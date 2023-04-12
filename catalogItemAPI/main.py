from fastapi import FastAPI, Depends, HTTPException
from beanie import init_beanie, PydanticObjectId
from motor.motor_asyncio import AsyncIOMotorClient
from models.catalogItemModels import CatalogItemIn, CatalogItem

app = FastAPI()
# MongoDB


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


@app.get("/catalog/page/{page_num}", tags=["Get"])
async def get_catalog_page(page_num: int):
    results = await CatalogItem.find_all().skip(page_num * 10).limit(10).to_list()
    if results is None:
        raise HTTPException(status_code=404, detail="No items found")
    return results


@app.post("/catalog", tags=["Post"])
async def create_catalog_item(item: CatalogItemIn):
    return await CatalogItem(**item.dict()).save()


@app.post("/catalog/bulk", tags=["Post"])
async def create_catalog_item_bulk(items: list[CatalogItemIn]):
    added_items = 0
    for item in items:
        await create_catalog_item(item)
        added_items += 1

    return {"message": f"{added_items} items added"}


@app.put("/catalog/{item_id}", tags=["Put"])
async def update_catalog_item(item_id: PydanticObjectId, item_in: CatalogItemIn):
    if (await CatalogItem.get(item_id)) is None:
        raise HTTPException(status_code=404, detail="Item not found")

    item = await CatalogItem.get(item_id)
    item.title = item_in.title
    item.description = item_in.description
    item.price = item_in.price
    return await item.save()


@app.delete("/catalog/bulk", tags=["Delete"])
async def delete_catalog_item_bulk(item_ids: list[PydanticObjectId]):
    deleted_items = 0
    for item_id in item_ids:
        await delete_catalog_item(item_id)
        deleted_items += 1

    return {"message": f"{deleted_items} items deleted"}


@app.delete("/catalog/{item_id}", tags=["Delete"])
async def delete_catalog_item(item_id: PydanticObjectId):
    if (await CatalogItem.get(item_id)) is None:
        raise HTTPException(status_code=404, detail="Item not found")

    item = await CatalogItem.get(item_id)
    await item.delete()
    return {"message": "Item deleted"}
