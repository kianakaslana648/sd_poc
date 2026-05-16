from worker.engine.sd_pipeline import SDEngine

engine = SDEngine()


async def run_sd_pipeline(task, progress_callback):
    return await engine.run(task, progress_callback)

async def process_task(task: dict, update_task):
    task_id = task["task_id"]

    try:
        async def progress_callback(p):
            await update_task(task_id, {"progress": p})

        result_path = await run_sd_pipeline(task, progress_callback)
        
        print(result_path)

        await update_task(task_id, {
            "status": "completed",
            "progress": 100,
            "result_url": result_path
        })

    except Exception as e:
        await update_task(task_id, {
            "status": "failed",
            "error_message": str(e)
        })
        raise