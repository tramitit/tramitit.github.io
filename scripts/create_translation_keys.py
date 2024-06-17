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
    for filename in files:
        tmp: dict[str, dict[str, str]] = json.loads(filename.read_bytes())
        for entry in tmp:
            translation_key: str = entry["translationKey"] # type: ignore
            translation_index["translationKey"][translation_key][entry["language"]] = entry

    with open(f"{Path(__file__).parent.parent.resolve()}/{out_dir}/translations.json", 'w') as f:
        #pprint(translation_index, stream=f)
        json.dump(translation_index, f)


if __name__ == "__main__":
    main()
