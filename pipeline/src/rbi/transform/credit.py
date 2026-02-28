"""
Transform World Bank credit/banking data into the credit.json schema.

Covers:
- Domestic credit by financial sector (% of GDP) — FS.AST.DOMS.GD.ZS
- Credit to private sector (% of GDP)            — FD.AST.PRVT.GD.ZS
- Lending interest rate (%)                      — FR.INR.LEND
- Deposit interest rate (%)                      — FR.INR.DPST

Source: World Bank Development Indicators for India
"""

import logging

logger = logging.getLogger(__name__)


def calendar_to_fiscal(cal_year: str) -> str:
    """Convert calendar year to Indian fiscal year string: '2020' -> '2020-21'."""
    y = int(cal_year)
    return f"{y}-{str(y + 1)[-2:]}"


def _build_series(wb_data: list[dict]) -> list[dict]:
    """Convert World Bank data points to fiscal-year series."""
    return [
        {"year": calendar_to_fiscal(p["year"]), "value": round(p["value"], 2)}
        for p in wb_data
    ]


def build_credit(
    wb_domestic_credit: list[dict],
    wb_private_credit: list[dict],
    wb_lending_rate: list[dict],
    wb_deposit_rate: list[dict],
    survey_year: str,
) -> dict:
    """
    Build credit.json from World Bank credit and interest rate data.

    Each indicator is a nested object with series, unit, and source.
    """
    domestic_series = _build_series(wb_domestic_credit)
    private_series = _build_series(wb_private_credit)
    lending_series = _build_series(wb_lending_rate)
    deposit_series = _build_series(wb_deposit_rate)

    logger.info(f"  domesticCreditPctGDP: {len(domestic_series)} data points")
    logger.info(f"  privateCreditPctGDP: {len(private_series)} data points")
    logger.info(f"  lendingRate: {len(lending_series)} data points")
    logger.info(f"  depositRate: {len(deposit_series)} data points")

    return {
        "year": survey_year,
        "domesticCreditPctGDP": {
            "series": domestic_series,
            "unit": "% of GDP",
            "source": "World Bank FS.AST.DOMS.GD.ZS",
        },
        "privateCreditPctGDP": {
            "series": private_series,
            "unit": "% of GDP",
            "source": "World Bank FD.AST.PRVT.GD.ZS",
        },
        "lendingRate": {
            "series": lending_series,
            "unit": "%",
            "source": "World Bank FR.INR.LEND",
        },
        "depositRate": {
            "series": deposit_series,
            "unit": "%",
            "source": "World Bank FR.INR.DPST",
        },
    }
