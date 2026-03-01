"""
Transform women's representation data.

Outputs:
  - representation.json: Women MPs trend across 17 elections
"""


def build_representation(women_trend: list[dict], survey_year: str) -> dict:
    """Build the representation JSON output."""

    trend = [
        {
            "year": w["year"],
            "totalSeats": w["totalSeats"],
            "womenMPs": w["womenMPs"],
            "pct": w["pct"],
        }
        for w in women_trend
    ]

    # 33% reservation target (Nari Shakti Vandan Adhiniyam, 2023)
    # Passed by Parliament Sep 2023, to be effective after delimitation + census
    target = {
        "label": "33% Reservation (2023 Act)",
        "pct": 33,
        "note": "Nari Shakti Vandan Adhiniyam passed Sep 2023. Effective after delimitation based on first Census post-Act.",
    }

    return {
        "year": survey_year,
        "trend": trend,
        "target": target,
        "source": "Lok Sabha Secretariat + PRS Legislative Research",
    }
