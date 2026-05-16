import json
import time
from loguru import logger
import asyncio
from shared.mongo import tasks_collection
from shared.redis import redis_client
from worker.processor import process_task

QUEUE_NAME = "generation_queue"


def get_task():
    _, data = redis_client.blpop(QUEUE_NAME)

    if isinstance(data, bytes):
        data = data.decode("utf-8")

    payload = json.loads(data)

    return payload

async def fetch_task(task_id: str):
    return await tasks_collection.find_one({"task_id": task_id})

async def update_task(task_id: str, update: dict):
    await tasks_collection.update_one(
        {"task_id": task_id},
        {"$set": update}
    )


async def start_consumer():
    logger.info("Worker consumer started...")

    while True:
        try:
            payload = get_task()
            task_id = payload["task_id"]

            logger.info(f"Got task: {task_id}")

            task = await fetch_task(task_id)

            if not task:
                logger.warning(f"Task not found: {task_id}")
                continue

            await update_task(task_id, {
                "status": "running",
                "progress": 1
            })

            await process_task(task, update_task)

        except Exception as e:
            logger.exception(e)
            time.sleep(1)