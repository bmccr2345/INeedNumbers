"""
Two-Factor Authentication (2FA) module
Provides TOTP-based 2FA functionality with QR code generation
"""
import pyotp
import qrcode
import io
import base64
from typing import Tuple, List
import secrets


def generate_totp_secret() -> str:
    """Generate a new TOTP secret key"""
    return pyotp.random_base32()


def generate_qr_code(email: str, secret: str, issuer: str = "I Need Numbers") -> str:
    """
    Generate QR code for TOTP setup
    Returns base64-encoded PNG image
    """
    # Create provisioning URI
    totp = pyotp.TOTP(secret)
    provisioning_uri = totp.provisioning_uri(
        name=email,
        issuer_name=issuer
    )
    
    # Generate QR code
    qr = qrcode.QRCode(
        version=1,
        error_correction=qrcode.constants.ERROR_CORRECT_L,
        box_size=10,
        border=4,
    )
    qr.add_data(provisioning_uri)
    qr.make(fit=True)
    
    # Create image
    img = qr.make_image(fill_color="black", back_color="white")
    
    # Convert to base64
    buffer = io.BytesIO()
    img.save(buffer, format='PNG')
    buffer.seek(0)
    img_base64 = base64.b64encode(buffer.getvalue()).decode('utf-8')
    
    return f"data:image/png;base64,{img_base64}"


def verify_totp_code(secret: str, code: str) -> bool:
    """
    Verify a TOTP code against the secret
    Returns True if valid, False otherwise
    """
    if not code or len(code) != 6:
        return False
    
    try:
        totp = pyotp.TOTP(secret)
        # Allow 1 time step tolerance (30 seconds before/after)
        return totp.verify(code, valid_window=1)
    except Exception:
        return False


def generate_backup_codes(count: int = 10) -> List[str]:
    """
    Generate backup codes for 2FA recovery
    Returns list of 8-character alphanumeric codes
    """
    codes = []
    for _ in range(count):
        # Generate 8-character code using secrets for cryptographic randomness
        code = ''.join(secrets.choice('ABCDEFGHJKLMNPQRSTUVWXYZ23456789') for _ in range(8))
        codes.append(code)
    return codes


def hash_backup_codes(codes: List[str]) -> List[str]:
    """
    Hash backup codes before storing in database
    Uses simple sha256 for backup codes
    """
    import hashlib
    return [hashlib.sha256(code.encode()).hexdigest() for code in codes]


def verify_backup_code(code: str, hashed_codes: List[str]) -> bool:
    """
    Verify a backup code against stored hashed codes
    Returns True if valid, False otherwise
    """
    import hashlib
    code_hash = hashlib.sha256(code.upper().encode()).hexdigest()
    return code_hash in hashed_codes
