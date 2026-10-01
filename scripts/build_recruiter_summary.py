#!/usr/bin/env python3
"""Build the public recruiter-summary PDF from the portfolio HTML.

Requires ReportLab. From any working directory:
    python scripts/build_recruiter_summary.py

Only overview.html and the public Sailday case are read. Profile content remains
in those maintained pages; this script owns typography and PDF presentation.
ReportLab's bundled Vera fonts are embedded, so no system font or browser is
required. An invariant PDF avoids timestamps and makes repeated builds stable.
"""

from __future__ import annotations

import argparse
from dataclasses import dataclass, field
from html import escape
from html.parser import HTMLParser
from pathlib import Path
from urllib.parse import urljoin, urlparse

import reportlab
from reportlab.lib import colors
from reportlab.lib.enums import TA_LEFT
from reportlab.lib.pagesizes import letter
from reportlab.lib.styles import ParagraphStyle
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont
from reportlab.pdfgen import canvas
from reportlab.platypus import Paragraph


ROOT = Path(__file__).resolve().parents[1]
VOID = {"area", "base", "br", "col", "embed", "hr", "img", "input", "link", "meta", "param", "source", "track", "wbr"}
INK = colors.HexColor("#172b3e")
MUTED = colors.HexColor("#506072")
ACCENT = colors.HexColor("#126f80")
RULE = colors.HexColor("#ccd8df")


@dataclass
class Node:
    tag: str
    attrs: dict[str, str] = field(default_factory=dict)
    children: list[Node | str] = field(default_factory=list)

    def all(self, tag: str | None = None, cls: str | None = None) -> list[Node]:
        found = []
        for child in self.children:
            if isinstance(child, Node):
                if (tag is None or child.tag == tag) and (cls is None or cls in child.attrs.get("class", "").split()):
                    found.append(child)
                found.extend(child.all(tag, cls))
        return found

    def one(self, tag: str | None = None, cls: str | None = None) -> Node:
        found = self.all(tag, cls)
        if len(found) != 1:
            raise ValueError(f"Expected one {tag or '*'} / {cls or '*'}; found {len(found)}")
        return found[0]

    def text(self) -> str:
        return clean(" ".join(child.text() if isinstance(child, Node) else child for child in self.children))

    def rich(self) -> str:
        parts = []
        for child in self.children:
            if isinstance(child, str):
                parts.append(escape(typography(child)))
            elif child.tag in {"strong", "b"}:
                parts.append(f"<b>{child.rich()}</b>")
            elif child.tag in {"em", "i"}:
                parts.append(f"<i>{child.rich()}</i>")
            else:
                parts.append(child.rich())
        return "".join(parts).strip()


class TreeParser(HTMLParser):
    def __init__(self) -> None:
        super().__init__(convert_charrefs=True)
        self.root = Node("root")
        self.stack = [self.root]

    def handle_starttag(self, tag, attrs):
        node = Node(tag, dict(attrs))
        self.stack[-1].children.append(node)
        if tag not in VOID:
            self.stack.append(node)

    def handle_startendtag(self, tag, attrs):
        self.handle_starttag(tag, attrs)
        if tag not in VOID:
            self.stack.pop()

    def handle_endtag(self, tag):
        for i in range(len(self.stack) - 1, 0, -1):
            if self.stack[i].tag == tag:
                del self.stack[i:]
                return

    def handle_data(self, data):
        self.stack[-1].children.append(data)


def typography(value: str) -> str:
    replacements = {"\u2010": "-", "\u2011": "-", "\u2012": "-", "\u2013": "-", "\u2014": " - ", "\u2018": "'", "\u2019": "'", "\u201c": '"', "\u201d": '"', "\u00b7": " | ", "\u2197": "", "\u2192": "", "\u00a0": " "}
    for old, new in replacements.items():
        value = value.replace(old, new)
    return value


def clean(value: str) -> str:
    return " ".join(typography(value).split())


def read_tree(path: Path) -> Node:
    parser = TreeParser()
    parser.feed(path.read_text(encoding="utf-8-sig"))
    return parser.root


def public_link(url: str, base: str) -> str:
    target = urljoin(base, url)
    if urlparse(target).scheme not in {"https", "mailto"}:
        raise ValueError(f"Unexpected public-link scheme: {target}")
    return target


def linked(label: str, href: str) -> str:
    return f'<link href="{escape(href, quote=True)}" color="#126f80">{escape(label)}</link>'


@dataclass
class Project:
    name: str
    status: str
    description: str
    stack: str
    url: str


def extract(source: Path) -> dict:
    tree = read_tree(source)
    base = next(n.attrs["href"] for n in tree.all("link") if n.attrs.get("rel") == "canonical")
    main = tree.one("main")
    sections = main.all("section", "summary-section")
    by_heading = {s.one("h2").text(): s for s in sections}
    experience = by_heading["Industry experience"]
    role = experience.one("div", "summary-role")
    projects = []
    for article in by_heading["Selected projects"].all("article"):
        anchor = article.one("h3").one("a")
        projects.append(Project(anchor.text(), article.one("span").text(), article.one("p").text(), article.one("small").text(), public_link(anchor.attrs["href"], base)))
    if not any(p.name == "Sailday" for p in projects):
        sailday = read_tree(source.parent / "projects" / "sailday.html")
        hero = sailday.one("div", "cs-hero")
        status = next(n for n in hero.all("div") if n.all("h2") and n.all("h2")[0].text() == "Project status").one("p").text().split(".", 1)[0]
        metadata = hero.one("dl", "cs-meta")
        stack = next(n.one("dd").text() for n in metadata.all("div") if n.one("dt").text() == "Stack")
        collection = next(n for n in sailday.all("div", "decision") if n.one("h3").text() == "1. Collect public rates")
        scheduling = collection.all("p")[0].text().split(". ", 1)[1]
        projects.append(Project("Sailday", f"{status} / Private source", f"{hero.one('p', 'lede').text()} {scheduling}", stack, public_link("projects/sailday.html#prices", base)))
    expected = {"SignalBridge", "BetTail", "Netted", "Downfield", "Sailday"}
    if {p.name for p in projects} != expected or len(projects) != 5:
        raise ValueError("The recruiter summary must contain the five documented projects")
    contacts = main.one("div", "summary-contacts")
    return {
        "name": main.one("h1").text(),
        "position": main.one("p", "summary-position").text(),
        "intro": main.one("p", "summary-intro").text(),
        "availability": contacts.one("strong").text(),
        "graduation": contacts.one("span").text(),
        "contacts": [(n.text(), public_link(n.attrs["href"], base)) for n in contacts.all("a")],
        "role": role.one("h3").text(),
        "role_dates": role.one("span").text(),
        "experience": [n.rich() for n in experience.all("li")],
        "education": [n.rich() for n in by_heading["Education & credentials"].all("p")],
        "projects": projects,
        "disclosure": main.one("p", "summary-disclosure").text(),
        "evidence": [(n.text(), public_link(n.attrs["href"], base)) for n in main.one("p", "summary-evidence").all("a")],
        "portfolio": next(public_link(n.attrs["href"], base) for n in contacts.all("a") if n.text() == "Portfolio"),
    }


def styles() -> dict[str, ParagraphStyle]:
    font_root = Path(reportlab.__file__).resolve().parent / "fonts"
    for name, filename in [("Summary", "Vera.ttf"), ("SummaryBold", "VeraBd.ttf"), ("SummaryItalic", "VeraIt.ttf")]:
        pdfmetrics.registerFont(TTFont(name, font_root / filename))
    pdfmetrics.registerFontFamily("Summary", normal="Summary", bold="SummaryBold", italic="SummaryItalic", boldItalic="SummaryBold")
    return {
        "body": ParagraphStyle("body", fontName="Summary", fontSize=10.1, leading=13.4, textColor=INK, alignment=TA_LEFT),
        "small": ParagraphStyle("small", fontName="Summary", fontSize=10, leading=12.6, textColor=MUTED),
        "heading": ParagraphStyle("heading", fontName="SummaryBold", fontSize=11, leading=14, textColor=INK),
        "project": ParagraphStyle("project", fontName="SummaryBold", fontSize=11.5, leading=15, textColor=INK),
        "label": ParagraphStyle("label", fontName="SummaryBold", fontSize=10, leading=13, textColor=ACCENT),
        "name": ParagraphStyle("name", fontName="SummaryBold", fontSize=27, leading=34, textColor=INK),
        "position": ParagraphStyle("position", fontName="Summary", fontSize=11, leading=15, textColor=MUTED),
    }


def para(text: str, style: ParagraphStyle, width: float) -> tuple[Paragraph, float]:
    p = Paragraph(text, style)
    _, height = p.wrap(width, 10000)
    return p, height


def draw(p: Paragraph, height: float, pdf: canvas.Canvas, x: float, y: float) -> float:
    p.drawOn(pdf, x, y - height)
    return y - height


def build(source: Path, output: Path) -> dict:
    data = extract(source)
    st = styles()
    width, height = letter
    margin = 34
    content_width = width - 2 * margin
    left_width, gap = 174, 24
    right_width = content_width - left_width - gap
    right_x = margin + left_width + gap
    output.parent.mkdir(parents=True, exist_ok=True)
    pdf = canvas.Canvas(str(output), pagesize=letter, invariant=1, pageCompression=1)
    pdf.setTitle(f"Recruiter summary - {data['name']}")
    pdf.setAuthor(data["name"])
    pdf.setSubject("Public experience, education and software-project portfolio")

    def place(text, style, x, y, w, after=0):
        p, h = para(text, st[style], w)
        return draw(p, h, pdf, x, y) - after

    y = height - margin
    y = place("RECRUITER SUMMARY", "label", margin, y, content_width, 4)
    y = place(escape(data["name"]), "name", margin, y, content_width, 1)
    y = place(escape(data["position"]), "position", margin, y, content_width, 8)
    y = place(escape(data["intro"]), "body", margin, y, content_width, 6)
    y = place(f"<b>{escape(data['availability'])}</b> | {escape(data['graduation'])}", "small", margin, y, content_width, 3)
    y = place(" &nbsp; | &nbsp; ".join(linked(label, href) for label, href in data["contacts"]), "small", margin, y, content_width, 10)
    pdf.setStrokeColor(RULE)
    pdf.setLineWidth(0.65)
    pdf.line(margin, y + 5, width - margin, y + 5)
    column_top = y - 5

    footer_items = [para(escape(data["disclosure"]), st["small"], content_width), para(" &nbsp; | &nbsp; ".join(linked(label, href) for label, href in data["evidence"]), st["small"], content_width)]
    footer_height = sum(item[1] for item in footer_items) + 17
    bottom = margin + footer_height

    # Measure whole project cards before drawing; never split a card or shrink
    # body type to fit. A second page is used only if source expansion needs it.
    cards = []
    for project in data["projects"]:
        heading = f'{linked(project.name, project.url)} <font name="Summary" size="10" color="#506072"> / {escape(project.status)}</font>'
        parts = [para(heading, st["project"], right_width), para(escape(project.description), st["body"], right_width), para(escape(project.stack), st["small"], right_width)]
        cards.append((parts, sum(p[1] for p in parts) + 12))

    left_y = place("Industry experience", "heading", margin, column_top, left_width, 7)
    left_y = place(escape(data["role"]).replace(" / ", "<br/>"), "project", margin, left_y, left_width, 4)
    left_y = place(escape(data["role_dates"]), "small", margin, left_y, left_width, 8)
    for bullet in data["experience"]:
        pdf.setFillColor(ACCENT)
        pdf.rect(margin, left_y - 7, 2.5, 2.5, fill=1, stroke=0)
        left_y = place(bullet, "body", margin + 10, left_y, left_width - 10, 7)
    left_y -= 9
    left_y = place("Education &amp; credentials", "heading", margin, left_y, left_width, 7)
    for item in data["education"]:
        left_y = place(item, "body", margin, left_y, left_width, 8)
    if left_y < bottom:
        raise ValueError("Experience and education exceeded the available page; revise the source or layout")

    right_y = place("Selected projects", "heading", right_x, column_top, right_width, 7)
    pages = 1
    for parts, card_height in cards:
        if right_y - card_height < bottom:
            pdf.showPage()
            pages += 1
            top = height - margin
            top = place("RECRUITER SUMMARY / CONTINUED", "label", margin, top, content_width, 6)
            top = place(escape(data["name"]), "name", margin, top, content_width, 8)
            top = place(linked("Full portfolio and project evidence", data["portfolio"]), "small", margin, top, content_width, 16)
            right_y = top
        for i, (p, h) in enumerate(parts):
            right_y = draw(p, h, pdf, right_x, right_y) - (4 if i == 0 else 2)
        right_y -= 4
    footer_y = margin + footer_height - 8
    pdf.setStrokeColor(RULE)
    pdf.line(margin, footer_y + 8, width - margin, footer_y + 8)
    for p, h in footer_items:
        footer_y = draw(p, h, pdf, margin, footer_y) - 3
    pdf.save()
    if pages > 2:
        raise ValueError("The public recruiter summary expanded beyond two pages")
    return {"pages": pages, "projects": len(cards), "minimum_body_pt": 10, "output": str(output)}


def main() -> None:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--source", type=Path, default=ROOT / "overview.html")
    parser.add_argument("--output", type=Path, default=ROOT / "assets" / "docs" / "aman-agarwal-recruiter-summary.pdf")
    args = parser.parse_args()
    result = build(args.source.resolve(), args.output.resolve())
    print(result)


if __name__ == "__main__":
    main()
