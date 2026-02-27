"""
Transform external sector data into the ExternalData schema.

Uses World Bank trade data for historical trends + Economic Survey for latest year.

Source: Economic Survey 2025-26, Chapter 4 "External Sector"
        + RBI Balance of Payments data
        + World Bank trade indicators
"""

import logging

logger = logging.getLogger(__name__)


def calendar_to_fiscal(cal_year: str) -> str:
    y = int(cal_year)
    return f"{y}-{str(y + 1)[-2:]}"


def build_external(
    wb_exports: list[dict],
    wb_imports: list[dict],
    survey_year: str,
) -> dict:
    """
    Build external.json from World Bank trade data + Survey data.

    World Bank provides exports/imports as % of GDP.
    We supplement with absolute USD values and CAD from the Economic Survey.
    """
    # Build year-indexed lookup from WB data
    exports_by_year = {p["year"]: p["value"] for p in wb_exports}
    imports_by_year = {p["year"]: p["value"] for p in wb_imports}

    # All calendar years where we have both exports and imports
    common_years = sorted(set(exports_by_year.keys()) & set(imports_by_year.keys()))

    series = []
    for cal_year in common_years:
        y = int(cal_year)
        if y < 2018:
            continue  # Keep last ~7 years for readability

        fiscal_year = calendar_to_fiscal(cal_year)
        exp_pct = exports_by_year[cal_year]
        imp_pct = imports_by_year[cal_year]

        series.append({
            "year": fiscal_year,
            "exports": round(exp_pct, 1),      # % of GDP
            "imports": round(imp_pct, 1),       # % of GDP
            "tradeBalance": round(exp_pct - imp_pct, 1),
            # CAD and forex: not available from WB at this granularity
            # Will be filled from RBI/Survey data below
            "cadPctGDP": 0,
            "forexReserves": 0,
        })

    # Supplement with curated data from Economic Survey and RBI
    # Source: Economic Survey 2025-26 Ch.4 + RBI Annual Report
    curated_cad = {
        "2018-19": {"cadPctGDP": -2.1, "forexReserves": 413},
        "2019-20": {"cadPctGDP": -0.9, "forexReserves": 478},
        "2020-21": {"cadPctGDP": 0.9, "forexReserves": 577},   # surplus year
        "2021-22": {"cadPctGDP": -1.2, "forexReserves": 607},
        "2022-23": {"cadPctGDP": -2.0, "forexReserves": 579},
        "2023-24": {"cadPctGDP": -0.7, "forexReserves": 646},
        "2024-25": {"cadPctGDP": -1.1, "forexReserves": 658},  # RE
        "2025-26": {"cadPctGDP": -0.8, "forexReserves": 670},  # Survey est.
    }

    for entry in series:
        fy = entry["year"]
        if fy in curated_cad:
            entry["cadPctGDP"] = curated_cad[fy]["cadPctGDP"]
            entry["forexReserves"] = curated_cad[fy]["forexReserves"]

    # Ensure FY2025-26 is present
    fiscal_years_present = {s["year"] for s in series}
    if "2025-26" not in fiscal_years_present:
        series.append({
            "year": "2025-26",
            "exports": 22.5,      # % of GDP, Survey estimate
            "imports": 25.3,      # % of GDP, Survey estimate
            "tradeBalance": -2.8,
            "cadPctGDP": -0.8,
            "forexReserves": 670,  # USD billion, Survey estimate
        })
        logger.info("  Added FY2025-26 external sector data from Economic Survey")

    series.sort(key=lambda x: x["year"])

    return {
        "year": survey_year,
        "series": series,
        "source": "https://api.worldbank.org/v2/country/ind + Economic Survey 2025-26 Ch.4 + RBI BoP data",
    }
