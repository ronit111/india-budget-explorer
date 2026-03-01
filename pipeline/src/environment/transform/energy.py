"""
Transform World Bank energy/carbon time series + CEA capacity mix into energy.json.
"""

import logging

logger = logging.getLogger(__name__)


def build_energy(wb_data: dict, cea_mix: list[dict], year: str) -> dict:
    fuel_capacity = [
        {
            "year": entry["year"],
            "coal": entry["coal"],
            "gas": entry["gas"],
            "nuclear": entry["nuclear"],
            "hydro": entry["hydro"],
            "solar": entry["solar"],
            "wind": entry["wind"],
            "biomass": entry["biomass"],
            "smallHydro": entry["smallHydro"],
        }
        for entry in cea_mix
    ]

    logger.info(f"  Energy: {len(wb_data.get('renewables_pct', []))} WB renewables points, {len(fuel_capacity)} CEA years")

    return {
        "year": year,
        "renewablesPctTimeSeries": wb_data.get("renewables_pct", []),
        "renewableElecTimeSeries": wb_data.get("renewable_elec", []),
        "coalElecTimeSeries": wb_data.get("coal_elec", []),
        "energyUsePerCapitaTimeSeries": wb_data.get("energy_use_pc", []),
        "co2PerCapitaTimeSeries": wb_data.get("co2_per_capita", []),
        "co2TotalTimeSeries": wb_data.get("co2_total", []),
        "ghgTotalTimeSeries": wb_data.get("ghg_total", []),
        "fuelCapacityMix": fuel_capacity,
        "source": "World Bank + CEA Installed Capacity Reports",
    }
