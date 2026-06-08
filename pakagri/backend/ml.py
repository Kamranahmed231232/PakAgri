"""
ML Inference Engine for PakAgri
Crop Recommendation and Yield Prediction with placeholder support.
"""

import os
import joblib
import numpy as np
from pathlib import Path
from typing import Tuple, Optional, List
import logging

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Models directory path
MODELS_DIR = Path(__file__).parent / "models"

# Ensure models directory exists
MODELS_DIR.mkdir(parents=True, exist_ok=True)

# ── PLACEHOLDER SECTION ─────────────────────────────────────────────────────
# When your trained models are ready, place them here:
#   backend/models/crop_model.pkl     <- RandomForestClassifier
#   backend/models/yield_model.pkl    <- RandomForestRegressor
#   backend/models/scaler.pkl        <- StandardScaler / MinMaxScaler
# Then set USE_MOCK = False below.
# ────────────────────────────────────────────────────────────────────────────

USE_MOCK = True  # <- flip to False after placing real .pkl files

# Crop labels in order matching model training
CROP_LABELS = [
    "rice", "maize", "chickpea", "kidneybeans", "pigeonpeas",
    "mothbeans", "mungbean", "blackgram", "lentil", "pomegranate",
    "banana", "mango", "grapes", "watermelon", "muskmelon",
    "apple", "orange", "papaya", "coconut", "cotton",
    "jute", "coffee", "wheat", "sugarcane"
]

# Crop emoji mapping
CROP_EMOJIS = {
    "rice": "🌾",
    "maize": "🌽",
    "chickpea": "🫘",
    "kidneybeans": "🫘",
    "pigeonpeas": "🫘",
    "mothbeans": "🫘",
    "mungbean": "🫘",
    "blackgram": "🫘",
    "lentil": "🫘",
    "pomegranate": "🍎",
    "banana": "🍌",
    "mango": "🥭",
    "grapes": "🍇",
    "watermelon": "🍉",
    "muskmelon": "🍈",
    "apple": "🍎",
    "orange": "🍊",
    "papaya": "🍈",
    "coconut": "🥥",
    "cotton": "☁️",
    "jute": "🌿",
    "coffee": "☕",
    "wheat": "🌾",
    "sugarcane": "🎋"
}


def load_models() -> Tuple[Optional[object], Optional[object], Optional[object]]:
    """
    Load ML models from disk at startup.

    Returns:
        Tuple of (crop_model, yield_model, scaler) or (None, None, None) if using mock
    """
    if USE_MOCK:
        logger.info("[ML] Running in MOCK mode - using rule-based predictions")
        return None, None, None

    try:
        crop_path = MODELS_DIR / "crop_model.pkl"
        yield_path = MODELS_DIR / "yield_model.pkl"
        scaler_path = MODELS_DIR / "scaler.pkl"

        if not crop_path.exists():
            logger.error(f"[ML] Crop model not found: {crop_path}")
            return None, None, None

        if not yield_path.exists():
            logger.error(f"[ML] Yield model not found: {yield_path}")
            return None, None, None

        if not scaler_path.exists():
            logger.error(f"[ML] Scaler not found: {scaler_path}")
            return None, None, None

        crop_model = joblib.load(crop_path)
        yield_model = joblib.load(yield_path)
        scaler = joblib.load(scaler_path)

        logger.info("[ML] Models loaded successfully - running in LIVE mode")
        return crop_model, yield_model, scaler

    except Exception as e:
        logger.error(f"[ML] Error loading models: {e}. Falling back to mock mode.")
        return None, None, None


def get_model_mode(crop_model: Optional[object]) -> str:
    """
    Determine current model mode.

    Args:
        crop_model: Loaded crop model or None

    Returns:
        "live" if models are loaded, "mock" otherwise
    """
    if USE_MOCK or crop_model is None:
        return "mock"
    return "live"


def predict_crop_and_yield(
    features: List[float],
    crop_model: Optional[object],
    yield_model: Optional[object],
    scaler: Optional[object],
    area_acres: float = 1.0
) -> Tuple[str, float, str, float, str]:
    """
    Predict crop and yield from soil/weather features.

    Args:
        features: List of [N, P, K, temperature, humidity, ph, rainfall]
        crop_model: Trained RandomForestClassifier or None
        yield_model: Trained RandomForestRegressor or None
        scaler: Trained StandardScaler or None
        area_acres: Farm area in acres (default 1.0)

    Returns:
        Tuple of (crop_name, confidence_pct, yield_level, estimated_kg, advice)
    """
    if USE_MOCK or crop_model is None or yield_model is None or scaler is None:
        return _mock_prediction(features, area_acres)

    try:
        # Prepare and scale features
        arr = np.array(features).reshape(1, -1)
        arr_scaled = scaler.transform(arr)

        # Crop classification
        crop_idx = crop_model.predict(arr_scaled)[0]
        crop_name = CROP_LABELS[int(crop_idx)] if isinstance(crop_idx, (int, np.integer)) else str(crop_idx)
        proba = crop_model.predict_proba(arr_scaled)[0]
        confidence = round(float(np.max(proba)) * 100, 2)

        # Yield regression
        yield_val = float(yield_model.predict(arr_scaled)[0])
        yield_kg = round(yield_val * area_acres, 2)

        # Determine yield level
        if yield_val > 3500:
            yield_level = "High"
        elif yield_val > 2000:
            yield_level = "Medium"
        else:
            yield_level = "Low"

        # Generate advice
        advice = _generate_advice(crop_name, yield_level, features)

        logger.info(f"[ML] Prediction: {crop_name}, confidence: {confidence}%, yield: {yield_kg}kg")
        return crop_name, confidence, yield_level, yield_kg, advice

    except Exception as e:
        logger.error(f"[ML] Prediction error: {e}. Falling back to mock.")
        return _mock_prediction(features, area_acres)


def _mock_prediction(features: List[float], area_acres: float) -> Tuple[str, float, str, float, str]:
    """
    Deterministic mock prediction based on input features.
    Provides realistic demo behavior without ML models.

    Args:
        features: List of [N, P, K, temperature, humidity, ph, rainfall]
        area_acres: Farm area in acres

    Returns:
        Tuple of (crop_name, confidence_pct, yield_level, estimated_kg, advice)
    """
    N, P, K, temp, humidity, ph, rainfall = features

    # Rule-based crop selection based on agronomic logic
    if rainfall > 200 and humidity > 80:
        crop = "rice"
    elif temp > 30 and rainfall < 100:
        crop = "cotton"
    elif ph < 6.5 and rainfall > 150:
        crop = "maize"
    elif N > 80 and rainfall > 150:
        crop = "sugarcane"
    elif temp < 20 and rainfall < 100:
        crop = "wheat"
    elif N > 50 and P > 40:
        crop = "chickpea"
    elif humidity > 70 and temp > 25:
        crop = "mango"
    elif rainfall > 150 and temp > 20:
        crop = "banana"
    else:
        crop = "lentil"

    # Confidence based on feature distinctiveness
    confidence = round(72.0 + (N % 20) + (ph * 0.5), 2)
    confidence = min(max(confidence, 65.0), 95.0)

    # Yield calculation based on nutrients and conditions
    base_yield = 2500 + (K * 3) + (rainfall * 0.5) - (abs(ph - 6.5) * 100)
    yield_kg = round(max(base_yield, 500) * area_acres, 2)

    if base_yield > 3500:
        yield_level = "High"
    elif base_yield > 2000:
        yield_level = "Medium"
    else:
        yield_level = "Low"

    advice = _generate_advice(crop, yield_level, features)

    logger.info(f"[ML-Mock] Prediction: {crop}, confidence: {confidence}%, yield: {yield_kg}kg")
    return crop, confidence, yield_level, yield_kg, advice


def _generate_advice(crop: str, yield_level: str, features: List[float]) -> str:
    """
    Generate farming advice based on prediction and input parameters.

    Args:
        crop: Recommended crop name
        yield_level: Yield prediction level (High/Medium/Low)
        features: List of input features [N, P, K, temp, humidity, ph, rainfall]

    Returns:
        Advice string
    """
    N, P, K, temp, humidity, ph, rainfall = features
    tips = []

    # Nitrogen advice
    if N < 30:
        tips.append("Increase nitrogen fertilizer (e.g., urea) for better growth.")
    elif N > 120:
        tips.append("Nitrogen levels are high — avoid over-fertilization to prevent leaching.")

    # Phosphorus advice
    if P < 20:
        tips.append("Add phosphorus-rich fertilizer (e.g., DAP) to improve root development.")

    # Potassium advice
    if K < 20:
        tips.append("Supplement potassium for better disease resistance and crop quality.")

    # pH advice
    if ph < 5.5:
        tips.append("Soil is too acidic — apply lime to raise pH to optimal levels (6.0-7.0).")
    elif ph > 8.0:
        tips.append("Soil is alkaline — consider sulfur treatment or organic matter.")

    # Rainfall/water advice
    if rainfall < 50:
        tips.append("Low rainfall detected — ensure irrigation availability, especially during critical growth stages.")
    elif rainfall > 300:
        tips.append("High rainfall expected — ensure proper drainage to prevent waterlogging.")

    # Temperature advice
    if temp < 15:
        tips.append("Cool temperatures detected — consider frost protection for sensitive crops.")

    # General advice based on yield level
    if yield_level == "Low":
        tips.append("Consider comprehensive soil testing and consulting your local agriculture extension office.")
    elif yield_level == "Medium":
        tips.append("Optimize your farming practices — moderate adjustments can improve yields significantly.")

    # Default positive advice
    if not tips:
        tips.append(f"Conditions are well-suited for {crop}. Maintain current soil health practices for optimal yields.")

    return " ".join(tips)


def get_crop_emoji(crop: str) -> str:
    """
    Get emoji for a specific crop.

    Args:
        crop: Crop name

    Returns:
        Emoji string
    """
    return CROP_EMOJIS.get(crop.lower(), "🌱")
