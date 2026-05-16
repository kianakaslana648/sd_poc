import asyncio
import torch
import cv2
import numpy as np

from PIL import Image
from pathlib import Path
from datetime import datetime
import os
from worker.engine.model_manager import (
    ModelManager
)


class SDEngine:

    def __init__(self):

        self.model_manager = ModelManager()

    async def run(
        self,
        task: dict,
        progress_callback=None
    ):

        base_model = task.get(
            "base_model",
            "sd15"
        )

        pipe = self.model_manager.get_pipeline(
            base_model,
            task
        )

        prompt = task["prompt"]

        negative_prompt = task.get(
            "negative_prompt"
        )

        steps = task.get("steps", 30)

        guidance_scale = task.get(
            "guidance_scale",
            7.5
        )

        seed = task.get("seed")

        generator = None

        if seed is not None:

            generator = torch.Generator(
                device="cuda"
            ).manual_seed(seed)

        #
        # CONTROLNET
        #
        use_controlnet = False
        
        if task.get("controlnet") is not None:
            use_controlnet = True

        control_image = None
        
        print("use_controlnet", use_controlnet)

        if use_controlnet:

            control_image_path = task.get("controlnet", {}).get("image_path")

            if not control_image_path:

                raise ValueError(
                    "control_image is required"
                )

            image = Image.open(
                control_image_path
            ).convert("RGB")

            #
            # CANNY PREPROCESS
            #
            image_np = np.array(image)

            canny = cv2.Canny(
                image_np,
                100,
                200
            )

            canny = np.stack(
                [canny] * 3,
                axis=2
            )

            control_image = Image.fromarray(
                canny
            )
        
            dev_img_path = "/app/data/dev"
            os.makedirs(dev_img_path, exist_ok=True)
            control_image.save(
                f"{dev_img_path}/tmp_img.png"
            )

        #
        # CALLBACK
        #
        def callback(
            pipe,
            step: int,
            timestep: int,
            callback_kwargs
        ):

            if progress_callback:

                progress = int(
                    ((step + 1) / steps) * 100
                )

                asyncio.create_task(
                    progress_callback(progress)
                )

            return callback_kwargs

        #
        # PIPELINE PARAMS
        #
        pipe_kwargs = dict(
            prompt=prompt,
            negative_prompt=negative_prompt,
            num_inference_steps=steps,
            guidance_scale=guidance_scale,
            generator=generator,
            callback_on_step_end=callback,
            callback_on_step_end_tensor_inputs=[
                "latents"
            ]
        )

        #
        # ADD CONTROL IMAGE
        #
        if use_controlnet:

            pipe_kwargs["image"] = control_image

        #
        # RUN PIPELINE
        #
        result = pipe(**pipe_kwargs)

        image = result.images[0]

        output_path = self._save_image(
            image,
            task["task_id"]
        )

        return output_path

    def _save_image(
        self,
        image,
        task_id: str
    ):

        now = datetime.now()

        output_dir = Path(
            f"/outputs/"
            f"{now.year}/"
            f"{now.month:02d}/"
            f"{now.day:02d}/"
            f"{now.hour:02d}-"
            f"{now.minute:02d}-"
            f"{now.second:02d}"
        )

        output_dir.mkdir(
            parents=True,
            exist_ok=True
        )

        path = output_dir / f"{task_id}.png"

        image.save(path)

        return str(path)