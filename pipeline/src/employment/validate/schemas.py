"""
Pydantic models matching the TypeScript schema contract for the Employment domain.
Used to validate pipeline output before writing JSON.
"""

from pydantic import BaseModel


class TimeSeriesPoint(BaseModel):
    year: str
    value: float


class StateValue(BaseModel):
    id: str
    name: str
    value: float


class EmploymentSummary(BaseModel):
    year: str
    unemploymentRate: float
    lfpr: float
    youthUnemployment: float
    femaleLfpr: float
    workforceTotal: float
    selfEmployedPct: float
    lastUpdated: str
    source: str


class UnemploymentData(BaseModel):
    year: str
    totalTimeSeries: list[TimeSeriesPoint]
    youthTimeSeries: list[TimeSeriesPoint]
    femaleTimeSeries: list[TimeSeriesPoint]
    maleTimeSeries: list[TimeSeriesPoint]
    stateUnemployment: list[StateValue]
    source: str


class ParticipationData(BaseModel):
    year: str
    lfprTotalTimeSeries: list[TimeSeriesPoint]
    lfprMaleTimeSeries: list[TimeSeriesPoint]
    lfprFemaleTimeSeries: list[TimeSeriesPoint]
    empPopRatioTimeSeries: list[TimeSeriesPoint]
    stateLfpr: list[StateValue]
    source: str


class SectoralEntry(BaseModel):
    id: str
    name: str
    employmentShare: float


class SectoralData(BaseModel):
    year: str
    agricultureTimeSeries: list[TimeSeriesPoint]
    industryTimeSeries: list[TimeSeriesPoint]
    servicesTimeSeries: list[TimeSeriesPoint]
    selfEmployedTimeSeries: list[TimeSeriesPoint]
    vulnerableTimeSeries: list[TimeSeriesPoint]
    currentSectors: list[SectoralEntry]
    source: str


class EmploymentIndicator(BaseModel):
    id: str
    name: str
    category: str
    unit: str
    states: list[StateValue]
    source: str


class EmploymentIndicatorsData(BaseModel):
    year: str
    indicators: list[EmploymentIndicator]


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
