import { useState, useEffect } from 'react';
import {
  loadEmploymentSummary,
  loadUnemployment,
  loadParticipation,
  loadSectoral,
  loadEmploymentIndicators,
} from '../lib/dataLoader.ts';
import type {
  EmploymentSummary,
  UnemploymentData,
  ParticipationData,
  SectoralData,
  EmploymentIndicatorsData,
} from '../lib/data/schema.ts';

interface EmploymentData {
  summary: EmploymentSummary | null;
  unemployment: UnemploymentData | null;
  participation: ParticipationData | null;
  sectoral: SectoralData | null;
  indicators: EmploymentIndicatorsData | null;
  loading: boolean;
  error: string | null;
}

export function useEmploymentData(year: string): EmploymentData {
  const [data, setData] = useState<EmploymentData>({
    summary: null,
    unemployment: null,
    participation: null,
    sectoral: null,
    indicators: null,
    loading: true,
    error: null,
  });

  useEffect(() => {
    let cancelled = false;
    setData((d) => ({ ...d, loading: true, error: null }));

    Promise.all([
      loadEmploymentSummary(year),
      loadUnemployment(year),
      loadParticipation(year),
      loadSectoral(year),
      loadEmploymentIndicators(year),
    ])
      .then(([summary, unemployment, participation, sectoral, indicators]) => {
        if (!cancelled) {
          setData({
            summary,
            unemployment,
            participation,
            sectoral,
            indicators,
            loading: false,
            error: null,
          });
        }
      })
      .catch((err) => {
        if (!cancelled) {
          setData((d) => ({ ...d, loading: false, error: String(err) }));
        }
      });

    return () => {
      cancelled = true;
    };
  }, [year]);

  return data;
}
