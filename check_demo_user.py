#!/usr/bin/env python3
"""
Check demo user in database
"""

import asyncio
import os
from motor.motor_asyncio import AsyncIOMotorClient

async def check_demo_user():
    # Connect to MongoDB
    mongo_url = os.environ.get('MONGO_URL', 'mongodb://localhost:27017')
    db_name = os.environ.get('DB_NAME', 'test_database')
    
    client = AsyncIOMotorClient(mongo_url)
    db = client[db_name]
    
    print(f"Connecting to MongoDB: {mongo_url}")
    print(f"Database: {db_name}")
    
    # Find demo user
    demo_user = await db.users.find_one({"email": "demo@demo.com"})
    
    if demo_user:
        print(f"\n✅ Demo user found:")
        print(f"   ID: {demo_user.get('id')}")
        print(f"   Email: {demo_user.get('email')}")
        print(f"   Full Name: {demo_user.get('full_name')}")
        print(f"   Plan: {demo_user.get('plan')}")
        print(f"   Status: {demo_user.get('status')}")
        print(f"   Created: {demo_user.get('created_at')}")
        
        # Check password hash
        hashed_password = demo_user.get('hashed_password', '')
        print(f"\n🔐 Password Hash Analysis:")
        print(f"   Hash: {hashed_password}")
        print(f"   Length: {len(hashed_password)}")
        print(f"   Starts with: {hashed_password[:20]}...")
        
        if hashed_password.startswith('$argon2'):
            print("   ✅ Hash format: Argon2id")
        elif hashed_password.startswith('$2b$') or hashed_password.startswith('$2a$') or hashed_password.startswith('$2y$'):
            print("   ✅ Hash format: bcrypt")
        else:
            print("   ❌ Hash format: Unknown")
        
        # Test password verification
        import sys
        sys.path.append('/app/backend')
        from app.security_modules.password import verify_password
        
        print(f"\n🧪 Password Verification Tests:")
        
        # Test with correct password
        test_passwords = ["demo", "demo123", "Demo", "DEMO"]
        
        for test_password in test_passwords:
            try:
                result = verify_password(test_password, hashed_password)
                status = "✅ MATCH" if result else "❌ NO MATCH"
                print(f"   Password '{test_password}': {status}")
            except Exception as e:
                print(f"   Password '{test_password}': ❌ ERROR - {e}")
        
    else:
        print("❌ Demo user not found in database")
        
        # List all users
        print("\n📋 All users in database:")
        async for user in db.users.find({}):
            print(f"   - {user.get('email')} (ID: {user.get('id')}, Plan: {user.get('plan')})")
    
    client.close()

if __name__ == "__main__":
    asyncio.run(check_demo_user())