from fastapi import FastAPI, Depends, HTTPException
from beanie import init_beanie, PydanticObjectId
from motor.motor_asyncio import AsyncIOMotorClient
from models.cartModels import CartIn, Cart, AddressObject
from models.catalogItemModels import CatalogItemIn, CatalogItem
from models.userModels import UserIn, User

app = FastAPI()


@app.on_event("startup")
async def startup():
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


# Hello World
@app.get("/")
async def root():
    return {"message": "Hello World"}


# Get ALL Users
@app.get("/user", tags=["Get"])
async def get_all_users():
    users = await User.find_all().to_list()
    if (users) is None:
        raise HTTPException(status_code=404, detail="Items not found")

    for user in users:
        if user.isDeleted == True:
            users.remove(user)

    return users


# Get User by ID
@app.get("/user/{user_id}", tags=["Get"])
async def get_user(user_id: PydanticObjectId):
    if (await User.get(user_id)) is None:
        raise HTTPException(status_code=404, detail="Item not found")
    return await User.get(user_id)


# Create User
@app.post("/user", tags=["Post"])
async def create_user(user_in: UserIn):
    new_user = User(**user_in.dict())
    return await new_user.save()


# Delete User
@app.delete("/user/{user_id}", tags=["Delete"])
async def delete_user(user_id: PydanticObjectId):
    user = await User.get(user_id)
    if user is None:
        raise HTTPException(status_code=404, detail="Item not found")
    user.isDeleted = True
    await user.save()
    return {"message": "User deleted"}


# Update User
@app.put("/user/{user_id}", tags=["Put"])
async def update_user(user_id: PydanticObjectId, user_in: UserIn):
    user = await User.get(user_id)
    if user is None:
        raise HTTPException(status_code=404, detail="Item not found")
    user.name = user_in.name
    user.email = user_in.email
    user.password = user_in.password
    user.cartID = user_in.cartID
    user.orderHistory = user_in.orderHistory
    return await user.save()


# Authenticate User
@app.post("/user/authenticate", tags=["Post"])
async def authenticate_user(user_in: UserIn):
    # https://indominusbyte.github.io/fastapi-jwt-auth/
    # This is JWT authentication for FastAPI
    # Use this, I think it's what Dave used in the sm-api
    pass
