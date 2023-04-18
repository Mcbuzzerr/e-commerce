from fastapi import FastAPI, Depends, HTTPException, Request
from fastapi.responses import JSONResponse
from contextlib import asynccontextmanager
from beanie import init_beanie, PydanticObjectId
from motor.motor_asyncio import AsyncIOMotorClient
from pydantic import BaseModel
from decouple import config
import py_eureka_client.eureka_client as eureka_client

from fastapi_jwt_auth import AuthJWT
from fastapi_jwt_auth.exceptions import AuthJWTException

from models.cartModels import CartIn, Cart, AddressObject
from models.catalogItemModels import CatalogItemIn, CatalogItem
from models.userModels import UserIn, User, UserAuth


@asynccontextmanager
async def startup(app: FastAPI):
    # Cart database
    client = AsyncIOMotorClient("mongodb://root:pass@cart-db:27017")
    await init_beanie(
        database=client.carts,
        document_models=[Cart, CatalogItem],
    )

    # User database
    user_client = AsyncIOMotorClient("mongodb://root:pass@user-db:27017")
    await init_beanie(
        database=user_client.users,
        document_models=[User],
    )

    await eureka_client.init_async(
        eureka_server="http://eureka:8761/eureka",
        app_name="cart-api",
        instance_port=8000,
    )

    yield
    # Shutdown code here


app = FastAPI(lifespan=startup)


class Settings(BaseModel):
    authjwt_secret_key: str = config("jwt_secret_key")


@AuthJWT.load_config
def get_config():
    return Settings()


@app.exception_handler(AuthJWTException)
async def authjwt_exception_handler(request: Request, exc: AuthJWTException):
    return JSONResponse(
        status_code=exc.status_code,
        content={"detail": exc.message},
    )


# Hello World
@app.get("/")
async def root(Auth: AuthJWT = Depends()):
    Auth.jwt_optional()
    current_user = Auth.get_jwt_subject()
    if current_user is None:
        return {"message": "Hello World"}
    return {"message": f"Hello {current_user}"}


# Get ALl Carts or The Cart of the Current User
@app.get("/cart", tags=["Get"])
async def get_all_carts(Auth: AuthJWT = Depends()):
    if (await Cart.find_all().to_list()) is None:
        raise HTTPException(status_code=404, detail="Cart not found")
    Auth.jwt_optional()
    current_user = Auth.get_jwt_subject()
    if current_user is None:
        return await Cart.find_all().to_list()
    else:
        user = await User.find_one(User.email == current_user)
        return await Cart.get(user.cartID)


# Get Cart by ID
@app.get("/cart/{cart_id}", tags=["Get"])
async def get_cart(cart_id: PydanticObjectId):
    if (await Cart.get(cart_id)) is None:
        raise HTTPException(status_code=404, detail="Cart not found")
    return await Cart.get(cart_id)


# Update Cart
@app.put("/cart/{cart_id}", tags=["Put"])
async def update_cart(cart_id: PydanticObjectId, cart_in: CartIn):
    if (await Cart.get(cart_id)) is None:
        raise HTTPException(status_code=404, detail="Cart not found")

    cart = await Cart.get(cart_id)
    cart.items = cart_in.items
    cart.shippingAddress = cart_in.shippingAddress
    cart.couponCode = cart_in.couponCode
    cart.total = 0
    for item in cart.items:
        cart.total += item.price

    return await cart.save()


# Delete Cart
@app.delete("/cart/{cart_id}", tags=["Delete"])
async def delete_cart(cart_id: PydanticObjectId):
    if (await Cart.get(cart_id)) is None:
        raise HTTPException(status_code=404, detail="Cart not found")

    item = await Cart.get(cart_id)
    await item.delete()
    return {"message": "Item deleted"}


# Add item to cart
@app.post("/cart/{cart_id}/add", tags=["Post"])
async def add_item_to_cart(cart_id: PydanticObjectId, item: CatalogItemIn):
    if (await Cart.get(cart_id)) is None:
        raise HTTPException(status_code=404, detail="Cart not found")

    cart = await Cart.get(cart_id)
    cart.items.append(item)
    cart.total += item.price

    return await cart.save()


# Add multiple items to cart
@app.post("/cart/{cart_id}/add/bulk", tags=["Post"])
async def add_items_to_cart(cart_id: PydanticObjectId, items: list[CatalogItemIn]):
    if (await Cart.get(cart_id)) is None:
        raise HTTPException(status_code=404, detail="Cart not found")

    cart = await Cart.get(cart_id)
    for item in items:
        cart.items.append(item)
        cart.total += item.price
    return await cart.save()


# Remove item from cart
@app.delete("/cart/{cart_id}/remove/{item_index}", tags=["Delete"])
async def remove_item_from_cart(cart_id: PydanticObjectId, item_index: int):
    cart = await Cart.get(cart_id)

    if (cart) is None:
        raise HTTPException(status_code=404, detail="Cart not found")
    if item_index < 0:
        raise HTTPException(status_code=400, detail="Invalid item index")
    if item_index > len(cart.items):
        raise HTTPException(status_code=400, detail="Invalid item index")

    cart.items.pop(item_index)

    cart.total = 0
    for item in cart.items:
        cart.total += item.price

    return await cart.save()


# Apply coupon code to cart
@app.post("/cart/{cart_id}/coupon/{coupon_code}", tags=["Post"])
async def apply_coupon_to_cart(cart_id: PydanticObjectId, coupon_code: str):
    cart = await Cart.get(cart_id)
    if (cart) is None:
        raise HTTPException(status_code=404, detail="Cart not found")

    valid_coupons = ["10OFF", "20OFF", "30OFF", "40OFF", "50OFF", "BOGO"]
    if (coupon_code in valid_coupons) is False:
        raise HTTPException(status_code=400, detail="Invalid coupon code")

    if cart.couponCode != "":
        raise HTTPException(status_code=400, detail="Coupon code already applied")

    cart.couponCode = coupon_code

    match coupon_code:
        case "10OFF":
            cart.total = cart.total * 0.9
        case "20OFF":
            cart.total = cart.total * 0.8
        case "30OFF":
            cart.total = cart.total * 0.7
        case "40OFF":
            cart.total = cart.total * 0.6
        case "50OFF":
            cart.total = cart.total * 0.5
        case "BOGO":
            if len(cart.items) > 1:
                cart.total -= cart.items[0].price
            else:
                raise HTTPException(
                    status_code=400,
                    detail="Not enough items in cart to apply BOGO coupon",
                )
        case _:
            raise HTTPException(status_code=400, detail="Invalid coupon code")

    return await cart.save()


# Remove coupon code from cart
@app.delete("/cart/{cart_id}/coupon", tags=["Delete"])
async def remove_coupon_from_cart(cart_id: PydanticObjectId):
    if (await Cart.get(cart_id)) is None:
        raise HTTPException(status_code=404, detail="Cart not found")

    cart = await Cart.get(cart_id)
    cart.couponCode = ""

    cart.total = 0
    for item in cart.items:
        cart.total += item.price

    return await cart.save()


# Update shipping address
@app.put("/cart/{cart_id}/shipping", tags=["Put"])
async def update_shipping_address(cart_id: PydanticObjectId, address: AddressObject):
    if (await Cart.get(cart_id)) is None:
        raise HTTPException(status_code=404, detail="Cart not found")

    cart = await Cart.get(cart_id)
    cart.shippingAddress = address
    return await cart.save()


# Checkout cart
@app.post("/cart/{cart_id}/checkout", tags=["Post"])
async def checkout_cart(cart_id: PydanticObjectId, Auth: AuthJWT = Depends()):
    Auth.jwt_required()
    current_user_email = Auth.get_jwt_subject()

    if (await Cart.get(cart_id)) is None:
        raise HTTPException(status_code=404, detail="Cart not found")

    cart = await Cart.get(cart_id)
    user = await User.find_one({"email": current_user_email})
    user.orderHistory.append(cart)
    new_cart = await create_cart(CartIn(items=[], shippingAddress=cart.shippingAddress))
    user.cartID = str(new_cart.id)
    await cart.delete()

    return await user.save()


# Create Cart
@app.post("/cart", tags=["Post"])
async def create_cart(cart_in: CartIn, Auth: AuthJWT = Depends()):
    totalCost = 0
    for item in cart_in.items:
        totalCost += item.price

    new_cart = Cart(**cart_in.dict(), total=totalCost)

    # Auth.jwt_optional()
    # current_user = Auth.get_jwt_subject()
    # if current_user is not None:
    #     user = await User.find_one(User.email == current_user)
    #     user.cartID = new_cart.id
    #     await user.save()

    return await new_cart.save()
