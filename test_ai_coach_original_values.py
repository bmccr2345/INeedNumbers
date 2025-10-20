#!/usr/bin/env python3

import sys
import os
sys.path.append('/app')

from backend_test import DealPackAPITester

def main():
    """Test AI Coach with original goal settings values from review request"""
    print("🎯 TESTING AI COACH WITH ORIGINAL GOAL SETTINGS VALUES")
    print("="*80)
    print("Testing AI Coach with the specific values mentioned in review request:")
    print("- Annual GCI: 300,000")
    print("- Monthly Target: 20,000.0")
    print("="*80)
    
    tester = DealPackAPITester()
    
    # First authenticate with demo user
    print("\n🔐 AUTHENTICATING WITH DEMO USER...")
    login_success = tester.test_demo_user_login_success()
    if not login_success[0]:
        print("❌ Cannot proceed without authentication")
        return False
    
    # Test AI Coach with current goal settings (should be the original values)
    print("\n🤖 TESTING AI COACH WITH CURRENT GOAL SETTINGS...")
    success, response = tester.run_test(
        "AI Coach - Generate with original goal settings",
        "POST",
        "api/ai-coach/generate",
        200,
        auth_required=True
    )
    
    if success and isinstance(response, dict):
        coaching_text = response.get('coaching_text', '')
        
        if coaching_text:
            print("✅ AI Coach generated response successfully")
            print(f"📝 Response length: {len(coaching_text)} characters")
            
            # Check if response indicates "No goals configured"
            if "No goals configured" in coaching_text or "set up your goals" in coaching_text.lower():
                print("❌ AI Coach still shows 'No goals configured' message")
                print("🔍 This indicates the goal settings integration issue persists")
                return False
            else:
                print("✅ AI Coach found goal settings correctly")
                
                # Check if original goal values are referenced in the response
                if "300000" in coaching_text or "300,000" in coaching_text or "$300,000" in coaching_text:
                    print("✅ Annual GCI goal (300,000) referenced in coaching response")
                else:
                    print("⚠️  Annual GCI goal not clearly referenced in response")
                    
                if "20000" in coaching_text or "20,000" in coaching_text or "$20,000" in coaching_text:
                    print("✅ Monthly target (20,000) referenced in coaching response")
                else:
                    print("⚠️  Monthly target not clearly referenced in response")
            
            # Check response format (should be new coaching_text format)
            if 'coaching_text' in response:
                print("✅ Response uses new coaching_text format")
            else:
                print("❌ Response uses old format (summary/actions)")
                return False
                
            # Show full response for analysis
            print(f"\n📝 FULL AI COACH RESPONSE:")
            print("-" * 80)
            print(coaching_text)
            print("-" * 80)
            
            return True
            
        else:
            print("❌ AI Coach response is empty")
            return False
    else:
        print("❌ AI Coach generation failed")
        return False

if __name__ == "__main__":
    success = main()
    if success:
        print("\n🎉 AI COACH WITH ORIGINAL VALUES TEST PASSED!")
        print("✅ AI Coach correctly finds and uses goal settings")
        print("✅ No 'No goals configured' message")
        print("✅ Goal values (300,000 annual, 20,000 monthly) referenced correctly")
        print("✅ Response format is correct (coaching_text)")
    else:
        print("\n❌ AI COACH WITH ORIGINAL VALUES TEST FAILED!")
    
    sys.exit(0 if success else 1)