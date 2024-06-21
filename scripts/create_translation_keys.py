import json
from collections import defaultdict
from pathlib import Path
from pprint import pprint
from typing import Set

tree = lambda: defaultdict(tree)


def main(directory: str | Path = "public", out_dir: str | Path = "data") -> None:
    files = Path(directory).rglob("translationindex.json")
    # dict with tranlsationKey -> language -> {slug, title}
    translation_index: dict[str, dict[str, dict[str, str]]] = tree()
    categories_index: dict[str, dict[str, dict[str, str]]] = tree()
    for filename in files:
        tmp: dict[str, dict[str, str]] = json.loads(filename.read_bytes())
        for entry in tmp:
            translation_key: str = entry["translationKey"]  # type: ignore
            translation_index["translationKey"][translation_key][
                entry["language"]
            ] = entry
            for cat in entry["categories"].split((",")):
                categories_index[cat.strip().lower()][entry["language"]] = entry["language"]

    with open(
        f"{Path(__file__).parent.parent.resolve()}/{out_dir}/translations.json", "w"
    ) as f:
        # pprint(translation_index, stream=f)
        json.dump(translation_index, f)

    with open(
        f"{Path(__file__).parent.parent.resolve()}/{out_dir}/categories.json", "w"
    ) as f:
        # pprint(translation_index, stream=f)
        json.dump(categories_index, f)


if __name__ == "__main__":
    main()
