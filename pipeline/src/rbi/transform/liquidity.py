"""
Transform World Bank monetary/liquidity data into the liquidity.json schema.

Covers:
- Broad money growth (annual %)  — FM.LBL.BMNY.ZG
- Broad money as % of GDP        — FM.LBL.BMNY.GD.ZS

Source: World Bank Development Indicators for India
"""

import logging

logger = logging.getLogger(__name__)


def calendar_to_fiscal(cal_year: str) -> str:
    """Convert calendar year to Indian fiscal year string: '2020' -> '2020-21'."""
    y = int(cal_year)
    return f"{y}-{str(y + 1)[-2:]}"


def build_liquidity(
    wb_broad_money_growth: list[dict],
    wb_broad_money_pct_gdp: list[dict],
    survey_year: str,
) -> dict:
    """
    Build liquidity.json from World Bank broad money indicators.

    Each series is an array of {year, value} in fiscal-year notation.
    """
    growth_series = [
        {"year": calendar_to_fiscal(p["year"]), "value": round(p["value"], 2)}
        for p in wb_broad_money_growth
    ]

    pct_gdp_series = [
        {"year": calendar_to_fiscal(p["year"]), "value": round(p["value"], 2)}
        for p in wb_broad_money_pct_gdp
    ]

    logger.info(f"  broadMoneyGrowth: {len(growth_series)} data points")
    logger.info(f"  broadMoneyPctGDP: {len(pct_gdp_series)} data points")

    return {
        "year": survey_year,
        "broadMoneyGrowth": {
            "series": growth_series,
            "unit": "%",
            "source": "World Bank FM.LBL.BMNY.ZG",
        },
        "broadMoneyPctGDP": {
            "series": pct_gdp_series,
            "unit": "% of GDP",
            "source": "World Bank FM.LBL.BMNY.GD.ZS",
        },
    }
