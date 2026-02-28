"""
Transform World Bank health expenditure data into spending.json.
"""

import logging

logger = logging.getLogger(__name__)


def build_health_spending(wb_data: dict, year: str) -> dict:
    logger.info(f"  Health Spending: {len(wb_data.get('health_exp_gdp', []))} GDP% points, {len(wb_data.get('oop_health', []))} OOP points")

    return {
        "year": year,
        "healthExpGDPTimeSeries": wb_data.get("health_exp_gdp", []),
        "healthExpPerCapitaTimeSeries": wb_data.get("health_exp_pc", []),
        "outOfPocketTimeSeries": wb_data.get("oop_health", []),
        "govtHealthExpTimeSeries": wb_data.get("govt_health_exp", []),
        "source": "World Bank Development Indicators",
    }
