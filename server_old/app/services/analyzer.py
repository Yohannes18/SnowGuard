from typing import List, Dict
import re
import httpx
import os
import asyncio
from dotenv import load_dotenv
import base64

load_dotenv()  # Load variables from .env into environment

VIRUSTOTAL_API_KEY = os.getenv("VIRUSTOTAL_API_KEY")
VIRUSTOTAL_API_URL = "https://www.virustotal.com/api/v3/urls"

GOOGLE_SAFEBROWSING_API_KEY = os.getenv("GOOGLE_SAFEBROWSING_API_KEY")
GOOGLE_SAFEBROWSING_API_URL = f"https://safebrowsing.googleapis.com/v4/threatMatches:find?key={GOOGLE_SAFEBROWSING_API_KEY}"

URLHAUS_JSON_URL = "https://urlhaus.abuse.ch/downloads/recent_json/"

class Analyzer:
    # --- Synchronous helpers ---
    def analyze_urls(self, urls: List[str]) -> Dict[str, str]:
        results = {}
        for url in urls:
            results[url] = "Valid URL" if self.is_valid_url(url) else "Invalid URL"
        return results

    def analyze_emails(self, emails: List[str]) -> Dict[str, str]:
        results = {}
        for email in emails:
            results[email] = "Valid Email" if self.is_valid_email(email) else "Invalid Email"
        return results

    def is_valid_url(self, url: str) -> bool:
        regex = re.compile(
            r'^(?:http|ftp)s?://'  # http:// or https://
            r'(?:(?:[A-Z0-9](?:[A-Z0-9-]{0,61}[A-Z0-9])?\.)+(?:[A-Z]{2,6}\.?|[A-Z0-9-]{2,}\.?)|'
            r'localhost|'
            r'\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}|'
            r'\[?[A-F0-9]*:[A-F0-9:]+\]?)'
            r'(?::\d+)?'
            r'(?:/?|[/?]\S+)$', re.IGNORECASE)
        return re.match(regex, url) is not None

    def is_valid_email(self, email: str) -> bool:
        regex = r'^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$'
        return re.match(regex, email) is not None

    # --- Async external API checks ---
    async def check_virustotal(self, url: str) -> bool:
        headers = {"x-apikey": VIRUSTOTAL_API_KEY}
        url_id = base64.urlsafe_b64encode(url.encode()).decode().strip("=")
        async with httpx.AsyncClient() as client:
            response = await client.get(f"{VIRUSTOTAL_API_URL}/{url_id}", headers=headers)
            if response.status_code == 200:
                data = await response.json()
                try:
                    stats = data["data"]["attributes"]["last_analysis_stats"]
                    return stats.get("malicious", 0) > 0
                except Exception:
                    return False
            return False

    async def check_google_safebrowsing(self, url: str) -> bool:
        payload = {
            "client": {
                "clientId": "snowguard",
                "clientVersion": "1.0"
            },
            "threatInfo": {
                "threatTypes": ["MALWARE", "SOCIAL_ENGINEERING", "UNWANTED_SOFTWARE", "POTENTIALLY_HARMFUL_APPLICATION"],
                "platformTypes": ["ANY_PLATFORM"],
                "threatEntryTypes": ["URL"],
                "threatEntries": [{"url": url}]
            }
        }
        async with httpx.AsyncClient() as client:
            response = await client.post(GOOGLE_SAFEBROWSING_API_URL, json=payload)
            if response.status_code == 200:
                data = await response.json()
                return "matches" in data
            return False

    async def check_urlhaus(self, url: str) -> bool:
        async with httpx.AsyncClient() as client:
            response = await client.get(URLHAUS_JSON_URL)
            if response.status_code == 200:
                data = await response.json()
                for entry in data.get("urls", []):
                    if entry.get("url") == url:
                        return True
            return False

    # --- Aggregate all results ---
    async def aggregate_url_checks(self, url: str) -> dict:
        virustotal_result, gsb_result, urlhaus_result = await asyncio.gather(
            self.check_virustotal(url),
            self.check_google_safebrowsing(url),
            self.check_urlhaus(url)
        )

        verdict = "Suspicious" if any([virustotal_result, gsb_result, urlhaus_result]) else "Safe"

        return {
            "virustotal": virustotal_result,
            "google_safebrowsing": gsb_result,
            "urlhaus": urlhaus_result,
            "verdict": verdict
        }
