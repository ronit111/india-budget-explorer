"""
Transform World Bank demographic data + Census 2011 state data into demographics.json.
"""

import logging

logger = logging.getLogger(__name__)


def build_demographics(wb_data: dict, census_states: list[dict], year: str) -> dict:
    """
    Build demographics.json matching the DemographicsData TypeScript interface.

    Args:
        wb_data: World Bank indicator data keyed by indicator name
        census_states: Census 2011 state population entries
        year: Output year string (e.g. "2025-26")
    """
    age_young = wb_data.get("pop_0_14", [])
    age_working = wb_data.get("pop_15_64", [])
    age_elderly = wb_data.get("pop_65_up", [])
    dependency = wb_data.get("dependency", [])

    birth_rate = wb_data.get("birth_rate", [])
    death_rate = wb_data.get("death_rate", [])
    fertility = wb_data.get("fertility", [])
    life_exp = wb_data.get("life_exp", [])
    life_exp_male = wb_data.get("life_exp_male", [])
    life_exp_female = wb_data.get("life_exp_female", [])

    urbanization = wb_data.get("urban_pct", [])

    states = [
        {
            "id": s["id"],
            "name": s["name"],
            "sexRatio": s["sexRatio"],
            "urbanizationRate": s["urbanPercent"],
            "growthRate": s["decadalGrowth"],
        }
        for s in census_states
    ]

    logger.info(f"  Demographics: {len(age_young)} age structure points, {len(states)} states")

    return {
        "year": year,
        "ageStructure": {
            "young": age_young,
            "working": age_working,
            "elderly": age_elderly,
        },
        "dependencyRatio": dependency,
        "vitalStats": {
            "birthRate": birth_rate,
            "deathRate": death_rate,
            "fertilityRate": fertility,
            "lifeExpectancy": life_exp,
            "lifeExpectancyMale": life_exp_male,
            "lifeExpectancyFemale": life_exp_female,
        },
        "urbanization": urbanization,
        "states": states,
        "source": "World Bank Development Indicators + Census of India 2011",
    }
