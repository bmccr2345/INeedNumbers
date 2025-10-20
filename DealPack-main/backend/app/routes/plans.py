"""
Stripe webhook handlers for subscription management.
Handles payment events, subscription updates, and billing failures.
"""

from fastapi import APIRouter, Request, HTTPException, Depends
from app.deps import get_settings
import stripe
import logging
from pymongo import MongoClient
from datetime import datetime, timezone
from typing import Dict, Any
import hashlib

logger = logging.getLogger(__name__)
router = APIRouter()

def get_database():
    """Get MongoDB database connection."""
    config = get_settings()
    client = MongoClient(config.MONGO_URL)
    return client[config.DB_NAME]

def create_idempotency_key(event: Dict[str, Any]) -> str:
    """Create idempotency key for webhook event."""
    event_id = event.get('id', '')
    event_type = event.get('type', '')
    return hashlib.sha256(f"{event_id}:{event_type}".encode()).hexdigest()

async def handle_checkout_completed(session: Dict[str, Any]):
    """Handle successful checkout session completion."""
    try:
        db = get_database()
        
        # Extract session data
        customer_id = session.get('customer')
        subscription_id = session.get('subscription')
        client_reference_id = session.get('client_reference_id')  # Should be user_id
        
        if not client_reference_id:
            logger.error(f"No client_reference_id in checkout session {session.get('id')}")
            return False
        
        # Get subscription details from Stripe
        stripe_subscription = stripe.Subscription.retrieve(subscription_id)
        price_id = stripe_subscription['items']['data'][0]['price']['id']
        
        # Determine plan type based on price ID
        config = get_settings()
        if price_id == config.STRIPE_PRICE_STARTER_MONTHLY:
            plan_type = "STARTER"
        elif price_id == config.STRIPE_PRICE_PRO_MONTHLY:
            plan_type = "PRO"
        else:
            logger.error(f"Unknown price ID: {price_id}")
            return False
        
        # Update user subscription in database
        update_result = db.users.update_one(
            {"_id": client_reference_id},
            {
                "$set": {
                    "subscription": {
                        "plan": plan_type,
                        "status": "active",
                        "stripe_customer_id": customer_id,
                        "stripe_subscription_id": subscription_id,
                        "current_period_start": datetime.fromtimestamp(
                            stripe_subscription['current_period_start'], 
                            timezone.utc
                        ),
                        "current_period_end": datetime.fromtimestamp(
                            stripe_subscription['current_period_end'], 
                            timezone.utc
                        ),
                        "updated_at": datetime.now(timezone.utc)
                    }
                }
            }
        )
        
        if update_result.modified_count == 0:
            logger.warning(f"No user found with ID {client_reference_id}")
            return False
        
        logger.info(f"Successfully upgraded user {client_reference_id} to {plan_type}")
        return True
        
    except Exception as e:
        logger.error(f"Error handling checkout completion: {e}")
        return False

async def handle_payment_succeeded(invoice: Dict[str, Any]):
    """Handle successful recurring payment."""
    try:
        db = get_database()
        
        subscription_id = invoice.get('subscription')
        if not subscription_id:
            return False
        
        # Find user by subscription ID
        user = db.users.find_one({"subscription.stripe_subscription_id": subscription_id})
        if not user:
            logger.error(f"No user found for subscription {subscription_id}")
            return False
        
        # Get updated subscription from Stripe
        stripe_subscription = stripe.Subscription.retrieve(subscription_id)
        
        # Update subscription period
        update_result = db.users.update_one(
            {"_id": user["_id"]},
            {
                "$set": {
                    "subscription.status": "active",
                    "subscription.current_period_start": datetime.fromtimestamp(
                        stripe_subscription['current_period_start'], 
                        timezone.utc
                    ),
                    "subscription.current_period_end": datetime.fromtimestamp(
                        stripe_subscription['current_period_end'], 
                        timezone.utc
                    ),
                    "subscription.updated_at": datetime.now(timezone.utc)
                }
            }
        )
        
        logger.info(f"Successfully renewed subscription for user {user['_id']}")
        return True
        
    except Exception as e:
        logger.error(f"Error handling payment success: {e}")
        return False

async def handle_payment_failed(invoice: Dict[str, Any]):
    """Handle failed payment."""
    try:
        db = get_database()
        
        subscription_id = invoice.get('subscription')
        if not subscription_id:
            return False
        
        # Find user by subscription ID
        user = db.users.find_one({"subscription.stripe_subscription_id": subscription_id})
        if not user:
            logger.error(f"No user found for subscription {subscription_id}")
            return False
        
        # Check if this is the final attempt
        attempt_count = invoice.get('attempt_count', 0)
        next_payment_attempt = invoice.get('next_payment_attempt')
        
        if next_payment_attempt:
            # Payment will be retried - mark as past_due
            status = "past_due"
            logger.warning(f"Payment failed for user {user['_id']} (attempt {attempt_count}), will retry")
        else:
            # Final attempt failed - cancel subscription
            status = "cancelled"
            logger.error(f"Final payment attempt failed for user {user['_id']}")
            
            # Cancel the Stripe subscription
            try:
                stripe.Subscription.modify(subscription_id, cancel_at_period_end=True)
            except Exception as e:
                logger.error(f"Failed to cancel Stripe subscription {subscription_id}: {e}")
        
        # Update user subscription status
        update_result = db.users.update_one(
            {"_id": user["_id"]},
            {
                "$set": {
                    "subscription.status": status,
                    "subscription.updated_at": datetime.now(timezone.utc),
                    "subscription.payment_failed_at": datetime.now(timezone.utc)
                }
            }
        )
        
        logger.info(f"Updated user {user['_id']} subscription status to {status}")
        return True
        
    except Exception as e:
        logger.error(f"Error handling payment failure: {e}")
        return False

@router.post("/stripe/webhook")
async def stripe_webhook(request: Request, settings=Depends(get_settings)):
    """
    Secure Stripe webhook with signature verification and idempotency.
    Handles subscription lifecycle events.
    """
    payload = await request.body()
    sig = request.headers.get("Stripe-Signature", "")
    
    if not settings.STRIPE_WEBHOOK_SECRET:
        raise HTTPException(500, "Webhook secret not configured")
    
    try:
        # Verify webhook signature
        event = stripe.Webhook.construct_event(payload, sig, settings.STRIPE_WEBHOOK_SECRET)
    except ValueError:
        logger.error("Invalid webhook payload")
        raise HTTPException(400, "Invalid payload")
    except stripe.error.SignatureVerificationError:
        logger.error("Invalid webhook signature")
        raise HTTPException(400, "Invalid signature")
    
    # Idempotency check
    db = get_database()
    idempotency_key = create_idempotency_key(event)
    
    existing_event = db.webhook_events.find_one({"idempotency_key": idempotency_key})
    if existing_event:
        logger.info(f"Webhook event {event.get('id')} already processed")
        return {"received": True, "status": "already_processed"}
    
    # Record event for idempotency
    db.webhook_events.insert_one({
        "idempotency_key": idempotency_key,
        "event_id": event.get('id'),
        "event_type": event.get('type'),
        "processed_at": datetime.now(timezone.utc),
        "status": "processing"
    })
    
    # Process the event
    event_type = event.get('type')
    success = False
    
    try:
        if event_type == 'checkout.session.completed':
            success = await handle_checkout_completed(event['data']['object'])
        elif event_type == 'invoice.payment_succeeded':
            success = await handle_payment_succeeded(event['data']['object'])
        elif event_type == 'invoice.payment_failed':
            success = await handle_payment_failed(event['data']['object'])
        elif event_type in ['customer.subscription.updated', 'customer.subscription.deleted']:
            # Handle subscription updates/cancellations
            subscription = event['data']['object']
            success = await handle_subscription_update(subscription)
        else:
            logger.info(f"Unhandled webhook event type: {event_type}")
            success = True  # Don't fail for unhandled events
        
        # Update event status
        status = "completed" if success else "failed"
        db.webhook_events.update_one(
            {"idempotency_key": idempotency_key},
            {"$set": {"status": status, "completed_at": datetime.now(timezone.utc)}}
        )
        
        if not success:
            logger.error(f"Failed to process webhook event {event.get('id')}")
            raise HTTPException(500, "Event processing failed")
        
        return {"received": True, "status": "processed"}
        
    except Exception as e:
        # Mark event as failed
        db.webhook_events.update_one(
            {"idempotency_key": idempotency_key},
            {
                "$set": {
                    "status": "failed",
                    "error": str(e),
                    "failed_at": datetime.now(timezone.utc)
                }
            }
        )
        logger.error(f"Webhook processing failed: {e}")
        raise HTTPException(500, "Internal server error")

async def handle_subscription_update(subscription: Dict[str, Any]):
    """Handle subscription updates and cancellations."""
    try:
        db = get_database()
        subscription_id = subscription.get('id')
        
        user = db.users.find_one({"subscription.stripe_subscription_id": subscription_id})
        if not user:
            logger.error(f"No user found for subscription {subscription_id}")
            return False
        
        # Update subscription data
        status_mapping = {
            'active': 'active',
            'past_due': 'past_due',
            'canceled': 'cancelled',
            'unpaid': 'cancelled',
            'incomplete': 'incomplete'
        }
        
        new_status = status_mapping.get(subscription.get('status'), 'unknown')
        
        update_data = {
            "subscription.status": new_status,
            "subscription.updated_at": datetime.now(timezone.utc)
        }
        
        # Add period dates if available
        if subscription.get('current_period_start'):
            update_data["subscription.current_period_start"] = datetime.fromtimestamp(
                subscription['current_period_start'], timezone.utc
            )
        
        if subscription.get('current_period_end'):
            update_data["subscription.current_period_end"] = datetime.fromtimestamp(
                subscription['current_period_end'], timezone.utc
            )
        
        db.users.update_one(
            {"_id": user["_id"]},
            {"$set": update_data}
        )
        
        logger.info(f"Updated subscription for user {user['_id']}: status={new_status}")
        return True
        
    except Exception as e:
        logger.error(f"Error handling subscription update: {e}")
        return False