from fastapi import FastAPI
from pydantic import BaseModel
from search_bots import find_flipkart, find_ajio, find_amazon, find_mintra
from selenium import webdriver

app = FastAPI()

class productDetails(BaseModel):
    url: str
    source: str

@app.post("/")
async def fetchUrl(data: productDetails):
    driver = webdriver.Chrome()
    driver.maximize_window()
    url, source = data.url, data.source
    print(source)
    searchSource = {"flipkart": find_flipkart, "amazon": find_amazon, "mintra": find_mintra, "ajio": find_ajio}
    for i in range(5):
        try:
            currentPrice = searchSource[source](driver, url)
            if currentPrice:
                return {"currentPrice": currentPrice}
        except:
            continue