from beanie import Document, PydanticObjectId
from pydantic import BaseModel, Field
from models.catalogItemModels import CatalogItem
from models.cartModels import Cart, AddressObject
from typing import Optional


class UserAuth(BaseModel):
    email: str
    password: str


class UserIn(UserAuth):
    name: str
    cartID: Optional[str | PydanticObjectId]
    orderHistory: list[Cart] = []


class User(Document, UserIn):
    id: PydanticObjectId = Field(default_factory=PydanticObjectId)
    isDeleted: bool = False
