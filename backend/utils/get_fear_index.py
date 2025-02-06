import requests
from bs4 import BeautifulSoup

def get_fear_and_greed_index():
    headers = {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
    }
    
    try:
        response = requests.get('https://www.binance.com/en/square/fear-and-greed-index', headers=headers)
        response.raise_for_status()
        
        soup = BeautifulSoup(response.text, 'html.parser')
        
        # Find elements using their specific class names
        fear_index_element = soup.find('div', {'class': 'css-cxlpc6', 'data-bn-type': 'text'})
        sentiment_element = soup.find('div', {'class': 'css-8o9ps9', 'data-bn-type': 'text'})
        
        if fear_index_element and sentiment_element:
            return {
                'value': int(fear_index_element.text),
                'sentiment': sentiment_element.text
            }
        else:
            print("Elements not found. The page structure might have changed.")
            return None

    except Exception as e:
        print(f"An error occurred: {str(e)}")
        return None
