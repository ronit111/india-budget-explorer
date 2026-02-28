"""
Transform World Bank hospital beds/physicians data + NHP state data into infrastructure.json.
"""

import logging

logger = logging.getLogger(__name__)


def build_infrastructure(wb_data: dict, nhp_states: list[dict], year: str) -> dict:
    state_infra = [
        {
            "id": s["id"],
            "name": s["name"],
            "bedsPerLakh": s["bedsPerLakh"],
            "phcs": s["phcs"],
            "chcs": s["chcs"],
            "subCentres": s["subCentres"],
            "doctorsAtPHC": s["doctorsAtPHC"],
            "doctorsPer10K": s["doctorsPer10K"],
        }
        for s in nhp_states
    ]

    logger.info(f"  Infrastructure: {len(wb_data.get('hospital_beds', []))} beds points, {len(state_infra)} states")

    return {
        "year": year,
        "hospitalBedsTimeSeries": wb_data.get("hospital_beds", []),
        "physiciansTimeSeries": wb_data.get("physicians", []),
        "nursesTimeSeries": wb_data.get("nurses", []),
        "stateInfrastructure": state_infra,
        "source": "World Bank + National Health Profile 2022",
    }
