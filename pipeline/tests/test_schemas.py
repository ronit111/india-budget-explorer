"""
Validate pipeline output JSON files against Pydantic models.
Run after the pipeline has produced output files.
"""

import json
from pathlib import Path

import pytest

# Add pipeline src to path
import sys
sys.path.insert(0, str(Path(__file__).parent.parent))

from src.validate.schemas import (
    BudgetSummary,
    ExpenditureData,
    ExpenditureSharesData,
    ReceiptsData,
    SankeyData,
    SchemesData,
    StatewiseData,
    TreemapData,
    YearIndex,
)

DATA_DIR = Path(__file__).parent.parent.parent / "public" / "data"
BUDGET_DIR = DATA_DIR / "budget" / "2025-26"
TAX_DIR = DATA_DIR / "tax-calculator"


def load_json(path: Path) -> dict:
    with open(path) as f:
        return json.load(f)


class TestBudgetSummary:
    def test_validates(self):
        data = load_json(BUDGET_DIR / "summary.json")
        summary = BudgetSummary(**data)
        assert summary.year == "2025-26"
        assert summary.totalExpenditure > 0
        assert summary.population == 1_450_000_000

    def test_per_capita_reasonable(self):
        data = load_json(BUDGET_DIR / "summary.json")
        summary = BudgetSummary(**data)
        # Per capita should be in the tens of thousands
        assert 10_000 < summary.perCapitaExpenditure < 100_000
        assert 10 < summary.perCapitaDailyExpenditure < 500


class TestReceipts:
    def test_validates(self):
        data = load_json(BUDGET_DIR / "receipts.json")
        receipts = ReceiptsData(**data)
        assert len(receipts.categories) > 0

    def test_percentages_sum(self):
        data = load_json(BUDGET_DIR / "receipts.json")
        total_pct = sum(c["percentOfTotal"] for c in data["categories"])
        # Percentages may exceed 100 since borrowings is included alongside tax receipts
        assert total_pct > 50  # sanity check


class TestExpenditure:
    def test_validates(self):
        data = load_json(BUDGET_DIR / "expenditure.json")
        exp = ExpenditureData(**data)
        assert len(exp.ministries) > 0

    def test_no_negative_amounts(self):
        data = load_json(BUDGET_DIR / "expenditure.json")
        for m in data["ministries"]:
            assert m["budgetEstimate"] >= 0
            assert m["perCapita"] >= 0

    def test_ministries_sum_reasonable(self):
        data = load_json(BUDGET_DIR / "expenditure.json")
        total = data["total"]
        ministry_sum = sum(m["budgetEstimate"] for m in data["ministries"])
        # Named ministries should cover at least 80% of total
        assert ministry_sum / total > 0.80


class TestSankey:
    def test_validates(self):
        data = load_json(BUDGET_DIR / "sankey.json")
        sankey = SankeyData(**data)
        assert len(sankey.nodes) > 0
        assert len(sankey.links) > 0

    def test_has_center_node(self):
        data = load_json(BUDGET_DIR / "sankey.json")
        center_nodes = [n for n in data["nodes"] if n["group"] == "center"]
        assert len(center_nodes) == 1

    def test_links_reference_valid_nodes(self):
        data = load_json(BUDGET_DIR / "sankey.json")
        node_ids = {n["id"] for n in data["nodes"]}
        for link in data["links"]:
            assert link["source"] in node_ids
            assert link["target"] in node_ids


class TestTreemap:
    def test_validates(self):
        data = load_json(BUDGET_DIR / "treemap.json")
        treemap = TreemapData(**data)
        assert treemap.root.id == "root"
        assert len(treemap.root.children) > 0


class TestStatewise:
    def test_validates(self):
        data = load_json(BUDGET_DIR / "statewise.json")
        sw = StatewiseData(**data)
        assert len(sw.states) > 0

    def test_transfers_sum(self):
        data = load_json(BUDGET_DIR / "statewise.json")
        state_sum = sum(s["transfer"] for s in data["states"])
        assert abs(state_sum - data["totalTransfers"]) / data["totalTransfers"] < 0.02


class TestSchemes:
    def test_validates(self):
        data = load_json(BUDGET_DIR / "schemes.json")
        schemes = SchemesData(**data)
        assert len(schemes.schemes) > 0

    def test_all_have_human_context(self):
        data = load_json(BUDGET_DIR / "schemes.json")
        for s in data["schemes"]:
            assert len(s["humanContext"]) > 10


class TestTaxSlabs:
    def test_file_exists(self):
        assert (TAX_DIR / "slabs.json").exists()

    def test_has_both_regimes(self):
        data = load_json(TAX_DIR / "slabs.json")
        assert "new" in data["regimes"]
        assert "old" in data["regimes"]

    def test_new_regime_slabs(self):
        data = load_json(TAX_DIR / "slabs.json")
        slabs = data["regimes"]["new"]["slabs"]
        assert len(slabs) == 7
        assert slabs[0]["rate"] == 0
        assert slabs[-1]["to"] is None


class TestExpenditureShares:
    def test_validates(self):
        data = load_json(TAX_DIR / "expenditure-shares.json")
        shares = ExpenditureSharesData(**data)
        assert len(shares.shares) > 0

    def test_percentages_sum(self):
        data = load_json(TAX_DIR / "expenditure-shares.json")
        total = sum(s["percentOfExpenditure"] for s in data["shares"])
        assert abs(total - 100) < 5  # within 5%


class TestYearsIndex:
    def test_validates(self):
        data = load_json(DATA_DIR / "years.json")
        idx = YearIndex(**data)
        assert idx.latest == "2025-26"
        assert "2025-26" in idx.years
