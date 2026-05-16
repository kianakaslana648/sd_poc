from pydantic import BaseModel
from typing import Optional, Literal


class ControlNetConfig(BaseModel):
    type: Literal["canny", "depth", "pose", "scribble"]
    weight: float = 1.0


class TaskModel(BaseModel):
    task_id: str
    prompt: str
    negative_prompt: Optional[str]
    mode: Literal["txt2img", "img2img"]
    base_model: Literal["sd15", "sdxl"]
    controlnet: Optional[ControlNetConfig]
    steps: int
    guidance_scale: float
    seed: Optional[int]
    status: str
    progress: int