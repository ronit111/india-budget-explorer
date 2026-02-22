# Review: Culturally Loaded Strings for Translation

These strings appear in the UI and contain India-specific cultural references, program names, unit analogies, and contextual descriptions. They need human review before machine translation to Hindi and South Indian languages.

**Action needed**: Review each string. Flag any that need professional translation rather than machine translation. Note any that should be adapted (not literally translated) for different regional audiences.

---

## Source 1: `public/data/budget/2025-26/expenditure.json` → `ministries[].humanContext`

These appear as contextual descriptions in the Data Explorer table and tooltips.

| # | Ministry | humanContext String | Translation Notes |
|---|----------|-------------------|-------------------|
| 1 | Interest Payments | "Rs 20 per citizen per day goes to paying interest on past debt" | Currency prefix "Rs" should stay as-is or become "₹". "Per citizen per day" is straightforward. |
| 2 | Ministry of Defence | "Enough to buy 1,362 Tejas fighter jets" | "Tejas" is a brand name (stays untranslated). The analogy works across languages. |
| 3 | Ministry of Rural Development | "Covers MGNREGA, rural housing, and road construction" | "MGNREGA" is a widely known acronym in all Indian languages. "PMAY-G" and "PMGSY" appear in scheme names (sub-rows) — these are also universal acronyms. |
| 4 | Ministry of Agriculture | "PM-KISAN alone puts Rs 6,000/year in 80 million farmer accounts" | "PM-KISAN" stays as-is. "80 million" could become "8 crore" in Hindi. Currency and numbers stay Latin. |
| 5 | Ministry of Education | "About Rs 2.4 per citizen per day on education" | Straightforward. Same currency note as #1. |
| 6 | Ministry of Health | "Rs 1.72 per citizen per day on public healthcare" | Straightforward. Same currency note as #1. |
| 7 | Ministry of Railways | "India runs 13,500+ trains daily, carrying 24 million passengers" | "24 million" could become "2.4 crore" in Hindi. The fact is universally relatable. |
| 8 | Ministry of Home Affairs | "Covers police, border security, and disaster response" | Straightforward descriptive string. |
| 9 | Ministry of Road Transport | "Building 27 km of highway per day" | Straightforward. "km" is universal. |
| 10 | Transfers to States & UTs | "Nearly 1 in 4 rupees goes directly to state governments" | "Rupees" may be translated differently by region (rupiya, roopai, etc.). Consider keeping "₹" symbol instead. |
| 11 | Subsidies (Food, Fertilizer, Fuel) | "Provides subsidized food to 80 crore people under NFSA" | "80 crore" is already in Indian number system. "NFSA" is a known acronym. The food subsidy context is deeply culturally relevant — this string carries weight differently in states with higher PDS dependence (Bihar, UP, Odisha). |

---

## Source 2: `public/data/tax-calculator/expenditure-shares.json` → `shares[].humanContext`

These appear in the Tax Calculator as unit analogies: "Your ₹X,XXX goes to Defence = 167 school mid-day meals". The `humanContextMultiplier` creates the "= N [unit]" format.

| # | Category | humanContext String | Multiplier | Rendered Example | Translation Notes |
|---|----------|-------------------|-----------|-----------------|-------------------|
| 1 | State Transfers | "Funding your state's roads, schools, and hospitals" | 0 (descriptive only) | "Funding your state's roads, schools, and hospitals" | "Your state's" needs natural phrasing per language. |
| 2 | Interest Payments | "Servicing past government debt" | 0 (descriptive only) | "Servicing past government debt" | Straightforward. |
| 3 | Defence | "school mid-day meals" | 167 | "= 167 school mid-day meals" | **Culturally loaded.** Mid-day meals (MDM) is a universal Indian reference, but the program name varies by state (e.g., "Akshara Dasoha" in Karnataka, "Uzhavu" in Tamil Nadu). Consider keeping "mid-day meals" as the generic term. |
| 4 | Subsidies | "months of subsidized ration for one family" | 4 | "= 4 months of subsidized ration for one family" | **Culturally loaded.** "Ration" in Indian context means PDS (Public Distribution System) entitlement. The word carries different connotations in different languages. |
| 5 | Roads & Highways | "metres of national highway" | 0.02 | "= 0.02 metres of national highway" | Note: 0.02m = 2cm. This renders as a very small number. May want to reconsider the unit (e.g., "centimetres" instead). Translation is straightforward otherwise. |
| 6 | Railways | "train journeys (sleeper class)" | 12 | "= 12 train journeys (sleeper class)" | "Sleeper class" is universally understood in India. Could also be "second sleeper" in some regions. |
| 7 | Home Affairs | "police and border security" | 0 (descriptive only) | "police and border security" | Straightforward. |
| 8 | Rural Development | "days of MGNREGA wages" | 8 | "= 8 days of MGNREGA wages" | "MGNREGA" stays as acronym. "Wages" = daily wage in rural employment context. Deeply relatable in rural India. |
| 9 | Agriculture | "farmer PM-KISAN installments" | 3 | "= 3 farmer PM-KISAN installments" | "PM-KISAN" stays as acronym. "Installments" refers to the ₹2,000 quarterly transfers. |
| 10 | Education | "school textbooks" | 25 | "= 25 school textbooks" | Straightforward. Universal reference. |
| 11 | Health | "basic health checkups" | 5 | "= 5 basic health checkups" | Straightforward. |
| 12 | Everything Else | "science, environment, culture, and more" | 0 (descriptive only) | "science, environment, culture, and more" | Straightforward. |

---

## Strings That Need Special Attention

### High Priority (culturally loaded, review before machine translation):
- **#3 (Defence/mid-day meals)**: The analogy comparing defence spending to school meals is editorially charged. The translation should preserve the editorial tone without amplifying or softening it.
- **#4 (Subsidies/ration)**: "Ration" carries deep cultural meaning in India (PDS system, ration cards, BPL entitlements). Machine translation may not capture the correct connotation.
- **#11 from expenditure.json (Subsidies/NFSA)**: "80 crore people" — this string's impact varies enormously by state. States with higher PDS dependence (Bihar, Odisha, UP) may relate differently than Maharashtra or Gujarat.

### Medium Priority (numbers may need localization):
- **#4 and #7 from expenditure.json**: "80 million" vs "8 crore" and "24 million" vs "2.4 crore" — the Hindi version should use crore/lakh units since the Indian number system is already the convention.
- **#5 from expenditure-shares.json**: "0.02 metres" renders oddly. Consider "2 centimetres" instead.

### Low Priority (straightforward, machine translation likely sufficient):
- All strings marked "Straightforward" above
- Acronyms (MGNREGA, PM-KISAN, NFSA, PMAY-G, PMGSY) stay untranslated in all languages

---

## Decision Needed

1. Should "Rs" become "₹" universally, or stay as "Rs" in English and use the symbol in translations?
2. For Hindi: should "80 million" become "8 करोड़" (crore in Devanagari) or "8 crore" (Latin)?
3. The mid-day meals analogy (#3): keep as-is, or adapt the analogy per region?
4. The "0.02 metres of highway" (#5): fix to "2 centimetres" before translation?
