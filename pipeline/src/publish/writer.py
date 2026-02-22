"""
Write validated JSON data to the public/data/ directory.
"""

import json
import logging
from pathlib import Path

logger = logging.getLogger(__name__)

# Project root is 3 levels up from this file
PROJECT_ROOT = Path(__file__).parent.parent.parent.parent


def write_json(data: dict, relative_path: str) -> Path:
    """
    Write a dict as JSON to public/data/{relative_path}.
    Creates parent directories as needed.
    """
    out_path = PROJECT_ROOT / "public" / "data" / relative_path
    out_path.parent.mkdir(parents=True, exist_ok=True)

    with open(out_path, "w") as f:
        json.dump(data, f, indent=2, ensure_ascii=False)

    logger.info(f"Wrote: {out_path}")
    return out_path


def publish_all(outputs: dict[str, dict]) -> list[Path]:
    """
    Write all pipeline outputs to their respective JSON files.

    Args:
        outputs: dict mapping relative paths to data dicts.
            e.g. {"budget/2025-26/summary.json": {...}, ...}
    """
    paths = []
    for rel_path, data in outputs.items():
        paths.append(write_json(data, rel_path))
    return paths
