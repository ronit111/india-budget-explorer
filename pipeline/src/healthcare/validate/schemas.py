"""
Pydantic models matching the TypeScript schema contract for the Healthcare domain.
"""

from pydantic import BaseModel


class TimeSeriesPoint(BaseModel):
    year: str
    value: float


class StateValue(BaseModel):
    id: str
    name: str
    value: float


class HealthcareSummary(BaseModel):
    year: str
    hospitalBedsPer1000: float
    physiciansPer1000: float
    healthExpGDP: float
    outOfPocketPct: float
    dptImmunization: float
    tbIncidence: float
    lastUpdated: str
    source: str


class StateHealthInfra(BaseModel):
    id: str
    name: str
    bedsPerLakh: float
    phcs: float
    chcs: float
    subCentres: float
    doctorsAtPHC: float
    doctorsPer10K: float


class InfrastructureData(BaseModel):
    year: str
    hospitalBedsTimeSeries: list[TimeSeriesPoint]
    physiciansTimeSeries: list[TimeSeriesPoint]
    nursesTimeSeries: list[TimeSeriesPoint]
    stateInfrastructure: list[StateHealthInfra]
    source: str


class HealthSpendingData(BaseModel):
    year: str
    healthExpGDPTimeSeries: list[TimeSeriesPoint]
    healthExpPerCapitaTimeSeries: list[TimeSeriesPoint]
    outOfPocketTimeSeries: list[TimeSeriesPoint]
    govtHealthExpTimeSeries: list[TimeSeriesPoint]
    source: str


class StateImmunization(BaseModel):
    id: str
    name: str
    fullImmunization: float
    bcg: float
    measles: float
    dpt3: float


class DiseaseData(BaseModel):
    year: str
    dptTimeSeries: list[TimeSeriesPoint]
    measlesTimeSeries: list[TimeSeriesPoint]
    tbIncidenceTimeSeries: list[TimeSeriesPoint]
    hivTimeSeries: list[TimeSeriesPoint]
    birthsAttendedTimeSeries: list[TimeSeriesPoint]
    stateImmunization: list[StateImmunization]
    source: str


class HealthcareIndicator(BaseModel):
    id: str
    name: str
    category: str
    unit: str
    states: list[StateValue]
    source: str


class HealthcareIndicatorsData(BaseModel):
    year: str
    indicators: list[HealthcareIndicator]


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
