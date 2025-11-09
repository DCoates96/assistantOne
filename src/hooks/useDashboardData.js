import { useCallback, useEffect, useRef, useState } from "react";
import { fetchNbaResearch, fetchTweetInsights, summarizeWithLLM } from "../services/dashboardService";

const initialState = {
  loading: false,
  error: null,
  tweetInsights: null,
  nbaResearch: null,
  briefing: null,
  lastUpdated: null
};

export function useDashboardData({ tweetTopic, nbaTopics, cadence, tone }) {
  const [state, setState] = useState(initialState);
  const latestRequestRef = useRef(0);

  const refresh = useCallback(async () => {
    const requestId = latestRequestRef.current + 1;
    latestRequestRef.current = requestId;

    setState((prev) => ({ ...prev, loading: true, error: null }));

    try {
      const [tweets, nba] = await Promise.all([
        fetchTweetInsights(tweetTopic),
        fetchNbaResearch(nbaTopics)
      ]);

      const summary = await summarizeWithLLM({ cadence, tone, tweets, nba });

      if (latestRequestRef.current !== requestId) {
        return;
      }

      setState({
        loading: false,
        error: null,
        tweetInsights: tweets,
        nbaResearch: nba,
        briefing: summary,
        lastUpdated: new Date().toISOString()
      });
    } catch (error) {
      if (latestRequestRef.current !== requestId) {
        return;
      }

      setState((prev) => ({
        ...prev,
        loading: false,
        error: error instanceof Error ? error.message : "Unknown error"
      }));
    }
  }, [tweetTopic, nbaTopics, cadence, tone]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const resetError = useCallback(() => setState((prev) => ({ ...prev, error: null })), []);

  return { ...state, refresh, resetError };
}
