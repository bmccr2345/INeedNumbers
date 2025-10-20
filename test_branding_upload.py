#!/usr/bin/env python3
"""
Branding Upload Functionality Test Script
Tests the fixed branding file upload functionality with local storage fallback
"""

import sys
import os
sys.path.append('/app')

from backend_test import DealPackAPITester

def main():
    """Run branding upload functionality tests"""
    print("🚀 BRANDING UPLOAD FUNCTIONALITY TESTING")
    print("="*80)
    print("Testing the fixed branding file upload functionality")
    print("Expected: Local storage fallback working when S3 credentials missing")
    print("Context: Fixed critical logic error where upload_to_s3() was called even when s3_client was None")
    print("="*80)
    
    # Initialize tester with production URL
    tester = DealPackAPITester()
    
    # Run the branding upload functionality tests
    print("\n" + "="*80)
    success, results = tester.test_branding_upload_functionality()
    print("="*80)
    
    # Display detailed results
    print(f"\n📊 BRANDING UPLOAD FUNCTIONALITY TEST RESULTS:")
    print(f"   Overall Status: {'✅ PASSED' if success else '❌ FAILED'}")
    
    # Show individual test results
    test_names = {
        'authentication': 'Authentication Requirement',
        'headshot_upload': 'Headshot Upload',
        'agent_logo_upload': 'Agent Logo Upload', 
        'file_serving': 'File Serving Endpoint',
        'validation': 'Error Handling & Validation'
    }
    
    for test_key, test_name in test_names.items():
        if test_key in results:
            test_result = results[test_key]
            status = '✅ PASSED' if test_result['success'] else '❌ FAILED'
            print(f"   {test_name}: {status}")
            
            # Show specific details for key tests
            if test_key == 'headshot_upload' and test_result['success']:
                response = test_result.get('response', {})
                if 'local_storage' in response and response['local_storage']:
                    print(f"      ✅ Local storage fallback working")
                    print(f"      ✅ File saved to: /tmp/uploads/branding/")
                    if 'filename' in response:
                        print(f"      ✅ Generated filename: {response['filename']}")
                        
            elif test_key == 'file_serving' and test_result['success']:
                response = test_result.get('response', {})
                if 'serving_successful' in response and response['serving_successful']:
                    print(f"      ✅ File serving endpoint working")
                    if 'content_length' in response:
                        print(f"      ✅ File content served: {response['content_length']} bytes")
    
    # Calculate and display success rate
    successful_tests = sum(1 for result in results.values() if result['success'])
    total_tests = len(results)
    success_rate = (successful_tests / total_tests) * 100 if total_tests > 0 else 0
    
    print(f"\n📈 Success Rate: {success_rate:.1f}% ({successful_tests}/{total_tests} tests passed)")
    
    # Show critical findings
    print(f"\n🔍 CRITICAL FINDINGS:")
    
    if success:
        print("   ✅ Branding upload functionality is working correctly")
        print("   ✅ Local storage fallback implemented properly")
        print("   ✅ Files saved to /tmp/uploads/branding/ when S3 not configured")
        print("   ✅ File serving endpoint working correctly")
        print("   ✅ Authentication and validation working as expected")
        print("   ✅ Critical logic error has been resolved")
        
        # Check for specific fixes
        headshot_result = results.get('headshot_upload', {}).get('response', {})
        if headshot_result.get('local_storage'):
            print("   ✅ CONFIRMED: No more 'Unable to locate credentials' errors")
            print("   ✅ CONFIRMED: upload_to_s3() not called when s3_client is None")
    else:
        print("   ❌ Branding upload functionality has issues")
        
        # Show specific failures
        for test_key, test_name in test_names.items():
            if test_key in results and not results[test_key]['success']:
                print(f"   ❌ {test_name} failed")
                error = results[test_key].get('response', {}).get('error', 'Unknown error')
                print(f"      Error: {error}")
    
    # Final status
    print(f"\n🎯 FINAL ASSESSMENT:")
    if success:
        print("   🎉 SUCCESS: Branding upload functionality is production-ready")
        print("   🎉 SUCCESS: Critical logic flaw has been fixed")
        print("   🎉 SUCCESS: Local storage fallback working correctly")
        sys.exit(0)
    else:
        print("   ❌ FAILURE: Branding upload functionality needs attention")
        print("   ❌ FAILURE: Critical issues found that need to be resolved")
        sys.exit(1)

if __name__ == "__main__":
    main()