import type { TaxSlabsData, TaxRegime, TaxSlab } from './data/schema.ts';

export interface TaxBreakdown {
  grossIncome: number;
  standardDeduction: number;
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
  let remaining = taxableIncome;
  let baseTax = 0;
  const slabwiseTax: { slab: TaxSlab; taxOnSlab: number }[] = [];

  for (const slab of regime.slabs) {
    if (remaining <= 0) {
      slabwiseTax.push({ slab, taxOnSlab: 0 });
      continue;
    }

    const upper = slab.to ?? Infinity;
    const slabWidth = upper - slab.from + 1;
    const taxableInSlab = Math.min(remaining, slabWidth);
    const taxOnSlab = taxableInSlab * (slab.rate / 100);

    slabwiseTax.push({ slab, taxOnSlab });
    baseTax += taxOnSlab;
    remaining -= taxableInSlab;
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
  slabsData: TaxSlabsData
): TaxBreakdown {
  const regime = slabsData.regimes[regimeType];
  const standardDeduction = regime.standardDeduction;
  const taxableIncome = Math.max(0, grossIncome - standardDeduction);

  const { slabwiseTax, baseTax } = computeSlabTax(taxableIncome, regime);

  // Rebate under Section 87A
  const rebateApplied = taxableIncome <= regime.rebateLimit && baseTax > 0;
  const taxAfterRebate = rebateApplied ? 0 : baseTax;

  const surchargeMaxRate = regime.surchargeMaxRate ?? 37;
  const surcharge = computeSurcharge(taxableIncome, taxAfterRebate, slabsData.surchargeSlabs, surchargeMaxRate);
  const taxPlusSurcharge = taxAfterRebate + surcharge;
  const cess = taxPlusSurcharge * (slabsData.cess / 100);
  const totalTax = Math.round(taxPlusSurcharge + cess);

  const effectiveRate = grossIncome > 0 ? (totalTax / grossIncome) * 100 : 0;

  return {
    grossIncome,
    standardDeduction,
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
