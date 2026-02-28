"""
Transform World Bank population data + Census 2011 state data into population.json.
"""

import logging

logger = logging.getLogger(__name__)


def build_population(wb_data: dict, census_states: list[dict], year: str) -> dict:
    """
    Build population.json matching the PopulationData TypeScript interface.

    Args:
        wb_data: World Bank indicator data keyed by indicator name
        census_states: Census 2011 state population entries
        year: Output year string (e.g. "2025-26")
    """
    national_ts = wb_data.get("population", [])
    growth_ts = wb_data.get("pop_growth", [])

    states = [
        {
            "id": s["id"],
            "name": s["name"],
            "population": s["population"],
            "density": s["density"],
            "urbanPercent": s["urbanPercent"],
            "ruralPercent": s["ruralPercent"],
            "decadalGrowth": s["decadalGrowth"],
        }
        for s in census_states
    ]

    logger.info(f"  Population: {len(national_ts)} national points, {len(states)} states")

    return {
        "year": year,
        "nationalTimeSeries": national_ts,
        "growthTimeSeries": growth_ts,
        "states": states,
        "source": "World Bank Development Indicators + Census of India 2011",
    }
