"""Import reviewed, script-free public page templates from the Emons reference.

Run with Python packages beautifulsoup4 and requests installed, then run
`node scripts/scope-reference.mjs`. Nothing from the reference's JavaScript,
analytics, chat services, or submission endpoints is executed or retained.
"""
import concurrent.futures
import hashlib
import json
import re
import xml.etree.ElementTree as ET
from pathlib import Path
from urllib.parse import urljoin, urlparse, unquote

import requests
from bs4 import BeautifulSoup, Comment

ROOT = Path(__file__).resolve().parents[1]
ORIGIN = "https://www.emons.de"
CONTENT = ROOT / "src/content/reference"
ASSETS = ROOT / "public/reference/internal"
CACHE = Path("/tmp/emons-reference-cache")
for directory in (CONTENT, ASSETS, CACHE):
    directory.mkdir(parents=True, exist_ok=True)


def fetch(url):
    path = CACHE / hashlib.sha256(url.encode()).hexdigest()
    if path.exists():
        return path.read_bytes()
    response = requests.get(url, timeout=45)
    response.raise_for_status()
    path.write_bytes(response.content)
    return response.content


sitemap = ET.fromstring(fetch(ORIGIN + "/sitemap.xml"))
urls = [node.text for node in sitemap.iter() if node.tag.endswith("}loc")
        and node.text.startswith(ORIGIN + "/en/")]
urls = [url for url in urls if not url.endswith("frachtanfrage-formular-old")]
urls += [ORIGIN + "/en/munz-ldb"]
paths = {urlparse(url).path for url in urls}
pages = {}


def load_page(url):
    try:
        return url, BeautifulSoup(fetch(url), "html.parser")
    except requests.RequestException as error:
        print("Page unavailable:", url, str(error), flush=True)
        return url, None


with concurrent.futures.ThreadPoolExecutor(max_workers=8) as pool:
    for url, soup in pool.map(load_page, urls):
        if soup and soup.find("main"):
            pages[urlparse(url).path] = soup
print("Fetched", len(pages), "pages", flush=True)

known_assets = json.loads((ROOT / "public/reference/asset-sources.json").read_text())["assets"]
asset_map = {url: "/reference/" + name for name, url in known_assets.items() if url.startswith("https://")}
asset_urls = set()
stylesheets = set()
for soup in pages.values():
    stylesheets.update(link["href"] for link in soup.select('link[rel="stylesheet"]')
                       if "website-files.com" in link["href"])
    for tag in soup.find_all(["img", "source", "video"]):
        for attr in ("src", "poster"):
            url = tag.get(attr, "")
            if url.startswith("https://cdn.prod.website-files.com/"):
                asset_urls.add(url)

css = "\n".join(fetch(url).decode() for url in sorted(stylesheets))
all_css = css + "\n".join(style.text for soup in pages.values() for style in soup.find_all("style"))
asset_urls.update(re.findall(r'url\([\"\']?(https://[^\s\)\"\']+)', all_css))


def download_asset(url):
    if url in asset_map:
        return url, asset_map[url]
    if "placeholder.60f9b1840c.svg" in url:
        return url, "/reference/internal/placeholder.svg"
    extension = Path(unquote(urlparse(url).path)).suffix.lower()
    if extension not in (".webp", ".png", ".jpg", ".jpeg", ".svg", ".gif", ".woff", ".woff2", ".mp4", ".avif"):
        return url, url
    name = hashlib.sha256(url.encode()).hexdigest()[:18] + extension
    target = ASSETS / name
    try:
        if not target.exists():
            target.write_bytes(fetch(url))
        return url, "/reference/internal/" + name
    except requests.RequestException as error:
        print("Asset unavailable:", url, str(error), flush=True)
        return url, url


with concurrent.futures.ThreadPoolExecutor(max_workers=8) as pool:
    asset_map.update(pool.map(download_asset, sorted(asset_urls)))
print("Downloaded", len(asset_urls), "assets", flush=True)


def local_url(url):
    if url in asset_map:
        return asset_map[url]
    if url.startswith(ORIGIN):
        url = url[len(ORIGIN):]
    if url.startswith("/en/old-frachtanfrage") or url.startswith("/en/frachtanfrage-formular-old"):
        return "/en/frachtanfrage"
    if url == "/en" or url.startswith("/en#"):
        return "/" + url[3:]
    if url.startswith("/") and not url.startswith("/en/"):
        return ORIGIN + url
    return url


def rewrite_css(text):
    for url, local in asset_map.items():
        text = text.replace(url, local)
    return text


def clean(element):
    for tag in element.find_all(["script", "noscript", "style", "rasa-chat", "object", "embed"]):
        tag.decompose()
    for comment in element.find_all(string=lambda text: isinstance(text, Comment)):
        comment.extract()
    for tag in element.find_all(True):
        for attr in list(tag.attrs):
            if attr.lower().startswith("on") or attr in ("data-redirect", "data-wf-page-id", "data-wf-element-id", "data-wf-locale-id"):
                del tag[attr]
        for attr in ("src", "href", "poster"):
            if attr in tag.attrs:
                tag[attr] = local_url(tag[attr])
                if attr == "src" and "google.com/maps/embed" in tag[attr]:
                    tag[attr] = re.sub(r"\s+", "", tag[attr])
                if tag[attr].lower().startswith("javascript:"):
                    tag[attr] = "#"
        if tag.name == "img":
            tag.attrs.pop("srcset", None)
            tag.attrs.pop("sizes", None)
        if "style" in tag.attrs:
            tag["style"] = rewrite_css(tag["style"])
        if tag.name == "form" and (tag.get("fs-list-element") == "filters" or tag.get("fs-cmsfilter-element") == "filters"):
            tag["action"] = "#"
        elif tag.name == "form" and tag.get("action") != "/en/search":
            tag["action"] = "/api/inquiries"
            tag["novalidate"] = ""
        if tag.name == "iframe" and "leafworks.de" in tag.get("src", ""):
            # Remote forms are replaced by a local, accessible form component.
            placeholder = element.new_tag("div") if isinstance(element, BeautifulSoup) else BeautifulSoup("", "html.parser").new_tag("div")
            placeholder["data-contact-form"] = ""
            tag.replace_with(placeholder)
        elif tag.name == "iframe":
            tag["title"] = "Location map"
            tag["loading"] = "lazy"
        if tag.name == "input" and tag.get("type") == "checkbox" and tag.get("required") is not None:
            tag.attrs.pop("checked", None)
        for old, new in (("viewbox", "viewBox"), ("preserveaspectratio", "preserveAspectRatio"), ("gradientunits", "gradientUnits"), ("gradienttransform", "gradientTransform")):
            if old in tag.attrs:
                tag[new] = tag.attrs.pop(old)
        if tag.name in ("clippath", "lineargradient", "radialgradient"):
            tag.name = {"clippath": "clipPath", "lineargradient": "linearGradient", "radialgradient": "radialGradient"}[tag.name]
    return str(element)


manifest = {}
shared = pages["/en/leistungen"]
chrome = {
    "navigation": clean(shared.select_one(".navbar_out-wrap")),
    "footer": clean(shared.find("footer")),
}
(CONTENT / "chrome.json").write_text(json.dumps(chrome, ensure_ascii=False))
(CONTENT / "original.css").write_text(rewrite_css(css))
for path, soup in pages.items():
    name = path.removeprefix("/en/").replace("/", "--")
    description = soup.select_one('meta[name="description"]')
    title = soup.title.get_text() if soup.title else "Emons"
    styles = "\n".join(style.text for style in soup.find_all("style")
                       if "html.w-mod-js:not(.w-mod-ix3)" not in style.text)
    main = soup.find("main")
    search_text = main.get_text(" ", strip=True)
    h1 = main.find("h1")
    manifest[path] = {
        "file": name,
        "title": title,
        "heading": h1.get_text(" ", strip=True) if h1 else title,
        "description": description.get("content", "") if description else "",
        "searchText": search_text[:3500],
        "theme": soup.body.get("theme", "dark"),
        "source": ORIGIN + path,
    }
    (CONTENT / (name + ".html")).write_text(clean(main), encoding="utf-8")
    (CONTENT / (name + ".css")).write_text(rewrite_css(styles), encoding="utf-8")
(CONTENT / "manifest.json").write_text(json.dumps(manifest, ensure_ascii=False, indent=2))
(CONTENT / "assets.json").write_text(json.dumps({k: v for k, v in asset_map.items() if k in asset_urls}, indent=2))
print("Imported", len(manifest), "script-free internal pages", flush=True)
