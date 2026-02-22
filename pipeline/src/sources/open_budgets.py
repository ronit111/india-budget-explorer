"""
CKAN API client for openbudgetsindia.org.
Attempts to fetch Union Budget data via the CKAN API.
Falls back to curated data if the API is inaccessible.
"""

import logging
from pathlib import Path

import requests

logger = logging.getLogger(__name__)

BASE_URL = "https://openbudgetsindia.org"
API_BASE = f"{BASE_URL}/api/3/action"
DATA_RAW_DIR = Path(__file__).parent.parent.parent / "data-raw"


def search_datasets(query: str = "union budget 2025-26", rows: int = 10) -> list[dict] | None:
    """Search CKAN for budget datasets."""
    try:
        resp = requests.get(
            f"{API_BASE}/package_search",
            params={"q": query, "rows": rows},
            timeout=15,
        )
        resp.raise_for_status()
        data = resp.json()
        if data.get("success"):
            results = data["result"]["results"]
            logger.info(f"Found {len(results)} datasets for '{query}'")
            return results
        return None
    except Exception as e:
        logger.warning(f"CKAN API search failed: {e}")
        return None


def download_resource(resource_url: str, filename: str) -> Path | None:
    """Download a CKAN resource file to data-raw/."""
    DATA_RAW_DIR.mkdir(parents=True, exist_ok=True)
    target = DATA_RAW_DIR / filename
    if target.exists():
        logger.info(f"Already downloaded: {filename}")
        return target
    try:
        resp = requests.get(resource_url, timeout=30, stream=True)
        resp.raise_for_status()
        with open(target, "wb") as f:
            for chunk in resp.iter_content(chunk_size=8192):
                f.write(chunk)
        logger.info(f"Downloaded: {filename}")
        return target
    except Exception as e:
        logger.warning(f"Download failed for {filename}: {e}")
        return None


def fetch_budget_data() -> dict | None:
    """
    Try to fetch Union Budget data from Open Budgets India.
    Returns parsed dataset metadata if successful, None otherwise.
    """
    logger.info("Attempting to fetch data from Open Budgets India CKAN API...")

    # Try multiple search queries
    for query in [
        "union budget 2025-26",
        "union budget expenditure",
        "union budget receipt",
        "demand for grants",
    ]:
        results = search_datasets(query)
        if results:
            # Look for CSV/Excel resources
            for dataset in results:
                for resource in dataset.get("resources", []):
                    fmt = (resource.get("format") or "").lower()
                    if fmt in ("csv", "xlsx", "xls"):
                        name = resource.get("name", "budget_data")
                        url = resource.get("url")
                        if url:
                            path = download_resource(url, f"{name}.{fmt}")
                            if path:
                                return {
                                    "dataset": dataset.get("title"),
                                    "resource": name,
                                    "path": str(path),
                                    "format": fmt,
                                }

    logger.info("Could not fetch live data from CKAN API. Using curated data.")
    return None
