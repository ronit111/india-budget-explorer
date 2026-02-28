"""
World Bank API client for fetching RBI-relevant financial indicators.
No authentication required. Returns JSON directly.

RBI-specific indicator codes covering monetary, liquidity, credit,
and external sectors.

API docs: https://datahelpdesk.worldbank.org/knowledgebase/articles/898599
"""

import logging
import time
from typing import Any

import requests

logger = logging.getLogger(__name__)

BASE_URL = "https://api.worldbank.org/v2/country/ind/indicator"
TIMEOUT = 60  # generous timeout; WB API can be slow
MAX_RETRIES = 2
RETRY_DELAY = 3  # seconds between retries

# RBI-domain indicator codes
INDICATORS = {
    "broad_money_growth": "FM.LBL.BMNY.ZG",       # Broad money growth (annual %)
    "broad_money_pct_gdp": "FM.LBL.BMNY.GD.ZS",   # Broad money (% of GDP)
    "domestic_credit_pct_gdp": "FS.AST.DOMS.GD.ZS",  # Domestic credit by financial sector (% of GDP)
    "private_credit_pct_gdp": "FD.AST.PRVT.GD.ZS",   # Credit to private sector (% of GDP)
    "reserves_usd": "FI.RES.TOTL.CD",              # Total reserves incl. gold (US$)
    "exchange_rate": "PA.NUS.FCRF",                 # Official exchange rate (INR per US$)
    "inflation_cpi": "FP.CPI.TOTL.ZG",             # CPI inflation (annual %)
    "lending_rate": "FR.INR.LEND",                  # Lending interest rate (%)
    "deposit_rate": "FR.INR.DPST",                  # Deposit interest rate (%)
    "bank_branches": "FB.CBK.BRCH.P5",             # Bank branches per 100K adults
}


def fetch_indicator(
    code: str,
    start_year: int = 2014,
    end_year: int = 2025,
) -> list[dict[str, Any]]:
    """
    Fetch a single indicator from the World Bank API.

    Returns list of {year: str, value: float} dicts, sorted by year ascending.
    Null values are filtered out. Returns empty list on any error (HTTP, timeout,
    parse failure) after retrying.
    """
    url = f"{BASE_URL}/{code}"
    params = {
        "date": f"{start_year}:{end_year}",
        "format": "json",
        "per_page": 100,
    }

    for attempt in range(MAX_RETRIES + 1):
        try:
            logger.info(f"Fetching {code} from World Bank API (attempt {attempt + 1})...")
            resp = requests.get(url, params=params, timeout=TIMEOUT)

            if resp.status_code != 200:
                logger.warning(f"  HTTP {resp.status_code} for {code}")
                if attempt < MAX_RETRIES:
                    time.sleep(RETRY_DELAY)
                    continue
                return []

            data = resp.json()

            # World Bank returns [metadata, data_array]
            if not isinstance(data, list) or len(data) < 2:
                logger.warning(f"  Unexpected response format for {code}")
                return []

            records = data[1]
            if records is None:
                logger.warning(f"  No data returned for {code}")
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

            if result:
                logger.info(
                    f"  Got {len(result)} data points for {code} "
                    f"({result[0]['year']}–{result[-1]['year']})"
                )
            else:
                logger.info(f"  No non-null data for {code}")
            return result

        except requests.exceptions.Timeout:
            logger.warning(f"  Timeout fetching {code} (attempt {attempt + 1})")
            if attempt < MAX_RETRIES:
                time.sleep(RETRY_DELAY)
                continue
            logger.warning(f"  All retries exhausted for {code} — returning empty")
            return []

        except requests.exceptions.RequestException as e:
            logger.warning(f"  Request error for {code}: {e}")
            if attempt < MAX_RETRIES:
                time.sleep(RETRY_DELAY)
                continue
            return []

    return []


def fetch_multiple(
    indicator_keys: list[str],
    start_year: int = 2014,
    end_year: int = 2025,
) -> dict[str, list[dict[str, Any]]]:
    """
    Fetch multiple indicators. Returns dict mapping indicator key to data points.
    Skips unknown keys with a warning. Gracefully handles failures per indicator.
    """
    results = {}
    for key in indicator_keys:
        code = INDICATORS.get(key)
        if not code:
            logger.warning(f"Unknown indicator key: {key}")
            continue
        data = fetch_indicator(code, start_year, end_year)
        if not data:
            logger.warning(f"No data returned for {key} ({code}) — will use empty series")
        results[key] = data
        # Small delay between requests to be polite to the API
        time.sleep(1)
    return results
