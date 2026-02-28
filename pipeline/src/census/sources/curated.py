"""
Curated census and demographic data from authoritative Indian government sources.

Sources:
  - Census of India 2011: Primary Census Abstract
    https://censusindia.gov.in/census.website/data/census-tables
  - NPC Population Projections 2011-2036: Technical Group on Population Projections,
    National Commission on Population, Ministry of Health & Family Welfare (July 2020)
    https://nhm.gov.in/New_Updates_2018/Report_Population_Projection_2019.pdf
  - NFHS-5 (2019-21): National Family Health Survey State Factsheets
    https://rchiips.org/nfhs/NFHS-5Reports/NFHS-5_INDIA_REPORT.pdf
  - SRS 2022 (Sample Registration System): Registrar General of India
    https://censusindia.gov.in/nada/index.php/catalog/44457

Data notes:
  - Census 2011 state boundaries: AP shown as undivided (includes present-day Telangana).
    Telangana listed separately using Census 2011 district-level aggregation.
  - J&K shown as undivided (includes present-day Ladakh UT).
  - NPC 2026 projections use current boundaries. J&K + Ladakh combined here
    to match Census 2011 undivided J&K. DNH + DD split proportionally by
    Census 2011 population share (merged into single UT in Jan 2020).
  - NFHS-5 uses current (2019-21) state/UT boundaries.
  - SRS data uses current state boundaries. Latest available: SRS 2022.

IMPORTANT: Every number must be cross-checked against primary source documents.
This file is manually curated.
"""

DATA_YEAR = "2011"

# ── Census 2011 State Population Data ─────────────────────────────────
# Source: Census of India 2011 — Primary Census Abstract
# Each entry: id, name, population, density (per sq km), urbanPercent,
#   ruralPercent, decadalGrowth (%), sexRatio (females per 1000 males),
#   literacyTotal (%), literacyMale (%), literacyFemale (%)

CENSUS_2011_STATES = [
    {"id": "up", "name": "Uttar Pradesh", "population": 199812341, "density": 829, "urbanPercent": 22.27, "ruralPercent": 77.73, "decadalGrowth": 20.23, "sexRatio": 912, "literacyTotal": 67.68, "literacyMale": 77.28, "literacyFemale": 57.18},
    {"id": "mh", "name": "Maharashtra", "population": 112374333, "density": 365, "urbanPercent": 45.23, "ruralPercent": 54.77, "decadalGrowth": 15.99, "sexRatio": 929, "literacyTotal": 82.34, "literacyMale": 88.38, "literacyFemale": 75.87},
    {"id": "br", "name": "Bihar", "population": 104099452, "density": 1106, "urbanPercent": 11.30, "ruralPercent": 88.70, "decadalGrowth": 25.42, "sexRatio": 918, "literacyTotal": 61.80, "literacyMale": 71.20, "literacyFemale": 51.50},
    {"id": "wb", "name": "West Bengal", "population": 91276115, "density": 1028, "urbanPercent": 31.89, "ruralPercent": 68.11, "decadalGrowth": 13.84, "sexRatio": 950, "literacyTotal": 76.26, "literacyMale": 81.69, "literacyFemale": 70.54},
    {"id": "mp", "name": "Madhya Pradesh", "population": 72626809, "density": 236, "urbanPercent": 27.63, "ruralPercent": 72.37, "decadalGrowth": 20.35, "sexRatio": 931, "literacyTotal": 69.32, "literacyMale": 78.73, "literacyFemale": 59.24},
    {"id": "tn", "name": "Tamil Nadu", "population": 72147030, "density": 555, "urbanPercent": 48.45, "ruralPercent": 51.55, "decadalGrowth": 15.61, "sexRatio": 996, "literacyTotal": 80.09, "literacyMale": 86.77, "literacyFemale": 73.44},
    {"id": "rj", "name": "Rajasthan", "population": 68548437, "density": 200, "urbanPercent": 24.89, "ruralPercent": 75.11, "decadalGrowth": 21.31, "sexRatio": 928, "literacyTotal": 66.11, "literacyMale": 79.19, "literacyFemale": 52.12},
    {"id": "ka", "name": "Karnataka", "population": 61095297, "density": 319, "urbanPercent": 38.57, "ruralPercent": 61.43, "decadalGrowth": 15.60, "sexRatio": 973, "literacyTotal": 75.36, "literacyMale": 82.47, "literacyFemale": 68.08},
    {"id": "gj", "name": "Gujarat", "population": 60439692, "density": 308, "urbanPercent": 42.58, "ruralPercent": 57.42, "decadalGrowth": 19.28, "sexRatio": 919, "literacyTotal": 78.03, "literacyMale": 85.75, "literacyFemale": 69.68},
    {"id": "ap", "name": "Andhra Pradesh", "population": 49577103, "density": 308, "urbanPercent": 29.47, "ruralPercent": 70.53, "decadalGrowth": 11.10, "sexRatio": 993, "literacyTotal": 67.02, "literacyMale": 74.88, "literacyFemale": 59.15},
    {"id": "od", "name": "Odisha", "population": 41974218, "density": 270, "urbanPercent": 16.68, "ruralPercent": 83.32, "decadalGrowth": 14.05, "sexRatio": 979, "literacyTotal": 72.87, "literacyMale": 81.59, "literacyFemale": 64.01},
    {"id": "tg", "name": "Telangana", "population": 35003674, "density": 312, "urbanPercent": 38.89, "ruralPercent": 61.11, "decadalGrowth": 13.58, "sexRatio": 988, "literacyTotal": 66.46, "literacyMale": 74.95, "literacyFemale": 57.92},
    {"id": "kl", "name": "Kerala", "population": 33406061, "density": 860, "urbanPercent": 47.72, "ruralPercent": 52.28, "decadalGrowth": 4.91, "sexRatio": 1084, "literacyTotal": 93.91, "literacyMale": 96.02, "literacyFemale": 91.98},
    {"id": "jh", "name": "Jharkhand", "population": 32988134, "density": 414, "urbanPercent": 24.05, "ruralPercent": 75.95, "decadalGrowth": 22.42, "sexRatio": 948, "literacyTotal": 66.41, "literacyMale": 76.84, "literacyFemale": 55.42},
    {"id": "as", "name": "Assam", "population": 31205576, "density": 398, "urbanPercent": 14.08, "ruralPercent": 85.92, "decadalGrowth": 17.07, "sexRatio": 958, "literacyTotal": 72.19, "literacyMale": 77.85, "literacyFemale": 66.27},
    {"id": "pb", "name": "Punjab", "population": 27743338, "density": 551, "urbanPercent": 37.49, "ruralPercent": 62.51, "decadalGrowth": 13.89, "sexRatio": 895, "literacyTotal": 75.84, "literacyMale": 80.44, "literacyFemale": 70.73},
    {"id": "ct", "name": "Chhattisgarh", "population": 25545198, "density": 189, "urbanPercent": 23.24, "ruralPercent": 76.76, "decadalGrowth": 22.61, "sexRatio": 991, "literacyTotal": 70.28, "literacyMale": 80.27, "literacyFemale": 60.24},
    {"id": "hr", "name": "Haryana", "population": 25351462, "density": 573, "urbanPercent": 34.79, "ruralPercent": 65.21, "decadalGrowth": 19.90, "sexRatio": 879, "literacyTotal": 75.55, "literacyMale": 84.06, "literacyFemale": 65.94},
    {"id": "jk", "name": "Jammu & Kashmir", "population": 12541302, "density": 56, "urbanPercent": 27.21, "ruralPercent": 72.79, "decadalGrowth": 23.64, "sexRatio": 889, "literacyTotal": 67.16, "literacyMale": 76.75, "literacyFemale": 56.43},
    {"id": "uk", "name": "Uttarakhand", "population": 10086292, "density": 189, "urbanPercent": 30.55, "ruralPercent": 69.45, "decadalGrowth": 18.81, "sexRatio": 963, "literacyTotal": 78.82, "literacyMale": 87.40, "literacyFemale": 70.01},
    {"id": "hp", "name": "Himachal Pradesh", "population": 6864602, "density": 123, "urbanPercent": 10.04, "ruralPercent": 89.96, "decadalGrowth": 12.94, "sexRatio": 972, "literacyTotal": 82.80, "literacyMale": 89.53, "literacyFemale": 75.93},
    {"id": "tr", "name": "Tripura", "population": 3673917, "density": 350, "urbanPercent": 26.18, "ruralPercent": 73.82, "decadalGrowth": 14.84, "sexRatio": 960, "literacyTotal": 87.22, "literacyMale": 91.53, "literacyFemale": 82.73},
    {"id": "ml", "name": "Meghalaya", "population": 2966889, "density": 132, "urbanPercent": 20.08, "ruralPercent": 79.92, "decadalGrowth": 27.95, "sexRatio": 989, "literacyTotal": 74.43, "literacyMale": 76.00, "literacyFemale": 72.89},
    {"id": "mn", "name": "Manipur", "population": 2855794, "density": 128, "urbanPercent": 32.45, "ruralPercent": 67.55, "decadalGrowth": 18.65, "sexRatio": 985, "literacyTotal": 79.85, "literacyMale": 86.49, "literacyFemale": 73.17},
    {"id": "nl", "name": "Nagaland", "population": 1978502, "density": 119, "urbanPercent": 28.97, "ruralPercent": 71.03, "decadalGrowth": -0.58, "sexRatio": 931, "literacyTotal": 79.55, "literacyMale": 82.75, "literacyFemale": 76.11},
    {"id": "ga", "name": "Goa", "population": 1458545, "density": 394, "urbanPercent": 62.17, "ruralPercent": 37.83, "decadalGrowth": 8.23, "sexRatio": 973, "literacyTotal": 88.70, "literacyMale": 92.65, "literacyFemale": 84.66},
    {"id": "ar", "name": "Arunachal Pradesh", "population": 1383727, "density": 17, "urbanPercent": 22.67, "ruralPercent": 77.33, "decadalGrowth": 26.03, "sexRatio": 938, "literacyTotal": 65.38, "literacyMale": 72.55, "literacyFemale": 57.70},
    {"id": "mz", "name": "Mizoram", "population": 1097206, "density": 52, "urbanPercent": 52.11, "ruralPercent": 47.89, "decadalGrowth": 23.48, "sexRatio": 976, "literacyTotal": 91.33, "literacyMale": 93.35, "literacyFemale": 89.27},
    {"id": "sk", "name": "Sikkim", "population": 610577, "density": 86, "urbanPercent": 24.97, "ruralPercent": 75.03, "decadalGrowth": 12.89, "sexRatio": 890, "literacyTotal": 81.42, "literacyMale": 86.55, "literacyFemale": 75.61},
    # Union Territories
    {"id": "dl", "name": "Delhi", "population": 16787941, "density": 11320, "urbanPercent": 97.50, "ruralPercent": 2.50, "decadalGrowth": 21.21, "sexRatio": 868, "literacyTotal": 86.21, "literacyMale": 90.94, "literacyFemale": 80.76},
    {"id": "py", "name": "Puducherry", "population": 1247953, "density": 2598, "urbanPercent": 68.31, "ruralPercent": 31.69, "decadalGrowth": 28.08, "sexRatio": 1037, "literacyTotal": 85.85, "literacyMale": 91.26, "literacyFemale": 80.67},
    {"id": "ch", "name": "Chandigarh", "population": 1055450, "density": 9258, "urbanPercent": 97.25, "ruralPercent": 2.75, "decadalGrowth": 17.19, "sexRatio": 818, "literacyTotal": 86.05, "literacyMale": 90.54, "literacyFemale": 81.38},
    {"id": "an", "name": "Andaman & Nicobar", "population": 380581, "density": 46, "urbanPercent": 37.70, "ruralPercent": 62.30, "decadalGrowth": 6.86, "sexRatio": 876, "literacyTotal": 86.27, "literacyMale": 90.11, "literacyFemale": 81.84},
    {"id": "dn", "name": "Dadra & Nagar Haveli", "population": 343709, "density": 700, "urbanPercent": 46.72, "ruralPercent": 53.28, "decadalGrowth": 55.88, "sexRatio": 774, "literacyTotal": 76.24, "literacyMale": 85.17, "literacyFemale": 64.32},
    {"id": "dd", "name": "Daman & Diu", "population": 243247, "density": 2169, "urbanPercent": 75.16, "ruralPercent": 24.84, "decadalGrowth": 53.76, "sexRatio": 618, "literacyTotal": 87.07, "literacyMale": 91.48, "literacyFemale": 79.59},
    {"id": "ld", "name": "Lakshadweep", "population": 64473, "density": 2013, "urbanPercent": 78.07, "ruralPercent": 21.93, "decadalGrowth": 6.30, "sexRatio": 946, "literacyTotal": 91.85, "literacyMale": 95.56, "literacyFemale": 87.95},
]


# ── NPC 2026 State Population Projections ────────────────────────────
# Source: "Population Projections for India and States 2011-2036"
# Technical Group on Population Projections, National Commission on Population,
# Ministry of Health & Family Welfare, Government of India (July 2020)
# https://nhm.gov.in/New_Updates_2018/Report_Population_Projection_2019.pdf
#
# Projected total population as of 1 July 2026.
# J&K + Ladakh combined (13,927,000 + 306,000) to match undivided J&K in Census 2011.
# DNH and DD split from merged NPC figure (1,593,000) by Census 2011 population share:
#   DNH: 343,709/586,956 = 58.6% → 933,000; DD: 243,247/586,956 = 41.4% → 660,000

NPC_2026_PROJECTIONS = [
    {"id": "up", "name": "Uttar Pradesh", "population": 243466000},
    {"id": "br", "name": "Bihar", "population": 132850000},
    {"id": "mh", "name": "Maharashtra", "population": 129584000},
    {"id": "wb", "name": "West Bengal", "population": 100631000},
    {"id": "mp", "name": "Madhya Pradesh", "population": 89965000},
    {"id": "rj", "name": "Rajasthan", "population": 83879000},
    {"id": "tn", "name": "Tamil Nadu", "population": 77582000},
    {"id": "gj", "name": "Gujarat", "population": 74343000},
    {"id": "ka", "name": "Karnataka", "population": 69074000},
    {"id": "ap", "name": "Andhra Pradesh", "population": 53740000},
    {"id": "od", "name": "Odisha", "population": 47221000},
    {"id": "jh", "name": "Jharkhand", "population": 41108000},
    {"id": "tg", "name": "Telangana", "population": 38665000},
    {"id": "as", "name": "Assam", "population": 36815000},
    {"id": "kl", "name": "Kerala", "population": 36239000},
    {"id": "hr", "name": "Haryana", "population": 31409000},
    {"id": "pb", "name": "Punjab", "population": 31370000},
    {"id": "ct", "name": "Chhattisgarh", "population": 31311000},
    {"id": "dl", "name": "Delhi", "population": 22674000},
    {"id": "jk", "name": "Jammu & Kashmir", "population": 14233000},
    {"id": "uk", "name": "Uttarakhand", "population": 12028000},
    {"id": "hp", "name": "Himachal Pradesh", "population": 7588000},
    {"id": "tr", "name": "Tripura", "population": 4268000},
    {"id": "ml", "name": "Meghalaya", "population": 3447000},
    {"id": "mn", "name": "Manipur", "population": 3318000},
    {"id": "nl", "name": "Nagaland", "population": 2299000},
    {"id": "ar", "name": "Arunachal Pradesh", "population": 1608000},
    {"id": "py", "name": "Puducherry", "population": 1771000},
    {"id": "ga", "name": "Goa", "population": 1601000},
    {"id": "dn", "name": "Dadra & Nagar Haveli", "population": 933000},
    {"id": "mz", "name": "Mizoram", "population": 1275000},
    {"id": "ch", "name": "Chandigarh", "population": 1270000},
    {"id": "sk", "name": "Sikkim", "population": 709000},
    {"id": "dd", "name": "Daman & Diu", "population": 660000},
    {"id": "an", "name": "Andaman & Nicobar", "population": 406000},
    {"id": "ld", "name": "Lakshadweep", "population": 70000},
]


# ── NFHS-5 (2019-21) State Health Data ───────────────────────────────
# Source: NFHS-5 India Report and State Factsheets
# https://rchiips.org/nfhs/NFHS-5Reports/NFHS-5_INDIA_REPORT.pdf
#
# Fields:
#   tfr: Total Fertility Rate
#   imr: Infant Mortality Rate (per 1000 live births)
#   under5mr: Under-5 Mortality Rate (per 1000 live births)
#   stunting: % of children under 5 who are stunted (height-for-age)
#   wasting: % of children under 5 who are wasted (weight-for-height)
#   fullImmunization: % of children 12-23 months fully immunized

NFHS5_STATE_HEALTH = [
    {"id": "up", "name": "Uttar Pradesh", "tfr": 2.4, "imr": 50.4, "under5mr": 59.8, "stunting": 39.7, "wasting": 17.3, "fullImmunization": 69.6},
    {"id": "mh", "name": "Maharashtra", "tfr": 1.7, "imr": 23.2, "under5mr": 28.0, "stunting": 35.2, "wasting": 25.6, "fullImmunization": 73.5},
    {"id": "br", "name": "Bihar", "tfr": 3.0, "imr": 46.8, "under5mr": 56.4, "stunting": 42.9, "wasting": 22.9, "fullImmunization": 71.0},
    {"id": "wb", "name": "West Bengal", "tfr": 1.6, "imr": 22.0, "under5mr": 25.4, "stunting": 33.8, "wasting": 20.3, "fullImmunization": 87.8},
    {"id": "mp", "name": "Madhya Pradesh", "tfr": 2.0, "imr": 41.3, "under5mr": 49.2, "stunting": 35.7, "wasting": 19.0, "fullImmunization": 77.1},
    {"id": "tn", "name": "Tamil Nadu", "tfr": 1.8, "imr": 18.6, "under5mr": 22.3, "stunting": 25.0, "wasting": 14.6, "fullImmunization": 89.2},
    {"id": "rj", "name": "Rajasthan", "tfr": 2.0, "imr": 30.3, "under5mr": 37.6, "stunting": 31.8, "wasting": 16.8, "fullImmunization": 80.4},
    {"id": "ka", "name": "Karnataka", "tfr": 1.7, "imr": 25.4, "under5mr": 29.5, "stunting": 35.4, "wasting": 19.5, "fullImmunization": 84.1},
    {"id": "gj", "name": "Gujarat", "tfr": 1.9, "imr": 31.2, "under5mr": 37.6, "stunting": 39.0, "wasting": 25.1, "fullImmunization": 76.3},
    {"id": "ap", "name": "Andhra Pradesh", "tfr": 1.7, "imr": 30.3, "under5mr": 35.2, "stunting": 31.2, "wasting": 16.1, "fullImmunization": 73.0},
    {"id": "od", "name": "Odisha", "tfr": 1.8, "imr": 36.3, "under5mr": 41.1, "stunting": 31.0, "wasting": 18.1, "fullImmunization": 90.5},
    {"id": "tg", "name": "Telangana", "tfr": 1.8, "imr": 26.4, "under5mr": 29.4, "stunting": 33.1, "wasting": 21.7, "fullImmunization": 79.1},
    {"id": "kl", "name": "Kerala", "tfr": 1.8, "imr": 4.4, "under5mr": 5.2, "stunting": 23.4, "wasting": 15.8, "fullImmunization": 77.8},
    {"id": "jh", "name": "Jharkhand", "tfr": 2.3, "imr": 37.9, "under5mr": 45.4, "stunting": 39.6, "wasting": 22.4, "fullImmunization": 73.9},
    {"id": "as", "name": "Assam", "tfr": 1.9, "imr": 31.9, "under5mr": 39.1, "stunting": 35.3, "wasting": 21.7, "fullImmunization": 66.4},
    {"id": "pb", "name": "Punjab", "tfr": 1.6, "imr": 28.0, "under5mr": 32.7, "stunting": 24.5, "wasting": 10.6, "fullImmunization": 76.2},
    {"id": "ct", "name": "Chhattisgarh", "tfr": 1.8, "imr": 44.3, "under5mr": 50.4, "stunting": 34.6, "wasting": 18.9, "fullImmunization": 79.7},
    {"id": "hr", "name": "Haryana", "tfr": 1.9, "imr": 33.3, "under5mr": 38.7, "stunting": 27.5, "wasting": 11.5, "fullImmunization": 76.9},
    {"id": "jk", "name": "Jammu & Kashmir", "tfr": 1.4, "imr": 16.3, "under5mr": 18.5, "stunting": 26.9, "wasting": 19.0, "fullImmunization": 86.2},
    {"id": "uk", "name": "Uttarakhand", "tfr": 1.9, "imr": 39.1, "under5mr": 45.6, "stunting": 27.0, "wasting": 13.2, "fullImmunization": 80.8},
    {"id": "hp", "name": "Himachal Pradesh", "tfr": 1.7, "imr": 25.6, "under5mr": 28.9, "stunting": 30.8, "wasting": 17.4, "fullImmunization": 89.3},
    {"id": "dl", "name": "Delhi", "tfr": 1.6, "imr": 24.5, "under5mr": 30.6, "stunting": 30.9, "wasting": 11.2, "fullImmunization": 76.0},
    {"id": "ga", "name": "Goa", "tfr": 1.3, "imr": 5.6, "under5mr": 10.6, "stunting": 25.8, "wasting": 19.1, "fullImmunization": 81.9},
]


# ── SRS 2022 State IMR ───────────────────────────────────────────────
# Source: Sample Registration System Statistical Report 2022
# Registrar General of India (latest available with state breakdown)
# IMR = Infant Mortality Rate per 1000 live births

SRS_STATE_IMR = [
    {"id": "mp", "name": "Madhya Pradesh", "value": 35},
    {"id": "up", "name": "Uttar Pradesh", "value": 33},
    {"id": "ct", "name": "Chhattisgarh", "value": 32},
    {"id": "od", "name": "Odisha", "value": 30},
    {"id": "as", "name": "Assam", "value": 30},
    {"id": "rj", "name": "Rajasthan", "value": 29},
    {"id": "br", "name": "Bihar", "value": 27},
    {"id": "jh", "name": "Jharkhand", "value": 25},
    {"id": "hr", "name": "Haryana", "value": 24},
    {"id": "gj", "name": "Gujarat", "value": 23},
    {"id": "ap", "name": "Andhra Pradesh", "value": 21},
    {"id": "wb", "name": "West Bengal", "value": 19},
    {"id": "uk", "name": "Uttarakhand", "value": 19},
    {"id": "pb", "name": "Punjab", "value": 18},
    {"id": "tg", "name": "Telangana", "value": 17},
    {"id": "mh", "name": "Maharashtra", "value": 15},
    {"id": "ka", "name": "Karnataka", "value": 15},
    {"id": "jk", "name": "Jammu & Kashmir", "value": 14},
    {"id": "hp", "name": "Himachal Pradesh", "value": 14},
    {"id": "tn", "name": "Tamil Nadu", "value": 12},
    {"id": "dl", "name": "Delhi", "value": 11},
    {"id": "kl", "name": "Kerala", "value": 5},
]
