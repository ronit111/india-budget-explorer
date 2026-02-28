"""
Transform curated state revenue data into revenue.json schema.

Source: RBI Handbook of Statistics on Indian States, Finance Commission reports
"""

import logging

logger = logging.getLogger(__name__)


def build_revenue(curated_data: list[dict], data_year: str) -> dict:
    """
    Build revenue.json from curated STATE_REVENUE_DATA.
    """
    states = sorted(curated_data, key=lambda s: s["totalRevenue"], reverse=True)
    logger.info(f"  revenue.json: {len(states)} states")

    return {
        "year": data_year,
        "states": states,
        "source": "RBI Handbook of Statistics on Indian States, Finance Commission",
    }
