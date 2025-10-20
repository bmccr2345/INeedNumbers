"""
Dependency injection for I Need Numbers application.
Uses centralized configuration with validation.
"""

from config import get_config, Config

def get_settings() -> Config:
    """
    Get application settings/configuration.
    This replaces the old Settings model with the new centralized Config.
    """
    return get_config()