import time
import hashlib
import json
from typing import Optional, Tuple
from dataclasses import dataclass

@dataclass
class CacheItem:
    body_hash: str
    created_at: float
    text: str

_cache: dict[str, CacheItem] = {}
_rate_limits: dict[str, list[float]] = {}

def make_cache_key(user_id: str, body: dict, context: str = "general") -> str:
    h = hashlib.sha256(json.dumps(body, sort_keys=True).encode()).hexdigest()
    return f"ai:{user_id}:{context}:{h}"

def get_cache(key: str, ttl: int) -> Optional[str]:
    item = _cache.get(key)
    if not item: 
        return None
    if time.time() - item.created_at > ttl:
        _cache.pop(key, None)
        return None
    return item.text

def set_cache(key: str, text: str):
    _cache[key] = CacheItem(body_hash=key, created_at=time.time(), text=text)

def check_rate_limit(user_id: str, max_per_minute: int) -> Tuple[bool, Optional[int]]:
    """Return (allowed, retry_after_seconds)"""
    now = time.time()
    window_start = now - 60  # 1 minute window
    
    if user_id not in _rate_limits:
        _rate_limits[user_id] = []
    
    # Clean old entries
    _rate_limits[user_id] = [t for t in _rate_limits[user_id] if t > window_start]
    
    # Check if under limit
    if len(_rate_limits[user_id]) >= max_per_minute:
        # Calculate retry after
        oldest_in_window = min(_rate_limits[user_id])
        retry_after = int(oldest_in_window + 60 - now) + 1
        return False, retry_after
    
    # Add current request
    _rate_limits[user_id].append(now)
    return True, None