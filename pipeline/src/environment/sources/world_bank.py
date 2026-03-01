"""
World Bank API client for fetching India environment indicators.
Covers air quality, forest cover, energy, carbon emissions, and protected areas.
"""

import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent.parent.parent.parent))

from src.common.world_bank import fetch_indicator as _fetch_indicator, fetch_multiple as _fetch_multiple

INDICATORS = {
    "co2_per_capita": "EN.ATM.CO2E.PC",
    "co2_total": "EN.ATM.CO2E.KT",
    "renewables_pct": "EG.FEC.RNEW.ZS",
    "forest_pct": "AG.LND.FRST.ZS",
    "forest_km2": "AG.LND.FRST.K2",
    "pm25": "EN.ATM.PM25.MC.M3",
    "renewable_elec": "EG.ELC.RNEW.ZS",
    "energy_use_pc": "EG.USE.PCAP.KG.OE",
    "coal_elec": "EG.ELC.COAL.ZS",
    "ghg_total": "EN.ATM.GHGT.KT.CE",
    "protected_areas": "ER.PTD.TOTL.ZS",
}


def fetch_indicator(code: str, start_year: int = 2000, end_year: int = 2025):
    return _fetch_indicator(code, start_year, end_year, precision=2)


def fetch_multiple(
    indicator_keys: list[str] | None = None,
    start_year: int = 2000,
    end_year: int = 2025,
):
    keys = indicator_keys or list(INDICATORS.keys())
    return _fetch_multiple(INDICATORS, keys, start_year, end_year, precision=2)
