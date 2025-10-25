from typing import Any, Dict, List
from datetime import datetime, timedelta
import os
from motor.motor_asyncio import AsyncIOMotorClient

# Get database connection
def get_db():
    client = AsyncIOMotorClient(os.environ['MONGO_URL'])
    return client[os.environ['DB_NAME']]

async def fetch_goal_settings(user_id: str) -> Dict[str, Any]:
    """Fetch user's goal settings from goal_settings collection"""
    db = get_db()
    goal_settings = await db.goal_settings.find_one({"userId": user_id})
    
    if not goal_settings:
        return {}
    
    return {
        "annual_gci_goal": goal_settings.get("annualGciGoal", 0),
        "monthly_gci_target": goal_settings.get("monthlyGciTarget", 0),
        "avg_gci_per_closing": goal_settings.get("avgGciPerClosing", 0),
        "workdays_this_month": goal_settings.get("workdays", 20),
        "earned_gci_to_date": goal_settings.get("earnedGciToDate", 0),
        "goal_type": goal_settings.get("goalType", "gci")
    }

async def fetch_activity_log(user_id: str, lookback_days: int = 28) -> Dict[str, Any]:
    """Fetch user's activity logs from activity_logs collection"""
    db = get_db()
    
    # Calculate date range
    end_date = datetime.utcnow()
    start_date = end_date - timedelta(days=lookback_days)
    
    # Get activity logs in date range
    logs_cursor = db.activity_logs.find({
        "userId": user_id,
        "loggedAt": {
            "$gte": start_date.isoformat(),
            "$lte": end_date.isoformat()
        }
    }).sort("loggedAt", -1)
    
    logs = await logs_cursor.to_list(length=100)
    
    # Aggregate activities
    total_activities = {
        "conversations": 0,
        "appointments": 0,
        "offersWritten": 0,
        "listingsTaken": 0
    }
    
    total_hours = {
        "prospecting": 0.0,
        "appointments": 0.0,
        "admin": 0.0,
        "marketing": 0.0
    }
    
    for log in logs:
        activities = log.get("activities", {})
        hours = log.get("hours", {})
        
        for key in total_activities:
            total_activities[key] += activities.get(key, 0)
        
        for key in total_hours:
            total_hours[key] += hours.get(key, 0)
    
    return {
        "from": start_date.date().isoformat(),
        "to": end_date.date().isoformat(),
        "total_days": lookback_days,
        "entries_count": len(logs),
        **total_activities,
        "hours": total_hours
    }

async def fetch_reflection_log(user_id: str, limit: int = 5) -> List[Dict[str, Any]]:
    """Fetch user's recent reflection logs"""
    db = get_db()
    
    reflections_cursor = db.reflection_logs.find({
        "userId": user_id
    }).sort("loggedAt", -1).limit(limit)
    
    reflections = await reflections_cursor.to_list(length=limit)
    
    return [
        {
            "date": reflection.get("loggedAt", "")[:10],  # Extract date part
            "reflection": reflection.get("reflection", ""),
            "mood": reflection.get("mood")
        }
        for reflection in reflections
    ]

async def fetch_pnl_summary(user_id: str, year: int) -> Dict[str, Any]:
    """Fetch P&L summary from deals and expenses"""
    db = get_db()
    
    # Get deals for the year (checking both closing_date and date fields for compatibility)
    deals_cursor = db.pnl_deals.find({
        "user_id": user_id,  # Fixed: use user_id instead of userId
        "$or": [
            {"closing_date": {"$regex": f"^{year}-"}},
            {"date": {"$regex": f"^{year}-"}}  # Fallback for older records
        ]
    })
    
    deals = await deals_cursor.to_list(length=1000)
    
    # Get expenses for the year  
    expenses_cursor = db.pnl_expenses.find({
        "user_id": user_id,  # Fixed: use user_id instead of userId
        "date": {
            "$regex": f"^{year}-"
        }
    })
    
    expenses = await expenses_cursor.to_list(length=1000)
    
    # Calculate totals (use final_income field from deals)
    total_income = sum(deal.get("final_income", deal.get("commission", 0)) for deal in deals)
    total_expenses = sum(expense.get("amount", 0) for expense in expenses)
    profit = total_income - total_expenses
    margin_pct = (profit / total_income) if total_income > 0 else 0
    
    # Count closed deals - P&L deals are inherently closed since they have closing_date and final_income
    # All P&L deals with closing_date should be considered closed
    closed_deals = [deal for deal in deals if deal.get("closing_date")]
    
    # Convert recent deals to JSON-serializable format (remove ObjectId fields)
    recent_deals_clean = []
    for deal in (deals[-3:] if deals else []):
        clean_deal = {k: v for k, v in deal.items() if k != '_id'}  # Remove MongoDB _id field
        recent_deals_clean.append(clean_deal)
    
    return {
        "year": year,
        "income": total_income,
        "expenses": total_expenses, 
        "profit": profit,
        "margin_pct": round(margin_pct, 2),
        "deals_count": len(deals),
        "closed_deals_count": len(closed_deals),
        "expenses_count": len(expenses),
        "recent_deals": recent_deals_clean  # Include recent deals for context (JSON-safe)
    }