"""
World Bank API client for fetching India economic indicators.
No authentication required. Returns JSON directly.

API docs: https://datahelpdesk.worldbank.org/knowledgebase/articles/898599
"""

import sys
from pathlib import Path

# Ensure pipeline root is importable
sys.path.insert(0, str(Path(__file__).resolve().parent.parent.parent.parent))

from src.common.world_bank import fetch_indicator as _fetch_indicator, fetch_multiple as _fetch_multiple

# Key indicator codes for India
INDICATORS = {
    "gdp_growth": "NY.GDP.MKTP.KD.ZG",       # GDP growth (annual %)
    "gdp_current_usd": "NY.GDP.MKTP.CD",      # GDP (current US$)
    "gdp_per_capita": "NY.GDP.PCAP.CD",        # GDP per capita (current US$)
    "inflation_cpi": "FP.CPI.TOTL.ZG",        # Inflation, consumer prices (annual %)
    "exports_pct_gdp": "NE.EXP.GNFS.ZS",      # Exports of goods and services (% of GDP)
    "imports_pct_gdp": "NE.IMP.GNFS.ZS",      # Imports of goods and services (% of GDP)
    "trade_pct_gdp": "NE.TRD.GNFS.ZS",        # Trade (% of GDP)
    "fdi_pct_gdp": "BX.KLT.DINV.WD.GD.ZS",   # FDI, net inflows (% of GDP)
    "agri_va_pct_gdp": "NV.AGR.TOTL.ZS",      # Agriculture, value added (% of GDP)
    "industry_va_pct_gdp": "NV.IND.TOTL.ZS",  # Industry, value added (% of GDP)
    "services_va_pct_gdp": "NV.SRV.TOTL.ZS",  # Services, value added (% of GDP)
    "unemployment": "SL.UEM.TOTL.ZS",          # Unemployment (% of total labor force)
    "current_account_pct_gdp": "BN.CAB.XOKA.GD.ZS",  # Current account balance (% of GDP)
    "govt_debt_pct_gdp": "GC.DOD.TOTL.GD.ZS", # Central government debt (% of GDP)
    "population": "SP.POP.TOTL",               # Population, total
    "gni_per_capita": "NY.GNP.PCAP.CD",        # GNI per capita, Atlas method (current US$)
}


def fetch_indicator(code: str, start_year: int = 2000, end_year: int = 2025):
    return _fetch_indicator(code, start_year, end_year, precision=4)


def fetch_multiple(
    indicator_keys: list[str],
    start_year: int = 2000,
    end_year: int = 2025,
):
    return _fetch_multiple(INDICATORS, indicator_keys, start_year, end_year, precision=4)
