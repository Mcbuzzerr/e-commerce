from fastapi import FastAPI, Depends, HTTPException
from beanie import init_beanie, PydanticObjectId
from motor.motor_asyncio import AsyncIOMotorClient
from models.catalogItemModels import CatalogItemIn, CatalogItem
import py_eureka_client.eureka_client as eureka_client
from contextlib import asynccontextmanager


@asynccontextmanager
async def startup(app: FastAPI):
    client = AsyncIOMotorClient("mongodb://root:pass@catalog-db:27017")
    await init_beanie(
        database=client.catalog,
        document_models=[CatalogItem],
    )

    await eureka_client.init_async(
        eureka_server="http://eureka:8761/eureka",
        app_name="read-catalog-api",
        instance_port=8000,
    )

    yield


app = FastAPI(lifespan=startup)


@app.on_event("startup")
async def startup():
    client = AsyncIOMotorClient("mongodb://root:pass@catalog-db:27017")
    await init_beanie(
        database=client.catalog,
        document_models=[CatalogItem],
    )


@app.get("/")
async def root():
    return {"message": "Hello World"}


@app.get("/catalog", tags=["Get"])
async def get_catalog():
    results = await CatalogItem.find_all().to_list()
    if (results) is None:
        raise HTTPException(status_code=404, detail="No items found")
    return results


@app.get("/catalog/{item_id}", tags=["Get"])
async def get_catalog_item(item_id: PydanticObjectId):
    results = await CatalogItem.get(item_id)
    if (results) is None:
        raise HTTPException(status_code=404, detail="Item not found")
    return results


@app.get("/catalog/search/{search_term}", tags=["Get"])
async def search_catalog_item(search_term: str):
    results = await CatalogItem.find(
        {
            "$or": [
                {"title": {"$regex": search_term, "$options": "i"}},
                {"description": {"$regex": search_term, "$options": "i"}},
            ]
        }
    ).to_list()
    if results is None:
        raise HTTPException(status_code=404, detail="No items found")
    return results


@app.get("/catalog/search/priceLowerThan/{price}", tags=["Get"])
async def search_catalog_item(price: float):
    results = await CatalogItem.find({"price": {"$lt": price}}).to_list()
    if results is None:
        raise HTTPException(status_code=404, detail="No items found")
    return results


@app.get("/catalog/page/{page_num}/{page_length}", tags=["Get"])
async def get_catalog_page(page_num: int, page_length: int):
    results = (
        await CatalogItem.find_all()
        .skip(page_num * page_length)
        .limit(page_length)
        .to_list()
    )
    if results is None:
        raise HTTPException(status_code=404, detail="No items found")
    return results
