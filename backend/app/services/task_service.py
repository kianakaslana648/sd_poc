import uuid
from pathlib import Path
from typing import Optional
from shared.redis import push_task
from shared.mongo import tasks_collection
from datetime import datetime

async def save_file(task_id: str, file, suffix: str = "input"):
    if not file:
        return None
    filename = file.filename or "file"
    ext = Path(filename).suffix or ".png"
    path = Path(f"/app/data/tasks/{task_id}_{suffix}{ext}")

    path.parent.mkdir(parents=True, exist_ok=True)
    content = await file.read()
    path.write_bytes(content)

    return str(path)

async def create_task(req):

    task_id = str(uuid.uuid4())

    controlnet = None

    if req.get("controlnet"):
        cn = req["controlnet"]

        cn_image_path = await save_file(
            task_id,
            cn.get("image")
        )

        print("saved data image", cn_image_path)
        controlnet = {
            "type": cn.get("type"),
            "weight": cn.get("weight", 1.0),
            "image_path": cn_image_path
        }

    task_doc = {
        "task_id": task_id,
        "status": "queued",
        "prompt": req["prompt"],
        "negative_prompt": req.get("negative_prompt"),
        "mode": req["mode"],
        "base_model": req.get("base_model", "sd15"),
        "controlnet": controlnet,
        "steps": req["steps"],
        "guidance_scale": req["guidance_scale"],
        "seed": req.get("seed"),
        "progress": 0,
        "result_url": None,
        "created_at": datetime.utcnow()
    }
    await tasks_collection.insert_one(task_doc)
    push_task(task_id)

    return task_id

async def get_task(task_id: str):

    task = await tasks_collection.find_one({
        "task_id": task_id
    })

    if not task:
        return None

    result_url = task.get("result_url")

    if result_url and result_url.startswith("/"):
        result_url = f"http://localhost:8000{result_url}"

    return {
        "task_id": task["task_id"],
        "status": task["status"],
        "progress": task.get("progress", 0),
        "result_url": result_url,
        "error_message": task.get("error_message"),
    }
    

async def search_gallery(
        page: int,
        limit: int,
        model: Optional[str] = None,
    ):

        skip = (page - 1) * limit

        query = {
            "status": "completed"
        }
        if model:
            query["model"] = model

        cursor = tasks_collection.find(query).sort("created_at", -1).skip(skip).limit(limit + 1)
        docs = await cursor.to_list(length=limit + 1)
        
        has_more = len(docs) > limit
        docs = docs[:limit]

        items = [
            {
                "id": str(d["task_id"]),
                "image_url": f"http://localhost:8000{d.get('result_url')}" if d.get("result_url") and d.get("result_url").startswith("/") else d.get("result_url"),
                "prompt": d.get("prompt"),
                "model": d.get("model"),
                "created_at": d.get("created_at"),
            }
            for d in docs
        ]

        return {
            "items": items, 
            "has_more": has_more
        }