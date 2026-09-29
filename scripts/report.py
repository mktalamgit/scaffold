"""Print a small report from the local seed data."""

import json
from pathlib import Path


def main() -> None:
    source = Path(".seed.json")
    tasks = json.loads(source.read_text()).get("tasks", []) if source.exists() else []
    completed = sum(task.get("completed", False) for task in tasks)
    print(f"{completed}/{len(tasks)} tasks complete")


if __name__ == "__main__":
    main()
