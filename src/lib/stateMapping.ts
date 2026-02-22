/**
 * Maps budget 2-letter state codes to TopoJSON state names (st_nm property).
 * Budget data uses shorthand codes; TopoJSON uses full names from Census of India.
 */
export const BUDGET_CODE_TO_TOPO_NAME: Record<string, string> = {
  UP: 'Uttar Pradesh',
  BH: 'Bihar',
  MP: 'Madhya Pradesh',
  WB: 'West Bengal',
  MH: 'Maharashtra',
  RJ: 'Rajasthan',
  TN: 'Tamil Nadu',
  KA: 'Karnataka',
  GJ: 'Gujarat',
  AP: 'Andhra Pradesh',
  OR: 'Odisha',
  TS: 'Telangana',
  KL: 'Kerala',
  JH: 'Jharkhand',
  CG: 'Chhattisgarh',
  AS: 'Assam',
  PB: 'Punjab',
  HR: 'Haryana',
  JK: 'Jammu and Kashmir',
  UK: 'Uttarakhand',
  HP: 'Himachal Pradesh',
  GA: 'Goa',
};

/** Reverse mapping: TopoJSON name → budget code */
export const TOPO_NAME_TO_BUDGET_CODE: Record<string, string> = Object.fromEntries(
  Object.entries(BUDGET_CODE_TO_TOPO_NAME).map(([code, name]) => [name, code])
);

/**
 * Northeast states that share the "NE" combined budget allocation.
 * Budget data reports them as one "Other NE States" entry.
 * The TopoJSON has each as individual geometries.
 */
export const NE_STATES = [
  'Arunachal Pradesh',
  'Manipur',
  'Meghalaya',
  'Mizoram',
  'Nagaland',
  'Tripura',
  'Sikkim',
];

/**
 * States/UTs in TopoJSON that have no direct budget data.
 * These render in neutral gray on the choropleth.
 */
export const STATES_WITHOUT_BUDGET_DATA = [
  'Andaman and Nicobar Islands',
  'Chandigarh',
  'Dadra and Nagar Haveli and Daman and Diu',
  'Delhi',
  'Lakshadweep',
  'Puducherry',
  'Ladakh',
];
