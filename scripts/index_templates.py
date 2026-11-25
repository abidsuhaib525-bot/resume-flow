import json
import os
import re
from pathlib import Path
import pypdfium2 as pdfium

ROOT = Path(__file__).resolve().parents[2]
BUNDLE_DIR = ROOT / "Professional CV Resume Bundle"
OUT_JSON = ROOT / "web" / "src" / "data" / "templates.json"
OUT_THUMBS = ROOT / "web" / "public" / "thumbnails"

OUT_JSON.parent.mkdir(parents=True, exist_ok=True)
OUT_THUMBS.mkdir(parents=True, exist_ok=True)

CATEGORIES = [
    "Executive",
    "Creative & Design",
    "Tech & Engineering",
    "Minimalist",
    "Academic",
]

ARCHETYPES = [
    "executive",
    "swiss",
    "editorial",
    "modern-sidebar",
    "technical",
    "minimal",
]

STYLE_NAMES = [
    "Executive Clarity",
    "Swiss Architect",
    "Editorial Press",
    "Modern Product",
    "Nordic Minimal",
    "Atelier Serif",
    "Tech Lead",
    "Studio Director",
    "Monograph Grid",
    "Zurich Clean",
    "Capital Brief",
    "Vanguard Split",
    "Linear Pro",
    "Kinetix Resume",
    "Oxford Classic",
    "Craft Folio",
    "Apex Executive",
    "Aether Minimal",
    "Foundry Grid",
    "Solstice Clean",
    "Vector Studio",
    "Meridian Two-Col",
    "Slate Precision",
    "Canvas Editorial",
    "Aura Modern",
    "Vertex Technical",
    "Prism Creative",
    "Summit Lead",
    "Cortex Engineer",
    "Noir Contrast",
]

ACCENT_PALETTE = [
    "#107C41",
    "#0F172A",
    "#1D4ED8",
    "#B45309",
    "#0F766E",
    "#4338CA",
    "#BE123C",
    "#374151",
]


def extract_vol_num(name: str) -> int:
    m = re.search(r"vol\.?\s*(\d+)", name, re.IGNORECASE)
    return int(m.group(1)) if m else 999


def is_cv_pdf(p: Path) -> bool:
    low = p.name.lower()
    if p.suffix.lower() != ".pdf":
        return False
    if any(skip in low for skip in ["help", "readme", "guide", "instruction", "font", "license"]):
        return False
    return True


def render_pdf_thumbnail(pdf_path: Path, out_path: Path) -> bool:
    if out_path.exists():
        return True
    try:
        pdf = pdfium.PdfDocument(str(pdf_path))
        if len(pdf) == 0:
            return False
        page = pdf[0]
        # Render at ~620px width for crisp retina A4 cards
        width = page.get_width()
        scale = 620.0 / max(width, 1.0)
        bitmap = page.render(scale=scale)
        pil_image = bitmap.to_pil().convert("RGB")
        pil_image.save(out_path, format="WEBP", quality=84, method=4)
        page.close()
        pdf.close()
        return True
    except Exception as e:
        print(f"WARN: failed to render {pdf_path}: {e}")
        return False


def main():
    series_dirs = [
        ("InDesign", BUNDLE_DIR / "Adobe Indesign (57)"),
        ("Illustrator", BUNDLE_DIR / "Adobe Illustrator (46)"),
    ]

    templates = []
    idx = 0

    for series_name, sdir in series_dirs:
        if not sdir.exists():
            continue
        folders = [d for d in sdir.iterdir() if d.is_dir()]
        folders.sort(key=lambda d: (extract_vol_num(d.name), d.name.lower()))

        for folder in folders:
            vol_num = extract_vol_num(folder.name)
            pdfs = sorted(
                [p for p in folder.rglob("*.pdf") if is_cv_pdf(p)],
                key=lambda p: p.name.lower(),
            )
            docxs = sorted(
                [p for p in folder.rglob("*.docx") if not p.name.startswith("~$")],
                key=lambda p: p.name.lower(),
            )
            if not pdfs and not docxs:
                continue

            primary_pdf = pdfs[0] if pdfs else None
            primary_docx = docxs[0] if docxs else None

            slug_series = "id" if series_name == "InDesign" else "ai"
            tid = f"{slug_series}-vol-{vol_num:02d}"
            # Ensure unique ID
            existing_ids = {t["id"] for t in templates}
            if tid in existing_ids:
                tid = f"{tid}-{idx}"

            thumb_file = OUT_THUMBS / f"{tid}.webp"
            has_thumb = False
            if primary_pdf:
                has_thumb = render_pdf_thumbnail(primary_pdf, thumb_file)

            style_name = STYLE_NAMES[idx % len(STYLE_NAMES)]
            category = CATEGORIES[idx % len(CATEGORIES)]
            archetype = ARCHETYPES[idx % len(ARCHETYPES)]
            accent = ACCENT_PALETTE[idx % len(ACCENT_PALETTE)]

            # Collect variants if multiple PDFs/DOCXs exist
            variants = []
            for p in pdfs:
                rel = str(p.relative_to(BUNDLE_DIR)).replace("\\", "/")
                variants.append({"label": p.stem, "format": "pdf", "relPath": rel})
            for d in docxs:
                rel = str(d.relative_to(BUNDLE_DIR)).replace("\\", "/")
                variants.append({"label": d.stem, "format": "docx", "relPath": rel})

            templates.append(
                {
                    "id": tid,
                    "volume": vol_num,
                    "title": f"Vol. {vol_num:02d} — {style_name}",
                    "shortTitle": f"Vol. {vol_num:02d} {style_name.split()[0]}",
                    "series": series_name,
                    "category": category,
                    "archetype": archetype,
                    "accentColor": accent,
                    "atsScore": 94 + (idx % 6),
                    "pages": 1 if (idx % 3 != 0) else 2,
                    "hasPdf": primary_pdf is not None,
                    "hasDocx": primary_docx is not None,
                    "pdfRelPath": str(primary_pdf.relative_to(BUNDLE_DIR)).replace("\\", "/") if primary_pdf else None,
                    "docxRelPath": str(primary_docx.relative_to(BUNDLE_DIR)).replace("\\", "/") if primary_docx else None,
                    "thumbnail": f"/thumbnails/{tid}.webp" if has_thumb else None,
                    "variantCount": max(len(pdfs), len(docxs)),
                    "variants": variants,
                    "featured": idx < 12,
                }
            )
            idx += 1

    with open(OUT_JSON, "w", encoding="utf-8") as f:
        json.dump(templates, f, indent=2)

    print(f"Indexed {len(templates)} templates. Thumbnails generated: {sum(1 for t in templates if t['thumbnail'])}")


if __name__ == "__main__":
    main()
