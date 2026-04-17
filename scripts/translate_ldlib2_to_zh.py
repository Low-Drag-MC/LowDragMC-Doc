from __future__ import annotations

import re
from pathlib import Path
from time import sleep

from deep_translator import GoogleTranslator


ROOT = Path(__file__).resolve().parents[1]
DOCS_DIR = ROOT / "docs" / "ldlib2"
TRANSLATOR = GoogleTranslator(source="en", target="zh-CN")

FENCED_BLOCK_RE = re.compile(r"(```[\s\S]*?```|~~~[\s\S]*?~~~)", re.MULTILINE)
PROTECTED_RE = re.compile(
    r"(`[^`]*`|!\[[^\]]*\]\([^)]+\)|\[[^\]]*\]\([^)]+\)|<[^>]+>|https?://\S+)"
)


def chunks(text: str, size: int = 2400) -> list[str]:
    if len(text) <= size:
        return [text]
    out: list[str] = []
    current: list[str] = []
    current_len = 0
    for part in re.split(r"(\n\n+)", text):
        if not part:
            continue
        if current_len + len(part) > size and current:
            out.append("".join(current))
            current = [part]
            current_len = len(part)
        else:
            current.append(part)
            current_len += len(part)
    if current:
        out.append("".join(current))
    return out


def translate_text(text: str) -> str:
    translated: list[str] = []
    for part in chunks(text):
        if not part.strip():
            translated.append(part)
            continue
        last_exc: Exception | None = None
        for _ in range(3):
            try:
                translated.append(TRANSLATOR.translate(part))
                last_exc = None
                break
            except Exception as exc:  # pragma: no cover
                last_exc = exc
                sleep(1)
        if last_exc is not None:
            raise last_exc
    return "".join(translated)


def translate_inline(line: str) -> str:
    protected: list[str] = []

    def stash(match: re.Match[str]) -> str:
        protected.append(match.group(0))
        return f"@@P{len(protected) - 1}@@"

    masked = PROTECTED_RE.sub(stash, line)
    if not masked.strip():
        return line

    # Keep list markers/headings while translating readable content.
    prefix_match = re.match(r"^(\s*(?:[#>*-]|\d+\.)\s+)", masked)
    prefix = prefix_match.group(1) if prefix_match else ""
    body = masked[len(prefix) :] if prefix else masked
    translated = translate_text(body) if body.strip() else body
    combined = f"{prefix}{translated}"

    for i, token in enumerate(protected):
        combined = combined.replace(f"@@P{i}@@", token)
    return combined


def translate_markdown(content: str) -> str:
    segments = FENCED_BLOCK_RE.split(content)
    output: list[str] = []
    for idx, segment in enumerate(segments):
        if idx % 2 == 1:
            output.append(segment)
            continue
        lines = segment.splitlines(keepends=True)
        for line in lines:
            # Preserve empty lines and obvious path-only lines.
            raw = line.strip()
            if not raw:
                output.append(line)
                continue
            if raw.startswith("---") and len(raw) <= 3:
                output.append(line)
                continue
            if raw.startswith("|") and raw.endswith("|"):
                output.append(line)
                continue
            output.append(translate_inline(line))
    return "".join(output)


def output_path(src: Path) -> Path:
    return src.with_name(f"{src.stem}.zh.md")


def main() -> None:
    files = sorted(p for p in DOCS_DIR.rglob("*.md") if not p.name.endswith(".zh.md"))
    for src in files:
        dst = output_path(src)
        if dst.exists() and dst.stat().st_mtime >= src.stat().st_mtime:
            print(f"skip: {dst.relative_to(ROOT)}")
            continue
        text = src.read_text(encoding="utf-8")
        zh = translate_markdown(text)
        dst.write_text(zh, encoding="utf-8")
        print(f"translated: {src.relative_to(ROOT)} -> {dst.relative_to(ROOT)}")

    index_zh = ROOT / "docs" / "index.zh.md"
    if not index_zh.exists():
        index_zh.write_text(
            "# LowDragMC 文档\n\n## 模块\n\n- [LDLib2](ldlib2/index.zh.md)\n",
            encoding="utf-8",
        )
        print(f"created: {index_zh.relative_to(ROOT)}")


if __name__ == "__main__":
    main()
