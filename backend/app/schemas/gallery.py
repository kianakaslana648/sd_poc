from pydantic import BaseModel
from typing import Optional, Literal, Dict, Any, List
from datetime import datetime


class GalleryItem(BaseModel):
    id: str
    image_url: str
    prompt: Optional[str] = None
    negative_prompt: Optional[str] = None
    model: Optional[str] = None
    created_at: datetime
    

class GalleryResponse(BaseModel):
    items: List[GalleryItem]
    has_more: bool