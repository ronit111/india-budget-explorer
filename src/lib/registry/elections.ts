import { registerChart } from '../chartRegistry.ts';
import type { TurnoutData, ResultsData, CandidatesData, RepresentationData } from '../data/schema.ts';

const DOMAIN = 'elections';
const ACCENT = '#6366F1';
const YEAR = '2025-26';
const base = `/data/elections/${YEAR}`;

registerChart({
  domain: DOMAIN,
  sectionId: 'turnout',
  title: 'Voter Turnout — 1957 to 2024',
  source: 'Election Commission of India',
  accentColor: ACCENT,
  dataFiles: [`${base}/turnout.json`],
  chartType: 'line',
  toTabular: (data) => {
    const d = data as TurnoutData;
    return {
      headers: ['Year', 'Turnout (%)', 'Electors (Crore)', 'Lok Sabha #'],
      rows: d.nationalTrend.map((t) => [t.year, t.turnout, t.electors, t.lsNumber]),
    };
  },
  heroStat: (data) => {
    const d = data as TurnoutData;
    const latest = d.nationalTrend[d.nationalTrend.length - 1];
    if (!latest) return null;
    return {
      label: 'Turnout 2024',
      value: `${latest.turnout}%`,
      context: `${latest.electors} crore voters were eligible. 64 crore voted.`,
    };
  },
});

registerChart({
  domain: DOMAIN,
  sectionId: 'party-landscape',
  title: 'Party Landscape — Seat Evolution 1957–2024',
  source: 'ECI + TCPD Lok Dhaba',
  accentColor: ACCENT,
  dataFiles: [`${base}/results.json`],
  chartType: 'area',
  toTabular: (data) => {
    const d = data as ResultsData;
    if (d.seatEvolution.length === 0) return { headers: [], rows: [] };
    const headers = ['Year', ...d.seatEvolution.map((s) => s.name)];
    const years = d.seatEvolution[0].data.map((p) => p.year);
    const rows = years.map((year, yi) => [
      year,
      ...d.seatEvolution.map((s) => s.data[yi]?.seats ?? 0),
    ]);
    return { headers, rows };
  },
  heroStat: () => ({
    label: '17 Elections',
    value: '1957–2024',
    context: 'Congress era → Coalition era → BJP era. Three distinct phases of Indian democracy.',
  }),
});

registerChart({
  domain: DOMAIN,
  sectionId: 'lok-sabha-2024',
  title: 'Lok Sabha 2024 — The Verdict',
  source: 'ECI Official Results',
  accentColor: ACCENT,
  dataFiles: [`${base}/results.json`],
  chartType: 'horizontal-bar',
  toTabular: (data) => {
    const d = data as ResultsData;
    return {
      headers: ['Party', 'Full Name', 'Seats', 'Vote Share (%)', 'Alliance'],
      rows: d.parties2024.map((p) => [p.party, p.fullName, p.seats, p.voteShare, p.alliance]),
    };
  },
  heroStat: (data) => {
    const d = data as ResultsData;
    const bjp = d.parties2024.find((p) => p.party === 'BJP');
    return {
      label: 'BJP Seats',
      value: `${bjp?.seats ?? 240}`,
      context: `32 short of 272 majority. NDA: ${d.allianceTotals2024.NDA}, INDIA: ${d.allianceTotals2024.INDIA}.`,
    };
  },
});

registerChart({
  domain: DOMAIN,
  sectionId: 'money-muscle',
  title: 'Money & Muscle — Candidate Profiles',
  source: 'ADR / MyNeta.info',
  accentColor: ACCENT,
  dataFiles: [`${base}/candidates.json`],
  chartType: 'horizontal-bar',
  toTabular: (data) => {
    const d = data as CandidatesData;
    return {
      headers: ['Rank', 'Name', 'Constituency', 'Party', 'Assets (₹ Crore)'],
      rows: d.topWealthiest.map((mp) => [mp.rank, mp.name, mp.constituency, mp.party, mp.assetsCrore]),
    };
  },
  heroStat: (data) => {
    const d = data as CandidatesData;
    return {
      label: 'MPs with Criminal Cases',
      value: `${d.criminal.pctAny}%`,
      context: `${d.criminal.withAnyCases} out of 543 MPs. ${d.criminal.pctSerious}% face serious charges.`,
    };
  },
});

registerChart({
  domain: DOMAIN,
  sectionId: 'gender-gap',
  title: 'Women in Parliament — 1957 to 2024',
  source: 'Lok Sabha Secretariat + PRS',
  accentColor: ACCENT,
  dataFiles: [`${base}/representation.json`],
  chartType: 'line',
  toTabular: (data) => {
    const d = data as RepresentationData;
    return {
      headers: ['Year', 'Women MPs', 'Total Seats', 'Women (%)'],
      rows: d.trend.map((t) => [t.year, t.womenMPs, t.totalSeats, t.pct]),
    };
  },
  heroStat: (data) => {
    const d = data as RepresentationData;
    const latest = d.trend[d.trend.length - 1];
    return {
      label: 'Women MPs',
      value: `${latest.pct}%`,
      context: `${latest.womenMPs} out of ${latest.totalSeats}. 33% reservation law passed 2023, not yet effective.`,
    };
  },
});
