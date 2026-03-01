"""
Shared World Bank API client for fetching India indicators.

All domain pipelines (Economy, Census, RBI, Education, Employment, Healthcare)
use this shared module instead of maintaining separate copies. Each domain
keeps its own INDICATORS dict mapping friendly keys to WB indicator codes.

No authentication required. Returns JSON directly.
API docs: https://datahelpdesk.worldbank.org/knowledgebase/articles/898599
"""

import logging
import time
from typing import Any

import requests

logger = logging.getLogger(__name__)

BASE_URL = "https://api.worldbank.org/v2/country/ind/indicator"
TIMEOUT = 60
MAX_RETRIES = 3
RETRY_DELAY_BASE = 2  # seconds; actual delay = base * attempt (exponential backoff)


def fetch_indicator(
    code: str,
    start_year: int = 2000,
    end_year: int = 2025,
    precision: int = 2,
) -> list[dict[str, Any]]:
    """
    Fetch a single indicator from the World Bank API.

    Returns list of {year: str, value: float} dicts, sorted by year ascending.
    Null values are filtered out. Returns empty list on any error after retrying.

    Args:
        code: World Bank indicator code (e.g., "NY.GDP.MKTP.KD.ZG").
        start_year: First year to fetch.
        end_year: Last year to fetch.
        precision: Decimal places for rounding values (default 2).
    """
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
            # HTTP 4xx/5xx — don't retry (indicator may not exist for India)
            logger.warning(f"HTTP error for {code}: {e} — returning empty")
            return []
        except (
            requests.exceptions.Timeout,
            requests.exceptions.ConnectionError,
        ) as e:
            if attempt == MAX_RETRIES:
                logger.warning(
                    f"Failed to fetch {code} after {MAX_RETRIES} attempts: {e}"
                )
                return []
            logger.info(f"  Retry {attempt}/{MAX_RETRIES} for {code}...")
            time.sleep(RETRY_DELAY_BASE * attempt)

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
                "value": round(item["value"], precision),
            })

    result.sort(key=lambda x: x["year"])

    if result:
        logger.info(
            f"  Got {len(result)} data points for {code} "
            f"({result[0]['year']}–{result[-1]['year']})"
        )
    else:
        logger.info(f"  No data for {code}")

    return result


def fetch_multiple(
    indicators: dict[str, str],
    keys: list[str] | None = None,
    start_year: int = 2000,
    end_year: int = 2025,
    precision: int = 2,
) -> dict[str, list[dict[str, Any]]]:
    """
    Fetch multiple indicators. Returns dict mapping friendly key to data points.

    Args:
        indicators: Dict mapping friendly key → WB indicator code.
        keys: Which keys to fetch. If None, fetches all.
        start_year: First year to fetch.
        end_year: Last year to fetch.
        precision: Decimal places for rounding values.
    """
    fetch_keys = keys or list(indicators.keys())
    results = {}
    for key in fetch_keys:
        code = indicators.get(key)
        if not code:
            logger.warning(f"Unknown indicator key: {key}")
            continue
        results[key] = fetch_indicator(code, start_year, end_year, precision)
    return results
