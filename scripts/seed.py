"""Seed sample task data for a future database-backed implementation."""

import json
from pathlib import Path


def main() -> None:
    output = Path(".seed.json")
    output.write_text(json.dumps({"tasks": [{"title": "Explore the scaffold", "completed": False}]}, indent=2) + "\n")
    print(f"Wrote {output}")


if __name__ == "__main__":
    main()
