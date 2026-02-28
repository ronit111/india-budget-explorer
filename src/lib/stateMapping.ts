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

/**
 * Complete mapping of all 28 states + 8 UTs.
 * Used by State Finances and Census domains where every state/UT has data.
 */
export const ALL_STATE_CODES: Record<string, string> = {
  // States
  AP: 'Andhra Pradesh',
  AR: 'Arunachal Pradesh',
  AS: 'Assam',
  BR: 'Bihar',
  CG: 'Chhattisgarh',
  GA: 'Goa',
  GJ: 'Gujarat',
  HR: 'Haryana',
  HP: 'Himachal Pradesh',
  JH: 'Jharkhand',
  KA: 'Karnataka',
  KL: 'Kerala',
  MP: 'Madhya Pradesh',
  MH: 'Maharashtra',
  MN: 'Manipur',
  ML: 'Meghalaya',
  MZ: 'Mizoram',
  NL: 'Nagaland',
  OR: 'Odisha',
  PB: 'Punjab',
  RJ: 'Rajasthan',
  SK: 'Sikkim',
  TN: 'Tamil Nadu',
  TS: 'Telangana',
  TR: 'Tripura',
  UP: 'Uttar Pradesh',
  UK: 'Uttarakhand',
  WB: 'West Bengal',
  // Union Territories
  AN: 'Andaman and Nicobar Islands',
  CH: 'Chandigarh',
  DN: 'Dadra and Nagar Haveli and Daman and Diu',
  DL: 'Delhi',
  JK: 'Jammu and Kashmir',
  LA: 'Ladakh',
  LD: 'Lakshadweep',
  PY: 'Puducherry',
};

/** Reverse: TopoJSON name → state code (all 36) */
export const TOPO_NAME_TO_STATE_CODE: Record<string, string> = Object.fromEntries(
  Object.entries(ALL_STATE_CODES).map(([code, name]) => [name, code])
);
