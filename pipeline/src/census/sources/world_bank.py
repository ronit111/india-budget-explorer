"""
World Bank API client for fetching India census and demographic indicators.
No authentication required. Returns JSON directly.

API docs: https://datahelpdesk.worldbank.org/knowledgebase/articles/898599
"""

import sys
from pathlib import Path

# Ensure pipeline root is importable
sys.path.insert(0, str(Path(__file__).resolve().parent.parent.parent.parent))

from src.common.world_bank import fetch_indicator as _fetch_indicator, fetch_multiple as _fetch_multiple

INDICATORS = {
    "population": "SP.POP.TOTL",
    "pop_growth": "SP.POP.GROW",
    "pop_0_14": "SP.POP.0014.TO.ZS",
    "pop_15_64": "SP.POP.1564.TO.ZS",
    "pop_65_up": "SP.POP.65UP.TO.ZS",
    "dependency": "SP.POP.DPND",
    "birth_rate": "SP.DYN.CBRT.IN",
    "death_rate": "SP.DYN.CDRT.IN",
    "fertility": "SP.DYN.TFRT.IN",
    "life_exp": "SP.DYN.LE00.IN",
    "life_exp_male": "SP.DYN.LE00.MA.IN",
    "life_exp_female": "SP.DYN.LE00.FE.IN",
    "urban_pct": "SP.URB.TOTL.IN.ZS",
    "imr": "SP.DYN.IMRT.IN",
    "under5_mr": "SH.DYN.MORT",
    "mmr": "SH.STA.MMRT",
    "literacy": "SE.ADT.LITR.ZS",
    "literacy_male": "SE.ADT.LITR.MA.ZS",
    "literacy_female": "SE.ADT.LITR.FE.ZS",
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
