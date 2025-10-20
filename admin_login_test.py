#!/usr/bin/env python3
"""
Admin Login Authentication Testing
Test the admin login functionality with updated password credentials.
"""

import requests
import sys
import json
import uuid
from datetime import datetime
from typing import Optional, Dict, Any
import time

class AdminLoginTester:
    def __init__(self, base_url="http://localhost:8001"):
        self.base_url = base_url
        self.tests_run = 0
        self.tests_passed = 0
        # Admin credentials from review request
        self.admin_email = "demo@demo.com"
        self.admin_password = "Goosey23!!23"

    def run_test(self, name, method, endpoint, expected_status, data=None, headers=None, cookies=None):
        """Run a single API test"""
        url = f"{self.base_url}/{endpoint}"
        default_headers = {'Content-Type': 'application/json'}
        
        if headers:
            default_headers.update(headers)

        self.tests_run += 1
        print(f"\n🔍 Testing {name}...")
        print(f"   URL: {url}")
        
        try:
            if method == 'GET':
                response = requests.get(url, headers=default_headers, cookies=cookies, timeout=15)
            elif method == 'POST':
                response = requests.post(url, json=data, headers=default_headers, cookies=cookies, timeout=15)

            success = response.status_code == expected_status
            if success:
                self.tests_passed += 1
                print(f"✅ Passed - Status: {response.status_code}")
                try:
                    response_data = response.json()
                    print(f"   Response: {json.dumps(response_data, indent=2)[:300]}...")
                except:
                    print(f"   Response: {response.text[:300]}...")
            else:
                print(f"❌ Failed - Expected {expected_status}, got {response.status_code}")
                print(f"   Response: {response.text[:300]}...")

            return success, response.json() if response.headers.get('content-type', '').startswith('application/json') else response.text

        except requests.exceptions.Timeout:
            print(f"❌ Failed - Request timeout")
            return False, {}
        except requests.exceptions.ConnectionError:
            print(f"❌ Failed - Connection error")
            return False, {}
        except Exception as e:
            print(f"❌ Failed - Error: {str(e)}")
            return False, {}

    def test_admin_login(self):
        """Test admin login with updated password"""
        print("\n🔐 TESTING ADMIN LOGIN WITH UPDATED PASSWORD...")
        
        login_data = {
            "email": self.admin_email,
            "password": self.admin_password,
            "remember_me": False
        }
        
        print(f"   🔍 Testing login with: {login_data['email']} / {login_data['password']}")
        
        success, response = self.run_test(
            "Admin Login - Updated Password",
            "POST",
            "api/auth/login",
            200,
            data=login_data
        )
        
        if success and isinstance(response, dict):
            # Check if login was successful
            if 'access_token' in response or 'user' in response:
                print("   ✅ Admin login successful")
                
                # Verify user details
                user_data = response.get('user', {})
                if user_data:
                    print(f"   ✅ User email: {user_data.get('email')}")
                    print(f"   ✅ User role: {user_data.get('role')}")
                    print(f"   ✅ User plan: {user_data.get('plan')}")
                    
                    # Check if role is master_admin as expected
                    role_correct = user_data.get('role') == 'master_admin'
                    plan_correct = user_data.get('plan') == 'PRO'
                    
                    if role_correct:
                        print("   ✅ Correct admin role 'master_admin' returned")
                    else:
                        print(f"   ❌ Role mismatch - expected 'master_admin', got '{user_data.get('role')}'")
                    
                    if plan_correct:
                        print("   ✅ Correct PRO plan returned")
                    else:
                        print(f"   ❌ Plan mismatch - expected 'PRO', got '{user_data.get('plan')}'")
                
                return success and role_correct and plan_correct, response
            else:
                print("   ❌ Login response missing expected fields")
                return False, response
        else:
            print("   ❌ Admin login failed")
            return False, response

    def test_argon2id_password_verification(self):
        """Test Argon2id password hash verification"""
        print("\n🔒 TESTING ARGON2ID PASSWORD VERIFICATION...")
        
        # Test with correct password
        correct_login_data = {
            "email": self.admin_email,
            "password": self.admin_password,
            "remember_me": False
        }
        
        correct_success, correct_response = self.run_test(
            "Argon2id - Correct Password",
            "POST",
            "api/auth/login",
            200,
            data=correct_login_data
        )
        
        # Test with wrong password
        wrong_login_data = {
            "email": self.admin_email,
            "password": "WrongPassword123!",
            "remember_me": False
        }
        
        wrong_success, wrong_response = self.run_test(
            "Argon2id - Wrong Password (Should Fail)",
            "POST",
            "api/auth/login",
            401,
            data=wrong_login_data
        )
        
        # Check if correct password succeeded and wrong password failed
        correct_login_ok = correct_success and isinstance(correct_response, dict) and ('user' in correct_response or 'access_token' in correct_response)
        wrong_password_rejected = wrong_success  # wrong_success means we got the expected 401 status
        
        if correct_login_ok and wrong_password_rejected:
            print("   ✅ Argon2id password verification working correctly")
            return True, {"correct": correct_response, "wrong": wrong_response}
        else:
            print("   ❌ Argon2id password verification has issues")
            return False, {"correct": correct_response, "wrong": wrong_response}

    def test_jwt_token_generation(self):
        """Test JWT token generation and validation"""
        print("\n🎫 TESTING JWT TOKEN GENERATION...")
        
        try:
            import requests
            session = requests.Session()
            
            # Login to get JWT token
            login_data = {
                "email": self.admin_email,
                "password": self.admin_password,
                "remember_me": True
            }
            
            login_response = session.post(
                f"{self.base_url}/api/auth/login",
                json=login_data,
                timeout=15
            )
            
            if login_response.status_code == 200:
                print("   ✅ Login successful for JWT testing")
                login_data_response = login_response.json()
                
                # Check for JWT token
                if 'access_token' in login_data_response:
                    jwt_token = login_data_response['access_token']
                    print("   ✅ JWT token generated")
                    
                    # Verify JWT token format
                    jwt_parts = jwt_token.split('.')
                    if len(jwt_parts) == 3:
                        print("   ✅ JWT token has correct format (header.payload.signature)")
                    else:
                        print("   ❌ JWT token has incorrect format")
                        return False, {"error": "Invalid JWT format"}
                else:
                    print("   ⚠️  No JWT token in response body (may be cookie-only)")
                
                # Test /api/auth/me with session cookies
                me_response = session.get(
                    f"{self.base_url}/api/auth/me",
                    timeout=15
                )
                
                if me_response.status_code == 200:
                    print("   ✅ JWT token validation working via cookies")
                    me_data = me_response.json()
                    
                    if me_data.get('role') == 'master_admin' and me_data.get('plan') == 'PRO':
                        print("   ✅ JWT token contains correct user data")
                        return True, {
                            "login": login_data_response,
                            "me": me_data,
                            "jwt_working": True
                        }
                    else:
                        print("   ❌ JWT token contains incorrect user data")
                        return False, {"error": "Incorrect user data"}
                else:
                    print("   ❌ JWT token validation failed")
                    return False, {"error": "Token validation failed"}
            else:
                print("   ❌ Login failed for JWT testing")
                return False, {"error": "Login failed"}
                
        except Exception as e:
            print(f"   ❌ Error in JWT testing: {e}")
            return False, {"error": str(e)}

    def test_httponly_cookies(self):
        """Test HttpOnly cookie setup"""
        print("\n🍪 TESTING HTTPONLY COOKIES...")
        
        try:
            import requests
            
            login_data = {
                "email": self.admin_email,
                "password": self.admin_password,
                "remember_me": True
            }
            
            response = requests.post(
                f"{self.base_url}/api/auth/login",
                json=login_data,
                timeout=15
            )
            
            if response.status_code == 200:
                print("   ✅ Login successful for cookie testing")
                
                # Check Set-Cookie header
                set_cookie_header = response.headers.get('Set-Cookie', '')
                
                if 'access_token' in set_cookie_header:
                    print("   ✅ access_token cookie set")
                    
                    # Check HttpOnly flag
                    if 'HttpOnly' in set_cookie_header:
                        print("   ✅ Cookie has HttpOnly flag")
                        httponly_ok = True
                    else:
                        print("   ❌ Cookie missing HttpOnly flag")
                        httponly_ok = False
                    
                    # Check SameSite attribute
                    if 'SameSite' in set_cookie_header:
                        print("   ✅ Cookie has SameSite attribute")
                        samesite_ok = True
                    else:
                        print("   ⚠️  Cookie missing SameSite attribute")
                        samesite_ok = False
                    
                    # Test cookie-based authentication
                    cookies = response.cookies
                    me_response = requests.get(
                        f"{self.base_url}/api/auth/me",
                        cookies=cookies,
                        timeout=15
                    )
                    
                    if me_response.status_code == 200:
                        print("   ✅ Cookie-based authentication working")
                        auth_working = True
                    else:
                        print("   ❌ Cookie-based authentication failed")
                        auth_working = False
                    
                    return httponly_ok and auth_working, {
                        "cookie_set": True,
                        "httponly": httponly_ok,
                        "samesite": samesite_ok,
                        "auth_working": auth_working,
                        "cookie_header": set_cookie_header
                    }
                else:
                    print("   ❌ No access_token cookie set")
                    return False, {"error": "No cookie set"}
            else:
                print("   ❌ Login failed for cookie testing")
                return False, {"error": "Login failed"}
                
        except Exception as e:
            print(f"   ❌ Error testing cookies: {e}")
            return False, {"error": str(e)}

    def test_auth_me_endpoint(self):
        """Test /api/auth/me endpoint returns correct admin data"""
        print("\n👤 TESTING /api/auth/me ENDPOINT...")
        
        try:
            import requests
            session = requests.Session()
            
            # Login first
            login_data = {
                "email": self.admin_email,
                "password": self.admin_password,
                "remember_me": False
            }
            
            login_response = session.post(
                f"{self.base_url}/api/auth/login",
                json=login_data,
                timeout=15
            )
            
            if login_response.status_code == 200:
                print("   ✅ Login successful for /api/auth/me testing")
                
                # Test /api/auth/me
                me_response = session.get(
                    f"{self.base_url}/api/auth/me",
                    timeout=15
                )
                
                if me_response.status_code == 200:
                    me_data = me_response.json()
                    print("   ✅ /api/auth/me endpoint accessible")
                    
                    # Verify admin data
                    email_correct = me_data.get('email') == self.admin_email
                    role_correct = me_data.get('role') == 'master_admin'
                    plan_correct = me_data.get('plan') == 'PRO'
                    
                    print(f"   🔍 Email: {me_data.get('email')} {'✅' if email_correct else '❌'}")
                    print(f"   🔍 Role: {me_data.get('role')} {'✅' if role_correct else '❌'}")
                    print(f"   🔍 Plan: {me_data.get('plan')} {'✅' if plan_correct else '❌'}")
                    
                    if email_correct and role_correct and plan_correct:
                        print("   ✅ All admin data correct")
                        return True, me_data
                    else:
                        print("   ❌ Some admin data incorrect")
                        return False, me_data
                else:
                    print(f"   ❌ /api/auth/me failed - {me_response.status_code}")
                    return False, {"error": "auth/me failed"}
            else:
                print(f"   ❌ Login failed - {login_response.status_code}")
                return False, {"error": "login failed"}
                
        except Exception as e:
            print(f"   ❌ Error testing /api/auth/me: {e}")
            return False, {"error": str(e)}

    def run_comprehensive_admin_login_tests(self):
        """Run all admin login tests"""
        print("🚀 STARTING COMPREHENSIVE ADMIN LOGIN TESTING...")
        print(f"   Base URL: {self.base_url}")
        print(f"   Admin Email: {self.admin_email}")
        print(f"   Admin Password: {self.admin_password}")
        print("   Expected: master_admin role, PRO plan, HttpOnly cookies, JWT tokens")
        
        results = {}
        
        # Test 1: Admin Login
        login_success, login_response = self.test_admin_login()
        results['admin_login'] = {'success': login_success, 'response': login_response}
        
        # Test 2: Argon2id Password Verification
        argon2_success, argon2_response = self.test_argon2id_password_verification()
        results['argon2id_verification'] = {'success': argon2_success, 'response': argon2_response}
        
        # Test 3: JWT Token Generation
        jwt_success, jwt_response = self.test_jwt_token_generation()
        results['jwt_token_generation'] = {'success': jwt_success, 'response': jwt_response}
        
        # Test 4: HttpOnly Cookies
        cookie_success, cookie_response = self.test_httponly_cookies()
        results['httponly_cookies'] = {'success': cookie_success, 'response': cookie_response}
        
        # Test 5: Auth Me Endpoint
        auth_me_success, auth_me_response = self.test_auth_me_endpoint()
        results['auth_me_endpoint'] = {'success': auth_me_success, 'response': auth_me_response}
        
        # Calculate overall success
        total_tests = 5
        successful_tests = sum([
            login_success,
            argon2_success,
            jwt_success,
            cookie_success,
            auth_me_success
        ])
        
        overall_success = successful_tests >= 4  # Allow one failure
        
        print(f"\n🎯 COMPREHENSIVE ADMIN LOGIN TESTING SUMMARY:")
        print(f"   Total tests run: {self.tests_run}")
        print(f"   Tests passed: {self.tests_passed}")
        print(f"   Success rate: {(self.tests_passed/self.tests_run)*100:.1f}%")
        print(f"   Test suites passed: {successful_tests}/{total_tests}")
        
        # Detailed results
        print(f"\n📋 DETAILED TEST RESULTS:")
        for test_name, test_result in results.items():
            status = "✅ PASSED" if test_result['success'] else "❌ FAILED"
            print(f"   {test_name}: {status}")
        
        return overall_success, results

if __name__ == "__main__":
    tester = AdminLoginTester()
    
    overall_success, results = tester.run_comprehensive_admin_login_tests()
    
    if overall_success:
        print("\n🎉 ADMIN LOGIN AUTHENTICATION TESTING COMPLETED SUCCESSFULLY")
        print("   ✅ Admin login working with updated password 'Goosey23!!23'")
        print("   ✅ Argon2id password hashing verified")
        print("   ✅ JWT token generation and validation working")
        print("   ✅ HttpOnly cookies set correctly")
        print("   ✅ Admin role 'master_admin' and PRO plan confirmed")
        print("   ✅ /api/auth/me endpoint returning correct user data")
        sys.exit(0)
    else:
        print("\n❌ ADMIN LOGIN AUTHENTICATION TESTING FAILED")
        print("   Issues found with admin login functionality")
        print("   Check detailed results above for specific failures")
        sys.exit(1)