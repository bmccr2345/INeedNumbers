#!/usr/bin/env python3
"""
Test password verification directly
"""

import sys
import os
sys.path.append(os.path.join(os.path.dirname(__file__), 'backend'))

from app.security_modules.password import verify_password

# Test password verification
password = "Goosey23!!23"
hash_from_db = "$argon2id$v=19$m=65536,t=4,p=1$q59L9mMP4Cd1z06bwO/t6w$U2pwkzFnXIR+HQMYDBaaNCLqSOl7t1miF+Tl1jwpgro"

print("Testing password verification...")
print(f"Password: {password}")
print(f"Hash: {hash_from_db}")

try:
    result = verify_password(password, hash_from_db)
    print(f"Verification result: {result}")
    if result:
        print("✅ Password verification successful")
    else:
        print("❌ Password verification failed")
except Exception as e:
    print(f"❌ Error during password verification: {e}")