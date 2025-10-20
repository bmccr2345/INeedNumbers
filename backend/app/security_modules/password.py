"""
Secure password hashing using Argon2id
"""
from argon2 import PasswordHasher
from argon2.exceptions import VerifyMismatchError
import logging

logger = logging.getLogger(__name__)

# Initialize Argon2id hasher with secure parameters
# time_cost: Number of iterations (recommended: 3-4)
# memory_cost: Memory usage in KB (recommended: 65536 = 64MB)
# parallelism: Number of threads (recommended: 1-4)
ph = PasswordHasher(
    time_cost=4,       # Iterations
    memory_cost=65536,  # 64MB memory
    parallelism=1,     # Single thread for better compatibility
    hash_len=32,       # 32 byte hash length
    salt_len=16        # 16 byte salt length
)

def hash_password(password: str) -> str:
    """
    Hash a password using Argon2id
    
    Args:
        password: Plain text password to hash
        
    Returns:
        Argon2id hash string
        
    Raises:
        ValueError: If password is empty or None
    """
    if not password or not password.strip():
        raise ValueError("Password cannot be empty")
    
    try:
        hashed = ph.hash(password)
        logger.info("Password hashed successfully")
        return hashed
    except Exception as e:
        logger.error(f"Failed to hash password: {e}")
        raise ValueError("Failed to hash password")

def verify_password(password: str, hashed: str) -> bool:
    """
    Verify a password against a hash (supports both Argon2id and bcrypt for backward compatibility)
    
    Args:
        password: Plain text password to verify
        hashed: Hash to verify against (Argon2id or bcrypt)
        
    Returns:
        True if password matches hash, False otherwise
    """
    if not password or not hashed:
        logger.warning("Password verification attempted with empty values")
        return False
    
    # Check if it's an Argon2id hash
    if hashed.startswith('$argon2'):
        try:
            ph.verify(hashed, password)
            logger.info("Password verification successful (Argon2id)")
            return True
        except VerifyMismatchError:
            logger.warning("Password verification failed - Argon2id mismatch")
            return False
        except Exception as e:
            logger.error(f"Argon2id password verification error: {e}")
            return False
    
    # Check if it's a bcrypt hash (backward compatibility)
    elif hashed.startswith('$2b$') or hashed.startswith('$2a$') or hashed.startswith('$2y$'):
        try:
            import bcrypt
            # Convert strings to bytes for bcrypt
            password_bytes = password.encode('utf-8')
            hashed_bytes = hashed.encode('utf-8')
            result = bcrypt.checkpw(password_bytes, hashed_bytes)
            if result:
                logger.info("Password verification successful (bcrypt - legacy)")
            else:
                logger.warning("Password verification failed - bcrypt mismatch")
            return result
        except Exception as e:
            logger.error(f"bcrypt password verification error: {e}")
            return False
    
    # Unknown hash format
    else:
        logger.error(f"Unknown password hash format: {hashed[:20]}...")
        return False

def check_needs_rehash(hashed: str) -> bool:
    """
    Check if a hash needs to be rehashed with current parameters
    
    Args:
        hashed: Argon2id hash to check
        
    Returns:
        True if hash needs rehashing, False otherwise
    """
    try:
        return ph.check_needs_rehash(hashed)
    except Exception:
        # If we can't check, assume it needs rehashing
        return True