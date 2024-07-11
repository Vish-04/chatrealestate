# Import necessary libraries
import chromedriver_autoinstaller
from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
import time
import re
import csv

# Automatically install the correct version of ChromeDriver


# Initialize the WebDriver (assuming Chrome)

links = ['https://www.metrolist.com/search/For_Sale-For_Rent/Map%20Location/map_9q95w88xc;9q9ky2hr5',"https://www.metrolist.com/search/For_Sale-For_Rent/Map%20Location/map_9q95ksev5;9q9t0jb0h","https://www.metrolist.com/search/For_Sale-For_Rent/Map%20Location/map_9qc02k9jf;9qc1jmune"]
for i in range(len(links)):
    chromedriver_autoinstaller.install()

    driver = webdriver.Chrome()
    # Open the URL
    driver.get(links[i])

    # Wait for the page to load
    WebDriverWait(driver, 10).until(EC.presence_of_element_located((By.CLASS_NAME, 'markerSale')))

    # Find all elements with class name "markerSale"
    markers = driver.find_elements(By.CLASS_NAME, 'markerSale')
    print(len(markers))

    listings = []

    # Loop through each marker and click on it
    try:
        for marker in markers:
            listing = {}
            # Click on the marker using JavaScript to avoid interception
            driver.execute_script("arguments[0].click();", marker)
            
            # Wait for the map-popup to appear and click on it
            WebDriverWait(driver, 10).until(EC.presence_of_element_located((By.CLASS_NAME, 'map-popup')))
            map_popup = driver.find_element(By.CLASS_NAME, 'map-popup')
            driver.execute_script("arguments[0].click();", map_popup)
            
            # Wait for the page to load (adjust the sleep time as necessary)
            time.sleep(2)

            try:
                # <-- Header Details -->
                print("Extracting header details...")
                listing_detail_label = WebDriverWait(driver, 10).until(
                    EC.presence_of_element_located((By.ID, 'listingDetailLabel'))
                )
                listing['listing_detail_label'] = listing_detail_label.text.replace('\n', ' ')
                
                listing_detail_price = WebDriverWait(driver, 10).until(
                    EC.presence_of_element_located((By.CLASS_NAME, 'listing-detail-price'))
                )
                listing['listing_detail_price'] = listing_detail_price.text.replace('\n', ' ')

                property_sign = WebDriverWait(driver, 10).until(
                    EC.presence_of_element_located((By.CLASS_NAME, 'property-sign'))
                )
                listing['property_sign'] = property_sign.text.replace('\n', ' ')

                listing_detail_monthly_cost = WebDriverWait(driver, 10).until(
                    EC.presence_of_element_located((By.CLASS_NAME, 'listing-detail-monthly-cost'))
                )
                listing['listing_detail_monthly_cost'] = listing_detail_monthly_cost.text.replace('\n', ' ')

                listing_detail_highlights = WebDriverWait(driver, 10).until(
                    EC.presence_of_element_located((By.CLASS_NAME, 'listing-detail-highlights'))
                )
                highlights_text = listing_detail_highlights.text.replace('\n', ' ')
                listing['highlights_text'] = highlights_text

                mls_number = re.search(r'MLS# \d{9}', highlights_text)
                if mls_number:
                    listing['mls_number'] = mls_number.group()
                else:
                    listing['mls_number'] = None
            except Exception as e:
                print(f"An error occurred in header details: {e}")
                listings.append(listing)
                print("ADDED NEW LISTING")

            try:
                # <-- Agent Related Info -->
                print("Extracting agent related info...")
                agent_img_box = driver.find_element(By.CLASS_NAME, 'contact-select-agent-img-box')
                agent_link = agent_img_box.find_element(By.TAG_NAME, 'a').get_attribute('href')
                agent_img_url = agent_img_box.find_element(By.TAG_NAME, 'img').get_attribute('src')
                listing['agent_link'] = agent_link
                listing['agent_img_url'] = agent_img_url

                contact_select_agent_info_name = WebDriverWait(driver, 10).until(
                    EC.presence_of_element_located((By.CLASS_NAME, 'contact-select-agent-info-name'))
                )
                agent_info_name_elements = contact_select_agent_info_name.find_elements(By.TAG_NAME, 'a')
                agent_info_p_elements = contact_select_agent_info_name.find_elements(By.TAG_NAME, 'p')

                if len(agent_info_name_elements) > 0:
                    listing['listing_agent_name'] = agent_info_name_elements[0].text.replace('\n', ' ')
                else:
                    listing['listing_agent_name'] = None

                if len(agent_info_p_elements) > 0:
                    listing['listing_office_name'] = agent_info_p_elements[0].text.replace('\n', ' ')
                else:
                    listing['listing_office_name'] = None

                if len(agent_info_name_elements) > 1:
                    listing['listing_agent_phone_number'] = agent_info_name_elements[1].text.replace('\n', ' ')
                else:
                    listing['listing_agent_phone_number'] = None
            except Exception as e:
                print(f"An error occurred in agent related info: {e}")
                listings.append(listing)
                print("ADDED NEW LISTING")

            try:
                # <-- Property Description -->
                print("Extracting property description...")
                property_description = WebDriverWait(driver, 10).until(
                    EC.presence_of_element_located((By.CLASS_NAME, 'listingDetailsFullDetailsList_PropertyDescription'))
                )
                listing['property_description'] = property_description.text.replace('\n', ' ')
            except Exception as e:
                print(f"An error occurred in property description: {e}")
                listings.append(listing)
                print("ADDED NEW LISTING")

            try:
                # <-- Interior Details -->
                print("Extracting interior details...")
                interior_details_ul = WebDriverWait(driver, 10).until(
                    EC.presence_of_element_located((By.CLASS_NAME, 'listingDetailsFullDetailsList_InteriorDetails'))
                )
                interior_details_lis = interior_details_ul.find_elements(By.TAG_NAME, 'li')
                for li in interior_details_lis:
                    text = li.text.replace('\n', ' ')
                    if ":" in text:
                        key, value = text.split(":")
                        listing[key.strip()] = value.strip()
            except Exception as e:
                print(f"An error occurred in interior details: {e}")
                listings.append(listing)
                print("ADDED NEW LISTING")

            try:
                # <-- Exterior Details -->
                print("Extracting exterior details...")
                exterior_details_ul = WebDriverWait(driver, 10).until(
                    EC.presence_of_element_located((By.CLASS_NAME, 'listingDetailsFullDetailsList_ExteriorDetails'))
                )
                exterior_details_lis = exterior_details_ul.find_elements(By.TAG_NAME, 'li')
                for li in exterior_details_lis:
                    text = li.text.replace('\n', ' ')
                    if ":" in text:
                        key, value = text.split(":")
                        listing[key.strip()] = value.strip()
            except Exception as e:
                print(f"An error occurred in exterior details: {e}")
                listings.append(listing)
                print("ADDED NEW LISTING")

            try:
                # <-- Community Information -->
                print("Extracting community information...")
                community_information_ul = WebDriverWait(driver, 10).until(
                    EC.presence_of_element_located((By.CLASS_NAME, 'listingDetailsFullDetailsList_CommunityInformation'))
                )
                community_information_lis = community_information_ul.find_elements(By.TAG_NAME, 'li')
                for li in community_information_lis:
                    text = li.text.replace('\n', ' ')
                    if ":" in text:
                        key, value = text.split(":")
                        listing[key.strip()] = value.strip()
            except Exception as e:
                print(f"An error occurred in community information: {e}")
                listings.append(listing)
                print("ADDED NEW LISTING")

            try:
                # <-- School Details -->
                print("Extracting school details...")
                school_details_ul = WebDriverWait(driver, 10).until(
                    EC.presence_of_element_located((By.CLASS_NAME, 'listingDetailsFullDetailsList_SchoolDetails'))
                )
                school_details_lis = school_details_ul.find_elements(By.TAG_NAME, 'li')
                for li in school_details_lis:
                    text = li.text.replace('\n', ' ')
                    if ":" in text:
                        key, value = text.split(":")
                        listing[key.strip()] = value.strip()
            except Exception as e:
                print(f"An error occurred in school details: {e}")
                listings.append(listing)
                print("ADDED NEW LISTING")

            try:
                # <-- Property Information From MLS Data -->
                print("Extracting property information from MLS data...")
                property_information_from_mls_data_ul = WebDriverWait(driver, 10).until(
                    EC.presence_of_element_located((By.CLASS_NAME, 'listingDetailsFullDetailsList_PropertyInformationFromMLSData'))
                )
                property_information_from_mls_data_lis = property_information_from_mls_data_ul.find_elements(By.TAG_NAME, 'li')
                for li in property_information_from_mls_data_lis:
                    text = li.text.replace('\n', ' ')
                    if ":" in text:
                        key, value = text.split(":")
                        listing[key.strip()] = value.strip()
            except Exception as e:
                print(f"An error occurred in property information from MLS data: {e}")
                listings.append(listing)
                print("ADDED NEW LISTING")

            try:
                # <-- Financial Information -->
                print("Extracting financial information...")
                financial_information_ul = WebDriverWait(driver, 10).until(
                    EC.presence_of_element_located((By.CLASS_NAME, 'listingDetailsFullDetailsList_FinancialInformation'))
                )
                financial_information_lis = financial_information_ul.find_elements(By.TAG_NAME, 'li')
                for li in financial_information_lis:
                    text = li.text.replace('\n', ' ')
                    if ":" in text:
                        key, value = text.split(":")
                        listing[key.strip()] = value.strip()
            except Exception as e:
                print(f"An error occurred in financial information: {e}")
                listings.append(listing)
                print("ADDED NEW LISTING")

            try:
                # <-- Utilities -->
                print("Extracting utilities information...")
                utilities_ul = WebDriverWait(driver, 10).until(
                    EC.presence_of_element_located((By.CLASS_NAME, 'listingDetailsFullDetailsList_Utilities'))
                )
                utilities_lis = utilities_ul.find_elements(By.TAG_NAME, 'li')
                for li in utilities_lis:
                    text = li.text.replace('\n', ' ')
                    if ":" in text:
                        key, value = text.split(":")
                        listing[key.strip()] = value.strip()
            except Exception as e:
                print(f"An error occurred in utilities information: {e}")
                listings.append(listing)
                print("ADDED NEW LISTING")

            try:
                # <-- Listing Office -->
                print("Extracting listing office information...")
                listing_office_ul = WebDriverWait(driver, 10).until(
                    EC.presence_of_element_located((By.CLASS_NAME, 'listingDetailsFullDetailsList_ListingOffice'))
                )
                listing_office_lis = listing_office_ul.find_elements(By.TAG_NAME, 'li')
                for li in listing_office_lis:
                    text = li.text.replace('\n', ' ')
                    if ":" in text:
                        key, value = text.split(":")
                        listing[key.strip()] = value.strip()
            except Exception as e:
                print(f"An error occurred in listing office information: {e}")
                listings.append(listing)
                print("ADDED NEW LISTING")

            try:
                # <-- Property Images -->
                print("Extracting property images...")
                carousel_inner = WebDriverWait(driver, 10).until(
                    EC.presence_of_element_located((By.CLASS_NAME, 'carousel-inner'))
                )
                property_images = []
                carousel_divs = carousel_inner.find_elements(By.TAG_NAME, 'div')
                for div in carousel_divs:
                    img = div.find_element(By.TAG_NAME, 'img')
                    property_images.append(img.get_attribute('src').replace('\n', ' '))
                listing['property_images'] = property_images
            except Exception as e:
                print(f"An error occurred in property images: {e}")
                listings.append(listing)
                print("ADDED NEW LISTING")

            listings.append(listing)
            print("ADDED NEW LISTING")

    except Exception as e:
        print(f"An error occurred: {e}")

    # Define the CSV file name
    csv_file = f'listings{i}.csv'

    print(listings)

    # Get the keys from the first listing to use as headers
    if listings:
        # Collect all unique keys from all listings
        all_keys = set()
        for listing in listings:
            all_keys.update(listing.keys())
        
        # Write the listings to a CSV file
        with open(csv_file, 'w', newline='', encoding='utf-8') as output_file:
            dict_writer = csv.DictWriter(output_file, fieldnames=all_keys)
            dict_writer.writeheader()
            dict_writer.writerows(listings)

    # Close the WebDriver
    driver.quit()



