# Import necessary libraries
import chromedriver_autoinstaller
from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
import time
import re
import csv


chromedriver_autoinstaller.install()

driver = webdriver.Chrome()

driver.get('https://www.realtor.com/realestateandhomes-search/San-Jose_CA')

try:
    listings = WebDriverWait(driver, 10).until(
        EC.presence_of_all_elements_located((By.CLASS_NAME, 'LinkComponent_anchor__TetCm'))
        
    )
finally:
    driver.quit()