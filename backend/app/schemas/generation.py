from pydantic import BaseModel
from typing import Optional, Literal, Dict, Any


class ControlNetRequest(BaseModel):
    type: Literal["canny", "depth", "pose", "scribble"]
    image_url: Optional[str] = None


class GenerateRequest(BaseModel):
    prompt: str
    negative_prompt: Optional[str] = None
    mode: Literal["txt2img", "img2img", "inpaint"] = "txt2img"
    base_model: Literal["sd15", "sdxl"] = "sd15"
    controlnet: Optional[ControlNetRequest] = None
    steps: int = 30
    guidance_scale: float = 7.5
    seed: Optional[int] = None
    image_url: Optional[str] = None
    extra: Optional[Dict[str, Any]] = None


class GenerateResponse(BaseModel):
    task_id: str
    status: str = "queued"