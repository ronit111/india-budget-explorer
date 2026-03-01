"""
Pydantic models matching the TypeScript schema contract for the Environment domain.
"""

from typing import Optional
from pydantic import BaseModel


class TimeSeriesPoint(BaseModel):
    year: str
    value: float


class StateValue(BaseModel):
    id: str
    name: str
    value: float


# ─── Summary ───────────────────────────────────────────────────────

class EnvironmentSummary(BaseModel):
    year: str
    co2PerCapita: float
    forestPct: float
    renewablesPct: float
    pm25: float
    coalPct: float
    ghgTotal: float
    lastUpdated: str
    source: str


# ─── Air Quality ───────────────────────────────────────────────────

class StateAQIEntry(BaseModel):
    id: str
    name: str
    aqi: float
    category: str


class CityAQIEntry(BaseModel):
    city: str
    state: str
    aqi: float


class AirQualityData(BaseModel):
    year: str
    pm25TimeSeries: list[TimeSeriesPoint]
    stateAQI: list[StateAQIEntry]
    cityAQI: list[CityAQIEntry]
    source: str


# ─── Forest ────────────────────────────────────────────────────────

class StateForestEntry(BaseModel):
    id: str
    name: str
    forestCoverKm2: float
    pctGeographicArea: float
    changeKm2: float


class ForestData(BaseModel):
    year: str
    forestPctTimeSeries: list[TimeSeriesPoint]
    forestKm2TimeSeries: list[TimeSeriesPoint]
    protectedAreasPct: list[TimeSeriesPoint]
    stateForestCover: list[StateForestEntry]
    source: str


# ─── Energy ────────────────────────────────────────────────────────

class FuelCapacityEntry(BaseModel):
    year: str
    coal: float
    gas: float
    nuclear: float
    hydro: float
    solar: float
    wind: float
    biomass: float
    smallHydro: float


class EnergyData(BaseModel):
    year: str
    renewablesPctTimeSeries: list[TimeSeriesPoint]
    renewableElecTimeSeries: list[TimeSeriesPoint]
    coalElecTimeSeries: list[TimeSeriesPoint]
    energyUsePerCapitaTimeSeries: list[TimeSeriesPoint]
    co2PerCapitaTimeSeries: list[TimeSeriesPoint]
    co2TotalTimeSeries: list[TimeSeriesPoint]
    ghgTotalTimeSeries: list[TimeSeriesPoint]
    fuelCapacityMix: list[FuelCapacityEntry]
    source: str


# ─── Water ─────────────────────────────────────────────────────────

class ReservoirEntry(BaseModel):
    region: str
    storagePct: float
    reservoirCount: int
    capacityBCM: float


class StateGroundwaterEntry(BaseModel):
    id: str
    name: str
    stagePct: float
    stage: str


class WaterData(BaseModel):
    year: str
    reservoirStorage: list[ReservoirEntry]
    groundwaterStage: list[StateGroundwaterEntry]
    source: str


# ─── Indicators (Explorer) ────────────────────────────────────────

class EnvironmentIndicator(BaseModel):
    id: str
    name: str
    category: str
    unit: str
    states: list[StateValue]
    source: str


class EnvironmentIndicatorsData(BaseModel):
    year: str
    indicators: list[EnvironmentIndicator]


# ─── Glossary ──────────────────────────────────────────────────────

class GlossaryTerm(BaseModel):
    id: str
    term: str
    simple: str
    detail: str
    inContext: Optional[str] = None
    relatedTerms: Optional[list[str]] = None


class GlossaryData(BaseModel):
    domain: str
    year: str
    terms: list[GlossaryTerm]
