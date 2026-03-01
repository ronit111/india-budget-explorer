"""
World Bank API client for fetching India education indicators.
No authentication required. Returns JSON directly.

API docs: https://datahelpdesk.worldbank.org/knowledgebase/articles/898599
"""

import sys
from pathlib import Path

# Ensure pipeline root is importable
sys.path.insert(0, str(Path(__file__).resolve().parent.parent.parent.parent))

from src.common.world_bank import fetch_indicator as _fetch_indicator, fetch_multiple as _fetch_multiple

INDICATORS = {
    "prim_enroll": "SE.PRM.ENRR",
    "sec_enroll": "SE.SEC.ENRR",
    "tert_enroll": "SE.TER.ENRR",
    "sec_enroll_f": "SE.SEC.ENRR.FE",
    "sec_enroll_m": "SE.SEC.ENRR.MA",
    "literacy_adult": "SE.ADT.LITR.ZS",
    "literacy_youth": "SE.ADT.1524.LT.ZS",
    "literacy_adult_f": "SE.ADT.LITR.FE.ZS",
    "edu_spend_gdp": "SE.XPD.TOTL.GD.ZS",
    "edu_spend_govt": "SE.XPD.TOTL.GB.ZS",
    "prim_compl": "SE.PRM.CMPT.ZS",
    "out_of_school": "SE.PRM.UNER",
    "ptr_primary": "SE.PRM.ENRL.TC.ZS",
    "ptr_secondary": "SE.SEC.ENRL.TC.ZS",
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
