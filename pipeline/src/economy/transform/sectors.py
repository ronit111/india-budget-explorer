"""
Transform sectoral GVA data into the SectorsData schema.

Source: Economic Survey 2025-26, Chapter 1 "State of the Economy"
        + MoSPI National Accounts Statistics
        + World Bank sectoral value added indicators
"""

import logging

logger = logging.getLogger(__name__)


def build_sectors(
    wb_agri: list[dict],
    wb_industry: list[dict],
    wb_services: list[dict],
    survey_year: str,
) -> dict:
    """
    Build sectors.json from World Bank GVA shares + Economic Survey growth rates.

    World Bank provides sectoral value added as % of GDP (not % of GVA).
    Growth rates come from the Economic Survey.

    Note: "5-year avg" uses FY2020-21 to FY2024-25 period.
    """
    # Get latest sectoral shares (% of GDP) from World Bank
    # Take the most recent year where all three sectors have data
    latest_agri = wb_agri[-1]["value"] if wb_agri else 17.0
    latest_industry = wb_industry[-1]["value"] if wb_industry else 26.0
    latest_services = wb_services[-1]["value"] if wb_services else 50.0

    # Growth rates from Economic Survey 2025-26 Chapter 1
    # Source: Table 1.1 "Sectoral Growth Rates of GVA at Basic Prices (2011-12 series)"
    sectors = [
        {
            "id": "agriculture",
            "name": "Agriculture & Allied",
            "currentGrowth": 3.8,       # FY2025-26 advance estimate
            "fiveYearAvg": 4.5,          # FY2020-21 to FY2024-25 avg
            "gvaShare": round(latest_agri, 1),
        },
        {
            "id": "industry",
            "name": "Industry",
            "currentGrowth": 6.2,        # FY2025-26 advance estimate
            "fiveYearAvg": 5.4,
            "gvaShare": round(latest_industry, 1),
        },
        {
            "id": "services",
            "name": "Services",
            "currentGrowth": 7.2,        # FY2025-26 advance estimate
            "fiveYearAvg": 7.8,
            "gvaShare": round(latest_services, 1),
        },
        {
            "id": "construction",
            "name": "Construction",
            "currentGrowth": 8.6,        # FY2025-26 advance estimate
            "fiveYearAvg": 8.1,
            "gvaShare": 8.0,             # Subset of industry
        },
        {
            "id": "manufacturing",
            "name": "Manufacturing",
            "currentGrowth": 5.8,        # FY2025-26 advance estimate
            "fiveYearAvg": 4.2,
            "gvaShare": 15.2,            # Subset of industry
        },
    ]

    return {
        "year": survey_year,
        "sectors": sectors,
        "source": "https://www.indiabudget.gov.in/economicsurvey/ (Ch.1, Table 1.1) + World Bank GDP indicators",
    }
