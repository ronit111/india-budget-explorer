"""
Transform curated state fiscal health data into fiscal-health.json schema.

Source: RBI Handbook of Statistics on Indian States, CAG State Finance Reports
"""

import logging

logger = logging.getLogger(__name__)


def build_fiscal_health(curated_data: list[dict], data_year: str) -> dict:
    """
    Build fiscal-health.json from curated STATE_FISCAL_DATA.
    """
    states = sorted(curated_data, key=lambda s: s["debtToGsdp"], reverse=True)
    logger.info(f"  fiscal-health.json: {len(states)} states")

    return {
        "year": data_year,
        "states": states,
        "source": "RBI Handbook of Statistics on Indian States",
    }
