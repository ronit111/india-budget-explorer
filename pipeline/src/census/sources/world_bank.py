"""
World Bank API client for fetching India census and demographic indicators.
No authentication required. Returns JSON directly.

API docs: https://datahelpdesk.worldbank.org/knowledgebase/articles/898599
"""

import logging
from typing import Any

import requests

logger = logging.getLogger(__name__)

BASE_URL = "https://api.worldbank.org/v2/country/ind/indicator"
TIMEOUT = 30

INDICATORS = {
    "population": "SP.POP.TOTL",
    "pop_growth": "SP.POP.GROW",
    "pop_0_14": "SP.POP.0014.TO.ZS",
    "pop_15_64": "SP.POP.1564.TO.ZS",
    "pop_65_up": "SP.POP.65UP.TO.ZS",
    "dependency": "SP.POP.DPND",
    "birth_rate": "SP.DYN.CBRT.IN",
    "death_rate": "SP.DYN.CDRT.IN",
    "fertility": "SP.DYN.TFRT.IN",
    "life_exp": "SP.DYN.LE00.IN",
    "life_exp_male": "SP.DYN.LE00.MA.IN",
    "life_exp_female": "SP.DYN.LE00.FE.IN",
    "urban_pct": "SP.URB.TOTL.IN.ZS",
    "imr": "SP.DYN.IMRT.IN",
    "under5_mr": "SH.DYN.MORT",
    "mmr": "SH.STA.MMRT",
    "literacy": "SE.ADT.LITR.ZS",
    "literacy_male": "SE.ADT.LITR.MA.ZS",
    "literacy_female": "SE.ADT.LITR.FE.ZS",
}


def fetch_indicator(
    code: str,
    start_year: int = 2000,
    end_year: int = 2025,
) -> list[dict[str, Any]]:
    """
    Fetch a single indicator from the World Bank API.

    Returns list of {year: str, value: float} dicts, sorted by year ascending.
    Null values are filtered out.
    """
    url = f"{BASE_URL}/{code}"
    params = {
        "date": f"{start_year}:{end_year}",
        "format": "json",
        "per_page": 100,
    }

    logger.info(f"Fetching {code} from World Bank API...")
    resp = requests.get(url, params=params, timeout=TIMEOUT)
    resp.raise_for_status()
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
        logger.info(f"  Got {len(result)} data points for {code} ({result[0]['year']}\u2013{result[-1]['year']})")
    else:
        logger.info(f"  No data for {code}")

    return result


def fetch_multiple(
    indicator_keys: list[str] | None = None,
    start_year: int = 2000,
    end_year: int = 2025,
) -> dict[str, list[dict[str, Any]]]:
    """
    Fetch multiple indicators. Returns dict mapping indicator key to data points.
    If indicator_keys is None, fetches all indicators.
    """
    keys = indicator_keys or list(INDICATORS.keys())
    results = {}
    for key in keys:
        code = INDICATORS.get(key)
        if not code:
            logger.warning(f"Unknown indicator key: {key}")
            continue
        results[key] = fetch_indicator(code, start_year, end_year)
    return results
