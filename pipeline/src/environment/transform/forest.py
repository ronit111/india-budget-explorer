"""
Transform World Bank forest time series + FSI state data into forest.json.
"""

import logging

logger = logging.getLogger(__name__)


def build_forest(wb_data: dict, fsi_states: list[dict], year: str) -> dict:
    state_forest = [
        {
            "id": s["id"],
            "name": s["name"],
            "forestCoverKm2": s["forestCoverKm2"],
            "pctGeographicArea": s["pctGeographicArea"],
            "changeKm2": s["changeKm2"],
        }
        for s in fsi_states
    ]

    logger.info(f"  Forest: {len(wb_data.get('forest_pct', []))} WB points, {len(state_forest)} states")

    return {
        "year": year,
        "forestPctTimeSeries": wb_data.get("forest_pct", []),
        "forestKm2TimeSeries": wb_data.get("forest_km2", []),
        "protectedAreasPct": wb_data.get("protected_areas", []),
        "stateForestCover": state_forest,
        "source": "World Bank + ISFR 2023",
    }
