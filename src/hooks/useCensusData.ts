import { useState, useEffect } from 'react';
import {
  loadCensusSummary,
  loadPopulation,
  loadDemographics,
  loadLiteracyData,
  loadHealthData,
  loadCensusIndicators,
} from '../lib/dataLoader.ts';
import type {
  CensusSummary,
  PopulationData,
  DemographicsData,
  LiteracyData,
  HealthData,
  CensusIndicatorsData,
} from '../lib/data/schema.ts';

interface CensusData {
  summary: CensusSummary | null;
  population: PopulationData | null;
  demographics: DemographicsData | null;
  literacy: LiteracyData | null;
  health: HealthData | null;
  indicators: CensusIndicatorsData | null;
  loading: boolean;
  error: string | null;
}

export function useCensusData(year: string): CensusData {
  const [data, setData] = useState<CensusData>({
    summary: null,
    population: null,
    demographics: null,
    literacy: null,
    health: null,
    indicators: null,
    loading: true,
    error: null,
  });

  useEffect(() => {
    let cancelled = false;
    setData((d) => ({ ...d, loading: true, error: null }));

    Promise.all([
      loadCensusSummary(year),
      loadPopulation(year),
      loadDemographics(year),
      loadLiteracyData(year),
      loadHealthData(year),
      loadCensusIndicators(year),
    ])
      .then(([summary, population, demographics, literacy, health, indicators]) => {
        if (!cancelled) {
          setData({
            summary,
            population,
            demographics,
            literacy,
            health,
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
