from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
EN_ROOT = ROOT / "docs" / "en"
ZH_ROOT = ROOT / "docs" / "zh"

missing: list[Path] = []
for src in sorted(EN_ROOT.rglob("*.md")):
    rel = src.relative_to(EN_ROOT)
    if not (ZH_ROOT / rel).exists():
        missing.append(rel)

print(f"missing={len(missing)}")
for rel in missing:
    print(rel.as_posix())
