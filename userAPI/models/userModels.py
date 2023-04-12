from beanie import Document, PydanticObjectId
from pydantic import BaseModel, Field
from models.catalogItemModels import CatalogItem
from models.cartModels import Cart, AddressObject
from typing import Optional

# THE USER MODEL HAS BEEN DELETED FROM THE OTHER APIs because I keep making changes to it and I don't want to have to change it in all the other APIs.
# I will need to copy it over to the other APIs when I am done with it.


class UserIn(BaseModel):
    name: str
    email: str
    password: str
    cartID: str
    orderHistory: list[Cart]


class User(Document, UserIn):
    id: PydanticObjectId = Field(default_factory=PydanticObjectId)
    isDeleted: bool = False
