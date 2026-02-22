"""
Generate Sankey diagram nodes and links.
Revenue sources → Central Government → Expenditure ministries.
"""


def build_sankey(
    receipts: list[dict],
    expenditures: list[dict],
    total_expenditure: float,
    year: str,
) -> dict:
    """
    Build Sankey data structure.

    Args:
        receipts: list of {"id", "name", "amount"} dicts
        expenditures: list of {"id", "name", "budgetEstimate"} dicts
        total_expenditure: total expenditure in Rs crore
        year: budget year string
    """
    nodes = []
    links = []

    # Revenue nodes (left side)
    for r in receipts:
        nodes.append({
            "id": r["id"],
            "name": r["name"],
            "group": "revenue",
            "value": r["amount"],
        })
        links.append({
            "source": r["id"],
            "target": "central-govt",
            "value": r["amount"],
            "verified": True,
        })

    # Central government node (middle)
    nodes.append({
        "id": "central-govt",
        "name": "Central Government",
        "group": "center",
        "value": total_expenditure,
    })

    # Expenditure nodes (right side)
    named_total = 0
    for e in expenditures:
        amount = e["budgetEstimate"]
        named_total += amount
        nodes.append({
            "id": e["id"],
            "name": e["name"].replace("Ministry of ", "").replace("Subsidies (Food, Fertilizer, Fuel)", "Subsidies"),
            "group": "expenditure",
            "value": amount,
        })
        links.append({
            "source": "central-govt",
            "target": e["id"],
            "value": amount,
            "verified": True,
        })

    # "Other" bucket for remaining expenditure
    other = total_expenditure - named_total
    if other > 0:
        nodes.append({
            "id": "other-expenditure",
            "name": "Other",
            "group": "expenditure",
            "value": round(other),
        })
        links.append({
            "source": "central-govt",
            "target": "other-expenditure",
            "value": round(other),
            "verified": True,
        })

    return {"year": year, "nodes": nodes, "links": links}
