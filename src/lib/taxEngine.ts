import type { TaxSlabsData, TaxRegime, TaxSlab } from './data/schema.ts';

export interface TaxBreakdown {
  grossIncome: number;
  standardDeduction: number;
  totalDeductions: number;
  taxableIncome: number;
  slabwiseTax: { slab: TaxSlab; taxOnSlab: number }[];
  baseTax: number;
  surcharge: number;
  cess: number;
  totalTax: number;
  effectiveRate: number;
  rebateApplied: boolean;
}

function computeSlabTax(
  taxableIncome: number,
  regime: TaxRegime
): { slabwiseTax: { slab: TaxSlab; taxOnSlab: number }[]; baseTax: number } {
  let baseTax = 0;
  const slabwiseTax: { slab: TaxSlab; taxOnSlab: number }[] = [];

  for (const slab of regime.slabs) {
    const upper = slab.to ?? Infinity;
    // Slab boundaries use +1 encoding (0→400000, 400001→800000, ...).
    // Convert to continuous monetary range: effective lower = max(0, from - 1).
    const lowerBound = Math.max(0, slab.from - 1);
    const incomeInSlab = Math.max(0, Math.min(taxableIncome, upper) - lowerBound);
    const taxOnSlab = incomeInSlab * (slab.rate / 100);

    slabwiseTax.push({ slab, taxOnSlab });
    baseTax += taxOnSlab;
  }

  return { slabwiseTax, baseTax };
}

function computeSurcharge(
  taxableIncome: number,
  baseTax: number,
  surchargeSlabs: TaxSlab[],
  maxRate: number
): number {
  let rate = 0;
  for (const slab of surchargeSlabs) {
    const upper = slab.to ?? Infinity;
    if (taxableIncome >= slab.from && taxableIncome <= upper) {
      rate = Math.min(slab.rate, maxRate);
      break;
    }
  }
  return baseTax * (rate / 100);
}

export function calculateTax(
  grossIncome: number,
  regimeType: 'new' | 'old',
  slabsData: TaxSlabsData,
  totalDeductions: number = 0
): TaxBreakdown {
  const regime = slabsData.regimes[regimeType];
  const standardDeduction = regime.standardDeduction;

  // Deductions only apply to Old Regime
  const appliedDeductions = regimeType === 'old' ? totalDeductions : 0;
  const taxableIncome = Math.max(0, grossIncome - standardDeduction - appliedDeductions);

  const { slabwiseTax, baseTax } = computeSlabTax(taxableIncome, regime);

  // Rebate under Section 87A + marginal relief
  let rebateApplied = false;
  let taxAfterRebate: number;

  if (regime.rebateLimit && baseTax > 0) {
    if (taxableIncome <= regime.rebateLimit) {
      // Full rebate: income within threshold
      rebateApplied = true;
      taxAfterRebate = 0;
    } else {
      // Marginal relief: tax cannot exceed income above rebate limit
      const excess = taxableIncome - regime.rebateLimit;
      if (baseTax > excess) {
        rebateApplied = true;
        taxAfterRebate = excess;
      } else {
        taxAfterRebate = baseTax;
      }
    }
  } else {
    taxAfterRebate = baseTax;
  }

  const surchargeMaxRate = regime.surchargeMaxRate ?? 37;
  const surcharge = computeSurcharge(taxableIncome, taxAfterRebate, slabsData.surchargeSlabs, surchargeMaxRate);
  const taxPlusSurcharge = taxAfterRebate + surcharge;
  const cess = taxPlusSurcharge * (slabsData.cess / 100);
  const totalTax = Math.round(taxPlusSurcharge + cess);

  const effectiveRate = grossIncome > 0 ? (totalTax / grossIncome) * 100 : 0;

  return {
    grossIncome,
    standardDeduction,
    totalDeductions: appliedDeductions,
    taxableIncome,
    slabwiseTax,
    baseTax,
    surcharge,
    cess,
    totalTax,
    effectiveRate,
    rebateApplied,
  };
}
