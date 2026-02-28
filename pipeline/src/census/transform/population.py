"""
Transform World Bank population data + Census 2011 + NPC 2026 projections into population.json.
"""

import logging

logger = logging.getLogger(__name__)


def build_population(
    wb_data: dict,
    census_states: list[dict],
    npc_states: list[dict],
    year: str,
) -> dict:
    """
    Build population.json matching the PopulationData TypeScript interface.

    Merges NPC 2026 projected population with Census 2011 metadata (density,
    urbanPercent, ruralPercent, decadalGrowth). NPC gives current population
    estimates; Census 2011 provides the most granular state-level demographic
    breakdown available until Census 2027.

    Args:
        wb_data: World Bank indicator data keyed by indicator name
        census_states: Census 2011 state population entries (density, urban%, etc.)
        npc_states: NPC 2026 projected populations by state
        year: Output year string (e.g. "2025-26")
    """
    national_ts = wb_data.get("population", [])
    growth_ts = wb_data.get("pop_growth", [])

    # Build lookup: state id → NPC projected population
    npc_pop = {s["id"]: s["population"] for s in npc_states}

    states = [
        {
            "id": s["id"],
            "name": s["name"],
            "population": npc_pop.get(s["id"], s["population"]),
            "density": s["density"],
            "urbanPercent": s["urbanPercent"],
            "ruralPercent": s["ruralPercent"],
            "decadalGrowth": s["decadalGrowth"],
        }
        for s in census_states
    ]

    logger.info(f"  Population: {len(national_ts)} national points, {len(states)} states (NPC 2026 projected)")

    return {
        "year": year,
        "nationalTimeSeries": national_ts,
        "growthTimeSeries": growth_ts,
        "states": states,
        "source": "World Bank + NPC Population Projections 2026 + Census of India 2011",
    }
