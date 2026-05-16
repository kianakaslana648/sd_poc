from fastapi import APIRouter, Form, File, UploadFile
from typing import Optional
from backend.app.schemas.generation import GenerateRequest, GenerateResponse
from backend.app.services.task_service import create_task, get_task

router = APIRouter()


@router.post("/generate")
async def generate(
    prompt: str = Form(...),
    negative_prompt: Optional[str] = Form(None),
    mode: str = Form("txt2img"),
    base_model: str = Form("sd15"),
    steps: int = Form(30),
    guidance_scale: float = Form(7.5),
    seed: Optional[int] = Form(None),
    controlnet_type: Optional[str] = Form(None),
    controlnet_image: Optional[UploadFile] = File(None),
):
    req = {
        "prompt": prompt,
        "negative_prompt": negative_prompt,
        "mode": mode,
        "base_model": base_model,
        "steps": steps,
        "guidance_scale": guidance_scale,
        "seed": seed,
        "controlnet": {
            "type": controlnet_type,
            "image": controlnet_image,
        } if controlnet_type else None
    }
    
    task_id = await create_task(req)

    return GenerateResponse(
        task_id=task_id,
        status="queued"
    )


@router.get("/task/{task_id}")
async def get_status(task_id: str):

    task = await get_task(task_id)

    if not task:
        return {
            "error": "task not found"
        }

    return task