"""
Ministry name normalization.
Handles abbreviations commonly found in budget documents.
"""

import re

# Common abbreviations in Indian budget documents
ABBREVIATIONS = {
    r"\bM/o\b": "Ministry of",
    r"\bMin\.\s*of\b": "Ministry of",
    r"\bDeptt\b": "Department",
    r"\bDept\.\b": "Department",
    r"\bD/o\b": "Department of",
    r"\bMoD\b": "Ministry of Defence",
    r"\bMoF\b": "Ministry of Finance",
    r"\bMHA\b": "Ministry of Home Affairs",
    r"\bMoRD\b": "Ministry of Rural Development",
    r"\bMoHFW\b": "Ministry of Health & Family Welfare",
    r"\bMoE\b": "Ministry of Education",
    r"\bMoRT&H\b": "Ministry of Road Transport & Highways",
    r"\bMoA&FW\b": "Ministry of Agriculture & Farmers Welfare",
    r"\bMoR\b": "Ministry of Railways",
    r"\b&\s*": "& ",
    r"\bGovt\.\b": "Government",
}


def normalize_ministry_name(name: str) -> str:
    """Expand abbreviations and clean up ministry names."""
    result = name.strip()
    for pattern, replacement in ABBREVIATIONS.items():
        result = re.sub(pattern, replacement, result)
    # Collapse multiple spaces
    result = re.sub(r"\s+", " ", result).strip()
    return result


def slugify(name: str) -> str:
    """Convert a ministry name to a URL-safe slug id."""
    s = name.lower()
    s = re.sub(r"[^a-z0-9\s-]", "", s)
    s = re.sub(r"[\s]+", "-", s)
    s = re.sub(r"-+", "-", s)
    return s.strip("-")
