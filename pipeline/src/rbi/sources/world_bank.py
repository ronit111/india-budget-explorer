"""
World Bank API client for fetching RBI-relevant financial indicators.
No authentication required. Returns JSON directly.

RBI-specific indicator codes covering monetary, liquidity, credit,
and external sectors.

API docs: https://datahelpdesk.worldbank.org/knowledgebase/articles/898599
"""

import sys
from pathlib import Path

# Ensure pipeline root is importable
sys.path.insert(0, str(Path(__file__).resolve().parent.parent.parent.parent))

from src.common.world_bank import fetch_indicator as _fetch_indicator, fetch_multiple as _fetch_multiple

# RBI-domain indicator codes
INDICATORS = {
    "broad_money_growth": "FM.LBL.BMNY.ZG",       # Broad money growth (annual %)
    "broad_money_pct_gdp": "FM.LBL.BMNY.GD.ZS",   # Broad money (% of GDP)
    "domestic_credit_pct_gdp": "FS.AST.DOMS.GD.ZS",  # Domestic credit by financial sector (% of GDP)
    "private_credit_pct_gdp": "FD.AST.PRVT.GD.ZS",   # Credit to private sector (% of GDP)
    "reserves_usd": "FI.RES.TOTL.CD",              # Total reserves incl. gold (US$)
    "exchange_rate": "PA.NUS.FCRF",                 # Official exchange rate (INR per US$)
    "inflation_cpi": "FP.CPI.TOTL.ZG",             # CPI inflation (annual %)
    "lending_rate": "FR.INR.LEND",                  # Lending interest rate (%)
    "deposit_rate": "FR.INR.DPST",                  # Deposit interest rate (%)
    "bank_branches": "FB.CBK.BRCH.P5",             # Bank branches per 100K adults
}


def fetch_indicator(code: str, start_year: int = 2000, end_year: int = 2025):
    return _fetch_indicator(code, start_year, end_year, precision=4)


def fetch_multiple(
    indicator_keys: list[str] | None = None,
    start_year: int = 2000,
    end_year: int = 2025,
):
    keys = indicator_keys or list(INDICATORS.keys())
    return _fetch_multiple(INDICATORS, keys, start_year, end_year, precision=4)
