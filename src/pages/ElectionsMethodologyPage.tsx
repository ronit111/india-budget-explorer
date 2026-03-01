import { motion } from 'framer-motion';
import { SEOHead } from '../components/seo/SEOHead.tsx';
import { SectionNumber } from '../components/ui/SectionNumber.tsx';
import { useScrollTrigger } from '../hooks/useScrollTrigger.ts';

const SECTIONS = [
  {
    title: 'Data Sources',
    content: (
      <>
        <p>
          Elections data draws exclusively from authoritative Indian institutions. No World Bank or international API — all data is sourced directly from government and civil society publications:
        </p>
        <ul className="mt-4 space-y-3">
          <li className="flex gap-3 items-start">
            <span className="mt-1.5 w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: 'var(--indigo)' }} />
            <span>
              <strong style={{ color: 'var(--indigo)' }}>Election Commission of India (ECI)</strong> — The constitutional authority for all elections.{' '}
              <a href="https://eci.gov.in/" target="_blank" rel="noopener noreferrer" className="font-medium link-hover" style={{ color: 'var(--indigo)' }}>
                eci.gov.in
              </a>{' '}
              — Official results for all 18 Lok Sabha elections (1951-2024), state-wise voter turnout, electorate size, and constituency-level data.
            </span>
          </li>
          <li className="flex gap-3 items-start">
            <span className="mt-1.5 w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: 'var(--indigo)' }} />
            <span>
              <strong style={{ color: 'var(--indigo)' }}>TCPD Lok Dhaba (Ashoka University)</strong> — Compiled, machine-readable electoral dataset.{' '}
              <a href="https://lokdhaba.ashoka.edu.in/" target="_blank" rel="noopener noreferrer" className="font-medium link-hover" style={{ color: 'var(--indigo)' }}>
                lokdhaba.ashoka.edu.in
              </a>{' '}
              — Trivedi Centre for Political Data. Party-wise seat counts and vote shares for 17 elections, cross-referenced with ECI statistical reports.
            </span>
          </li>
          <li className="flex gap-3 items-start">
            <span className="mt-1.5 w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: 'var(--indigo)' }} />
            <span>
              <strong style={{ color: 'var(--indigo)' }}>ADR / MyNeta</strong> — Candidate affidavit analysis.{' '}
              <a href="https://adrindia.org/" target="_blank" rel="noopener noreferrer" className="font-medium link-hover" style={{ color: 'var(--indigo)' }}>
                adrindia.org
              </a>{' '}
              — Association for Democratic Reforms. Analysis of self-sworn affidavits filed by all 543 winning candidates in 2024: criminal records, declared assets, education, and liabilities.
            </span>
          </li>
          <li className="flex gap-3 items-start">
            <span className="mt-1.5 w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: 'var(--indigo)' }} />
            <span>
              <strong style={{ color: 'var(--indigo)' }}>Lok Sabha Secretariat + PRS Legislative Research</strong> — Women's representation data.{' '}
              <a href="https://prsindia.org/" target="_blank" rel="noopener noreferrer" className="font-medium link-hover" style={{ color: 'var(--indigo)' }}>
                prsindia.org
              </a>{' '}
              — Women MPs elected per Lok Sabha from 1957 to 2024. Historical data from Lok Sabha Secretariat publications, recent data from PRS compilations.
            </span>
          </li>
        </ul>
      </>
    ),
  },
  {
    title: 'Party Groupings',
    content: (
      <>
        <p>
          For the party evolution stacked chart, parties are grouped into 8 categories to show structural trends without 50+ individual party lines:
        </p>
        <ul className="mt-4 space-y-2">
          <li className="flex gap-3 items-start">
            <span className="mt-1.5 w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: '#00BFFF' }} />
            <span><strong>INC (Congress)</strong> — Indian National Congress and its historical factions (Congress(I), Congress(O) etc.).</span>
          </li>
          <li className="flex gap-3 items-start">
            <span className="mt-1.5 w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: '#FF6B35' }} />
            <span><strong>BJP</strong> — Bharatiya Janata Party. Includes Jan Sangh (pre-1980, its predecessor).</span>
          </li>
          <li className="flex gap-3 items-start">
            <span className="mt-1.5 w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: '#DC2626' }} />
            <span><strong>Left</strong> — CPI, CPI(M), RSP, Forward Bloc, and other Left parties.</span>
          </li>
          <li className="flex gap-3 items-start">
            <span className="mt-1.5 w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: '#A855F7' }} />
            <span><strong>Janata Family</strong> — Janata Party, Janata Dal, JD(U), RJD, JD(S), INLD. The "merger and split" family from 1977 onward.</span>
          </li>
          <li className="flex gap-3 items-start">
            <span className="mt-1.5 w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: '#14B8A6' }} />
            <span><strong>Regional</strong> — DMK, AIADMK, TMC, TDP, BJD, Shiv Sena, YSRCP, NCP, TRS/BRS, AGP, etc. Parties with strong state-level bases.</span>
          </li>
          <li className="flex gap-3 items-start">
            <span className="mt-1.5 w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: '#9CA3AF' }} />
            <span><strong>Others</strong> — Independents and smaller unrecognized parties.</span>
          </li>
        </ul>
        <p className="mt-4">
          Seat counts may differ by 1-3 from some sources due to by-election results, redistribution of split-party seats, and nomination conventions. The narrative trend is robust across all sources.
        </p>
      </>
    ),
  },
  {
    title: 'ADR Candidate Data',
    content: (
      <>
        <p>
          All candidate-level data comes from self-sworn affidavits filed under Section 33A of the Representation of People Act, 1951, as mandated by the Supreme Court in <em>Union of India v. ADR</em> (2003).
        </p>
        <ul className="mt-4 space-y-2">
          <li className="flex gap-3 items-start">
            <span className="mt-1.5 w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: 'var(--indigo)' }} />
            <span><strong>Criminal cases</strong> — Includes FIRs and pending cases. "Serious cases" includes IPC sections related to murder, attempt to murder, kidnapping, robbery, extortion, and crimes against women. These are allegations, not convictions.</span>
          </li>
          <li className="flex gap-3 items-start">
            <span className="mt-1.5 w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: 'var(--indigo)' }} />
            <span><strong>Assets</strong> — Self-declared total assets (movable + immovable) of the candidate and spouse. Does not include assets of other family members. Actual wealth may differ significantly from declared figures.</span>
          </li>
          <li className="flex gap-3 items-start">
            <span className="mt-1.5 w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: 'var(--indigo)' }} />
            <span><strong>Education</strong> — Self-declared highest educational qualification. Categories: Post-graduate and above, Graduate, and Below graduate.</span>
          </li>
        </ul>
      </>
    ),
  },
  {
    title: 'Data Vintage',
    content: (
      <>
        <ul className="space-y-2">
          <li className="flex gap-3 items-start">
            <span className="mt-1.5 w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: 'var(--gold)' }} />
            <span>Turnout and seat data: 2nd Lok Sabha (1957) to 18th Lok Sabha (2024). The 1st Lok Sabha (1951-52) is excluded because it was India's first-ever general election with different constituency structures.</span>
          </li>
          <li className="flex gap-3 items-start">
            <span className="mt-1.5 w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: 'var(--gold)' }} />
            <span>ADR candidate analysis: 18th Lok Sabha (2024) only. Historical affidavit data is less reliable and inconsistently digitized.</span>
          </li>
          <li className="flex gap-3 items-start">
            <span className="mt-1.5 w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: 'var(--gold)' }} />
            <span>Women MPs data: 1957-2024 (17 elections). Source: Lok Sabha Secretariat statistical handbook + PRS compilations.</span>
          </li>
          <li className="flex gap-3 items-start">
            <span className="mt-1.5 w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: 'var(--gold)' }} />
            <span>Total constituencies changed over time: 494 (1957), 520 (1967), 542 (1977), 529 (1989), 521 (1991), 543 (1996 onward). Seat counts in the evolution chart reflect actual totals per election.</span>
          </li>
        </ul>
      </>
    ),
  },
  {
    title: 'Limitations',
    content: (
      <>
        <ul className="space-y-2">
          <li className="flex gap-3 items-start">
            <span className="mt-1.5 w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: 'var(--saffron)' }} />
            <span><strong>Lok Sabha only</strong> — This domain covers general elections to the lower house of Parliament. State assembly elections, Rajya Sabha, and local body elections are not included.</span>
          </li>
          <li className="flex gap-3 items-start">
            <span className="mt-1.5 w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: 'var(--saffron)' }} />
            <span><strong>Criminal cases ≠ convictions</strong> — Many cases are politically motivated or languish in courts for decades. A declared criminal case does not mean the MP is guilty. India's conviction rate for politicians is notably low.</span>
          </li>
          <li className="flex gap-3 items-start">
            <span className="mt-1.5 w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: 'var(--saffron)' }} />
            <span><strong>FPTP distortion</strong> — Seat counts don't reflect popular support. A party can win 0 seats with millions of votes (BSP 2014: 4.1% votes, 0 seats). Conversely, a regional party can win 20+ seats with 2% national share due to geographic concentration.</span>
          </li>
          <li className="flex gap-3 items-start">
            <span className="mt-1.5 w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: 'var(--saffron)' }} />
            <span><strong>Party groupings are editorial</strong> — The 8-category grouping (INC, BJP, Left, Janata, BSP, SP, Regional, Others) is our editorial choice to show trends. Individual party-level data is available for 2024.</span>
          </li>
          <li className="flex gap-3 items-start">
            <span className="mt-1.5 w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: 'var(--saffron)' }} />
            <span><strong>No expenditure data</strong> — Election spending data is opaque in India. While ECI sets spending limits, actual expenditure (including undisclosed spending) is not reliably available.</span>
          </li>
        </ul>
      </>
    ),
  },
];

function MethodSection({ section, index }: { section: typeof SECTIONS[number]; index: number }) {
  const [ref, isVisible] = useScrollTrigger({ threshold: 0.1 });

  return (
    <section ref={ref} className="composition">
      <div className="max-w-3xl mx-auto px-6 sm:px-8">
        <SectionNumber number={index + 1} className="mb-4 block" isVisible={isVisible} />

        <motion.h2
          initial={{ opacity: 0, y: 16 }}
          animate={isVisible ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="text-xl font-bold mb-4"
          style={{ color: 'var(--indigo)' }}
        >
          {section.title}
        </motion.h2>

        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={isVisible ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1], delay: 0.1 }}
          className="text-sm leading-relaxed"
          style={{ color: 'var(--text-secondary)' }}
        >
          {section.content}
        </motion.div>
      </div>
    </section>
  );
}

export default function ElectionsMethodologyPage() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="min-h-screen"
    >
      <SEOHead
        title="Methodology — Elections Data | Indian Data Project"
        description="Data sources, party groupings, ADR candidate analysis methodology, and limitations for elections data on Indian Data Project."
        path="/elections/methodology"
        image="/og-elections.png"
      />

      <div className="max-w-3xl mx-auto px-6 sm:px-8 pt-10 md:pt-14">
        <motion.h1
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="text-composition font-bold mb-3"
        >
          Elections Methodology
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1], delay: 0.1 }}
          className="text-base mb-8"
          style={{ color: 'var(--text-secondary)' }}
        >
          How we compiled 67 years of Lok Sabha data — from ECI statistical reports to ADR affidavit analysis. Every number traces to an authoritative source.
        </motion.p>
      </div>

      {SECTIONS.map((section, i) => (
        <MethodSection key={section.title} section={section} index={i} />
      ))}
    </motion.div>
  );
}
