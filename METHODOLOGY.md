# Methodology

## About This Portal

Indian Data Project makes Union Budget data accessible, visual, and shareable. We take publicly available government data, process it into structured formats, and present it through interactive visualizations.

## Data Sources

### Primary Source: Open Budgets India
- **URL**: [openbudgetsindia.org](https://openbudgetsindia.org/)
- **Maintained by**: Centre for Budget and Governance Accountability (CBGA) + CivicDataLab
- **Access method**: CKAN REST API
- **Coverage**: Union Budget data from 2014-15 onwards
- **License**: Data published under open licenses

### Supplementary: India Budget Portal
- **URL**: [indiabudget.gov.in](https://www.indiabudget.gov.in/)
- **Maintained by**: Ministry of Finance, Government of India
- **Access method**: PDF and Excel document downloads
- **Note**: Official source. In case of any discrepancy between our processed data and the original documents, the official PDFs are authoritative.

### Tax Slab Data
- **Source**: Income Tax Act provisions as announced in the Union Budget
- **Assessment Year**: 2026-27 (Financial Year 2025-26)
- **Regime options**: New Tax Regime (default) and Old Tax Regime

### State-wise Transfer Data
- **Source**: Finance Commission recommendations and budget documents
- **Note**: State transfer figures are approximations based on budget allocations. Actual devolution depends on Finance Commission formulas and may differ from budget estimates.

## Data Processing

### Pipeline
1. **Fetch**: Budget data is downloaded from Open Budgets India's CKAN API
2. **Extract**: CSV/Excel files are parsed into structured tables
3. **Transform**: Ministry names are normalized, derived metrics (% of total, year-over-year change, per-capita figures) are computed
4. **Validate**: Output is checked against schemas — expenditure items must sum to the total (within 1%), percentages must sum to approximately 100%
5. **Publish**: Validated JSON is committed to the repository and auto-deployed

### Update Frequency
- Budget data updates once per year (February 1, Union Budget day)
- Revised Estimates and Actuals are incorporated when released
- The pipeline runs daily checks for corrections or updates

### Derived Metrics
- **Per capita**: Calculated using estimated 2025 population of 1,450,000,000 (based on UN World Population Prospects)
- **Year-over-year change**: Percentage change from previous year's Budget Estimate
- **"Paisa per rupee"**: Each ministry's share expressed as paisa out of every rupee of expenditure
- **Human context**: Approximate real-world equivalents to make large numbers relatable (e.g., "enough for X school meals")

## Known Limitations

1. **Budget Estimates vs. Actuals**: Most figures shown are Budget Estimates (BE), which are projections. Revised Estimates (RE) and Actual Expenditure often differ significantly.

2. **Off-budget borrowings**: Some government spending occurs through off-budget vehicles (like Food Corporation of India borrowings) that don't appear in the main budget. Our figures reflect only on-budget expenditure.

3. **State-level data**: State transfer figures are approximations. The actual devolution formula involves complex Finance Commission calculations based on income distance, area, population, forest cover, and other factors.

4. **Census data gap**: Per-capita calculations use projected population figures because the last Census was conducted in 2011. The next Census is scheduled for 2026-27.

5. **Tax calculator**: The calculator provides an estimate. Actual tax liability depends on exemptions, deductions, and specific provisions not captured here. Consult a tax professional for precise calculations.

## Map Boundaries

India state boundaries displayed on this portal follow Survey of India guidelines, showing the full extent of Jammu & Kashmir and Ladakh as integral parts of India.

## License

This portal republishes government data under the **Government Open Data License - India (GODL)**. The GODL permits free use, adaptation, and redistribution of government data with attribution.

**Required attribution**: Data sourced from Open Budgets India (openbudgetsindia.org) and the Ministry of Finance, Government of India (indiabudget.gov.in).

## Open Source

The source code for this portal, including the data pipeline and all visualization components, is open source. Contributions, corrections, and feedback are welcome.

## Contact

Found an error in the data? Have a suggestion? Open an issue on our GitHub repository.
