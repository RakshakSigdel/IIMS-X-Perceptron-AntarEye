from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
import os

from src.fundus_classifier.api.routes import router
from src.fundus_classifier.config import HEATMAP_DIR

app = FastAPI(title="Fundus Classifier API", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

os.makedirs(HEATMAP_DIR, exist_ok=True)
app.mount("/static/heatmaps", StaticFiles(directory=HEATMAP_DIR), name="heatmaps")

app.include_router(router)

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
