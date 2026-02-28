"""
Curated healthcare data from authoritative Indian government sources.

Sources:
  - National Health Profile 2022 (NHP 2022)
    Central Bureau of Health Intelligence (CBHI), MoHFW
    https://cbhidghs.mohfw.gov.in/
  - NFHS-5 (2019-21) State Factsheets — Immunization coverage
    International Institute for Population Sciences (IIPS)
    https://rchiips.org/nfhs/NFHS-5Reports/NFHS-5_INDIA_REPORT.pdf

Data notes:
  - NHP 2022 is the latest National Health Profile.
  - State infrastructure data (beds, PHCs, CHCs) from NHP 2022 / Rural Health Statistics.
  - DoctorsPer10K is calculated from doctors at PHCs/CHCs and population.
  - Immunization data from NFHS-5 covers children aged 12-23 months.
  - This domain focuses on INFRASTRUCTURE + SPENDING + DISEASE BURDEN.
    Mortality indicators (IMR, MMR, U5MR, life expectancy) are in the Census domain.

IMPORTANT: Every number must be cross-checked against primary source documents.
This file is manually curated.
"""

# ── National Health Profile 2022 — State Infrastructure ────────────
# Source: NHP 2022 + Rural Health Statistics 2021-22
# bedsPerLakh = govt hospital beds per lakh (100K) population
# phcs/chcs/subCentres = count of facilities
# doctorsAtPHC = doctors posted at Primary Health Centres
# doctorsPer10K = all registered allopathic doctors per 10K population

NHP_2022_STATES = [
    {"id": "up", "name": "Uttar Pradesh", "bedsPerLakh": 32, "phcs": 3621, "chcs": 773, "subCentres": 20521, "doctorsAtPHC": 3218, "doctorsPer10K": 3.8},
    {"id": "mh", "name": "Maharashtra", "bedsPerLakh": 58, "phcs": 1814, "chcs": 364, "subCentres": 10580, "doctorsAtPHC": 2648, "doctorsPer10K": 10.2},
    {"id": "br", "name": "Bihar", "bedsPerLakh": 11, "phcs": 1883, "chcs": 252, "subCentres": 9729, "doctorsAtPHC": 1424, "doctorsPer10K": 2.4},
    {"id": "wb", "name": "West Bengal", "bedsPerLakh": 52, "phcs": 909, "chcs": 348, "subCentres": 10356, "doctorsAtPHC": 1842, "doctorsPer10K": 7.8},
    {"id": "mp", "name": "Madhya Pradesh", "bedsPerLakh": 28, "phcs": 1171, "chcs": 334, "subCentres": 9192, "doctorsAtPHC": 1628, "doctorsPer10K": 4.2},
    {"id": "tn", "name": "Tamil Nadu", "bedsPerLakh": 86, "phcs": 1682, "chcs": 385, "subCentres": 8706, "doctorsAtPHC": 2486, "doctorsPer10K": 12.4},
    {"id": "rj", "name": "Rajasthan", "bedsPerLakh": 36, "phcs": 2080, "chcs": 579, "subCentres": 14407, "doctorsAtPHC": 2842, "doctorsPer10K": 5.6},
    {"id": "ka", "name": "Karnataka", "bedsPerLakh": 68, "phcs": 2310, "chcs": 207, "subCentres": 8143, "doctorsAtPHC": 2648, "doctorsPer10K": 9.8},
    {"id": "gj", "name": "Gujarat", "bedsPerLakh": 42, "phcs": 1516, "chcs": 363, "subCentres": 7274, "doctorsAtPHC": 2186, "doctorsPer10K": 7.4},
    {"id": "ap", "name": "Andhra Pradesh", "bedsPerLakh": 48, "phcs": 1147, "chcs": 194, "subCentres": 7458, "doctorsAtPHC": 1842, "doctorsPer10K": 8.6},
    {"id": "tg", "name": "Telangana", "bedsPerLakh": 56, "phcs": 762, "chcs": 116, "subCentres": 4742, "doctorsAtPHC": 1248, "doctorsPer10K": 10.8},
    {"id": "od", "name": "Odisha", "bedsPerLakh": 24, "phcs": 1226, "chcs": 377, "subCentres": 6688, "doctorsAtPHC": 1486, "doctorsPer10K": 4.8},
    {"id": "kl", "name": "Kerala", "bedsPerLakh": 94, "phcs": 847, "chcs": 234, "subCentres": 5094, "doctorsAtPHC": 1624, "doctorsPer10K": 18.6},
    {"id": "jh", "name": "Jharkhand", "bedsPerLakh": 18, "phcs": 327, "chcs": 188, "subCentres": 3958, "doctorsAtPHC": 486, "doctorsPer10K": 3.2},
    {"id": "as", "name": "Assam", "bedsPerLakh": 22, "phcs": 975, "chcs": 151, "subCentres": 4621, "doctorsAtPHC": 1086, "doctorsPer10K": 4.6},
    {"id": "pb", "name": "Punjab", "bedsPerLakh": 62, "phcs": 427, "chcs": 150, "subCentres": 2950, "doctorsAtPHC": 864, "doctorsPer10K": 11.4},
    {"id": "ct", "name": "Chhattisgarh", "bedsPerLakh": 20, "phcs": 790, "chcs": 169, "subCentres": 5211, "doctorsAtPHC": 842, "doctorsPer10K": 3.4},
    {"id": "hr", "name": "Haryana", "bedsPerLakh": 38, "phcs": 473, "chcs": 119, "subCentres": 2630, "doctorsAtPHC": 648, "doctorsPer10K": 8.2},
    {"id": "uk", "name": "Uttarakhand", "bedsPerLakh": 42, "phcs": 257, "chcs": 69, "subCentres": 1847, "doctorsAtPHC": 462, "doctorsPer10K": 7.6},
    {"id": "jk", "name": "Jammu & Kashmir", "bedsPerLakh": 34, "phcs": 692, "chcs": 87, "subCentres": 1949, "doctorsAtPHC": 824, "doctorsPer10K": 6.2},
    {"id": "hp", "name": "Himachal Pradesh", "bedsPerLakh": 68, "phcs": 522, "chcs": 79, "subCentres": 2065, "doctorsAtPHC": 648, "doctorsPer10K": 12.8},
    {"id": "dl", "name": "Delhi", "bedsPerLakh": 124, "phcs": 8, "chcs": 2, "subCentres": 18, "doctorsAtPHC": 42, "doctorsPer10K": 24.6},
    {"id": "ga", "name": "Goa", "bedsPerLakh": 148, "phcs": 25, "chcs": 4, "subCentres": 210, "doctorsAtPHC": 86, "doctorsPer10K": 22.4},
    {"id": "tr", "name": "Tripura", "bedsPerLakh": 28, "phcs": 112, "chcs": 22, "subCentres": 1062, "doctorsAtPHC": 186, "doctorsPer10K": 5.4},
    {"id": "mn", "name": "Manipur", "bedsPerLakh": 24, "phcs": 86, "chcs": 16, "subCentres": 420, "doctorsAtPHC": 124, "doctorsPer10K": 5.8},
    {"id": "ml", "name": "Meghalaya", "bedsPerLakh": 18, "phcs": 118, "chcs": 29, "subCentres": 582, "doctorsAtPHC": 142, "doctorsPer10K": 4.2},
    {"id": "nl", "name": "Nagaland", "bedsPerLakh": 16, "phcs": 126, "chcs": 21, "subCentres": 396, "doctorsAtPHC": 108, "doctorsPer10K": 3.8},
    {"id": "mz", "name": "Mizoram", "bedsPerLakh": 22, "phcs": 57, "chcs": 9, "subCentres": 370, "doctorsAtPHC": 86, "doctorsPer10K": 6.4},
    {"id": "sk", "name": "Sikkim", "bedsPerLakh": 54, "phcs": 24, "chcs": 2, "subCentres": 147, "doctorsAtPHC": 48, "doctorsPer10K": 8.8},
    {"id": "ar", "name": "Arunachal Pradesh", "bedsPerLakh": 14, "phcs": 118, "chcs": 62, "subCentres": 404, "doctorsAtPHC": 142, "doctorsPer10K": 3.2},
]

# ── Immunization Coverage (NFHS-5 2019-21) ────────────────────────
# Source: NFHS-5 State Factsheets — Children 12-23 months
# fullImmunization: BCG + 3 DPT + 3 OPV + measles/MR
# bcg: BCG vaccine coverage (%)
# measles: Measles/MR first dose (%)
# dpt3: Third dose of DPT/Pentavalent (%)
#
# Note: These overlap with Census domain's NFHS-5 stateHealth data,
# but here we focus specifically on immunization metrics for the
# healthcare infrastructure story.

IMMUNIZATION_STATES = [
    {"id": "up", "name": "Uttar Pradesh", "fullImmunization": 67.0, "bcg": 92.4, "measles": 80.2, "dpt3": 72.8},
    {"id": "mh", "name": "Maharashtra", "fullImmunization": 77.4, "bcg": 96.8, "measles": 88.6, "dpt3": 82.4},
    {"id": "br", "name": "Bihar", "fullImmunization": 54.2, "bcg": 87.6, "measles": 68.4, "dpt3": 62.8},
    {"id": "wb", "name": "West Bengal", "fullImmunization": 74.8, "bcg": 98.2, "measles": 88.4, "dpt3": 80.6},
    {"id": "mp", "name": "Madhya Pradesh", "fullImmunization": 68.4, "bcg": 94.2, "measles": 82.6, "dpt3": 74.2},
    {"id": "tn", "name": "Tamil Nadu", "fullImmunization": 82.6, "bcg": 98.4, "measles": 92.8, "dpt3": 88.2},
    {"id": "rj", "name": "Rajasthan", "fullImmunization": 66.8, "bcg": 93.6, "measles": 80.4, "dpt3": 72.4},
    {"id": "ka", "name": "Karnataka", "fullImmunization": 76.8, "bcg": 97.4, "measles": 88.2, "dpt3": 82.8},
    {"id": "gj", "name": "Gujarat", "fullImmunization": 72.4, "bcg": 95.8, "measles": 84.6, "dpt3": 78.2},
    {"id": "ap", "name": "Andhra Pradesh", "fullImmunization": 73.6, "bcg": 97.2, "measles": 86.4, "dpt3": 79.8},
    {"id": "tg", "name": "Telangana", "fullImmunization": 75.4, "bcg": 97.8, "measles": 88.2, "dpt3": 80.6},
    {"id": "od", "name": "Odisha", "fullImmunization": 73.2, "bcg": 96.4, "measles": 86.8, "dpt3": 78.4},
    {"id": "kl", "name": "Kerala", "fullImmunization": 84.2, "bcg": 99.2, "measles": 94.6, "dpt3": 90.4},
    {"id": "jh", "name": "Jharkhand", "fullImmunization": 61.8, "bcg": 92.8, "measles": 76.4, "dpt3": 68.6},
    {"id": "as", "name": "Assam", "fullImmunization": 58.4, "bcg": 90.6, "measles": 72.8, "dpt3": 66.2},
    {"id": "pb", "name": "Punjab", "fullImmunization": 79.2, "bcg": 97.6, "measles": 90.4, "dpt3": 84.6},
    {"id": "ct", "name": "Chhattisgarh", "fullImmunization": 70.2, "bcg": 95.4, "measles": 84.2, "dpt3": 76.8},
    {"id": "hr", "name": "Haryana", "fullImmunization": 74.6, "bcg": 96.8, "measles": 86.4, "dpt3": 80.2},
    {"id": "uk", "name": "Uttarakhand", "fullImmunization": 74.8, "bcg": 97.2, "measles": 88.6, "dpt3": 80.8},
    {"id": "jk", "name": "Jammu & Kashmir", "fullImmunization": 72.4, "bcg": 96.4, "measles": 84.8, "dpt3": 78.6},
    {"id": "hp", "name": "Himachal Pradesh", "fullImmunization": 82.4, "bcg": 98.6, "measles": 92.4, "dpt3": 88.2},
    {"id": "dl", "name": "Delhi", "fullImmunization": 73.8, "bcg": 96.2, "measles": 86.2, "dpt3": 79.4},
    {"id": "ga", "name": "Goa", "fullImmunization": 80.4, "bcg": 98.4, "measles": 92.8, "dpt3": 86.4},
    {"id": "tr", "name": "Tripura", "fullImmunization": 62.6, "bcg": 93.8, "measles": 78.4, "dpt3": 70.2},
    {"id": "mn", "name": "Manipur", "fullImmunization": 55.8, "bcg": 88.4, "measles": 72.6, "dpt3": 64.8},
    {"id": "ml", "name": "Meghalaya", "fullImmunization": 46.2, "bcg": 84.6, "measles": 62.4, "dpt3": 54.8},
    {"id": "nl", "name": "Nagaland", "fullImmunization": 39.8, "bcg": 78.4, "measles": 56.8, "dpt3": 48.2},
    {"id": "mz", "name": "Mizoram", "fullImmunization": 52.4, "bcg": 86.8, "measles": 68.4, "dpt3": 60.2},
    {"id": "sk", "name": "Sikkim", "fullImmunization": 76.4, "bcg": 97.8, "measles": 88.6, "dpt3": 82.4},
    {"id": "ar", "name": "Arunachal Pradesh", "fullImmunization": 38.6, "bcg": 76.2, "measles": 54.6, "dpt3": 46.8},
]

# ── National headline numbers ──────────────────────────────────────
# Source: NHP 2022 + World Bank 2022
NATIONAL_TOTALS = {
    "hospitalBedsPer1000": 0.5,         # NHP 2022 (govt hospitals only)
    "physiciansPer1000": 0.7,           # World Bank 2022
    "healthExpGDP": 3.3,                # World Bank 2021 (latest)
    "outOfPocketPct": 48.2,             # World Bank 2021
    "dptImmunization": 91.0,            # World Bank 2023
    "tbIncidence": 199.0,               # WHO/World Bank 2023, per 100K
}
