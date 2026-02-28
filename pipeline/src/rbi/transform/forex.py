"""
Transform World Bank external/forex data into the forex.json schema.

Covers:
- Total reserves including gold (US$) — FI.RES.TOTL.CD
- Official exchange rate (INR/USD)    — PA.NUS.FCRF

Source: World Bank Development Indicators for India

Note: World Bank reserves are in current US dollars. We convert to
US$ billion for readability (divide by 1e9, round to 2 decimals).
"""

import logging

logger = logging.getLogger(__name__)


def calendar_to_fiscal(cal_year: str) -> str:
    """Convert calendar year to Indian fiscal year string: '2020' -> '2020-21'."""
    y = int(cal_year)
    return f"{y}-{str(y + 1)[-2:]}"


def build_forex(
    wb_reserves: list[dict],
    wb_exchange_rate: list[dict],
    survey_year: str,
) -> dict:
    """
    Build forex.json from World Bank reserves and exchange rate data.

    Reserves are converted from US$ to US$ billion for chart readability.
    Exchange rate is INR per 1 USD (annual average).
    """
    # Convert reserves from raw US$ to US$ billion
    reserves_series = [
        {
            "year": calendar_to_fiscal(p["year"]),
            "value": round(p["value"] / 1e9, 2),
        }
        for p in wb_reserves
    ]

    exchange_series = [
        {
            "year": calendar_to_fiscal(p["year"]),
            "value": round(p["value"], 2),
        }
        for p in wb_exchange_rate
    ]

    logger.info(f"  reservesUSD: {len(reserves_series)} data points")
    logger.info(f"  exchangeRate: {len(exchange_series)} data points")

    return {
        "year": survey_year,
        "reservesUSD": {
            "series": reserves_series,
            "unit": "US$ billion",
            "source": "World Bank FI.RES.TOTL.CD",
        },
        "exchangeRate": {
            "series": exchange_series,
            "unit": "INR per USD",
            "source": "World Bank PA.NUS.FCRF",
        },
    }
