#!/usr/bin/env python3
"""Generate English static version of MineCode pages under public/en."""

from __future__ import annotations

import json
import re
import shutil
import time
import urllib.parse
import urllib.request
from pathlib import Path

from lxml import html

ROOT = Path(__file__).resolve().parents[1]
PUBLIC_DIR = ROOT / "public"
EN_DIR = PUBLIC_DIR / "en"

CYRILLIC_RE = re.compile(r"[А-Яа-яЁё]")
LEAD_WS_RE = re.compile(r"^\s*")
TAIL_WS_RE = re.compile(r"\s*$")
SEP = "\n[[[FAIF_SEP]]]\n"
TRANSLATE_URL = "https://translate.googleapis.com/translate_a/single"


def has_cyrillic(text: str) -> bool:
    return bool(CYRILLIC_RE.search(text or ""))


def split_ws(text: str) -> tuple[str, str, str]:
    lead = LEAD_WS_RE.search(text).group(0)
    tail = TAIL_WS_RE.search(text).group(0)
    core = text[len(lead) : len(text) - len(tail) if tail else len(text)]
    return lead, core, tail


def request_translate(text: str) -> str:
    params = {
        "client": "gtx",
        "sl": "ru",
        "tl": "en",
        "dt": "t",
        "q": text,
    }
    url = f"{TRANSLATE_URL}?{urllib.parse.urlencode(params)}"

    for i in range(4):
        try:
            with urllib.request.urlopen(url, timeout=30) as resp:
                data = json.loads(resp.read().decode("utf-8"))
            return "".join(chunk[0] for chunk in data[0] if chunk and chunk[0])
        except Exception:
            if i == 3:
                return text
            time.sleep(0.5 * (i + 1))

    return text


def translate_many(strings: list[str]) -> dict[str, str]:
    if not strings:
        return {}

    out: dict[str, str] = {}
    queue = [s for s in strings if s and has_cyrillic(s)]
    idx = 0

    while idx < len(queue):
        batch: list[str] = []
        cur_len = 0
        while idx < len(queue):
            s = queue[idx]
            add = len(s) + len(SEP)
            # Keep URL reasonable for GET endpoint.
            if batch and cur_len + add > 1400:
                break
            batch.append(s)
            cur_len += add
            idx += 1

        joined = SEP.join(batch)
        translated_joined = request_translate(joined)
        parts = translated_joined.split(SEP)

        if len(parts) != len(batch):
            # Fallback to one-by-one if separator got mangled
            for s in batch:
                out[s] = request_translate(s)
        else:
            for src, dst in zip(batch, parts):
                out[src] = dst

    return out


def rewrite_href(href: str) -> str:
    if not href:
        return href
    if href.startswith("#") or href.startswith("mailto:") or href.startswith("http"):
        return href
    if href.startswith("/en"):
        return href

    if href == "/":
        return "/en"
    if href == "/course-map" or href == "/course-map.html":
        return "/en/course-map"
    if href.startswith("/lessons/"):
        return f"/en{href}"

    return href


def collect_text_nodes(tree):
    text_nodes = []
    for node in tree.xpath("//text()"):
        parent = node.getparent()
        if parent is None:
            continue
        if parent.tag in {"script", "style"}:
            continue
        text_nodes.append(node)
    return text_nodes


def translate_html_file(src: Path, global_cache: dict[str, str]) -> None:
    rel = src.relative_to(PUBLIC_DIR)
    out = EN_DIR / rel
    out.parent.mkdir(parents=True, exist_ok=True)

    raw = src.read_text(encoding="utf-8")
    tree = html.fromstring(raw)

    if tree.tag.lower() == "html":
        tree.set("lang", "en")

    text_nodes = collect_text_nodes(tree)

    needed: set[str] = set()
    text_refs: list[tuple[object, str, str, str]] = []

    for node in text_nodes:
        original = str(node)
        if not has_cyrillic(original):
            continue
        lead, core, tail = split_ws(original)
        if not core:
            continue
        text_refs.append((node, lead, core, tail))
        if core not in global_cache:
            needed.add(core)

    attr_refs: list[tuple[object, str, str]] = []
    attrs = ["title", "alt", "placeholder", "data-explanation", "data-answer"]

    for el in tree.xpath("//*[@title or @alt or @placeholder or @data-explanation or @data-answer]"):
        for attr in attrs:
            val = el.get(attr)
            if val and has_cyrillic(val):
                attr_refs.append((el, attr, val))
                if val not in global_cache:
                    needed.add(val)

    for meta in tree.xpath("//meta[@content]"):
        val = meta.get("content")
        if val and has_cyrillic(val):
            attr_refs.append((meta, "content", val))
            if val not in global_cache:
                needed.add(val)

    if needed:
        translated = translate_many(sorted(needed))
        global_cache.update(translated)

    for node, lead, core, tail in text_refs:
        translated_core = global_cache.get(core, core)
        new_text = f"{lead}{translated_core}{tail}"

        if getattr(node, "is_text", False):
            node.getparent().text = new_text
        elif getattr(node, "is_tail", False):
            node.getparent().tail = new_text

    for el, attr, original in attr_refs:
        el.set(attr, global_cache.get(original, original))

    for el in tree.xpath("//*[@href]"):
        el.set("href", rewrite_href(el.get("href")))

    rendered = html.tostring(tree, encoding="unicode", doctype="<!DOCTYPE html>", method="html")
    out.write_text(rendered, encoding="utf-8")


def main() -> None:
    if EN_DIR.exists():
        shutil.rmtree(EN_DIR)
    EN_DIR.mkdir(parents=True, exist_ok=True)

    html_files = sorted(p for p in PUBLIC_DIR.rglob("*.html") if "/es/" not in p.as_posix() and "/en/" not in p.as_posix())
    cache: dict[str, str] = {}

    for f in html_files:
        translate_html_file(f, cache)
        print(f"✓ {f.relative_to(PUBLIC_DIR)}")

    print(f"Done. Translated {len(html_files)} files")
    print(f"Cache: {len(cache)} unique strings")


if __name__ == "__main__":
    main()
