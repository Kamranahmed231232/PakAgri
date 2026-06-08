"""
JWT Authentication Module for PakAgri
Password hashing with bcrypt and JWT token management.
"""

import os
from datetime import datetime, timedelta
from typing import Optional
from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from jose import JWTError, jwt
from passlib.context import CryptContext
import bcrypt
import logging

from models import TokenData, UserInDB
from database import get_database

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Security configuration
SECRET_KEY = os.getenv("SECRET_KEY", "pakagri_super_secret_key_2024_change_in_production")
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 60

# Password hashing context
pwd_context = CryptContext(
    schemes=["bcrypt"],
    deprecated="auto",
    bcrypt__rounds=12
)

# OAuth2 scheme for token extraction
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/token")


def hash_password(password: str) -> str:
    """
    Hash a plain text password using bcrypt.

    Args:
        password: Plain text password to hash

    Returns:
        Hashed password string
    """
    return pwd_context.hash(password)


def verify_password(plain_password: str, hashed_password: str) -> bool:
    """
    Verify a plain password against a hashed password.

    Args:
        plain_password: Plain text password to verify
        hashed_password: Stored hashed password

    Returns:
        True if password matches, False otherwise
    """
    try:
        return pwd_context.verify(plain_password, hashed_password)
    except Exception as e:
        logger.error(f"Password verification error: {e}")
        return False


def create_access_token(data: dict, expires_delta: Optional[timedelta] = None) -> str:
    """
    Create a JWT access token.

    Args:
        data: Dictionary to encode in the token (typically {"sub": email})
        expires_delta: Optional custom expiration time

    Returns:
        Encoded JWT token string
    """
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.utcnow() + expires_delta
    else:
        expire = datetime.utcnow() + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)

    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt


async def get_current_user(token: str = Depends(oauth2_scheme)) -> dict:
    """
    Get the current authenticated user from the JWT token.

    Args:
        token: JWT token from Authorization header

    Returns:
        User document from MongoDB

    Raises:
        HTTPException: 401 if token is invalid or user not found
    """
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )

    try:
        # Decode JWT token
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        email: str = payload.get("sub")

        if email is None:
            logger.warning("Token missing email subject")
            raise credentials_exception

        token_data = TokenData(email=email)

    except JWTError as e:
        logger.warning(f"JWT decode error: {e}")
        raise credentials_exception

    # Fetch user from database
    if token_data.email is None:
        raise credentials_exception

    db = get_database()
    user = await db.users.find_one({"email": token_data.email})

    if user is None:
        logger.warning(f"User not found for email: {token_data.email}")
        raise credentials_exception

    return user


async def authenticate_user(email: str, password: str) -> Optional[dict]:
    """
    Authenticate a user by email and password.

    Args:
        email: User's email address
        password: User's password

    Returns:
        User document if authentication successful, None otherwise
    """
    db = get_database()
    user = await db.users.find_one({"email": email})

    if user is None:
        return None

    if not verify_password(password, user.get("hashed_password", "")):
        return None

    return user


def create_token_for_user(email: str) -> str:
    """
    Create an access token for a user.

    Args:
        email: User's email address

    Returns:
        JWT access token string
    """
    access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        data={"sub": email},
        expires_delta=access_token_expires
    )
    return access_token


def decode_token(token: str) -> Optional[dict]:
    """
    Decode a JWT token without validation.

    Args:
        token: JWT token string

    Returns:
        Decoded payload or None if invalid
    """
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        return payload
    except JWTError:
        return None
