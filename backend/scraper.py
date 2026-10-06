import asyncio
import random
import uuid

async def scrape_google_business_profile(business_name: str, location: str = None) -> dict:
    """
    Simulates a call to a Google Maps Scraper API (e.g., Outscraper, SerpApi).
    In a real production environment, this would make an HTTP request to the scraper service.
    For MVP, we return a realistic simulated payload based on the user's input.
    """
    print(f"Scraping data for '{business_name}'...")
    
    # Simulate network latency (2-3 seconds)
    await asyncio.sleep(random.uniform(1.5, 3.0))
    
    # Generate mock coordinates based on location (Dubai fallback)
    lat = 25.2048 + random.uniform(-0.05, 0.05)
    lng = 55.2708 + random.uniform(-0.05, 0.05)
    
    # Realistic mock profile payload
    profile_data = {
        "google_location_id": f"ChIJ{uuid.uuid4().hex[:16]}",
        "business_name": business_name,
        "primary_category": "Local Business",
        "address_line": f"{random.randint(1, 999)} Business Road, Suite {random.randint(10, 50)}",
        "city": location if location else "Dubai",
        "postal_code": "00000",
        "country": "United Arab Emirates",
        "latitude": lat,
        "longitude": lng,
        "phone_number": f"+971 50 {random.randint(1000000, 9999999)}",
        "website_url": f"https://www.{business_name.lower().replace(' ', '')}.com",
        "booking_url": None,
        "health_score": random.randint(45, 85),
        "reviews_count": random.randint(10, 500),
        "rating": round(random.uniform(3.5, 4.9), 1)
    }
    
    return profile_data
