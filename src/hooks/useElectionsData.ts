import { useState, useEffect } from 'react';
import {
  loadElectionsSummary,
  loadTurnout,
  loadResults,
  loadCandidates,
  loadRepresentation,
} from '../lib/dataLoader.ts';
import type {
  ElectionsSummary,
  TurnoutData,
  ResultsData,
  CandidatesData,
  RepresentationData,
} from '../lib/data/schema.ts';

interface ElectionsData {
  summary: ElectionsSummary | null;
  turnout: TurnoutData | null;
  results: ResultsData | null;
  candidates: CandidatesData | null;
  representation: RepresentationData | null;
  loading: boolean;
  error: string | null;
}

export function useElectionsData(year: string): ElectionsData {
  const [data, setData] = useState<ElectionsData>({
    summary: null,
    turnout: null,
    results: null,
    candidates: null,
    representation: null,
    loading: true,
    error: null,
  });

  useEffect(() => {
    let cancelled = false;
    setData((d) => ({ ...d, loading: true, error: null }));

    Promise.all([
      loadElectionsSummary(year),
      loadTurnout(year),
      loadResults(year),
      loadCandidates(year),
      loadRepresentation(year),
    ])
      .then(([summary, turnout, results, candidates, representation]) => {
        if (!cancelled) {
          setData({
            summary,
            turnout,
            results,
            candidates,
            representation,
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
