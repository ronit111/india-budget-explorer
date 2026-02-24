import type { TaxSlabsData, TaxRegime, TaxSlab, DeductionDetail, OldRegimeDeductions } from './data/schema.ts';

export interface TaxBreakdown {
  grossIncome: number;
  standardDeduction: number;
  deductions: DeductionDetail[];
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

const DEDUCTION_CAPS: { key: keyof OldRegimeDeductions; section: string; label: string; cap: number | null }[] = [
  { key: 'section80C', section: '80C', label: 'Investments & Savings', cap: 150000 },
  { key: 'section80D_self', section: '80D', label: 'Health Insurance (Self)', cap: 25000 },
  { key: 'section80D_parents', section: '80D', label: 'Health Insurance (Parents)', cap: 25000 },
  { key: 'section80CCD1B', section: '80CCD(1B)', label: 'NPS (Additional)', cap: 50000 },
  { key: 'section24b', section: '24(b)', label: 'Home Loan Interest', cap: 200000 },
  { key: 'hra', section: 'HRA', label: 'House Rent Allowance', cap: null },
  { key: 'section80TTA', section: '80TTA', label: 'Savings Interest', cap: 10000 },
];

function computeDeductions(deductions: OldRegimeDeductions): { details: DeductionDetail[]; total: number } {
  const details: DeductionDetail[] = [];
  let total = 0;

  for (const { key, section, label, cap } of DEDUCTION_CAPS) {
    const claimed = deductions[key];
    if (claimed <= 0) continue;
    const allowed = cap !== null ? Math.min(claimed, cap) : claimed;
    details.push({ section, label, claimed, allowed });
    total += allowed;
  }

  return { details, total };
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
  slabsData: TaxSlabsData,
  deductions?: OldRegimeDeductions
): TaxBreakdown {
  const regime = slabsData.regimes[regimeType];
  const standardDeduction = regime.standardDeduction;

  // Compute deductions (only for Old Regime)
  const { details: deductionDetails, total: totalDeductions } =
    regimeType === 'old' && deductions
      ? computeDeductions(deductions)
      : { details: [] as DeductionDetail[], total: 0 };

  const taxableIncome = Math.max(0, grossIncome - standardDeduction - totalDeductions);

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
    deductions: deductionDetails,
    totalDeductions,
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
