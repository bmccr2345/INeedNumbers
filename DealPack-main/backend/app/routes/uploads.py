from fastapi import APIRouter, UploadFile, File, HTTPException, Depends
import magic  # python-magic
from app.deps import get_settings
import boto3
import uuid
from botocore.config import Config

router = APIRouter()

@router.post("/asset")
async def upload_asset(f: UploadFile = File(...), settings=Depends(get_settings)):
    """Secure asset upload with MIME validation and size limits"""
    blob = await f.read()
    
    # Check file size
    if len(blob) > settings.ASSET_MAX_MB * 1024 * 1024:
        raise HTTPException(413, "File too large")
    
    # Validate MIME type from actual file content
    mime_from_bytes = magic.from_buffer(blob, mime=True)
    allowed = [m.strip() for m in settings.ALLOWED_MIME.split(",")]
    
    if mime_from_bytes not in allowed:
        raise HTTPException(415, "Unsupported media type")

    # S3 upload with secure configuration
    try:
        s3 = boto3.client("s3",
            aws_access_key_id=settings.S3_ACCESS_KEY_ID,
            aws_secret_access_key=settings.S3_SECRET_ACCESS_KEY,
            region_name=settings.S3_REGION,
            config=Config(s3={"addressing_style": "virtual"})
        )
        
        key = f"assets/{uuid.uuid4().hex}"
        s3.put_object(
            Bucket=settings.S3_BUCKET,
            Key=key,
            Body=blob,
            ContentType=mime_from_bytes,
            ACL="private"  # Secure: no public access
        )
        
        return {"key": key}
        
    except Exception as e:
        raise HTTPException(500, "Upload failed")