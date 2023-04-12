from beanie import Document, PydanticObjectId
from pydantic import BaseModel, Field


class CatalogItemIn(BaseModel):
    title: str
    description: str
    price: float


class CatalogItem(Document, CatalogItemIn):
    id: PydanticObjectId = Field(default_factory=PydanticObjectId)
