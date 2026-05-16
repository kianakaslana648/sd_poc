import os
import redis
import json

REDIS_URL = os.getenv("REDIS_URL", "redis://localhost:6379")
QUEUE_NAME = "generation_queue"

redis_client = redis.Redis.from_url(
    REDIS_URL,
    decode_responses=True
)

def push_task(task_id: str, payload: dict = {}):
    message = {
        "task_id": task_id,
        **payload
    }

    redis_client.lpush(
        QUEUE_NAME,
        json.dumps(message)
    )