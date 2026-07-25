<div align="center">
  <img src="./frontend/public/logo.png" alt="AntarEye Logo" width="120" />
  <h1>AntarEye</h1>
  <p><strong>AI-Assisted Retinal Disease Screening Platform</strong></p>
  
  [Dataset](https://drive.google.com/file/d/1-Lt4q_zLq9OuvXuPDnup3b3nCUhS2xpx/view?usp=sharing)
</div>

---

## 👁️ About The Project

AntarEye is a clinical decision support system designed to assist ophthalmologists in diagnosing retinal diseases. By leveraging advanced machine learning models (ViT/CNN) and Large Language Models (LLMs), AntarEye analyzes fundus images to predict conditions like Diabetic Retinopathy, Glaucoma, and Normal eyes.

It provides instant activation heatmaps, prediction confidences, and auto-generates clinical and patient-friendly recommendation reports in a structured PDF format.

### 🌟 Key Features

- **AI Disease Classification:** Fast, accurate prediction using custom-trained ML models.
- **Explainable AI (XAI):** Visual activation heatmaps highlighting affected retinal regions.
- **LLM-Powered Insights:** Automated clinical guidance (via Google Gemini) for doctors and simplified explanations for patients.
- **Secure RBAC System:** Role-based access control (Admin, Doctor, Patient) powered by Supabase Auth.
- **Automated Medical Reports:** Instant, one-click A4 PDF report generation.

---

## 🤖 How AI Was Used

Our platform integrates a dual-layered AI architecture:

1. **Computer Vision (PyTorch/FastAPI):** A custom vision model trained on retinal fundus images to classify diseases and generate spatial heatmaps (Grad-CAM) to ensure medical explainability.
2. **Generative AI (Gemini):** We use Google's Gemini LLM to interpret the raw probability scores and patient demographic data, instantly crafting two distinct recommendation paragraphs: a clinical guide for the examining physician and an empathetic, simplified summary for the patient.

---

## 🚀 Getting Started

### Prerequisites

- Node.js (v18+)
- Python (3.9+)
- Supabase CLI or active Supabase project
- API Keys: `SUPABASE_URL`, `SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY`, `GEMINI_API_KEY`

### Running the Frontend (Next.js)

```bash
cd frontend
npm install
# Configure your .env.local with Supabase keys and FastAPI URL
npm run dev
```

### Running the Backend (FastAPI)

```bash
cd ai
pip install -r requirements.txt
# Configure your .env with Gemini API key
python -m src.fundus_classifier.api.main
```

---

## 📊 Dataset

The AI model was trained on the fundus retina images data from various sources.

- **Link:** [View Dataset](https://drive.google.com/file/d/1-Lt4q_zLq9OuvXuPDnup3b3nCUhS2xpx/view?usp=sharing)

---

## 👥 Team RUG Tech

- **Bipin Subedi** - Backend Developer - <https://github.com/BipinSubedi0608>
- **Prasun Bhattarai** - AI/ML Developer - <https://github.com/prasunbhattarai>
- **Rakshak Sigdel** - Leader & Frontend Developer - <https://github.com/RakshakSigdel>

---
*Built for IIMS x Perceptron International Hackathon 2026*
