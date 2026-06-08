"""
Pydantic v2 Models for PakAgri API
All request and response models with validation.
"""

from datetime import datetime
from typing import Optional
from pydantic import BaseModel, Field, EmailStr, field_validator
import re


class UserRegister(BaseModel):
    """User registration request model."""

    email: EmailStr = Field(
        ...,
        description="User's email address",
        examples=["farmer@example.com"]
    )
    password: str = Field(
        ...,
        min_length=6,
        max_length=100,
        description="User's password (6-100 characters)",
        examples=["securePassword123"]
    )
    full_name: str = Field(
        ...,
        min_length=2,
        max_length=100,
        description="User's full name",
        examples=["Muhammad Ali"]
    )
    farm_location: str = Field(
        ...,
        min_length=2,
        max_length=200,
        description="Farm location (city/province)",
        examples=["Faisalabad, Punjab"]
    )

    @field_validator('password')
    @classmethod
    def password_strength(cls, v: str) -> str:
        if len(v) < 6:
            raise ValueError('Password must be at least 6 characters')
        return v

    @field_validator('full_name')
    @classmethod
    def name_must_not_be_empty(cls, v: str) -> str:
        if not v.strip():
            raise ValueError('Full name cannot be empty')
        return v.strip()


class UserLogin(BaseModel):
    """User login request model."""

    email: EmailStr = Field(
        ...,
        description="User's email address",
        examples=["farmer@example.com"]
    )
    password: str = Field(
        ...,
        description="User's password",
        examples=["securePassword123"]
    )


class Token(BaseModel):
    """JWT token response model."""

    access_token: str = Field(
        ...,
        description="JWT access token"
    )
    token_type: str = Field(
        default="bearer",
        description="Token type"
    )


class TokenData(BaseModel):
    """JWT token payload data."""

    email: Optional[str] = Field(
        default=None,
        description="User email from token"
    )


class PredictionInput(BaseModel):
    """Input data for crop prediction."""

    N: float = Field(
        ...,
        ge=0,
        le=150,
        description="Nitrogen content in soil (kg/ha)",
        examples=[90.0]
    )
    P: float = Field(
        ...,
        ge=0,
        le=150,
        description="Phosphorus content in soil (kg/ha)",
        examples=[42.0]
    )
    K: float = Field(
        ...,
        ge=0,
        le=250,
        description="Potassium content in soil (kg/ha)",
        examples=[43.0]
    )
    temperature: float = Field(
        ...,
        ge=0,
        le=50,
        description="Temperature in Celsius",
        examples=[25.5]
    )
    humidity: float = Field(
        ...,
        ge=0,
        le=100,
        description="Relative humidity in percentage",
        examples=[80.0]
    )
    ph: float = Field(
        ...,
        ge=0,
        le=14,
        description="Soil pH value",
        examples=[6.5]
    )
    rainfall: float = Field(
        ...,
        ge=0,
        le=400,
        description="Rainfall in mm",
        examples=[200.0]
    )
    area_acres: float = Field(
        default=1.0,
        ge=0.1,
        le=1000,
        description="Farm area in acres",
        examples=[5.0]
    )

    model_config = {
        "json_schema_extra": {
            "examples": [
                {
                    "N": 90,
                    "P": 42,
                    "K": 43,
                    "temperature": 25.5,
                    "humidity": 80.0,
                    "ph": 6.5,
                    "rainfall": 200.0,
                    "area_acres": 5.0
                }
            ]
        }
    }


class PredictionResponse(BaseModel):
    """Crop prediction response model."""

    recommended_crop: str = Field(
        ...,
        description="Recommended crop name",
        examples=["rice"]
    )
    confidence: float = Field(
        ...,
        ge=0,
        le=100,
        description="Confidence percentage for recommendation",
        examples=[85.5]
    )
    yield_level: str = Field(
        ...,
        description="Expected yield level (High/Medium/Low)",
        examples=["High"]
    )
    estimated_production_kg: float = Field(
        ...,
        ge=0,
        description="Estimated production in kg",
        examples=[2500.0]
    )
    advice: str = Field(
        ...,
        description="AI-generated farming advice",
        examples=["Conditions are well-suited for rice. Maintain current soil health."]
    )
    input_data: PredictionInput = Field(
        ...,
        description="Original input parameters"
    )
    user_email: str = Field(
        ...,
        description="Email of user who made prediction"
    )
    timestamp: datetime = Field(
        default_factory=datetime.utcnow,
        description="Prediction timestamp"
    )


class ModelMetrics(BaseModel):
    """ML model performance metrics."""

    # Classification metrics
    accuracy: float = Field(
        ...,
        ge=0,
        le=100,
        description="Classification accuracy percentage",
        examples=[94.5]
    )
    precision: float = Field(
        ...,
        ge=0,
        le=100,
        description="Weighted precision percentage",
        examples=[93.8]
    )
    recall: float = Field(
        ...,
        ge=0,
        le=100,
        description="Weighted recall percentage",
        examples=[94.2]
    )
    f1_score: float = Field(
        ...,
        ge=0,
        le=100,
        description="Weighted F1 score percentage",
        examples=[93.9]
    )

    # Regression metrics
    r2_score: float = Field(
        ...,
        le=1,
        description="R-squared score for yield prediction",
        examples=[0.85]
    )
    mae: float = Field(
        ...,
        ge=0,
        description="Mean Absolute Error for yield prediction",
        examples=[150.5]
    )
    rmse: float = Field(
        ...,
        ge=0,
        description="Root Mean Squared Error for yield prediction",
        examples=[200.3]
    )

    saved_at: datetime = Field(
        default_factory=datetime.utcnow,
        description="Timestamp when metrics were saved"
    )


class UserInDB(BaseModel):
    """User document in MongoDB."""

    email: EmailStr
    hashed_password: str
    full_name: str
    farm_location: str
    created_at: datetime = Field(default_factory=datetime.utcnow)


class PredictionInDB(PredictionResponse):
    """Prediction document in MongoDB with ID."""

    id: Optional[str] = Field(default=None, alias="_id")


class MetricsInDB(ModelMetrics):
    """Metrics document in MongoDB with ID."""

    id: Optional[str] = Field(default=None, alias="_id")


class HealthResponse(BaseModel):
    """Health check response."""

    status: str = Field(default="ok", description="Service status")
    model_mode: str = Field(
        ...,
        description="ML model mode (live/mock)"
    )
    timestamp: datetime = Field(
        default_factory=datetime.utcnow,
        description="Current server timestamp"
    )
