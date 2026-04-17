from pathlib import Path
import shutil


def define_env(env):
    def version_badge(version, label="Added", icon="tag-outline", href=None, tooltip="Minimum version"):
        icon_markup = f":material-{icon}:"
        version_link = href or f"#v{version}"

        return f'''
<span class="mdx-badge" title="{tooltip}">
  <span class="mdx-version-box">
    <span class="mdx-badge__icon">{icon_markup}</span>
    <span class="mdx-badge__text">
      <a href="{version_link}">{label} {version}</a>
    </span>
  </span>
</span>
        '''
    env.macro(version_badge)


def on_post_build(env):
    site_dir = Path(env.conf["site_dir"])
    docs_dir = Path(env.conf["docs_dir"])

    # Keep an /en prefixed mirror so both /en and /zh routes exist.
    en_dir = site_dir / "en"
    if en_dir.exists():
        shutil.rmtree(en_dir)
    en_dir.mkdir(parents=True, exist_ok=True)
    for item in site_dir.iterdir():
        if item.name in {"en", "zh"}:
            continue
        target = en_dir / item.name
        if item.is_dir():
            shutil.copytree(item, target)
        else:
            shutil.copy2(item, target)

    # Reuse ldlib2 static assets in /zh output without duplicating source files.
    zh_root = site_dir / "zh"
    ldlib2_src = docs_dir / "ldlib2"
    if zh_root.exists() and ldlib2_src.exists():
        for src in ldlib2_src.rglob("*"):
            if not src.is_file():
                continue
            if src.suffix.lower() == ".md":
                continue
            dst = zh_root / src.relative_to(docs_dir)
            dst.parent.mkdir(parents=True, exist_ok=True)
            shutil.copy2(src, dst)
