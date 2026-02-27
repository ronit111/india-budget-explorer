"""
Transform fiscal data into the FiscalData schema.

Fiscal deficit data comes primarily from the Economic Survey Statistical Appendix
and Budget at a Glance documents. World Bank has limited fiscal data for India.

Source: Economic Survey 2025-26, Chapter 2 "Fiscal Developments"
        + Budget at a Glance, indiabudget.gov.in
"""

import logging

logger = logging.getLogger(__name__)


def build_fiscal(survey_year: str) -> dict:
    """
    Build fiscal.json from curated Economic Survey / Budget data.

    All values are from official Budget documents and the Economic Survey 2025-26.
    Source: Table 2.1 of Statistical Appendix + Budget at a Glance (various years)

    Note: Revenue deficit and primary deficit for FY2025-26 are Budget Estimates.
    Earlier years use Revised/Actual figures where available.
    """
    series = [
        {
            "year": "2019-20",
            "fiscalDeficitPctGDP": 4.6,
            "revenueDeficitPctGDP": 3.3,
            "primaryDeficitPctGDP": 1.6,
        },
        {
            "year": "2020-21",
            "fiscalDeficitPctGDP": 9.2,  # COVID year
            "revenueDeficitPctGDP": 7.3,
            "primaryDeficitPctGDP": 5.7,
        },
        {
            "year": "2021-22",
            "fiscalDeficitPctGDP": 6.7,
            "revenueDeficitPctGDP": 4.4,
            "primaryDeficitPctGDP": 3.3,
        },
        {
            "year": "2022-23",
            "fiscalDeficitPctGDP": 6.4,
            "revenueDeficitPctGDP": 3.9,
            "primaryDeficitPctGDP": 2.8,
        },
        {
            "year": "2023-24",
            "fiscalDeficitPctGDP": 5.6,
            "revenueDeficitPctGDP": 2.6,
            "primaryDeficitPctGDP": 2.0,
        },
        {
            "year": "2024-25",
            "fiscalDeficitPctGDP": 4.8,  # Revised Estimate
            "revenueDeficitPctGDP": 1.8,
            "primaryDeficitPctGDP": 1.3,
        },
        {
            "year": "2025-26",
            "fiscalDeficitPctGDP": 4.4,  # Budget Estimate
            "revenueDeficitPctGDP": 1.5,
            "primaryDeficitPctGDP": 0.8,
        },
    ]

    return {
        "year": survey_year,
        "targetFiscalDeficit": 3.0,  # FRBM Act target
        "series": series,
        "source": "https://www.indiabudget.gov.in/economicsurvey/ (Ch.2) + Budget at a Glance",
    }
