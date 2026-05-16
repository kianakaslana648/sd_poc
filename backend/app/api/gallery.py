from fastapi import APIRouter, Query, Depends
from typing import List, Optional
from backend.app.schemas.gallery import GalleryItem, GalleryResponse
from backend.app.services.task_service import search_gallery


router = APIRouter()

@router.get("/gallery/search")
async def gallery_search(
    page: int = Query(1, ge=1),
    limit: int = Query(30, ge=1, le=100),
    model: str | None = None,
):
    return await search_gallery(page, limit, model)