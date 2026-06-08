# PakAgri — Smart Crop Recommendation & Yield Predictor

**Pakistan Ki Zameen, Hamare Haath** | پاکستان کی زمین، ہمارے ہاتھ

An AI-powered platform helping Pakistani farmers make data-driven decisions about crop selection and yield estimation. Built for farmers in Punjab, Sindh, KPK, and Balochistan.

![PakAgri Screenshot](./screenshot.png)

---

## Architecture

```
┌─────────────────────────────────────────────────────────────────────┐
│                           PakAgri                                    │
├─────────────────────────────────────────────────────────────────────┤
│  Frontend (Next.js 14)          Backend (FastAPI)                    │
│  ┌─────────────────┐           ┌─────────────────┐                  │
│  │  SSG Pages      │           │  Auth (JWT)      │                  │
│  │  - Landing      │◄─────────►│  - /register     │                  │
│  │  - Accuracy     │   REST    │  - /token        │                  │
│  │                 │    API    │                 │                  │
│  │  CSR Pages      │           │  ML Engine       │                  │
│  │  - Dashboard    │           │  - crop_model    │                  │
│  │  - Login        │           │  - yield_model   │                  │
│  │  - Register     │           │  - scaler        │                  │
│  └────────┬────────┘           └────────┬────────┘                  │
│           │                             │                            │
│           │    Recharts &              │    scikit-learn           │
│           │    framer-motion            │    RandomForest           │
│           │                             │                            │
│           └──────────┬──────────────────┘                            │
│                      │                                               │
│              ┌───────▼────────┐                                       │
│              │   MongoDB      │                                       │
│              │  - users       │                                       │
│              │  - predictions  │                                       │
│              │  - model_metrics│                                      │
│              └────────────────┘                                       │
└─────────────────────────────────────────────────────────────────────┘
```

---

## Prerequisites

- **Python 3.11+**
- **Node.js 18+**
- **MongoDB 6.0+** (local or Atlas)
- **pip** (Python package manager)
- **npm** (Node package manager)

---

## Quick Start

### 1. Backend Setup

```bash
# Navigate to backend
cd pakagri/backend

# Create virtual environment
python -m venv venv

# Activate virtual environment
# On Linux/macOS:
source venv/bin/activate
# On Windows:
# venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Train ML models (generates .pkl files)
python train_model.py

# Start FastAPI server
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

### 2. Frontend Setup

```bash
# Navigate to frontend (in a new terminal)
cd pakagri/frontend

# Install dependencies
npm install

# Start development server
npm run dev
```

### 3. Access the Application

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:8000
- **API Docs**: http://localhost:8000/docs

---

## Environment Variables

| Variable | Location | Description | Default |
|----------|----------|-------------|---------|
| `MONGODB_URL` | backend/.env | MongoDB connection string | `mongodb://localhost:27017` |
| `SECRET_KEY` | backend/.env | JWT secret key | (hardcoded for dev) |
| `NEXT_PUBLIC_API_URL` | frontend/.env.local | Backend API URL | `http://localhost:8000` |

---

## API Endpoints

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| `POST` | `/register` | No | Register new user |
| `POST` | `/token` | No | Login & get JWT token |
| `POST` | `/predict` | Yes | Get crop recommendation & yield prediction |
| `GET` | `/accuracy` | Yes | Get model performance metrics |
| `GET` | `/predictions/history` | Yes | Get user's prediction history |
| `GET` | `/health` | No | Health check endpoint |

---

## Model Swap Instructions

The application runs in **mock mode** by default for demonstration. To use real trained models:

### Step 1: Train the Models

```bash
cd pakagri/backend
python train_model.py
```

This generates:
- `backend/models/crop_model.pkl` — RandomForestClassifier
- `backend/models/yield_model.pkl` — RandomForestRegressor  
- `backend/models/scaler.pkl` — StandardScaler
- `backend/models/metrics.json` — Model performance metrics

### Step 2: Enable Live Mode

Open `backend/ml.py` and change:

```python
USE_MOCK = False  # ← Change from True to False
```

### Step 3: Restart Backend

```bash
uvicorn main:app --reload --port 8000
```

The `/health` endpoint will now show `"model_mode": "live"`.

---

## Features

- **Crop Recommendation**: AI-powered crop suggestions based on soil N-P-K levels, temperature, humidity, pH, and rainfall
- **Yield Prediction**: Estimated production in kg per acre with High/Medium/Low classification
- **Bilingual Interface**: English and Urdu labels throughout
- **Secure Authentication**: JWT-based auth with bcrypt password hashing
- **Prediction History**: Track all your past recommendations
- **Model Metrics Dashboard**: Real-time view of model accuracy and performance
- **Responsive Design**: Works on mobile, tablet, and desktop

---

## Tech Stack

| Category | Technology |
|----------|------------|
| Frontend | Next.js 14, React 18, TypeScript, Tailwind CSS |
| Charts | Recharts, framer-motion |
| Backend | FastAPI, Python 3.11, Uvicorn |
| Database | MongoDB with Motor (async) |
| ML | scikit-learn, pandas, numpy, joblib |
| Auth | JWT, bcrypt, python-jose |

---

## Tier Requirements Coverage

### Tier A — Core Requirements
- [x] User registration and login
- [x] JWT-based authentication
- [x] Crop recommendation API
- [x] Yield prediction API
- [x] MongoDB data persistence
- [x] Prediction history

### Tier B — ML & Performance
- [x] RandomForest classification model
- [x] RandomForest regression model
- [x] Data preprocessing & cleaning
- [x] Model metrics endpoint
- [x] Confidence scores
- [x] Training script with full metrics

### Tier C — Advanced Features
- [x] SSG landing & accuracy pages
- [x] CSR dashboard with live data
- [x] framer-motion animations
- [x] Recharts visualizations
- [x] Bilingual interface (Urdu + English)
- [x] Responsive design
- [x] Production-ready code

---

## Team Members

| Name | Role |
|------|------|
| Development Team | Full-Stack & ML Engineering |

---

## Screenshots

### Landing Page
Beautiful hero with wheat field motifs and bilingual headlines.

### Dashboard
Interactive form with sliders for soil parameters, prediction results with charts.

### Accuracy Page
Model metrics with animated progress rings and performance breakdown.

---

## License

MIT License — Built for Pakistani farmers.

**PakAgri** | کسان کا ڈیجیٹل ساتھی
