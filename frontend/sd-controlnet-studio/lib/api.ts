// =============================
// Base Config
// =============================

const BASE_URL = "http://localhost:8000/api/v1"

const DEFAULT_HEADERS = {
  "Content-Type": "application/json",
}

// =============================
// Types
// =============================

export type Mode = "txt2img" | "img2img"

export type ControlNetMode =
  | "canny"
  | "depth"
  | "pose"
  | "scribble"

export interface ControlNetUnit {
  type: ControlNetMode
  image?: File | null
}

export type TaskStatus =
  | "queued"
  | "running"
  | "completed"
  | "failed"
  
export interface GenerateRequest {
  prompt: string
  negative_prompt?: string
  mode: Mode
  controlnet?: ControlNetUnit | null
  steps: number
  guidance_scale?: number
  seed?: number
  strength?: number
}

export interface GenerateResponse {
  task_id: string
  status: TaskStatus
}

export interface TaskResponse {
  task_id: string
  status: TaskStatus
  progress: number
  result_url?: string | null
  error_message?: string | null
}

// =============================
// Core API Helper
// =============================

async function request<T>(
  url: string,
  options?: RequestInit
): Promise<T> {
  const res = await fetch(url, options)

  if (!res.ok) {
    const errorText = await res.text()
    throw new Error(errorText || "API request failed")
  }

  return res.json()
}

// =============================
// API: Generate Image
// =============================

export async function generateImage(
  payload: GenerateRequest
): Promise<GenerateResponse> {
  const form = new FormData()

  form.append("prompt", payload.prompt)
  form.append("mode", payload.mode)
  form.append("steps", String(payload.steps))

  if (payload.negative_prompt)
    form.append("negative_prompt", payload.negative_prompt)

  if (payload.guidance_scale)
    form.append("guidance_scale", String(payload.guidance_scale))

  if (payload.seed)
    form.append("seed", String(payload.seed))

  if (payload.controlnet) {
    form.append("controlnet_type", payload.controlnet.type)

    if (payload.controlnet.image) {
      form.append("controlnet_image", payload.controlnet.image)
    }
  }

    return request(`${BASE_URL}/generate`, {
    method: "POST",
    body: form,
  })
}

// =============================
// API: Get Task Status
// =============================

export async function getTask(
  taskId: string
): Promise<TaskResponse> {
  return request<TaskResponse>(`${BASE_URL}/task/${taskId}`)
}

// =============================
// Polling Helper (simple realtime)
// =============================

export async function waitForTask(
  taskId: string,
  onUpdate?: (task: TaskResponse) => void,
  intervalMs: number = 1500
): Promise<TaskResponse> {
  return new Promise((resolve, reject) => {
    let stopped = false

    const poll = async () => {
      if (stopped) return

      try {
        const task = await getTask(taskId)

        onUpdate?.(task)

        if (task.status === "completed") {
          stopped = true
          resolve(task)
          return
        }

        if (task.status === "failed") {
          stopped = true
          reject(new Error(task.error_message || "Task failed"))
          return
        }

        setTimeout(poll, intervalMs)
      } catch (err) {
        stopped = true
        reject(err)
      }
    }

    poll()
  })
}


export async function fetchGallery(page: number, limit: number = 30) {
  const res = await fetch(
    `${BASE_URL}/gallery/search?page=${page}&limit=${limit}`
  );

  if (!res.ok) {
    throw new Error("Failed to fetch gallery");
  }

  return res.json();
}