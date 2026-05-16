import torch

from diffusers import (
    StableDiffusionPipeline,
    StableDiffusionControlNetPipeline,
    ControlNetModel,
    EulerAncestralDiscreteScheduler
)


class ModelManager:

    def __init__(self):

        self.models = {}

    def get_pipeline(
        self,
        base_model: str,
        task: dict
    ):

        use_controlnet = False
        
        if task.get("controlnet") is not None:
            use_controlnet = True

        cache_key = (
            f"{base_model}_controlnet"
            if use_controlnet
            else base_model
        )
        
        print("selected model", cache_key)

        if cache_key in self.models:
            return self.models[cache_key]

        #
        # SD1.5
        #
        if base_model == "sd15":

            #
            # CONTROLNET
            #
            if use_controlnet:

                controlnet = (
                    ControlNetModel
                    .from_pretrained(
                        "lllyasviel/sd-controlnet-canny",
                        torch_dtype=torch.float16
                    )
                )

                pipe = (
                    StableDiffusionControlNetPipeline
                    .from_single_file(
                        "/sd_models/meinamix_v12Final.safetensors",

                        controlnet=controlnet,

                        torch_dtype=torch.float16,

                        safety_checker=None,

                        original_config_file=(
                            "/sd_models/configs/"
                            "v1-inference.yaml"
                        )
                    )
                )

            #
            # NORMAL SD
            #
            else:

                pipe = (
                    StableDiffusionPipeline
                    .from_single_file(
                        "/sd_models/meinamix_v12Final.safetensors",

                        torch_dtype=torch.float16,

                        safety_checker=None,

                        original_config_file=(
                            "/sd_models/configs/"
                            "v1-inference.yaml"
                        )
                    )
                )

            pipe.scheduler = (
                EulerAncestralDiscreteScheduler
                .from_config(
                    pipe.scheduler.config
                )
            )

            pipe = pipe.to("cuda")

        #
        # SDXL
        #
        elif base_model == "sdxl":

            pipe = (
                StableDiffusionPipeline
                .from_pretrained(
                    "stabilityai/"
                    "stable-diffusion-xl-base-1.0",

                    torch_dtype=torch.float16,

                    use_safetensors=True
                )
            )

            pipe = pipe.to("cuda")

        else:

            raise ValueError(
                f"Unknown model: {base_model}"
            )

        self.models[cache_key] = pipe

        return pipe