from selenium.webdriver.common.by import By

def find_flipkart(driver, url: str):
    driver.get(url)
    element = driver.find_element(By.XPATH, '//div[@id="price-info-icon"]/../..//div[contains(@class, "Nx9bqj CxhGGd")]')
    return element.get_attribute('innerHTML')

def find_amazon(driver, url: str):
    driver.get(url)
    element = driver.find_element(By.XPATH, '//div[@id="corePriceDisplay_desktop_feature_div"]/div')
    price = element.get_attribute('innerText').split(" ")[0]
    return price

def find_ajio(driver, url):
    driver.get(url)
    element = driver.find_element(By.XPATH, '//div[@class="prod-price-section "]//div[@class="prod-sp"]')
    return element.get_attribute('innerHTML')

def find_mintra(driver, url):
    driver.get(url)
    element = driver.find_element(By.XPATH, '//div[@class="pdp-price-info"]/div[1]/p[1]/span[@class="pdp-price"]/strong')
    return element.get_attribute('innerHTML')