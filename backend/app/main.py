from fastapi import FastAPI
from fastapi.staticfiles import StaticFiles
from fastapi.middleware.cors import CORSMiddleware
from backend.app.api.generate import router as generate_router
from backend.app.api.gallery import router as gallery_router


app = FastAPI(
    title="SD ControlNet Backend",
    version="1.0.0"
)
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "http://127.0.0.1:3000",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.mount(
    "/outputs",
    StaticFiles(directory="/outputs"),
    name="outputs"
)

# routes
app.include_router(generate_router, prefix="/api/v1")
app.include_router(gallery_router, prefix="/api/v1")


@app.get("/")
def health_check():
    return {
        "status": "ok",
        "service": "sd-controlnet-backend"
    }