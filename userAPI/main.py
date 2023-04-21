from datetime import datetime, timedelta
from fastapi import FastAPI, Depends, HTTPException, Request
from fastapi.responses import JSONResponse
from beanie import init_beanie, PydanticObjectId
from motor.motor_asyncio import AsyncIOMotorClient
from pydantic import BaseModel
from decouple import config

from fastapi_jwt_auth import AuthJWT
from fastapi_jwt_auth.exceptions import AuthJWTException

from models.cartModels import CartIn, Cart, AddressObject
from models.catalogItemModels import CatalogItemIn, CatalogItem
from models.userModels import UserIn, User, UserAuth

import py_eureka_client.eureka_client as eureka_client
from contextlib import asynccontextmanager


@asynccontextmanager
async def startup(app: FastAPI):
    # Cart database
    cart_client = AsyncIOMotorClient("mongodb://root:pass@cart-db:27017")
    await init_beanie(
        database=cart_client.carts,
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
        app_name="user-api",
        instance_port=8000,
    )

    yield


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
@app.get("/hello")
async def root(Authorize: AuthJWT = Depends()):
    Authorize.jwt_optional()
    current_user = Authorize.get_jwt_subject()
    if current_user is None:
        return {"message": "Hello World"}
    return {"message": f"Hello {current_user}"}


# Get ALL Users
@app.get("/get_all", tags=["Get"])
async def get_all_users():
    users = await User.find_all().to_list()
    if (users) is None:
        raise HTTPException(status_code=404, detail="User not found")

    for user in users:
        if user.isDeleted == True:
            users.remove(user)

    return users


# Get User by ID
@app.get("/{user_id}", tags=["Get"])
async def get_user(user_id: PydanticObjectId):
    if (await User.get(user_id)) is None:
        raise HTTPException(status_code=404, detail="User not found")
    return await User.get(user_id)


# Create User
@app.post("/create", tags=["Post"])
async def create_user(user_in: UserIn):
    new_user = User(**user_in.dict())
    return await new_user.save()


# Delete User
@app.delete("/{user_id}", tags=["Delete"])
async def delete_user(user_id: PydanticObjectId):
    user = await User.get(user_id)
    if user is None:
        raise HTTPException(status_code=404, detail="User not found")
    user.isDeleted = True
    await user.save()
    return {"message": "User deleted"}


# Update User
@app.put("/{user_id}", tags=["Put"])
async def update_user(user_id: PydanticObjectId, user_in: UserIn):
    user = await User.get(user_id)
    if user is None:
        raise HTTPException(status_code=404, detail="User not found")
    user.name = user_in.name
    user.email = user_in.email
    user.password = user_in.password
    user.cartID = user_in.cartID
    user.orderHistory = user_in.orderHistory
    user.isDeleted = user_in.isDeleted
    return await user.save()


# Authenticate User
@app.post("/authenticate", tags=["Post"])
async def authenticate_user(user_in: UserAuth, Authorize: AuthJWT = Depends()):
    # https://indominusbyte.github.io/fastapi-jwt-auth/
    # This is JWT authentication for FastAPI
    # Use this, I think it's what Dave used in the sm-api
    user = await User.find_one(User.email == user_in.email)
    if user is None:
        raise HTTPException(status_code=404, detail="User not found")
    if user.password != user_in.password:
        raise HTTPException(status_code=401, detail="Incorrect password")
    expires_time = timedelta(days=3)
    access_token = Authorize.create_access_token(
        subject=user.email, expires_time=expires_time
    )
    return {
        "access_token": access_token,
        "user": {"email": user.email, "name": user.name},
    }
