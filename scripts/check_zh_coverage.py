from pathlib import Path

root = Path(__file__).resolve().parents[1] / "docs" / "ldlib2"
missing = []
for src in sorted(root.rglob("*.md")):
    if src.name.endswith(".zh.md"):
        continue
    dst = src.with_name(f"{src.stem}.zh.md")
    if not dst.exists():
        missing.append(src)

print(f"missing={len(missing)}")
for p in missing:
    print(p.as_posix())
