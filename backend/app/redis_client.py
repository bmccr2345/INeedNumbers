"""
Redis client for caching and rate limiting.
Production-ready with connection pooling and error handling.
"""

import redis
import json
import logging
from typing import Optional, Any, Union
from config import get_config
import time

logger = logging.getLogger(__name__)

class RedisClient:
    """
    Production-ready Redis client with connection pooling.
    Handles caching, rate limiting, and session storage.
    """
    
    def __init__(self):
        self.config = get_config()
        self._client: Optional[redis.Redis] = None
        self._pool: Optional[redis.ConnectionPool] = None
        self._connect()
    
    def _connect(self):
        """Initialize Redis connection with pooling."""
        try:
            if not self.config.REDIS_URL:
                if self.config.is_production():
                    raise ValueError("Redis is required in production environment")
                logger.warning("Redis not configured - using in-memory fallback")
                return
            
            # Parse Redis URL and create connection pool
            self._pool = redis.ConnectionPool.from_url(
                self.config.REDIS_URL,
                password=self.config.REDIS_PASSWORD,
                db=self.config.REDIS_DB,
                max_connections=20,
                retry_on_timeout=True,
                socket_connect_timeout=5,
                socket_timeout=5,
                health_check_interval=30
            )
            
            self._client = redis.Redis(connection_pool=self._pool)
            
            # Test connection
            self._client.ping()
            logger.info(f"Redis connected: {self.config.REDIS_URL}")
            
        except Exception as e:
            if self.config.is_production():
                logger.error(f"Redis connection failed in production: {e}")
                raise
            else:
                logger.warning(f"Redis connection failed, using fallback: {e}")
                self._client = None
    
    def is_connected(self) -> bool:
        """Check if Redis is connected and available."""
        if not self._client:
            return False
        
        try:
            self._client.ping()
            return True
        except:
            return False
    
    def set(self, key: str, value: Any, ttl: Optional[int] = None) -> bool:
        """
        Set a value in Redis with optional TTL.
        Returns True on success, False on failure.
        """
        if not self._client:
            return False
        
        try:
            serialized_value = json.dumps(value) if not isinstance(value, (str, bytes)) else value
            result = self._client.set(key, serialized_value, ex=ttl)
            return bool(result)
        except Exception as e:
            logger.error(f"Redis SET failed for key {key}: {e}")
            return False
    
    def get(self, key: str) -> Optional[Any]:
        """
        Get a value from Redis.
        Automatically deserializes JSON values.
        """
        if not self._client:
            return None
        
        try:
            value = self._client.get(key)
            if value is None:
                return None
            
            # Try to deserialize as JSON, fallback to string
            try:
                return json.loads(value)
            except (json.JSONDecodeError, TypeError):
                return value.decode('utf-8') if isinstance(value, bytes) else value
                
        except Exception as e:
            logger.error(f"Redis GET failed for key {key}: {e}")
            return None
    
    def delete(self, key: str) -> bool:
        """Delete a key from Redis."""
        if not self._client:
            return False
        
        try:
            result = self._client.delete(key)
            return bool(result)
        except Exception as e:
            logger.error(f"Redis DELETE failed for key {key}: {e}")
            return False
    
    def increment(self, key: str, amount: int = 1, ttl: Optional[int] = None) -> Optional[int]:
        """
        Increment a counter in Redis.
        Sets TTL if provided and key doesn't exist.
        """
        if not self._client:
            return None
        
        try:
            # Use pipeline for atomic operations
            pipe = self._client.pipeline()
            pipe.incr(key, amount)
            
            # Set TTL only if key is new
            if ttl and not self._client.exists(key):
                pipe.expire(key, ttl)
            
            results = pipe.execute()
            return results[0] if results else None
            
        except Exception as e:
            logger.error(f"Redis INCREMENT failed for key {key}: {e}")
            return None
    
    def rate_limit_check(self, key: str, limit: int, window: int) -> tuple[bool, int, int]:
        """
        Check rate limit using sliding window.
        
        Returns:
            (allowed: bool, current_count: int, reset_time: int)
        """
        if not self._client:
            # Fallback to in-memory rate limiting
            return self._memory_rate_limit(key, limit, window)
        
        try:
            now = int(time.time())
            window_start = now - window
            
            # Use pipeline for atomic operations
            pipe = self._client.pipeline()
            
            # Remove old entries
            pipe.zremrangebyscore(key, 0, window_start)
            
            # Count current entries
            pipe.zcard(key)
            
            # Add current request
            pipe.zadd(key, {f"{now}:{id(pipe)}": now})
            
            # Set expiration
            pipe.expire(key, window + 10)  # Small buffer for cleanup
            
            results = pipe.execute()
            current_count = results[1]  # Count after cleanup
            
            allowed = current_count < limit
            reset_time = now + window
            
            # If not allowed, remove the request we just added
            if not allowed:
                self._client.zremrangebyrank(key, -1, -1)
            
            return allowed, current_count, reset_time
            
        except Exception as e:
            logger.error(f"Redis rate limit check failed for key {key}: {e}")
            # Fallback to allowing request on Redis failure
            return True, 0, int(time.time()) + window
    
    def _memory_rate_limit(self, key: str, limit: int, window: int) -> tuple[bool, int, int]:
        """
        Fallback in-memory rate limiting.
        NOT suitable for production with multiple instances.
        """
        if not hasattr(self, '_memory_store'):
            self._memory_store = {}
        
        now = time.time()
        
        if key not in self._memory_store:
            self._memory_store[key] = []
        
        # Clean old entries
        self._memory_store[key] = [
            timestamp for timestamp in self._memory_store[key]
            if now - timestamp < window
        ]
        
        current_count = len(self._memory_store[key])
        
        if current_count < limit:
            self._memory_store[key].append(now)
            return True, current_count + 1, int(now + window)
        
        return False, current_count, int(now + window)
    
    def health_check(self) -> dict:
        """Get Redis health status."""
        if not self._client:
            return {
                "status": "disconnected",
                "message": "Redis not configured or connection failed",
                "connected": False
            }
        
        try:
            info = self._client.info()
            return {
                "status": "healthy",
                "connected": True,
                "redis_version": info.get("redis_version"),
                "connected_clients": info.get("connected_clients"),
                "used_memory_human": info.get("used_memory_human"),
                "uptime_in_seconds": info.get("uptime_in_seconds")
            }
        except Exception as e:
            return {
                "status": "unhealthy",
                "connected": False,
                "error": str(e)
            }

# Global Redis client instance
_redis_client: Optional[RedisClient] = None

def get_redis_client() -> RedisClient:
    """Get the global Redis client instance."""
    global _redis_client
    if _redis_client is None:
        _redis_client = RedisClient()
    return _redis_client