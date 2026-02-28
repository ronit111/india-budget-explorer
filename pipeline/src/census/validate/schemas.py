"""
Pydantic models matching the TypeScript schema contract for the Census & Demographics domain.
Used to validate pipeline output before writing JSON.
"""

from pydantic import BaseModel


# ─── Shared ────────────────────────────────────────────────────────

class TimeSeriesPoint(BaseModel):
    year: str
    value: float


class StateValue(BaseModel):
    id: str
    name: str
    value: float


# ─── Census Summary ───────────────────────────────────────────────

class TopPopulousState(BaseModel):
    name: str
    population: float


class CensusSummary(BaseModel):
    year: str
    totalPopulation: float
    populationGrowthRate: float
    literacyRate: float
    urbanizationRate: float
    sexRatio: float
    topPopulousStates: list[TopPopulousState]
    lastUpdated: str
    source: str


# ─── Population ──────────────────────────────────────────────────

class StatePopulation(BaseModel):
    id: str
    name: str
    population: float
    density: float
    urbanPercent: float
    ruralPercent: float
    decadalGrowth: float


class PopulationData(BaseModel):
    year: str
    nationalTimeSeries: list[TimeSeriesPoint]
    growthTimeSeries: list[TimeSeriesPoint]
    states: list[StatePopulation]
    source: str


# ─── Literacy ────────────────────────────────────────────────────

class StateLiteracy(BaseModel):
    id: str
    name: str
    overallRate: float
    maleRate: float
    femaleRate: float
    genderGap: float


class LiteracyData(BaseModel):
    year: str
    totalTimeSeries: list[TimeSeriesPoint]
    maleTimeSeries: list[TimeSeriesPoint]
    femaleTimeSeries: list[TimeSeriesPoint]
    states: list[StateLiteracy]
    source: str


# ─── Demographics ────────────────────────────────────────────────

class AgeStructure(BaseModel):
    young: list[TimeSeriesPoint]
    working: list[TimeSeriesPoint]
    elderly: list[TimeSeriesPoint]


class VitalStats(BaseModel):
    birthRate: list[TimeSeriesPoint]
    deathRate: list[TimeSeriesPoint]
    fertilityRate: list[TimeSeriesPoint]
    lifeExpectancy: list[TimeSeriesPoint]
    lifeExpectancyMale: list[TimeSeriesPoint]
    lifeExpectancyFemale: list[TimeSeriesPoint]


class StateDemographics(BaseModel):
    id: str
    name: str
    sexRatio: float
    urbanizationRate: float
    growthRate: float


class DemographicsData(BaseModel):
    year: str
    ageStructure: AgeStructure
    dependencyRatio: list[TimeSeriesPoint]
    vitalStats: VitalStats
    urbanization: list[TimeSeriesPoint]
    states: list[StateDemographics]
    source: str


# ─── Health ──────────────────────────────────────────────────────

class StateHealthEntry(BaseModel):
    id: str
    name: str
    value: float


class StateNfhsEntry(BaseModel):
    id: str
    name: str
    tfr: float
    imr: float
    under5mr: float
    stunting: float
    wasting: float
    fullImmunization: float


class HealthData(BaseModel):
    year: str
    imrNational: list[TimeSeriesPoint]
    mmr: list[TimeSeriesPoint]
    under5: list[TimeSeriesPoint]
    lifeExpectancy: list[TimeSeriesPoint]
    fertilityRate: list[TimeSeriesPoint]
    stateImr: list[StateHealthEntry]
    stateHealth: list[StateNfhsEntry]
    source: str


# ─── Census Indicators (Explorer) ────────────────────────────────

class CensusIndicator(BaseModel):
    id: str
    name: str
    category: str
    unit: str
    states: list[StateValue]
    source: str


class CensusIndicatorsData(BaseModel):
    year: str
    indicators: list[CensusIndicator]


# ─── Glossary ────────────────────────────────────────────────────

class GlossaryTerm(BaseModel):
    id: str
    term: str
    simple: str
    detail: str
    inContext: str | None = None
    relatedTerms: list[str] | None = None


class GlossaryData(BaseModel):
    domain: str
    year: str
    terms: list[GlossaryTerm]
