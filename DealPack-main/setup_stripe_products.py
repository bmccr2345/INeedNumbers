#!/usr/bin/env python3
"""
Script to create Stripe test products and prices for I Need Numbers subscription plans
"""
import stripe
import os
from pathlib import Path
from dotenv import load_dotenv

# Load environment variables
ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / 'backend' / '.env')

# Set Stripe API key
STRIPE_API_KEY = os.environ.get('STRIPE_API_KEY', '')
if not STRIPE_API_KEY:
    print("❌ STRIPE_API_KEY not found in environment variables")
    exit(1)

stripe.api_key = STRIPE_API_KEY

def create_stripe_products_and_prices():
    """Create Stripe products and prices for I Need Numbers subscription plans"""
    
    try:
        print("🏗️  Creating Stripe products and prices...")
        
        # Create Starter Plan Product
        print("\n📦 Creating Starter Plan product...")
        starter_product = stripe.Product.create(
            name="I Need Numbers Starter",
            description="Starter plan for I Need Numbers - Save up to 10 deals, basic analytics",
            metadata={
                "plan_type": "starter",
                "deal_limit": "10"
            }
        )
        print(f"✅ Created Starter product: {starter_product.id}")
        
        # Create Starter Plan Price ($19/month)
        print("💰 Creating Starter Plan price ($19/month)...")
        starter_price = stripe.Price.create(
            product=starter_product.id,
            unit_amount=1900,  # $19.00 in cents
            currency="usd",
            recurring={"interval": "month"},
            metadata={
                "plan_type": "starter"
            }
        )
        print(f"✅ Created Starter price: {starter_price.id}")
        
        # Create Pro Plan Product
        print("\n📦 Creating Pro Plan product...")
        pro_product = stripe.Product.create(
            name="I Need Numbers Pro",
            description="Pro plan for I Need Numbers - Unlimited deals, advanced analytics, custom branding",
            metadata={
                "plan_type": "pro",
                "deal_limit": "unlimited"
            }
        )
        print(f"✅ Created Pro product: {pro_product.id}")
        
        # Create Pro Plan Price ($49/month)
        print("💰 Creating Pro Plan price ($49/month)...")
        pro_price = stripe.Price.create(
            product=pro_product.id,
            unit_amount=4900,  # $49.00 in cents
            currency="usd",
            recurring={"interval": "month"},
            metadata={
                "plan_type": "pro"
            }
        )
        print(f"✅ Created Pro price: {pro_price.id}")
        
        # Update environment file
        print("\n📝 Updating environment variables...")
        env_file_path = ROOT_DIR / 'backend' / '.env'
        
        # Read current env file
        with open(env_file_path, 'r') as f:
            env_content = f.read()
        
        # Update price IDs
        env_content = env_content.replace(
            'STRIPE_PRICE_STARTER_MONTHLY="price_test_starter_monthly"',
            f'STRIPE_PRICE_STARTER_MONTHLY="{starter_price.id}"'
        )
        env_content = env_content.replace(
            'STRIPE_PRICE_PRO_MONTHLY="price_test_pro_monthly"',
            f'STRIPE_PRICE_PRO_MONTHLY="{pro_price.id}"'
        )
        
        # Write updated env file
        with open(env_file_path, 'w') as f:
            f.write(env_content)
        
        print("✅ Updated backend/.env with new price IDs")
        
        print("\n🎉 Stripe setup completed successfully!")
        print("=" * 60)
        print(f"Starter Plan Price ID: {starter_price.id}")
        print(f"Pro Plan Price ID: {pro_price.id}")
        print("=" * 60)
        
        return {
            "starter_price_id": starter_price.id,
            "pro_price_id": pro_price.id,
            "starter_product_id": starter_product.id,
            "pro_product_id": pro_product.id
        }
        
    except stripe.error.StripeError as e:
        print(f"❌ Stripe API error: {e}")
        return None
    except Exception as e:
        print(f"❌ Error: {e}")
        return None

if __name__ == "__main__":
    print("🚀 I Need Numbers Stripe Setup")
    print("=" * 40)
    
    result = create_stripe_products_and_prices()
    
    if result:
        print("\n✅ Setup completed successfully!")
        print("You can now test the Stripe integration.")
    else:
        print("\n❌ Setup failed!")
        exit(1)