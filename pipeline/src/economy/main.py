"""
Economic Survey Data Pipeline — main entry point.

Stages:
  1. FETCH   — World Bank API + curated Survey data
  2. TRANSFORM — Build output schemas from raw data
  3. VALIDATE — Pydantic model checks
  4. PUBLISH — Write JSON to public/data/economy/
"""

import logging
import sys
from datetime import date
from pathlib import Path

# Set up path so we can import our modules
sys.path.insert(0, str(Path(__file__).resolve().parent.parent.parent))

from src.economy.sources.world_bank import fetch_multiple
from src.economy.transform.gdp import build_gdp_growth
from src.economy.transform.inflation import build_inflation
from src.economy.transform.fiscal import build_fiscal
from src.economy.transform.external import build_external
from src.economy.transform.sectors import build_sectors
from src.economy.validate.schemas import (
    EconomicIndicator,
    EconomySummary,
    ExternalData,
    FiscalData,
    GDPGrowthData,
    IndicatorsData,
    InflationData,
    SectorsData,
    TimeSeriesPoint,
)
from src.publish.writer import publish_all

logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s [%(levelname)s] %(name)s: %(message)s",
)
logger = logging.getLogger("economy-pipeline")

SURVEY_YEAR = "2025-26"
SOURCE_URL = "https://www.indiabudget.gov.in/economicsurvey/"
POPULATION = 1_460_000_000  # 2025 estimate (UN WPP 2024 revision: ~146 crore)


def run_economy_pipeline():
    logger.info("=" * 60)
    logger.info(f"Economic Survey Pipeline — {SURVEY_YEAR}")
    logger.info("=" * 60)

    # ── Stage 1: FETCH ──────────────────────────────────────────
    logger.info("Stage 1: FETCH from World Bank API")
    wb_data = fetch_multiple(
        [
            "gdp_growth",
            "inflation_cpi",
            "exports_pct_gdp",
            "imports_pct_gdp",
            "agri_va_pct_gdp",
            "industry_va_pct_gdp",
            "services_va_pct_gdp",
            "current_account_pct_gdp",
            "population",
            "gdp_current_usd",
        ],
        start_year=2014,
        end_year=2025,
    )

    for key, data in wb_data.items():
        logger.info(f"  {key}: {len(data)} data points")

    # ── Stage 2: TRANSFORM ──────────────────────────────────────
    logger.info("Stage 2: TRANSFORM")

    # 2a. GDP Growth
    gdp_growth_data = build_gdp_growth(wb_data.get("gdp_growth", []), SURVEY_YEAR)
    logger.info(f"  gdp-growth.json: {len(gdp_growth_data['series'])} data points")

    # 2b. Inflation
    inflation_data = build_inflation(wb_data.get("inflation_cpi", []), SURVEY_YEAR)
    logger.info(f"  inflation.json: {len(inflation_data['series'])} data points")

    # 2c. Fiscal (curated from Survey/Budget documents)
    fiscal_data = build_fiscal(SURVEY_YEAR)
    logger.info(f"  fiscal.json: {len(fiscal_data['series'])} data points")

    # 2d. External Sector
    external_data = build_external(
        wb_data.get("exports_pct_gdp", []),
        wb_data.get("imports_pct_gdp", []),
        SURVEY_YEAR,
    )
    logger.info(f"  external.json: {len(external_data['series'])} data points")

    # 2e. Sectors
    sectors_data = build_sectors(
        wb_data.get("agri_va_pct_gdp", []),
        wb_data.get("industry_va_pct_gdp", []),
        wb_data.get("services_va_pct_gdp", []),
        SURVEY_YEAR,
    )
    logger.info(f"  sectors.json: {len(sectors_data['sectors'])} sectors")

    # 2f. Summary (hub page card)
    # Get latest population from WB or use estimate
    pop_data = wb_data.get("population", [])
    population = int(pop_data[-1]["value"]) if pop_data else POPULATION

    gdp_usd = wb_data.get("gdp_current_usd", [])
    nominal_gdp_usd = gdp_usd[-1]["value"] if gdp_usd else 3_900_000_000_000  # ~$3.9T

    # Rs crore: GDP at current prices from Budget documents
    # Source: Economic Survey 2025-26 statistical appendix
    nominal_gdp_rs_crore = 35_698_000  # Rs 356.98 lakh crore

    summary_data = {
        "year": SURVEY_YEAR,
        "surveyDate": "2026-01-29",
        "realGDPGrowth": 6.5,  # Provisional Estimate for FY2024-25 (May 2025, supersedes 6.4% FAE)
        "nominalGDP": nominal_gdp_rs_crore,
        "projectedGrowthLow": 7.4,
        "projectedGrowthHigh": 7.4,  # NSO First Advance Estimate for FY2025-26 (Jan 2026), corroborated by RBI Feb 2026
        "cpiInflation": 4.0,  # Economic Survey 2025-26 revised projection (down from 4.2%)
        "fiscalDeficitPercentGDP": 4.4,
        "currentAccountDeficitPercentGDP": -0.8,  # H1 FY2025-26 (Apr-Sep); full year est. ~1.1%
        "population": population,
        "perCapitaGDP": round(nominal_gdp_rs_crore * 1e7 / population),  # Rs per person
        "lastUpdated": date.today().isoformat(),
        "source": SOURCE_URL,
    }
    logger.info("  summary.json: built from Survey + World Bank data")

    # 2g. Indicators (comprehensive collection for explorer page)
    indicators = _build_indicators(wb_data, gdp_growth_data, inflation_data, fiscal_data)
    indicators_data = {
        "year": SURVEY_YEAR,
        "indicators": indicators,
    }
    logger.info(f"  indicators.json: {len(indicators)} indicators")

    # ── Stage 3: VALIDATE ──────────────────────────────────────
    logger.info("Stage 3: VALIDATE")
    errors = []

    validations = [
        ("summary.json", EconomySummary, summary_data),
        ("gdp-growth.json", GDPGrowthData, gdp_growth_data),
        ("inflation.json", InflationData, inflation_data),
        ("fiscal.json", FiscalData, fiscal_data),
        ("external.json", ExternalData, external_data),
        ("sectors.json", SectorsData, sectors_data),
        ("indicators.json", IndicatorsData, indicators_data),
    ]

    for name, model, data in validations:
        try:
            model(**data)
            logger.info(f"  {name} ✓")
        except Exception as e:
            errors.append(f"{name}: {e}")
            logger.error(f"  {name} FAILED: {e}")

    if errors:
        logger.error(f"Validation failed with {len(errors)} error(s):")
        for err in errors:
            logger.error(f"  - {err}")
        sys.exit(1)

    # ── Stage 4: PUBLISH ──────────────────────────────────────
    logger.info("Stage 4: PUBLISH")
    outputs = {
        f"economy/{SURVEY_YEAR}/summary.json": summary_data,
        f"economy/{SURVEY_YEAR}/gdp-growth.json": gdp_growth_data,
        f"economy/{SURVEY_YEAR}/inflation.json": inflation_data,
        f"economy/{SURVEY_YEAR}/fiscal.json": fiscal_data,
        f"economy/{SURVEY_YEAR}/external.json": external_data,
        f"economy/{SURVEY_YEAR}/sectors.json": sectors_data,
        f"economy/{SURVEY_YEAR}/indicators.json": indicators_data,
    }

    paths = publish_all(outputs)
    logger.info(f"Published {len(paths)} files")

    logger.info("=" * 60)
    logger.info("Economy pipeline complete!")
    logger.info("=" * 60)


def _build_indicators(
    wb_data: dict,
    gdp_growth: dict,
    inflation: dict,
    fiscal: dict,
) -> list[dict]:
    """Build the comprehensive indicators collection for the Explorer page."""
    indicators = []

    # GDP Growth (from our own transform, which includes the latest Survey estimate)
    indicators.append({
        "id": "gdp-growth",
        "name": "Real GDP Growth Rate",
        "category": "growth",
        "unit": "percent",
        "series": gdp_growth["series"],
        "source": gdp_growth["source"],
    })

    # CPI Inflation
    indicators.append({
        "id": "cpi-inflation",
        "name": "CPI Inflation (Annual Average)",
        "category": "prices",
        "unit": "percent",
        "series": [{"year": s["period"], "value": s["cpiHeadline"]} for s in inflation["series"]],
        "source": inflation["source"],
    })

    # Fiscal deficit
    indicators.append({
        "id": "fiscal-deficit",
        "name": "Fiscal Deficit (% of GDP)",
        "category": "fiscal",
        "unit": "percent",
        "series": [{"year": s["year"], "value": s["fiscalDeficitPctGDP"]} for s in fiscal["series"]],
        "source": fiscal["source"],
    })

    # Revenue deficit
    indicators.append({
        "id": "revenue-deficit",
        "name": "Revenue Deficit (% of GDP)",
        "category": "fiscal",
        "unit": "percent",
        "series": [{"year": s["year"], "value": s["revenueDeficitPctGDP"]} for s in fiscal["series"]],
        "source": fiscal["source"],
    })

    # World Bank indicators - convert calendar years to fiscal years
    wb_indicator_configs = [
        ("exports-pct-gdp", "Exports (% of GDP)", "external", "percent", "exports_pct_gdp"),
        ("imports-pct-gdp", "Imports (% of GDP)", "external", "percent", "imports_pct_gdp"),
        ("agri-va-pct-gdp", "Agriculture Value Added (% of GDP)", "growth", "percent", "agri_va_pct_gdp"),
        ("industry-va-pct-gdp", "Industry Value Added (% of GDP)", "growth", "percent", "industry_va_pct_gdp"),
        ("services-va-pct-gdp", "Services Value Added (% of GDP)", "growth", "percent", "services_va_pct_gdp"),
    ]

    for ind_id, name, category, unit, wb_key in wb_indicator_configs:
        raw = wb_data.get(wb_key, [])
        if not raw:
            continue
        from src.economy.transform.gdp import calendar_to_fiscal
        series = [
            {"year": calendar_to_fiscal(p["year"]), "value": round(p["value"], 1)}
            for p in raw
        ]
        indicators.append({
            "id": ind_id,
            "name": name,
            "category": category,
            "unit": unit,
            "series": series,
            "source": f"https://api.worldbank.org/v2/country/ind/indicator (World Bank)",
        })

    return indicators


if __name__ == "__main__":
    run_economy_pipeline()
