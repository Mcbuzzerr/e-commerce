from beanie import Document, PydanticObjectId
from pydantic import BaseModel, Field
from models.catalogItemModels import CatalogItem
from typing import Optional


class AddressObject(BaseModel):
    street: str
    street2: str
    city: str
    state: str
    zip: str
    country: str


class CartIn(BaseModel):
    items: list[CatalogItem]
    # couponCode Planned as a list, but usually you can only have 1 coupon code per order in a store.
    couponCode: Optional[str] = ""
    shippingAddress: AddressObject


class Cart(Document, CartIn):
    id: PydanticObjectId = Field(default_factory=PydanticObjectId)
    total: float  # A subtotal was planned, but why would I pretend to deal with taxes? Taxes are the worst.
