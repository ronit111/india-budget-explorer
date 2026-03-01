"""
Transform turnout data for the Elections domain.

Outputs:
  - turnout.json: National trend (17 elections) + event annotations + state breakdown 2024
"""


def build_turnout(turnout_trend: list[dict], events: list[dict],
                  state_turnout: list[dict], survey_year: str) -> dict:
    """Build the turnout JSON output."""

    # National trend: year, turnout %, electors (crore), LS number
    trend = [
        {
            "year": t["year"],
            "turnout": t["turnout"],
            "electors": t["electors"],
            "lsNumber": t["lsNumber"],
        }
        for t in turnout_trend
    ]

    # Event annotations for timeline overlay
    annotations = [
        {"year": e["year"], "event": e["event"]}
        for e in events
    ]

    # State-wise 2024 breakdown — sorted by turnout descending
    state_breakdown = sorted(
        [
            {"id": s["id"], "name": s["name"], "turnout": s["turnout"]}
            for s in state_turnout
        ],
        key=lambda x: x["turnout"],
        reverse=True,
    )

    return {
        "year": survey_year,
        "nationalTrend": trend,
        "events": annotations,
        "stateBreakdown2024": state_breakdown,
        "source": "Election Commission of India — Statistical Reports on General Elections",
    }
