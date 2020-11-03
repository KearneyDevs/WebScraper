# Documentation

## Overview

This project uses Puppeteer & Cron to scrape a website at regular intervals and email a given person if an item is shown as in stock.  

In order to customise the tool, you should change the url variable to the product you want to check. The tool is currently configured to check Asda. For another retailer/website, you will also need to change the class selector to reflect how the new site treats out of stock items. In the case of Asda, an element with the class of `.out-of-stock` is only presented on page if the item is out of stock. You can find the class on the relevant website by using developer tools - right click and inspect element.


## Dependencies

For this file to work, when running locally you must ensure there is a .env file in the project directory with credentials in the below format:  

EMAIL_PASSWORD=MySuperSecretPassword  
EMAIL_ADDRESS=stevenwalker1991@test.com
