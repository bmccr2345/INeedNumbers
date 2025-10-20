import json
import pytest
import sys
import os
from unittest.mock import AsyncMock, patch

# Add the parent directory to the path
sys.path.append(os.path.dirname(os.path.dirname(__file__)))

@pytest.mark.asyncio
async def test_coach_data_views():
    """Test that data view functions return expected structure"""
    from app.data_views import fetch_goal_settings, fetch_activity_log, fetch_reflection_log, fetch_pnl_summary
    
    user_id = "test_user_123"
    
    # Mock database responses
    with patch('app.data_views.get_db') as mock_db:
        # Mock goal settings
        mock_db.return_value.goal_settings.find_one = AsyncMock(return_value={
            "userId": user_id,
            "annualGciGoal": 200000,
            "monthlyGciTarget": 16667,
            "avgGciPerClosing": 8000
        })
        
        goals = await fetch_goal_settings(user_id)
        assert "annual_gci_goal" in goals
        assert goals["annual_gci_goal"] == 200000

def test_cache_functionality():
    """Test AI coach caching works correctly"""
    from app.ai import make_cache_key, set_cache, get_cache
    
    user_id = "test_user"
    payload = {"test": "data"}
    
    # Test cache key generation
    key = make_cache_key(user_id, payload)
    assert key.startswith("ai:test_user:")
    assert len(key) > 20  # Should be reasonably long hash
    
    # Test cache set/get
    test_response = '{"summary": "test coaching"}'
    set_cache(key, test_response)
    
    cached = get_cache(key, ttl=300)
    assert cached == test_response
    
    # Test cache expiry (with very short TTL)
    cached_expired = get_cache(key, ttl=0)
    assert cached_expired is None

def test_rate_limiting():
    """Test rate limiting functionality"""
    from app.ai import check_rate_limit
    
    user_id = "test_user_rate"
    
    # First few requests should be allowed
    for i in range(5):
        allowed, retry_after = check_rate_limit(user_id, max_per_minute=6)
        assert allowed is True
        assert retry_after is None
    
    # 6th request should still be allowed
    allowed, retry_after = check_rate_limit(user_id, max_per_minute=6)
    assert allowed is True
    
    # 7th request should be rate limited
    allowed, retry_after = check_rate_limit(user_id, max_per_minute=6)
    assert allowed is False
    assert retry_after is not None
    assert retry_after > 0

def test_pii_redaction():
    """Test PII redaction in reflections"""
    from app.routes.ai_coach import redact_pii
    
    test_cases = [
        ("Contact me at john@example.com", "Contact me at [EMAIL]"),
        ("Call me at 555-123-4567", "Call me at [PHONE]"),
        ("My SSN is 123-45-6789", "My SSN is [SSN]"),
        ("Normal text", "Normal text"),
        ("", ""),
        (None, None)
    ]
    
    for input_text, expected in test_cases:
        result = redact_pii(input_text)
        assert result == expected

# Integration test would require actual database
# @pytest.mark.asyncio
# async def test_coach_generate_endpoint():
#     """Integration test for coach generation endpoint"""
#     # This would test the full endpoint with a test database
#     pass

if __name__ == "__main__":
    pytest.main([__file__, "-v"])