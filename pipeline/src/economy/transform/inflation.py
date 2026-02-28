"""
Transform inflation data into the InflationData schema.

For the initial build, we use annual CPI data from World Bank
plus key data points from the Economic Survey 2025-26.

The Economic Survey reports:
- CPI headline inflation declined from 5.4% (FY2023-24) to 4.6% (Apr-Dec 2024)
  to ~4.9% (FY2024-25 est.)
- Food inflation moderated significantly
- Core inflation remained subdued at ~3.5%

Source: Economic Survey 2025-26 Chapter 5
"""

import logging

logger = logging.getLogger(__name__)


def calendar_to_fiscal(cal_year: str) -> str:
    y = int(cal_year)
    return f"{y}-{str(y + 1)[-2:]}"


def build_inflation(wb_cpi_data: list[dict], survey_year: str) -> dict:
    """
    Build inflation.json from World Bank annual CPI data + Survey data points.

    CPI data from World Bank is annual (calendar year).
    We supplement with fiscal-year averages from the Survey where available.
    """
    series = []
    for point in wb_cpi_data:
        fiscal_year = calendar_to_fiscal(point["year"])
        series.append({
            "period": fiscal_year,
            "cpiHeadline": round(point["value"], 1),
            # World Bank doesn't separate food/core, so we use headline for both initially.
            # More granular data to be added when RBI DBIE integration is complete.
            "cpiFood": None,
            "cpiCore": None,
        })

    # Add Economic Survey data points that World Bank may not have yet
    fiscal_years_present = {s["period"] for s in series}

    # FY2024-25 estimate from Economic Survey: ~4.9% headline
    # Source: Economic Survey 2025-26, Chapter 5 "Inflation: Tamed and Anchored"
    if "2024-25" not in fiscal_years_present:
        series.append({
            "period": "2024-25",
            "cpiHeadline": 4.9,
            "cpiFood": 7.5,     # Food inflation avg for FY2024-25 (Survey)
            "cpiCore": 3.5,     # Core inflation estimate (Survey)
        })
        logger.info("  Added FY2024-25 inflation estimate from Economic Survey")

    # FY2025-26 from Economic Survey 2025-26 revised projection
    if "2025-26" not in fiscal_years_present:
        series.append({
            "period": "2025-26",
            "cpiHeadline": 4.0,  # Economic Survey 2025-26 revised projection (down from 4.2%)
            "cpiFood": 5.8,      # Food inflation avg (Survey)
            "cpiCore": 3.2,      # Core inflation estimate (Survey)
        })
        logger.info("  Added FY2025-26 inflation data from Economic Survey")

    series.sort(key=lambda x: x["period"])

    # Apply real food/core CPI from Economic Survey for years where WB
    # headline is present but food/core breakdown isn't available.
    # We do NOT fabricate food/core with synthetic multipliers — null means
    # "data not available" and the frontend skips those points.
    survey_food_core = {
        "2024-25": {"cpiFood": 7.5, "cpiCore": 3.5},
        "2025-26": {"cpiFood": 5.8, "cpiCore": 3.2},
    }
    for s in series:
        if s["period"] in survey_food_core:
            data = survey_food_core[s["period"]]
            if s["cpiFood"] is None:
                s["cpiFood"] = data["cpiFood"]
            if s["cpiCore"] is None:
                s["cpiCore"] = data["cpiCore"]

    return {
        "year": survey_year,
        "targetBand": {"lower": 2, "upper": 6},  # RBI's flexible inflation targeting
        "series": series,
        "source": "https://api.worldbank.org/v2/country/ind/indicator/FP.CPI.TOTL.ZG + Economic Survey 2025-26 Ch.5",
    }
