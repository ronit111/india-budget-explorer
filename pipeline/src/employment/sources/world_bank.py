"""
World Bank API client for fetching India employment and labor indicators.
No authentication required. Returns JSON directly.
"""

import sys
from pathlib import Path

# Ensure pipeline root is importable
sys.path.insert(0, str(Path(__file__).resolve().parent.parent.parent.parent))

from src.common.world_bank import fetch_indicator as _fetch_indicator, fetch_multiple as _fetch_multiple

INDICATORS = {
    "unemp_total": "SL.UEM.TOTL.ZS",
    "unemp_national": "SL.UEM.TOTL.NE.ZS",
    "unemp_youth": "SL.UEM.1524.ZS",
    "unemp_youth_nat": "SL.UEM.1524.NE.ZS",
    "unemp_female": "SL.UEM.TOTL.FE.ZS",
    "unemp_male": "SL.UEM.TOTL.MA.ZS",
    "lfpr_total": "SL.TLF.CACT.ZS",
    "lfpr_female": "SL.TLF.CACT.FE.ZS",
    "lfpr_male": "SL.TLF.CACT.MA.ZS",
    "emp_agri": "SL.AGR.EMPL.ZS",
    "emp_industry": "SL.IND.EMPL.ZS",
    "emp_services": "SL.SRV.EMPL.ZS",
    "emp_self": "SL.EMP.SELF.ZS",
    "labor_force": "SL.TLF.TOTL.IN",
    "emp_pop_ratio": "SL.EMP.TOTL.SP.ZS",
    "vulnerable_emp": "SL.EMP.VULN.ZS",
    "lfpr_national": "SL.TLF.CACT.NE.ZS",
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
