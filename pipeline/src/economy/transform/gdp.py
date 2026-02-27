"""
Transform World Bank GDP data into the GDPGrowthData schema.
"""

import logging

logger = logging.getLogger(__name__)

# India uses April-March fiscal years. World Bank reports calendar years.
# Map calendar year to fiscal year: 2024 → "2024-25"
def calendar_to_fiscal(cal_year: str) -> str:
    y = int(cal_year)
    return f"{y}-{str(y + 1)[-2:]}"


def build_gdp_growth(wb_data: list[dict], survey_year: str) -> dict:
    """
    Build gdp-growth.json from World Bank GDP growth data.

    The Economic Survey 2025-26 reports 7.4% real GDP growth for FY2025-26 (advance estimate).
    World Bank data lags by ~1 year, so we supplement the latest year from the Survey.

    Source: World Bank NY.GDP.MKTP.KD.ZG + Economic Survey 2025-26 Chapter 1
    """
    series = []
    for point in wb_data:
        fiscal_year = calendar_to_fiscal(point["year"])
        series.append({
            "year": fiscal_year,
            "value": round(point["value"], 1),
        })

    # The latest World Bank data point may not cover FY2025-26.
    # Add the advance estimate from the Economic Survey if missing.
    fiscal_years_present = {s["year"] for s in series}
    if "2025-26" not in fiscal_years_present:
        # Economic Survey 2025-26: real GDP growth advance estimate = 6.4%
        # (First Advance Estimate for FY2025-26, published Jan 2026)
        # Source: https://www.indiabudget.gov.in/economicsurvey/
        series.append({
            "year": "2025-26",
            "value": 6.4,
            "label": "Advance estimate",
        })
        logger.info("  Added FY2025-26 advance estimate (6.4%) from Economic Survey")

    # Sort by fiscal year
    series.sort(key=lambda x: x["year"])

    return {
        "year": survey_year,
        "indicator": "Real GDP Growth Rate",
        "unit": "percent",
        "series": series,
        "source": "https://api.worldbank.org/v2/country/ind/indicator/NY.GDP.MKTP.KD.ZG + Economic Survey 2025-26",
    }
