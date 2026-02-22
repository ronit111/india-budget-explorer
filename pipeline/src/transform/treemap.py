"""
Generate treemap hierarchy for expenditure visualization.
Root → categories → ministries → schemes.
"""

import json

from .derive import percent_of_total


def build_treemap(expenditures: list[dict], total: float, year: str) -> dict:
    """
    Build treemap data from expenditure list.

    Each expenditure dict has: id, name, budgetEstimate, schemes (list of dicts).
    """
    children = []

    named_total = 0
    for e in expenditures:
        amount = e["budgetEstimate"]
        named_total += amount

        node = {
            "name": e["name"]
                .replace("Ministry of ", "")
                .replace("Subsidies (Food, Fertilizer, Fuel)", "Subsidies"),
            "id": e["id"],
            "value": amount,
            "percentOfTotal": percent_of_total(amount, total),
        }

        schemes = e.get("schemes", [])
        if schemes:
            scheme_children = []
            scheme_total = sum(s["amount"] for s in schemes)
            for s in schemes:
                scheme_children.append({
                    "name": s["name"],
                    "id": s["id"],
                    "value": s["amount"],
                })
            # Add "Other" child if schemes don't cover full ministry amount
            remainder = amount - scheme_total
            if remainder > 0:
                other_id = e["id"].split("-")[0] if "-" in e["id"] else e["id"]
                scheme_children.append({
                    "name": "Other",
                    "id": f"{other_id}-other",
                    "value": round(remainder),
                })
            node["children"] = scheme_children

        children.append(node)

    # "Other Expenditure" bucket
    other = total - named_total
    if other > 0:
        children.append({
            "name": "Other Expenditure",
            "id": "other-expenditure",
            "value": round(other),
            "percentOfTotal": percent_of_total(other, total),
        })

    root = {
        "name": f"Union Budget {year}",
        "id": "root",
        "children": children,
    }

    return {"year": year, "root": root}
