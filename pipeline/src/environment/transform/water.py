"""
Transform CWC reservoir storage + CGWB groundwater data into water.json.
"""

import logging

logger = logging.getLogger(__name__)


def build_water(cwc_storage: list[dict], cgwb_states: list[dict], year: str) -> dict:
    reservoir_storage = [
        {
            "region": r["region"],
            "storagePct": r["storagePct"],
            "reservoirCount": r["reservoirCount"],
            "capacityBCM": r["capacityBCM"],
        }
        for r in cwc_storage
    ]

    groundwater = [
        {
            "id": s["id"],
            "name": s["name"],
            "stagePct": s["stagePct"],
            "stage": s["stage"],
        }
        for s in cgwb_states
    ]

    logger.info(f"  Water: {len(reservoir_storage)} regions, {len(groundwater)} groundwater states")

    return {
        "year": year,
        "reservoirStorage": reservoir_storage,
        "groundwaterStage": groundwater,
        "source": "CWC Reservoir Bulletin + CGWB Assessment 2023",
    }
