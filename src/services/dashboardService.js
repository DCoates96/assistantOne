const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

export async function fetchTweetInsights(topic) {
  await wait(400);

  const now = new Date().toISOString();
  const baseHighlights = [
    "League executives are dissecting pace-and-space wrinkles fueled by second-unit lineups.",
    "Analytics conversations focus on lineup versatility against jumbo frontcourts.",
    "Players are sharing wearable-driven recovery milestones that could swing playoff readiness."
  ];

  return {
    topic,
    lastRun: now,
    postsConsidered: 64,
    sentiment: {
      positive: 0.58,
      neutral: 0.29,
      negative: 0.13
    },
    summary:
      "Social chatter clusters around innovation, trade speculation, and emerging voices shaping the nightly discourse.",
    highlights: baseHighlights,
    topVoices: [
      { handle: "@courtvision", focus: "Analytics breakdowns" },
      { handle: "@lockerroomreports", focus: "Beat reporting" },
      { handle: "@sportscihub", focus: "Performance science" }
    ]
  };
}

export async function fetchNbaResearch(topics) {
  await wait(450);

  const now = new Date().toISOString();

  const keyStories = [
    {
      id: "defense-adjustments",
      title: "Defensive schemes tightening at the top",
      detail:
        "Multiple sources note length-versus-switch decisions driving matchup strategies across contenders.",
      source: "The Ringer"
    },
    {
      id: "trade-scouting",
      title: "Trade desks monitoring mid-tier contracts",
      detail:
        "Cap strategists expect a surge of negotiations aimed at optimizing tax aprons before the draft.",
      source: "ESPN Front Office"
    },
    {
      id: "player-care",
      title: "Player care initiatives expanding",
      detail:
        "Teams invest in circadian-aligned travel plans and cognitive recovery tools to reduce fatigue spikes.",
      source: "NBA Performance Collective"
    }
  ];

  const scheduleWatch = [
    {
      matchup: "Kings at Suns",
      note: "Pace battle with implications for tiebreaker scenarios.",
      date: "Thursday"
    },
    {
      matchup: "Heat at Knicks",
      note: "Physical series preview as both clubs tweak half-court sets.",
      date: "Friday"
    }
  ];

  return {
    topics,
    lastRun: now,
    summary:
      "Cross-referenced newsletters, podcasts, and beat reports reveal the themes most teams are gaming out this week.",
    keyStories,
    scheduleWatch
  };
}

export async function summarizeWithLLM({ cadence, tone, tweets, nba }) {
  await wait(320);

  const cadenceLabel = cadence === "weekly" ? "Weekly" : "Daily";

  const toneLead = {
    analytical: "Analytical lens prioritizes signal over noise.",
    conversational: "Conversational tone keeps insights approachable.",
    executive: "Executive summary highlights rapid decision cues."
  }[tone];

  return {
    headline: `${cadenceLabel} briefing (${tone})`,
    overview: `${toneLead} Synthesized ${tweets.topic} chatter with ${nba.topics.length} NBA research threads.`,
    highlights: [
      `Social insight: ${tweets.highlights[0]}`,
      `Research spotlight: ${nba.keyStories[0].title} — ${nba.keyStories[0].detail}`,
      `Upcoming focus: ${nba.scheduleWatch[0].matchup} (${nba.scheduleWatch[0].note})`
    ],
    actionItems: [
      "Share the social sentiment breakdown with comms partners.",
      "Coordinate with analytics staff on defensive scheme pivots.",
      "Block 15 minutes to skim scouting reports before the highlighted matchups."
    ]
  };
}
