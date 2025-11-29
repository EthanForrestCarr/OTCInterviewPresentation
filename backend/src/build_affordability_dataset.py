"""Build the combined housing affordability dataset used by the frontend.

This script ties together ACS-derived affordability metrics and HUD FMR
values (where available) into a single JSON file suitable for
consumption by the Vite + React + TypeScript frontend.
"""

from __future__ import annotations

import json
import math
from pathlib import Path

import pandas as pd

from .config import PROCESSED_DATA_DIR
from .load_acs import load_acs_affordability
from .load_hud import load_hud_fmr


def build_affordability_dataset() -> Path:
    """Build and write the combined affordability dataset to JSON.

    Returns the path to the written JSON file.
    """

    acs_df = load_acs_affordability()

    # Attempt to load HUD FMR; if anything goes wrong, fall back to
    # ACS-only data so the pipeline remains robust.
    try:
        hud_df = load_hud_fmr()
    except Exception as exc:  # pragma: no cover - defensive
        print(f"[build_affordability_dataset] HUD load failed, continuing without HUD: {exc}")
        hud_df = None

    if hud_df is not None and not hud_df.empty:
        combined = acs_df.merge(
            hud_df, on=["year", "geo_name"], how="left", suffixes=("", "_hud")
        )
    else:
        combined = acs_df.copy()

    # Build the JSON structure expected by the frontend.
    geographies = sorted(combined["geo_name"].unique())

    # Cast to standard Python types for JSON serialization
    def _clean_record(rec: dict) -> dict:
        cleaned = {}
        for k, v in rec.items():
            if isinstance(v, float) and math.isnan(v):
                cleaned[k] = None
            else:
                cleaned[k] = v
        return cleaned

    raw_records = combined.to_dict(orient="records")
    records = [_clean_record(r) for r in raw_records]

    payload = {
        "geographies": geographies,
        "metrics": records,
    }

    PROCESSED_DATA_DIR.mkdir(parents=True, exist_ok=True)
    out_path = PROCESSED_DATA_DIR / "housing_affordability_timeseries.json"
    out_path.write_text(json.dumps(payload, indent=2))

    return out_path


if __name__ == "__main__":
    output_path = build_affordability_dataset()
    print(f"Wrote affordability dataset to {output_path}")
