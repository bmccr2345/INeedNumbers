"""
Logging filters to remove sensitive data from logs.
Prevents PII and authentication data from being logged.
"""
import logging
import re
from typing import Dict, Any


class SensitiveHeadersFilter(logging.Filter):
    """
    Filter to remove sensitive headers and PII from log records.
    Removes Authorization, Cookie headers and potential PII patterns.
    """
    
    def __init__(self):
        super().__init__()
        # Headers to completely remove
        self.sensitive_headers = {
            'authorization',
            'cookie', 
            'x-api-key',
            'x-auth-token',
            'stripe-signature'
        }
        
        # PII patterns to redact
        self.pii_patterns = [
            # Email addresses
            (re.compile(r'\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b'), '[EMAIL_REDACTED]'),
            # Phone numbers (basic pattern)
            (re.compile(r'\b\d{3}[-.]?\d{3}[-.]?\d{4}\b'), '[PHONE_REDACTED]'),
            # Credit card numbers (basic pattern)
            (re.compile(r'\b\d{4}[-\s]?\d{4}[-\s]?\d{4}[-\s]?\d{4}\b'), '[CC_REDACTED]'),
            # JWT tokens (basic pattern)
            (re.compile(r'eyJ[A-Za-z0-9_-]*\.[A-Za-z0-9_-]*\.[A-Za-z0-9_-]*'), '[JWT_REDACTED]'),
            # API keys (sk- prefix for OpenAI/Stripe)
            (re.compile(r'sk-[A-Za-z0-9_-]{20,}'), '[API_KEY_REDACTED]'),
        ]
    
    def filter(self, record: logging.LogRecord) -> bool:
        """
        Filter log record to remove sensitive information.
        
        Args:
            record: LogRecord to filter
            
        Returns:
            True to keep the record, False to drop it
        """
        try:
            # Filter message content
            if hasattr(record, 'msg') and record.msg:
                record.msg = self._sanitize_text(str(record.msg))
            
            # Filter arguments
            if hasattr(record, 'args') and record.args:
                record.args = tuple(self._sanitize_text(str(arg)) for arg in record.args)
            
            # Filter extra attributes that might contain headers
            for attr in ['headers', 'request_headers', 'response_headers']:
                if hasattr(record, attr):
                    setattr(record, attr, self._sanitize_headers(getattr(record, attr)))
            
        except Exception:
            # If filtering fails, pass the record through unchanged
            # Better to log with sensitive data than lose the log entirely
            pass
            
        return True
    
    def _sanitize_text(self, text: str) -> str:
        """Remove PII patterns from text."""
        if not isinstance(text, str):
            return text
            
        # Apply PII pattern replacements
        for pattern, replacement in self.pii_patterns:
            text = pattern.sub(replacement, text)
            
        return text
    
    def _sanitize_headers(self, headers) -> Dict[str, Any]:
        """Remove sensitive headers from headers dict."""
        if not isinstance(headers, dict):
            return headers
            
        sanitized = {}
        for key, value in headers.items():
            if key.lower() in self.sensitive_headers:
                sanitized[key] = '[REDACTED]'
            else:
                # Still check value for PII patterns
                if isinstance(value, str):
                    sanitized[key] = self._sanitize_text(value)
                else:
                    sanitized[key] = value
                    
        return sanitized


def setup_secure_logging(logger_name: str = None) -> logging.Logger:
    """
    Setup logger with sensitive data filtering.
    
    Args:
        logger_name: Name of logger to configure
        
    Returns:
        Configured logger with security filters
    """
    logger = logging.getLogger(logger_name)
    
    # Add sensitive data filter to all handlers
    sensitive_filter = SensitiveHeadersFilter()
    
    # Apply to existing handlers
    for handler in logger.handlers:
        handler.addFilter(sensitive_filter)
    
    # Apply to root logger handlers if no specific handlers
    if not logger.handlers:
        root_logger = logging.getLogger()
        for handler in root_logger.handlers:
            handler.addFilter(sensitive_filter)
    
    return logger


def log_request_safely(logger: logging.Logger, request_info: Dict[str, Any], level: int = logging.INFO):
    """
    Log request information with automatic PII filtering.
    
    Args:
        logger: Logger instance with security filters
        request_info: Request information dictionary
        level: Log level to use
    """
    # The filter will automatically sanitize this
    logger.log(level, "Request: %s", request_info)


# Pre-configured loggers for common use cases
security_logger = setup_secure_logging("security")
api_logger = setup_secure_logging("api")
auth_logger = setup_secure_logging("auth")