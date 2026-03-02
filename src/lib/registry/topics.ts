/**
 * Chart registry entries for cross-domain topic sections.
 * Key format: "topics/{topicId}-{sectionId}"
 *
 * Topic charts pull from multiple domain data files, so toTabular
 * returns a minimal single-row summary rather than full tabular data.
 */
import { registerChart } from '../chartRegistry.ts';
import { ALL_TOPICS } from '../topicConfigs/index.ts';

const DOMAIN = 'topics';

// Auto-register every section from every topic config
for (const topic of ALL_TOPICS) {
  for (const section of topic.sections) {
    for (const chart of section.charts) {
      registerChart({
        domain: DOMAIN,
        sectionId: `${topic.id}-${section.id}`,
        title: chart.chartTitle,
        source: section.sources.join(', '),
        accentColor: topic.accent,
        dataFiles: [], // Topic charts compose from multiple domain files (loaded by useTopicData)
        chartType: chart.chartType === 'stat-row' ? 'custom' : chart.chartType as 'line' | 'area' | 'horizontal-bar',
        toTabular: () => ({
          headers: ['Topic', 'Section', 'Chart'],
          rows: [[topic.title, section.title, chart.chartTitle]],
        }),
      });
    }
  }
}
