"""
ML Model Training Script for PakAgri
Trains crop recommendation classifier and yield regression models.
"""

import os
import json
import numpy as np
import pandas as pd
from datetime import datetime
from pathlib import Path
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import StandardScaler
from sklearn.ensemble import RandomForestClassifier, RandomForestRegressor
from sklearn.metrics import (
    accuracy_score,
    precision_score,
    recall_score,
    f1_score,
    classification_report,
    r2_score,
    mean_absolute_error,
    mean_squared_error
)
import joblib
import logging

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

# Paths
SCRIPT_DIR = Path(__file__).parent
DATA_PATH = SCRIPT_DIR / "data" / "Crop_recommendation.csv"
MODELS_DIR = SCRIPT_DIR / "models"
METRICS_PATH = MODELS_DIR / "metrics.json"

# Ensure models directory exists
MODELS_DIR.mkdir(parents=True, exist_ok=True)


def load_data() -> pd.DataFrame:
    """
    Load and display the crop recommendation dataset.

    Returns:
        DataFrame with crop data
    """
    if not DATA_PATH.exists():
        raise FileNotFoundError(f"Data file not found: {DATA_PATH}")

    df = pd.read_csv(DATA_PATH)
    logger.info(f"=" * 60)
    logger.info("DATA GATHERING REPORT")
    logger.info(f"=" * 60)
    logger.info(f"Dataset shape: {df.shape[0]} rows, {df.shape[1]} columns")
    logger.info(f"Columns: {list(df.columns)}")
    logger.info(f"\nFirst 5 rows:")
    logger.info(f"\n{df.head()}")
    logger.info(f"\nData types:\n{df.dtypes}")
    logger.info(f"\nCrop distribution:\n{df['label'].value_counts()}")

    return df


def clean_data(df: pd.DataFrame) -> pd.DataFrame:
    """
    Clean the dataset: handle duplicates, nulls, and outliers.

    Args:
        df: Raw DataFrame

    Returns:
        Cleaned DataFrame
    """
    initial_rows = len(df)
    logger.info(f"\n" + "=" * 60)
    logger.info("DATA CLEANING REPORT")
    logger.info(f"=" * 60)

    # Check for duplicates
    duplicates = df.duplicated().sum()
    if duplicates > 0:
        df = df.drop_duplicates()
        logger.info(f"Removed {duplicates} duplicate rows")
    else:
        logger.info("No duplicates found")

    # Check for nulls
    nulls = df.isnull().sum()
    if nulls.sum() > 0:
        logger.info(f"Null values detected:\n{nulls}")
        df = df.dropna()
        logger.info("Dropped rows with null values")
    else:
        logger.info("No null values found")

    # Handle outliers using IQR for numeric columns
    numeric_cols = ['N', 'P', 'K', 'temperature', 'humidity', 'ph', 'rainfall']
    outliers_removed = 0

    for col in numeric_cols:
        if col in df.columns:
            Q1 = df[col].quantile(0.25)
            Q3 = df[col].quantile(0.75)
            IQR = Q3 - Q1
            lower = Q1 - 1.5 * IQR
            upper = Q3 + 1.5 * IQR
            before = len(df)
            df = df[(df[col] >= lower) & (df[col] <= upper)]
            removed = before - len(df)
            outliers_removed += removed

    logger.info(f"Removed {outliers_removed} outlier rows using IQR method")

    final_rows = len(df)
    logger.info(f"\nCleaning summary:")
    logger.info(f"  Initial rows: {initial_rows}")
    logger.info(f"  Final rows: {final_rows}")
    logger.info(f"  Rows removed: {initial_rows - final_rows}")

    return df


def engineer_features(df: pd.DataFrame) -> tuple:
    """
    Engineer features and create synthetic yield target.

    Args:
        df: Cleaned DataFrame

    Returns:
        Tuple of (features, crop_labels, yield_targets)
    """
    logger.info(f"\n" + "=" * 60)
    logger.info("FEATURE ENGINEERING REPORT")
    logger.info(f"=" * 60)

    # Feature columns
    feature_cols = ['N', 'P', 'K', 'temperature', 'humidity', 'ph', 'rainfall']
    X = df[feature_cols].values
    y_crop = df['label'].values

    # Encode crop labels
    from sklearn.preprocessing import LabelEncoder
    label_encoder = LabelEncoder()
    y_crop_encoded = label_encoder.fit_transform(y_crop)

    logger.info(f"Features extracted: {feature_cols}")
    logger.info(f"Feature shape: {X.shape}")
    logger.info(f"Crop classes: {list(label_encoder.classes_)}")
    logger.info(f"Number of crop classes: {len(label_encoder.classes_)}")

    # Generate synthetic yield data
    # NOTE: This is synthetic for demonstration until real yield data is provided.
    # Real yield data would come from agricultural surveys or farm records.
    # Formula: base yield + nutrient contributions + rainfall factor + noise
    np.random.seed(42)
    yield_kg = (
        1000 +
        (df['N'].values * 10) +
        (df['P'].values * 8) +
        (df['K'].values * 6) +
        (df['rainfall'].values * 2) +
        np.random.normal(0, 200, len(df))
    )
    yield_kg = np.maximum(yield_kg, 500)  # Minimum yield threshold

    logger.info(f"\nSynthetic yield generated:")
    logger.info(f"  Min yield: {yield_kg.min():.2f} kg/ha")
    logger.info(f"  Max yield: {yield_kg.max():.2f} kg/ha")
    logger.info(f"  Mean yield: {yield_kg.mean():.2f} kg/ha")
    logger.info(f"  Std yield: {yield_kg.std():.2f} kg/ha")
    logger.info(f"\nNOTE: Yield data is SYNTHETIC for demonstration.")
    logger.info(f"Replace with real yield data from agricultural surveys for production use.")

    return X, y_crop_encoded, yield_kg, label_encoder


def train_crop_classifier(X: np.ndarray, y: np.ndarray) -> tuple:
    """
    Train RandomForestClassifier for crop recommendation.

    Args:
        X: Feature array
        y: Encoded crop labels

    Returns:
        Tuple of (model, X_test, y_test, y_pred, metrics)
    """
    logger.info(f"\n" + "=" * 60)
    logger.info("CROP CLASSIFICATION TRAINING")
    logger.info(f"=" * 60)

    # Split data (stratified for balanced class distribution)
    X_train, X_test, y_train, y_test = train_test_split(
        X, y, test_size=0.2, random_state=42, stratify=y
    )

    logger.info(f"Training samples: {len(X_train)}")
    logger.info(f"Testing samples: {len(X_test)}")

    # Train classifier
    clf = RandomForestClassifier(
        n_estimators=100,
        max_depth=None,
        min_samples_split=2,
        min_samples_leaf=1,
        random_state=42,
        n_jobs=-1
    )
    clf.fit(X_train, y_train)

    # Predict
    y_pred = clf.predict(X_test)

    # Calculate metrics
    accuracy = accuracy_score(y_test, y_pred) * 100
    precision = precision_score(y_test, y_pred, average='weighted', zero_division=0) * 100
    recall = recall_score(y_test, y_pred, average='weighted', zero_division=0) * 100
    f1 = f1_score(y_test, y_pred, average='weighted', zero_division=0) * 100

    logger.info(f"\nClassification Metrics:")
    logger.info(f"  Accuracy:  {accuracy:.2f}%")
    logger.info(f"  Precision: {precision:.2f}%")
    logger.info(f"  Recall:    {recall:.2f}%")
    logger.info(f"  F1 Score:  {f1:.2f}%")

    logger.info(f"\nClassification Report:")
    print(classification_report(y_test, y_pred, zero_division=0))

    metrics = {
        'accuracy': round(accuracy, 2),
        'precision': round(precision, 2),
        'recall': round(recall, 2),
        'f1_score': round(f1, 2)
    }

    return clf, X_train, metrics


def train_yield_regressor(X: np.ndarray, y_yield: np.ndarray) -> tuple:
    """
    Train RandomForestRegressor for yield prediction.

    Args:
        X: Feature array
        y_yield: Yield targets in kg/ha

    Returns:
        Tuple of (model, metrics)
    """
    logger.info(f"\n" + "=" * 60)
    logger.info("YIELD REGRESSION TRAINING")
    logger.info(f"=" * 60)

    # Split data
    X_train, X_test, y_train, y_test = train_test_split(
        X, y_yield, test_size=0.2, random_state=42
    )

    logger.info(f"Training samples: {len(X_train)}")
    logger.info(f"Testing samples: {len(X_test)}")

    # Train regressor
    reg = RandomForestRegressor(
        n_estimators=100,
        max_depth=None,
        min_samples_split=2,
        min_samples_leaf=1,
        random_state=42,
        n_jobs=-1
    )
    reg.fit(X_train, y_train)

    # Predict
    y_pred = reg.predict(X_test)

    # Calculate metrics
    r2 = r2_score(y_test, y_pred)
    mae = mean_absolute_error(y_test, y_pred)
    rmse = np.sqrt(mean_squared_error(y_test, y_pred))

    logger.info(f"\nRegression Metrics:")
    logger.info(f"  R² Score: {r2:.4f}")
    logger.info(f"  MAE:      {mae:.2f} kg/ha")
    logger.info(f"  RMSE:     {rmse:.2f} kg/ha")

    metrics = {
        'r2_score': round(r2, 4),
        'mae': round(mae, 2),
        'rmse': round(rmse, 2)
    }

    return reg, metrics


def save_artifacts(
    scaler: StandardScaler,
    crop_model: RandomForestClassifier,
    yield_model: RandomForestRegressor,
    label_encoder,
    clf_metrics: dict,
    reg_metrics: dict
) -> None:
    """
    Save models and metrics to disk.

    Args:
        scaler: Fitted StandardScaler
        crop_model: Trained classifier
        yield_model: Trained regressor
        label_encoder: Fitted label encoder
        clf_metrics: Classification metrics
        reg_metrics: Regression metrics
    """
    logger.info(f"\n" + "=" * 60)
    logger.info("SAVING ARTIFACTS")
    logger.info(f"=" * 60)

    # Save scaler
    scaler_path = MODELS_DIR / "scaler.pkl"
    joblib.dump(scaler, scaler_path)
    logger.info(f"Saved: {scaler_path}")

    # Save crop model
    crop_path = MODELS_DIR / "crop_model.pkl"
    joblib.dump(crop_model, crop_path)
    logger.info(f"Saved: {crop_path}")

    # Save yield model
    yield_path = MODELS_DIR / "yield_model.pkl"
    joblib.dump(yield_model, yield_path)
    logger.info(f"Saved: {yield_path}")

    # Save label encoder
    encoder_path = MODELS_DIR / "label_encoder.pkl"
    joblib.dump(label_encoder, encoder_path)
    logger.info(f"Saved: {encoder_path}")

    # Save metrics to JSON
    metrics = {
        **clf_metrics,
        **reg_metrics,
        'saved_at': datetime.utcnow().isoformat(),
        'model_type': 'RandomForest',
        'n_estimators': 100,
        'training_data_rows': 50  # Update this based on actual data
    }

    with open(METRICS_PATH, 'w') as f:
        json.dump(metrics, f, indent=2)
    logger.info(f"Saved: {METRICS_PATH}")


def main():
    """
    Main training pipeline.
    """
    logger.info("\n" + "=" * 70)
    logger.info("   PAKAGRI ML MODEL TRAINING PIPELINE")
    logger.info("=" * 70)
    logger.info(f"Started at: {datetime.utcnow().isoformat()}")

    try:
        # Step 1: Load data
        df = load_data()

        # Step 2: Clean data
        df_clean = clean_data(df)

        # Step 3: Engineer features
        X, y_crop, y_yield, label_encoder = engineer_features(df_clean)

        # Step 4: Scale features
        scaler = StandardScaler()
        X_scaled = scaler.fit_transform(X)
        logger.info(f"\nFeatures scaled using StandardScaler")
        logger.info(f"  Mean: {scaler.mean_}")
        logger.info(f"  Std:  {scaler.scale_}")

        # Step 5: Train crop classifier
        crop_model, X_train_scaled, clf_metrics = train_crop_classifier(X_scaled, y_crop)

        # Step 6: Train yield regressor
        yield_model, reg_metrics = train_yield_regressor(X_scaled, y_yield)

        # Step 7: Save all artifacts
        save_artifacts(scaler, crop_model, yield_model, label_encoder, clf_metrics, reg_metrics)

        # Final summary
        logger.info("\n" + "=" * 70)
        logger.info("   TRAINING COMPLETE - SUMMARY")
        logger.info("=" * 70)
        logger.info("\nClassification Performance:")
        logger.info(f"  Accuracy:  {clf_metrics['accuracy']:.2f}%")
        logger.info(f"  Precision: {clf_metrics['precision']:.2f}%")
        logger.info(f"  Recall:    {clf_metrics['recall']:.2f}%")
        logger.info(f"  F1 Score:  {clf_metrics['f1_score']:.2f}%")

        logger.info("\nRegression Performance:")
        logger.info(f"  R² Score: {reg_metrics['r2_score']:.4f}")
        logger.info(f"  MAE:      {reg_metrics['mae']:.2f} kg/ha")
        logger.info(f"  RMSE:     {reg_metrics['rmse']:.2f} kg/ha")

        logger.info(f"\nModels saved to: {MODELS_DIR}")
        logger.info(f"\nTo use these models, set USE_MOCK = False in backend/ml.py")
        logger.info(f"\nCompleted at: {datetime.utcnow().isoformat()}")
        logger.info("=" * 70)

    except Exception as e:
        logger.error(f"\nTraining failed: {e}")
        raise e


if __name__ == "__main__":
    main()
