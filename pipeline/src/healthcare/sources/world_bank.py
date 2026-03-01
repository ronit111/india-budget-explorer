"""
World Bank API client for fetching India healthcare indicators.
Focuses on infrastructure, spending, and disease burden (NOT mortality/life expectancy,
which are already in the Census domain).
"""

import sys
from pathlib import Path

# Ensure pipeline root is importable
sys.path.insert(0, str(Path(__file__).resolve().parent.parent.parent.parent))

from src.common.world_bank import fetch_indicator as _fetch_indicator, fetch_multiple as _fetch_multiple

INDICATORS = {
    "hospital_beds": "SH.MED.BEDS.ZS",
    "physicians": "SH.MED.PHYS.ZS",
    "nurses": "SH.MED.NUMW.P3",
    "health_exp_gdp": "SH.XPD.CHEX.GD.ZS",
    "health_exp_pc": "SH.XPD.CHEX.PC.CD",
    "oop_health": "SH.XPD.OOPC.CH.ZS",
    "govt_health_exp": "SH.XPD.GHED.GD.ZS",
    "imm_dpt": "SH.IMM.IDPT",
    "imm_measles": "SH.IMM.MEAS",
    "tb_incidence": "SH.TBS.INCD",
    "hiv_prev": "SH.DYN.AIDS.ZS",
    "births_attended": "SH.STA.BRTC.ZS",
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
