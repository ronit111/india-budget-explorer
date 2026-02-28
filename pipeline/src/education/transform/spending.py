"""
Transform World Bank education spending data into spending.json.
"""

import logging

logger = logging.getLogger(__name__)


def build_spending(wb_data: dict, year: str) -> dict:
    """
    Build spending.json matching the SpendingData TypeScript interface.
    """
    logger.info(f"  Spending: {len(wb_data.get('edu_spend_gdp', []))} GDP% points, {len(wb_data.get('out_of_school', []))} out-of-school points")

    return {
        "year": year,
        "spendGDPTimeSeries": wb_data.get("edu_spend_gdp", []),
        "spendGovtTimeSeries": wb_data.get("edu_spend_govt", []),
        "outOfSchoolTimeSeries": wb_data.get("out_of_school", []),
        "source": "World Bank Development Indicators",
    }
