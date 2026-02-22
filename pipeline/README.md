# India Budget Data Pipeline

Fetches, transforms, and validates Union Budget 2025-26 data, producing JSON files consumed by the React frontend.

## Setup

```bash
cd pipeline
pip install -e ".[dev]"
```

## Run the Pipeline

```bash
python src/main.py
```

This will:
1. Attempt to fetch data from Open Budgets India (CKAN API)
2. Fall back to curated 2025-26 budget data if the API is unavailable
3. Transform data into visualization-ready structures (Sankey, treemap, etc.)
4. Validate all output against Pydantic schemas
5. Write JSON files to `../public/data/`

## Output Files

| File | Description |
|------|-------------|
| `budget/2025-26/summary.json` | Top-level budget numbers |
| `budget/2025-26/receipts.json` | Revenue/receipt categories |
| `budget/2025-26/expenditure.json` | Ministry-wise expenditure |
| `budget/2025-26/sankey.json` | Sankey diagram nodes & links |
| `budget/2025-26/treemap.json` | Treemap hierarchy |
| `budget/2025-26/statewise.json` | State-wise transfers |
| `budget/2025-26/schemes.json` | Government schemes |
| `tax-calculator/slabs.json` | Income tax slabs (new & old regime) |
| `tax-calculator/expenditure-shares.json` | How tax money is spent |
| `years.json` | Available budget years |

## Run Tests

```bash
pytest tests/ -v
```

## Architecture

```
src/
├── main.py              # Orchestrates all stages
├── sources/             # Data fetching (CKAN API)
├── extract/             # CSV/Excel parsing + curated data
├── transform/           # Normalization, metrics, Sankey, treemap
├── validate/            # Pydantic models matching TypeScript schema
└── publish/             # JSON file writer
```
