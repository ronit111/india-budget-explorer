"""
Pydantic models matching the TypeScript schema contract for the RBI domain.
Used to validate pipeline output before writing JSON.
"""

from pydantic import BaseModel


# ─── Shared ──────────────────────────────────────────────────────────────

class TimeSeriesPoint(BaseModel):
    year: str
    value: float
    label: str | None = None


class SeriesWithMeta(BaseModel):
    """A time series with unit and source metadata."""
    series: list[TimeSeriesPoint]
    unit: str
    source: str


# ─── RBI Summary ─────────────────────────────────────────────────────────

class RBISummary(BaseModel):
    year: str
    repoRate: float
    repoRateDate: str
    stance: str
    crr: float
    slr: float
    cpiLatest: float | None = None
    forexReservesUSD: float | None = None
    broadMoneyGrowth: float | None = None
    lastUpdated: str
    source: str


# ─── Monetary Policy ─────────────────────────────────────────────────────

class MPCDecision(BaseModel):
    date: str
    rate: float
    change: float
    stance: str


class CRRPoint(BaseModel):
    year: str
    value: float


class MonetaryPolicyData(BaseModel):
    year: str
    currentRate: float
    currentStance: str
    decisions: list[MPCDecision]
    crrHistory: list[CRRPoint]
    source: str


# ─── Liquidity ───────────────────────────────────────────────────────────

class LiquidityData(BaseModel):
    year: str
    broadMoneyGrowth: SeriesWithMeta
    broadMoneyPctGDP: SeriesWithMeta


# ─── Credit ──────────────────────────────────────────────────────────────

class CreditData(BaseModel):
    year: str
    domesticCreditPctGDP: SeriesWithMeta
    privateCreditPctGDP: SeriesWithMeta
    lendingRate: SeriesWithMeta
    depositRate: SeriesWithMeta


# ─── Forex ───────────────────────────────────────────────────────────────

class ForexData(BaseModel):
    year: str
    reservesUSD: SeriesWithMeta
    exchangeRate: SeriesWithMeta


# ─── Indicators (Explorer) ──────────────────────────────────────────────

class RBIIndicator(BaseModel):
    id: str
    name: str
    category: str
    unit: str
    series: list[TimeSeriesPoint]
    source: str


class RBIIndicatorsData(BaseModel):
    year: str
    indicators: list[RBIIndicator]
