"""
World Bank API client for fetching India employment and labor indicators.
No authentication required. Returns JSON directly.
"""

import logging
import time
from typing import Any

import requests

logger = logging.getLogger(__name__)

BASE_URL = "https://api.worldbank.org/v2/country/ind/indicator"
TIMEOUT = 60
MAX_RETRIES = 3

INDICATORS = {
    "unemp_total": "SL.UEM.TOTL.ZS",
    "unemp_national": "SL.UEM.TOTL.NE.ZS",
    "unemp_youth": "SL.UEM.1524.ZS",
    "unemp_youth_nat": "SL.UEM.1524.NE.ZS",
    "unemp_female": "SL.UEM.TOTL.FE.ZS",
    "unemp_male": "SL.UEM.TOTL.MA.ZS",
    "lfpr_total": "SL.TLF.CACT.ZS",
    "lfpr_female": "SL.TLF.CACT.FE.ZS",
    "lfpr_male": "SL.TLF.CACT.MA.ZS",
    "emp_agri": "SL.AGR.EMPL.ZS",
    "emp_industry": "SL.IND.EMPL.ZS",
    "emp_services": "SL.SRV.EMPL.ZS",
    "emp_self": "SL.EMP.SELF.ZS",
    "labor_force": "SL.TLF.TOTL.IN",
    "emp_pop_ratio": "SL.EMP.TOTL.SP.ZS",
    "vulnerable_emp": "SL.EMP.VULN.ZS",
    "lfpr_national": "SL.TLF.CACT.NE.ZS",
}


def fetch_indicator(
    code: str,
    start_year: int = 2000,
    end_year: int = 2025,
) -> list[dict[str, Any]]:
    url = f"{BASE_URL}/{code}"
    params = {
        "date": f"{start_year}:{end_year}",
        "format": "json",
        "per_page": 100,
    }

    logger.info(f"Fetching {code} from World Bank API...")
    for attempt in range(1, MAX_RETRIES + 1):
        try:
            resp = requests.get(url, params=params, timeout=TIMEOUT)
            resp.raise_for_status()
            break
        except requests.exceptions.HTTPError as e:
            logger.warning(f"HTTP error for {code}: {e} — returning empty")
            return []
        except (requests.exceptions.Timeout, requests.exceptions.ConnectionError) as e:
            if attempt == MAX_RETRIES:
                logger.warning(f"Failed to fetch {code} after {MAX_RETRIES} attempts: {e}")
                return []
            logger.info(f"  Retry {attempt}/{MAX_RETRIES} for {code}...")
            time.sleep(2 * attempt)
    data = resp.json()

    if not isinstance(data, list) or len(data) < 2:
        logger.warning(f"Unexpected response format for {code}")
        return []

    records = data[1]
    if records is None:
        logger.warning(f"No data returned for {code}")
        return []

    result = []
    for item in records:
        if item["value"] is not None:
            result.append({
                "year": item["date"],
                "value": round(item["value"], 2),
            })

    result.sort(key=lambda x: x["year"])

    if result:
        logger.info(f"  Got {len(result)} data points for {code} ({result[0]['year']}–{result[-1]['year']})")
    else:
        logger.info(f"  No data for {code}")

    return result


def fetch_multiple(
    indicator_keys: list[str] | None = None,
    start_year: int = 2000,
    end_year: int = 2025,
) -> dict[str, list[dict[str, Any]]]:
    keys = indicator_keys or list(INDICATORS.keys())
    results = {}
    for key in keys:
        code = INDICATORS.get(key)
        if not code:
            logger.warning(f"Unknown indicator key: {key}")
            continue
        results[key] = fetch_indicator(code, start_year, end_year)
    return results
