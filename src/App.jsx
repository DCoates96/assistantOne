import React, { useMemo, useState } from "react";
import Section from "./components/Section";
import InsightCard from "./components/InsightCard";
import { useDashboardData } from "./hooks/useDashboardData";
import "./App.css";

const DEFAULT_TWEET_TOPIC = "Sports technology";
const DEFAULT_NBA_TOPICS = ["Trade rumors", "Injury reports", "Playoff race analytics"];
const DEFAULT_TONE = "analytical";

const cadenceOptions = [
  { value: "daily", label: "Daily" },
  { value: "weekly", label: "Weekly" }
];

const toneOptions = [
  { value: "analytical", label: "Analytical" },
  { value: "conversational", label: "Conversational" },
  { value: "executive", label: "Executive" }
];

function formatTimestamp(isoString) {
  if (!isoString) return "";
  try {
    return new Date(isoString).toLocaleString();
  } catch (error) {
    return isoString;
  }
}

function SentimentSummary({ sentiment }) {
  if (!sentiment) return null;
  const entries = Object.entries(sentiment);

  return (
    <div className="sentiment">
      {entries.map(([mood, value]) => {
        const percent = Math.round(value * 100);
        return (
          <span key={mood} className={`sentiment__pill sentiment__pill--${mood}`}>
            {mood}: {percent}%
          </span>
        );
      })}
    </div>
  );
}

export default function App() {
  const [tweetTopic, setTweetTopic] = useState(DEFAULT_TWEET_TOPIC);
  const [nbaTopicsInput, setNbaTopicsInput] = useState(DEFAULT_NBA_TOPICS.join(", "));
  const [cadence, setCadence] = useState(cadenceOptions[0].value);
  const [tone, setTone] = useState(DEFAULT_TONE);

  const nbaTopics = useMemo(
    () =>
      nbaTopicsInput
        .split(",")
        .map((topic) => topic.trim())
        .filter(Boolean),
    [nbaTopicsInput]
  );

  const { loading, error, resetError, refresh, tweetInsights, nbaResearch, briefing, lastUpdated } =
    useDashboardData({ tweetTopic, nbaTopics, cadence, tone });

  return (
    <div className="app">
      <header className="app__header">
        <div>
          <h1>assistantOne briefing</h1>
          <p className="app__tagline">
            Personalised news dashboard orchestrating social buzz, NBA research, and LLM-powered context.
          </p>
        </div>
        <div className="app__header-actions">
          {lastUpdated && <span className="app__meta">Last updated {formatTimestamp(lastUpdated)}</span>}
          <button className="refresh-button" onClick={refresh} disabled={loading}>
            {loading ? "Refreshing…" : "Refresh briefing"}
          </button>
        </div>
      </header>

      {error && (
        <div className="app__error" role="alert">
          <span>{error}</span>
          <button type="button" onClick={resetError}>
            Dismiss
          </button>
        </div>
      )}

      <Section
        title="Configuration"
        description="Tailor the assistant to the topics you care about and the tone of summary you want."
      >
        <form className="inputs" onSubmit={(event) => event.preventDefault()}>
          <label className="field">
            <span>Tweet topic</span>
            <input value={tweetTopic} onChange={(event) => setTweetTopic(event.target.value)} />
          </label>
          <label className="field">
            <span>NBA research topics (comma separated)</span>
            <textarea value={nbaTopicsInput} onChange={(event) => setNbaTopicsInput(event.target.value)} rows={3} />
          </label>
          <label className="field">
            <span>Summary cadence</span>
            <select value={cadence} onChange={(event) => setCadence(event.target.value)}>
              {cadenceOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </label>
          <label className="field">
            <span>LLM tone</span>
            <select value={tone} onChange={(event) => setTone(event.target.value)}>
              {toneOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </label>
        </form>
      </Section>

      <Section
        title="Tweet intelligence"
        description="Digest of the newest conversations, themes, and voices emerging across Twitter/X."
        meta={tweetInsights && `Last run ${formatTimestamp(tweetInsights.lastRun)}`}
      >
        <InsightCard
          summary={tweetInsights?.summary}
          items={tweetInsights?.highlights ?? []}
          footer={
            tweetInsights && (
              <div className="card__footer-grid">
                <SentimentSummary sentiment={tweetInsights.sentiment} />
                <span className="card__meta">Posts analysed: {tweetInsights.postsConsidered}</span>
                <div className="card__meta">
                  Top voices: {tweetInsights.topVoices.map((voice) => voice.handle).join(", ")}
                </div>
              </div>
            )
          }
          emptyCopy="No tweet intelligence yet. Adjust your topic and refresh."
        />
      </Section>

      <Section
        title="NBA research digest"
        description="Curated roundup from beat writers, analytics newsletters, podcasts, and team pressers."
        meta={nbaResearch && `Last run ${formatTimestamp(nbaResearch.lastRun)}`}
      >
        <InsightCard
          summary={nbaResearch?.summary}
          items={
            nbaResearch?.keyStories.map((story) => ({
              key: story.id,
              title: `${story.title} · ${story.source}`,
              detail: story.detail
            })) ?? []
          }
          footer={
            nbaResearch && (
              <div className="card__footer-grid">
                <div>
                  <strong>Matchups to monitor</strong>
                  <ul className="inline-list">
                    {nbaResearch.scheduleWatch.map((item) => (
                      <li key={item.matchup}>
                        <span>{item.matchup}</span>
                        <small>{item.date} — {item.note}</small>
                      </li>
                    ))}
                  </ul>
                </div>
                <span className="card__meta">Tracked topics: {nbaResearch.topics.join(", ")}</span>
              </div>
            )
          }
          emptyCopy="No NBA research yet. Add topics and refresh to generate insights."
        />
      </Section>

      <Section
        title="LLM digest"
        description="High-level synthesis from your assistant with suggested next steps."
        meta={briefing && briefing.headline}
      >
        {briefing ? (
          <div className="briefing">
            <p className="briefing__overview">{briefing.overview}</p>
            <ul className="briefing__highlights">
              {briefing.highlights.map((highlight) => (
                <li key={highlight}>{highlight}</li>
              ))}
            </ul>
            <div className="briefing__actions">
              <h3>Suggested actions</h3>
              <ol>
                {briefing.actionItems.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ol>
            </div>
          </div>
        ) : (
          <p>Configure your preferences above and refresh to generate a tailored briefing.</p>
        )}
      </Section>

      <Section
        title="Assistant roadmap"
        description="The assistant is evolving toward a one-stop daily command centre."
      >
        <div className="card roadmap">
          <p>
            Upcoming releases will weave in personal reminders (birthdays, events, recurring to-dos) and add automation hooks
            so the dashboard becomes a true daily operations hub.
          </p>
          <ul>
            <li>Calendar, contacts, and CRM integrations for proactive nudges.</li>
            <li>Action tracking with follow-through checklists and delegations.</li>
            <li>Cross-domain coverage beyond basketball, tailored to your interests.</li>
            <li>Multimodal interfaces so you can review briefings via voice or chat.</li>
          </ul>
        </div>
      </Section>
    </div>
  );
}
