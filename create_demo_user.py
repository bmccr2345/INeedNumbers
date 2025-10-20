#!/usr/bin/env python3
"""
Create demo user in MongoDB database
"""

import bcrypt
import uuid
from datetime import datetime, timezone
import pymongo

def create_demo_user():
    """Create demo user in MongoDB"""
    
    # Connect to MongoDB
    client = pymongo.MongoClient("mongodb://localhost:27017")
    db = client["test_database"]
    users_collection = db["users"]
    
    # Check if demo user already exists
    existing_user = users_collection.find_one({"email": "demo@demo.com"})
    if existing_user:
        print("✅ Demo user already exists!")
        print(f"   Email: {existing_user['email']}")
        print(f"   Plan: {existing_user['plan']}")
        print(f"   ID: {existing_user['id']}")
        return True
    
    # Generate password hash
    password = "demo123"
    password_bytes = password.encode('utf-8')
    salt = bcrypt.gensalt()
    hashed_password = bcrypt.hashpw(password_bytes, salt).decode('utf-8')
    
    # Create user document
    user_doc = {
        "id": str(uuid.uuid4()),
        "email": "demo@demo.com",
        "full_name": "Demo User",
        "hashed_password": hashed_password,
        "plan": "PRO",  # PRO plan to test all branding features
        "role": "user",
        "status": "active",
        "is_verified": True,
        "created_at": datetime.now(timezone.utc).isoformat(),
        "updated_at": datetime.now(timezone.utc).isoformat(),
        "stripe_customer_id": None,
        "stripe_subscription_id": None,
        "plan_updated_at": None,
        "deals_count": 0
    }
    
    try:
        # Insert user
        result = users_collection.insert_one(user_doc)
        print("✅ Demo user created successfully!")
        print(f"   Email: demo@demo.com")
        print(f"   Password: demo123")
        print(f"   Plan: PRO")
        print(f"   ID: {user_doc['id']}")
        print(f"   MongoDB _id: {result.inserted_id}")
        return True
        
    except Exception as e:
        print(f"❌ Failed to create demo user: {str(e)}")
        return False

if __name__ == "__main__":
    success = create_demo_user()
    if success:
        print("\n🎉 Demo user is ready for testing!")
        print("   Frontend can now login with demo@demo.com / demo123")
        print("   This will generate real JWT tokens instead of 'demo-token'")
    else:
        print("\n❌ Demo user creation failed")