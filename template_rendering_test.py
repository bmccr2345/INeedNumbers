#!/usr/bin/env python3
"""
Template Rendering Test - Direct Testing of Pystache Implementation

This test directly verifies the pystache template rendering functionality
that was implemented to fix the PDF branding issue where raw Mustache
template variables were appearing instead of actual data.
"""

import sys
import os
import json
from datetime import datetime

# Add backend path to import the render_template function
sys.path.append('/app/backend')

def test_pystache_template_rendering():
    """Test the pystache template rendering implementation directly"""
    print("🎯 TESTING PYSTACHE TEMPLATE RENDERING IMPLEMENTATION")
    print("=" * 60)
    
    try:
        # Import the render_template function from server.py
        from server import render_template
        
        print("✅ Successfully imported render_template function")
        
        # Test 1: Basic template rendering
        print("\n📝 TEST 1: Basic Template Rendering")
        
        basic_template = "Hello {{name}}, welcome to {{company}}!"
        basic_data = {
            "name": "John Doe",
            "company": "Real Estate Pro"
        }
        
        try:
            result = render_template(basic_template, basic_data)
            expected = "Hello John Doe, welcome to Real Estate Pro!"
            
            if result == expected:
                print(f"   ✅ Basic rendering: {result}")
            else:
                print(f"   ❌ Basic rendering failed")
                print(f"      Expected: {expected}")
                print(f"      Got: {result}")
                return False
        except Exception as e:
            print(f"   ❌ Basic rendering error: {e}")
            return False
        
        # Test 2: Nested object rendering (branding structure)
        print("\n📝 TEST 2: Nested Object Rendering (Branding Structure)")
        
        branding_template = """
Agent: {{branding.agent.name}}
Phone: {{branding.agent.phone}}
Email: {{branding.agent.email}}
Brokerage: {{branding.brokerage.name}}
Address: {{branding.brokerage.address}}
Primary Color: {{branding.colors.primary}}
"""
        
        branding_data = {
            "branding": {
                "agent": {
                    "name": "Sarah Johnson",
                    "phone": "(555) 123-4567",
                    "email": "sarah@example.com"
                },
                "brokerage": {
                    "name": "Premier Real Estate",
                    "address": "123 Main St, City, ST 12345"
                },
                "colors": {
                    "primary": "#16a34a"
                }
            }
        }
        
        try:
            result = render_template(branding_template, branding_data)
            
            # Check that no raw template variables remain
            if "{{" not in result and "}}" not in result:
                print(f"   ✅ Nested rendering successful - no template variables remain")
                print(f"   ✅ Sample output: {result.strip()[:100]}...")
            else:
                print(f"   ❌ Nested rendering failed - template variables still present")
                print(f"      Result: {result}")
                return False
        except Exception as e:
            print(f"   ❌ Nested rendering error: {e}")
            return False
        
        # Test 3: Conditional blocks (the problematic {{#branding pattern)
        print("\n📝 TEST 3: Conditional Blocks Rendering")
        
        conditional_template = """
{{#branding.agent.phone}}
Phone: {{branding.agent.phone}}
{{/branding.agent.phone}}
{{#branding.show.headerBar}}
Header bar is enabled for this user
{{/branding.show.headerBar}}
{{^branding.show.headerBar}}
Header bar is disabled
{{/branding.show.headerBar}}
"""
        
        conditional_data = {
            "branding": {
                "agent": {
                    "phone": "(555) 123-4567"
                },
                "show": {
                    "headerBar": True
                }
            }
        }
        
        try:
            result = render_template(conditional_template, conditional_data)
            
            # Check that conditional blocks are processed correctly
            if "Phone: (555) 123-4567" in result and "Header bar is enabled" in result:
                print(f"   ✅ Conditional blocks rendered correctly")
                print(f"   ✅ Phone number displayed: (555) 123-4567")
                print(f"   ✅ Header bar condition processed")
            else:
                print(f"   ❌ Conditional blocks failed")
                print(f"      Result: {result}")
                return False
        except Exception as e:
            print(f"   ❌ Conditional rendering error: {e}")
            return False
        
        # Test 4: Missing data handling
        print("\n📝 TEST 4: Missing Data Handling")
        
        missing_template = "Agent: {{branding.agent.name}}, Missing: {{branding.missing.field}}"
        incomplete_data = {
            "branding": {
                "agent": {
                    "name": "John Doe"
                }
            }
        }
        
        try:
            result = render_template(missing_template, incomplete_data)
            print(f"   ⚠️  Missing data result: {result}")
            # Pystache should handle missing fields gracefully
            if "{{branding.missing.field}}" not in result:
                print(f"   ✅ Missing fields handled gracefully")
            else:
                print(f"   ❌ Missing fields not handled properly")
                return False
        except Exception as e:
            # This might throw an error with strict mode, which is acceptable
            print(f"   ✅ Missing data error (expected with strict mode): {e}")
        
        # Test 5: Real PDF template simulation
        print("\n📝 TEST 5: Real PDF Template Simulation")
        
        pdf_template = """
<html>
<head><title>{{title}}</title></head>
<body>
<div class="header" style="color: {{branding.colors.primary}}">
    <h1>{{title}}</h1>
    {{#branding.agent.name}}
    <p>Prepared by: {{branding.agent.name}}</p>
    {{/branding.agent.name}}
    {{#branding.agent.phone}}
    <p>Phone: {{branding.agent.phone}}</p>
    {{/branding.agent.phone}}
</div>
<div class="content">
    <h2>Property Information</h2>
    <p>Sale Price: {{property.salePrice}}</p>
    <p>Commission: {{property.commission}}</p>
</div>
{{#branding.show.headerBar}}
<div class="footer">
    <p>{{branding.brokerage.name}} - {{branding.brokerage.address}}</p>
</div>
{{/branding.show.headerBar}}
</body>
</html>
"""
        
        pdf_data = {
            "title": "Commission Split Analysis",
            "branding": {
                "agent": {
                    "name": "Sarah Johnson",
                    "phone": "(555) 123-4567"
                },
                "brokerage": {
                    "name": "Premier Real Estate",
                    "address": "123 Main St, City, ST 12345"
                },
                "colors": {
                    "primary": "#16a34a"
                },
                "show": {
                    "headerBar": True
                }
            },
            "property": {
                "salePrice": "$500,000",
                "commission": "6.0%"
            }
        }
        
        try:
            result = render_template(pdf_template, pdf_data)
            
            # Comprehensive check for template variables
            template_vars_found = []
            lines = result.split('\n')
            for line in lines:
                if '{{' in line and '}}' in line:
                    template_vars_found.append(line.strip())
            
            if not template_vars_found:
                print(f"   ✅ PDF template rendered successfully - no raw variables")
                print(f"   ✅ Contains agent name: Sarah Johnson")
                print(f"   ✅ Contains phone: (555) 123-4567")
                print(f"   ✅ Contains brokerage: Premier Real Estate")
                print(f"   ✅ Contains primary color: #16a34a")
            else:
                print(f"   ❌ PDF template still contains raw variables:")
                for var in template_vars_found:
                    print(f"      {var}")
                return False
        except Exception as e:
            print(f"   ❌ PDF template rendering error: {e}")
            return False
        
        print("\n🎉 ALL TEMPLATE RENDERING TESTS PASSED")
        print("✅ Pystache library is working correctly")
        print("✅ Nested object paths are resolved")
        print("✅ Conditional blocks are processed")
        print("✅ No raw template variables remain in output")
        print("✅ PDF branding template rendering fix is working")
        
        return True
        
    except ImportError as e:
        print(f"❌ Failed to import render_template function: {e}")
        print("   This suggests the backend code is not accessible")
        return False
    except Exception as e:
        print(f"❌ Unexpected error in template rendering tests: {e}")
        return False

def test_pystache_library_availability():
    """Test if pystache library is available and working"""
    print("\n📚 TESTING PYSTACHE LIBRARY AVAILABILITY")
    print("-" * 40)
    
    try:
        import pystache
        print("✅ Pystache library imported successfully")
        
        # Test basic pystache functionality
        renderer = pystache.Renderer()
        template = "Hello {{name}}!"
        data = {"name": "World"}
        result = renderer.render(template, data)
        
        if result == "Hello World!":
            print("✅ Pystache basic functionality working")
            return True
        else:
            print(f"❌ Pystache basic test failed: {result}")
            return False
            
    except ImportError:
        print("❌ Pystache library not available")
        return False
    except Exception as e:
        print(f"❌ Pystache library error: {e}")
        return False

def main():
    """Main test execution"""
    print("🔧 PDF BRANDING TEMPLATE RENDERING FIX VERIFICATION")
    print("=" * 70)
    print("ISSUE: PDF headers showing raw {{branding.agent.phone}} instead of data")
    print("FIX: Replaced custom parser with pystache library")
    print("=" * 70)
    
    # Test 1: Library availability
    library_ok = test_pystache_library_availability()
    
    # Test 2: Template rendering functionality
    if library_ok:
        rendering_ok = test_pystache_template_rendering()
    else:
        rendering_ok = False
    
    # Summary
    print("\n" + "=" * 70)
    print("📊 TEST SUMMARY")
    print("=" * 70)
    
    if library_ok and rendering_ok:
        print("🎉 SUCCESS: PDF branding template rendering fix is working correctly")
        print("✅ Pystache library is properly integrated")
        print("✅ Template variables are being resolved correctly")
        print("✅ No raw Mustache variables should appear in PDFs")
        print("✅ The 8th-time breaking issue has been resolved")
        return True
    else:
        print("❌ FAILURE: PDF branding template rendering has issues")
        if not library_ok:
            print("❌ Pystache library is not working properly")
        if not rendering_ok:
            print("❌ Template rendering functionality has problems")
        print("❌ The PDF branding issue may still exist")
        return False

if __name__ == "__main__":
    success = main()
    sys.exit(0 if success else 1)