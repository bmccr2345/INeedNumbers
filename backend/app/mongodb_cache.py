"""
MongoDB-based caching and rate limiting system.
Replaces Redis for Emergent deployment compatibility.
"""
import json
import logging
from datetime import datetime, timezone, timedelta
from typing import Optional, Dict, Any, Union
import pymongo
from pymongo import MongoClient
from pymongo.errors import PyMongoError
from config import get_config

logger = logging.getLogger(__name__)

class MongoDBCache:
    """
    MongoDB-based caching system that replaces Redis functionality.
    Uses TTL indexes for automatic cache expiration.
    """
    
    def __init__(self):
        self.config = get_config()
        self._client: Optional[MongoClient] = None
        self._db = None
        self._cache_collection = None
        self._rate_limit_collection = None
        self._connect()
    
    def _connect(self):
        """Initialize MongoDB connection and create collections."""
        try:
            if not self.config.MONGO_URL:
                logger.error("MongoDB URL not configured")
                return
            
            self._client = MongoClient(self.config.MONGO_URL)
            self._db = self._client[self.config.DB_NAME]
            
            # Cache collection with TTL index
            self._cache_collection = self._db.cache
            self._cache_collection.create_index(
                "expires_at", 
                expireAfterSeconds=0,
                background=True
            )
            
            # Rate limiting collection with TTL index
            self._rate_limit_collection = self._db.rate_limits
            self._rate_limit_collection.create_index(
                "expires_at", 
                expireAfterSeconds=0,
                background=True
            )
            
            # Test connection
            self._client.admin.command('ping')
            logger.info("MongoDB cache system initialized successfully")
            
        except Exception as e:
            logger.error(f"Failed to initialize MongoDB cache: {e}")
            self._client = None
    
    def is_connected(self) -> bool:
        """Check if MongoDB connection is active."""
        try:
            if self._client:
                self._client.admin.command('ping')
                return True
        except Exception:
            pass
        return False
    
    async def get(self, key: str) -> Optional[str]:
        """Get cached value by key."""
        if self._cache_collection is None:
            return None
        
        try:
            doc = self._cache_collection.find_one({"_id": key})
            if doc and doc.get("expires_at", datetime.now(timezone.utc)) > datetime.now(timezone.utc):
                return doc.get("value")
        except Exception as e:
            logger.error(f"Cache get error for key {key}: {e}")
        
        return None
    
    async def set(self, key: str, value: str, ttl_seconds: int = 3600) -> bool:
        """Set cached value with TTL."""
        if self._cache_collection is None:
            return False
        
        try:
            expires_at = datetime.now(timezone.utc) + timedelta(seconds=ttl_seconds)
            
            self._cache_collection.replace_one(
                {"_id": key},
                {
                    "_id": key,
                    "value": value,
                    "created_at": datetime.now(timezone.utc),
                    "expires_at": expires_at
                },
                upsert=True
            )
            return True
        except Exception as e:
            logger.error(f"Cache set error for key {key}: {e}")
            return False
    
    async def delete(self, key: str) -> bool:
        """Delete cached value."""
        if self._cache_collection is None:
            return False
        
        try:
            result = self._cache_collection.delete_one({"_id": key})
            return result.deleted_count > 0
        except Exception as e:
            logger.error(f"Cache delete error for key {key}: {e}")
            return False
    
    async def exists(self, key: str) -> bool:
        """Check if key exists in cache."""
        if self._cache_collection is None:
            return False
        
        try:
            doc = self._cache_collection.find_one(
                {"_id": key, "expires_at": {"$gt": datetime.now(timezone.utc)}},
                {"_id": 1}
            )
            return doc is not None
        except Exception as e:
            logger.error(f"Cache exists error for key {key}: {e}")
            return False
    
    async def get_json(self, key: str) -> Optional[Dict]:
        """Get cached JSON value."""
        value = await self.get(key)
        if value:
            try:
                return json.loads(value)
            except json.JSONDecodeError:
                logger.error(f"Invalid JSON in cache for key {key}")
        return None
    
    async def set_json(self, key: str, value: Dict, ttl_seconds: int = 3600) -> bool:
        """Set cached JSON value."""
        try:
            json_str = json.dumps(value)
            return await self.set(key, json_str, ttl_seconds)
        except Exception as e:
            logger.error(f"Cache set_json error for key {key}: {e}")
            return False
    
    # Rate limiting methods
    async def rate_limit_check(self, key: str, limit: int, window_seconds: int) -> Dict[str, Any]:
        """
        Check and update rate limit for a key.
        Returns: {"allowed": bool, "remaining": int, "reset_time": datetime}
        """
        if self._rate_limit_collection is None:
            # Fallback: allow request but log warning
            logger.warning("Rate limiting unavailable - MongoDB not connected")
            return {"allowed": True, "remaining": limit - 1, "reset_time": datetime.now(timezone.utc)}
        
        try:
            now = datetime.now(timezone.utc)
            window_start = now - timedelta(seconds=window_seconds)
            reset_time = now + timedelta(seconds=window_seconds)
            
            # Clean up old entries and count current requests
            self._rate_limit_collection.delete_many({
                "key": key,
                "timestamp": {"$lt": window_start}
            })
            
            current_count = self._rate_limit_collection.count_documents({
                "key": key,
                "timestamp": {"$gte": window_start}
            })
            
            if current_count >= limit:
                return {
                    "allowed": False,
                    "remaining": 0,
                    "reset_time": reset_time
                }
            
            # Record this request
            self._rate_limit_collection.insert_one({
                "key": key,
                "timestamp": now,
                "expires_at": reset_time  # TTL cleanup
            })
            
            return {
                "allowed": True,
                "remaining": limit - current_count - 1,
                "reset_time": reset_time
            }
            
        except Exception as e:
            logger.error(f"Rate limit check error for key {key}: {e}")
            # Fail open - allow the request
            return {"allowed": True, "remaining": limit - 1, "reset_time": datetime.now(timezone.utc)}
    
    async def close(self):
        """Close MongoDB connection."""
        if self._client:
            self._client.close()
            logger.info("MongoDB cache connection closed")


# Global cache instance
_cache_instance: Optional[MongoDBCache] = None

def get_cache() -> MongoDBCache:
    """Get or create global cache instance."""
    global _cache_instance
    if _cache_instance is None:
        _cache_instance = MongoDBCache()
    return _cache_instance

async def cache_get(key: str) -> Optional[str]:
    """Convenience function for cache get."""
    return await get_cache().get(key)

async def cache_set(key: str, value: str, ttl_seconds: int = 3600) -> bool:
    """Convenience function for cache set."""
    return await get_cache().set(key, value, ttl_seconds)

async def cache_delete(key: str) -> bool:
    """Convenience function for cache delete."""
    return await get_cache().delete(key)

async def rate_limit_check(key: str, limit: int, window_seconds: int) -> Dict[str, Any]:
    """Convenience function for rate limiting."""
    return await get_cache().rate_limit_check(key, limit, window_seconds)