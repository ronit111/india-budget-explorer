import { useParams, Navigate } from 'react-router-dom';
import { SEOHead } from '../components/seo/SEOHead.tsx';
import { TopicHero } from '../components/topics/TopicHero.tsx';
import { TopicSection } from '../components/topics/TopicSection.tsx';
import { TopicCTA } from '../components/topics/TopicCTA.tsx';
import { KeyTakeaways, type TakeawayPill } from '../components/ui/KeyTakeaways.tsx';
import { useTopicData } from '../hooks/useTopicData.ts';
import { TOPIC_CONFIGS } from '../lib/topicConfigs/index.ts';
import type { TopicDataBag } from '../lib/topicConfig.ts';

function resolveValue(v: string | ((bag: TopicDataBag) => string), bag: TopicDataBag): string {
  return typeof v === 'function' ? v(bag) : v;
}

export default function TopicDetailPage() {
  const { topicId } = useParams<{ topicId: string }>();
  const topic = topicId ? TOPIC_CONFIGS[topicId] : undefined;

  // Always call the hook with a stable empty array fallback
  const requiredData = topic?.requiredData ?? [];
  const { data: bag, loading, error } = useTopicData(requiredData);

  if (!topic) {
    return <Navigate to="/topics" replace />;
  }

  // Build takeaway pills from config
  const pills: TakeawayPill[] = topic.takeaways.map((t) => ({
    value: resolveValue(t.value, bag),
    label: t.label,
    sectionId: t.sectionId,
  }));

  return (
    <>
      <SEOHead
        title={`${topic.title} — Indian Data Project`}
        description={topic.subtitle}
        path={`/topics/${topic.id}`}
        image="/og-topics.png"
      />

      {/* Hero */}
      <TopicHero topic={topic} bag={bag} />

      {/* Key takeaways */}
      {!loading && (
        <KeyTakeaways pills={pills} accent={topic.accent} />
      )}

      {/* Narrative bridge */}
      <div className="max-w-3xl mx-auto px-6 sm:px-8 py-8 md:py-12">
        <p
          className="text-sm sm:text-base leading-relaxed"
          style={{ color: 'var(--text-secondary)' }}
        >
          {topic.narrativeBridge}
        </p>
      </div>

      {/* Loading state */}
      {loading && (
        <div className="py-24 text-center">
          <div
            className="inline-block w-6 h-6 border-2 rounded-full animate-spin"
            style={{ borderColor: `${topic.accent}40`, borderTopColor: topic.accent }}
          />
          <p className="text-sm mt-3" style={{ color: 'var(--text-muted)' }}>
            Loading data from {topic.contributingDomains.length} domains…
          </p>
        </div>
      )}

      {/* Error state */}
      {error && (
        <div className="py-16 text-center max-w-md mx-auto px-6">
          <p className="text-sm" style={{ color: 'var(--text-muted)' }}>
            {error}
          </p>
        </div>
      )}

      {/* Sections */}
      {!loading &&
        topic.sections.map((section) => (
          <TopicSection
            key={section.id}
            section={section}
            bag={bag}
            topicId={topic.id}
            accent={topic.accent}
          />
        ))}

      {/* CTA cards */}
      {!loading && <TopicCTA links={topic.ctaLinks} accent={topic.accent} />}
    </>
  );
}
