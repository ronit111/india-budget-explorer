"""
World Bank API client for fetching India economic indicators.
No authentication required. Returns JSON directly.

API docs: https://datahelpdesk.worldbank.org/knowledgebase/articles/898599
"""

import logging
from typing import Any

import requests

logger = logging.getLogger(__name__)

BASE_URL = "https://api.worldbank.org/v2/country/ind/indicator"
TIMEOUT = 30

# Key indicator codes for India
INDICATORS = {
    "gdp_growth": "NY.GDP.MKTP.KD.ZG",       # GDP growth (annual %)
    "gdp_current_usd": "NY.GDP.MKTP.CD",      # GDP (current US$)
    "gdp_per_capita": "NY.GDP.PCAP.CD",        # GDP per capita (current US$)
    "inflation_cpi": "FP.CPI.TOTL.ZG",        # Inflation, consumer prices (annual %)
    "exports_pct_gdp": "NE.EXP.GNFS.ZS",      # Exports of goods and services (% of GDP)
    "imports_pct_gdp": "NE.IMP.GNFS.ZS",      # Imports of goods and services (% of GDP)
    "trade_pct_gdp": "NE.TRD.GNFS.ZS",        # Trade (% of GDP)
    "fdi_pct_gdp": "BX.KLT.DINV.WD.GD.ZS",   # FDI, net inflows (% of GDP)
    "agri_va_pct_gdp": "NV.AGR.TOTL.ZS",      # Agriculture, value added (% of GDP)
    "industry_va_pct_gdp": "NV.IND.TOTL.ZS",  # Industry, value added (% of GDP)
    "services_va_pct_gdp": "NV.SRV.TOTL.ZS",  # Services, value added (% of GDP)
    "unemployment": "SL.UEM.TOTL.ZS",          # Unemployment (% of total labor force)
    "current_account_pct_gdp": "BN.CAB.XOKA.GD.ZS",  # Current account balance (% of GDP)
    "govt_debt_pct_gdp": "GC.DOD.TOTL.GD.ZS", # Central government debt (% of GDP)
    "population": "SP.POP.TOTL",               # Population, total
    "gni_per_capita": "NY.GNP.PCAP.CD",        # GNI per capita, Atlas method (current US$)
}


def fetch_indicator(
    code: str,
    start_year: int = 2014,
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

    # World Bank returns [metadata, data_array]
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
                "value": round(item["value"], 4),
            })

    # Sort ascending by year
    result.sort(key=lambda x: x["year"])

    logger.info(f"  Got {len(result)} data points for {code} ({result[0]['year']}–{result[-1]['year']})" if result else f"  No data for {code}")
    return result


def fetch_multiple(
    indicator_keys: list[str],
    start_year: int = 2014,
    end_year: int = 2025,
) -> dict[str, list[dict[str, Any]]]:
    """
    Fetch multiple indicators. Returns dict mapping indicator key to data points.
    """
    results = {}
    for key in indicator_keys:
        code = INDICATORS.get(key)
        if not code:
            logger.warning(f"Unknown indicator key: {key}")
            continue
        results[key] = fetch_indicator(code, start_year, end_year)
    return results
