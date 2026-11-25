import json
import sys
from pathlib import Path
import pypdfium2 as pdfium
import pypdfium2.raw as pdfium_c


def rgb_to_hex(rgb):
    return "#{:02x}{:02x}{:02x}".format(int(rgb[0]), int(rgb[1]), int(rgb[2]))


def sample_box_colors(pil_img, left_px, top_px, right_px, bottom_px):
    W, H = pil_img.size
    # Sample 1-2px outside the box perimeter to get the true background color
    pad = 2
    border_pixels = []
    for x in range(max(0, left_px - pad), min(W, right_px + pad + 1), max(1, (right_px - left_px) // 8 or 1)):
        for y in (max(0, top_px - pad), min(H - 1, bottom_px + pad)):
            border_pixels.append(pil_img.getpixel((x, y))[:3])
    for y in range(max(0, top_px), min(H, bottom_px + 1), max(1, (bottom_px - top_px) // 4 or 1)):
        for x in (max(0, left_px - pad), min(W - 1, right_px + pad)):
            border_pixels.append(pil_img.getpixel((x, y))[:3])

    if not border_pixels:
        bg = (255, 255, 255)
    else:
        # Median RGB for clean flat background sampling
        rs = sorted(p[0] for p in border_pixels)
        gs = sorted(p[1] for p in border_pixels)
        bs = sorted(p[2] for p in border_pixels)
        mid = len(border_pixels) // 2
        bg = (rs[mid], gs[mid], bs[mid])

    # Find highest-contrast pixel inside the text box as the ink/foreground color
    best_fg = (15, 23, 42)
    best_dist = -1
    step_x = max(1, (right_px - left_px) // 18)
    step_y = max(1, (bottom_px - top_px) // 8)
    for x in range(max(0, left_px), min(W, right_px), step_x):
        for y in range(max(0, top_px), min(H, bottom_px), step_y):
            p = pil_img.getpixel((x, y))[:3]
            dist = abs(p[0] - bg[0]) + abs(p[1] - bg[1]) + abs(p[2] - bg[2])
            if dist > best_dist:
                best_dist = dist
                best_fg = p

    if best_dist < 40:
        lum = 0.299 * bg[0] + 0.587 * bg[1] + 0.114 * bg[2]
        best_fg = (255, 255, 255) if lum < 128 else (17, 24, 39)

    return rgb_to_hex(bg), rgb_to_hex(best_fg)


def main():
    if len(sys.argv) < 4:
        print(json.dumps({"error": "Usage: extract_pdf_layout.py <pdf_path> <hd_webp_out> <json_out>"}))
        sys.exit(1)

    pdf_path = Path(sys.argv[1])
    hd_out = Path(sys.argv[2])
    json_out = Path(sys.argv[3])

    hd_out.parent.mkdir(parents=True, exist_ok=True)
    json_out.parent.mkdir(parents=True, exist_ok=True)

    doc = pdfium.PdfDocument(str(pdf_path))
    page = doc[0]
    pw = float(page.get_width())
    ph = float(page.get_height())

    # Render crisp 1400px-wide high-res A4 sheet (exact match to original PDF design)
    target_w = 1400.0
    scale = target_w / max(pw, 1.0)
    bitmap = page.render(scale=scale)
    pil_img = bitmap.to_pil().convert("RGB")
    pil_img.save(hd_out, format="WEBP", quality=90, method=4)
    img_w, img_h = pil_img.size

    # 1. Extract text bounding boxes with exact sampled bg/fg colors
    tp = page.get_textpage()
    rect_count = tp.count_rects()
    text_boxes = []

    for i in range(rect_count):
        left, bottom, right, top = tp.get_rect(i)
        raw_txt = tp.get_text_bounded(left, bottom, right, top)
        txt = " ".join((raw_txt or "").split()).strip()
        if not txt:
            continue

        bw = max(right - left, 2.0)
        bh = max(top - bottom, 4.0)

        # Convert PDF bottom-left coords to top-left percentages
        x_pct = (left / pw) * 100.0
        y_pct = ((ph - top) / ph) * 100.0
        w_pct = (bw / pw) * 100.0
        h_pct = (bh / ph) * 100.0

        # Pixel coordinates for color sampling
        l_px = int((left / pw) * img_w)
        r_px = int((right / pw) * img_w)
        t_px = int(((ph - top) / ph) * img_h)
        b_px = int(((ph - bottom) / ph) * img_h)
        bg_hex, fg_hex = sample_box_colors(pil_img, l_px, t_px, r_px, b_px)

        text_boxes.append(
            {
                "id": f"tb-{i}",
                "text": txt,
                "xPct": round(max(0.0, x_pct), 3),
                "yPct": round(max(0.0, y_pct), 3),
                "wPct": round(min(100.0, w_pct), 3),
                "hPct": round(min(100.0, h_pct), 3),
                "bgColor": bg_hex,
                "fgColor": fg_hex,
                "isHeading": bh >= 13.0 or (len(txt) <= 28 and txt.isupper() and any(c.isalpha() for c in txt)),
            }
        )

    # Sort visually top-to-bottom, then left-to-right
    text_boxes.sort(key=lambda b: (round(b["yPct"] / 1.5), b["xPct"]))

    # 2. Extract embedded image objects (CV profile photos & graphics)
    image_boxes = []
    img_objs = list(page.get_objects(filter=[pdfium_c.FPDF_PAGEOBJ_IMAGE]))
    for idx, obj in enumerate(img_objs):
        try:
            left, bottom, right, top = obj.get_bounds()
        except Exception:
            continue
        bw = right - left
        bh = top - bottom
        # Skip tiny 1-2px artifacts or full-page background textures (> 85% page area)
        if bw < 28 or bh < 28:
            continue
        if (bw / pw) > 0.85 and (bh / ph) > 0.85:
            continue

        x_pct = (left / pw) * 100.0
        y_pct = ((ph - top) / ph) * 100.0
        w_pct = (bw / pw) * 100.0
        h_pct = (bh / ph) * 100.0

        l_px = int(max(0, (left / pw) * img_w))
        r_px = int(min(img_w - 1, (right / pw) * img_w))
        t_px = int(max(0, ((ph - top) / ph) * img_h))
        b_px = int(min(img_h - 1, ((ph - bottom) / ph) * img_h))
        bg_hex, _ = sample_box_colors(pil_img, l_px, t_px, r_px, b_px)

        # Heuristic: if corners of image box closely match outer bg, it's likely circular!
        aspect = bw / max(bh, 1.0)
        is_circle = 0.85 <= aspect <= 1.15

        image_boxes.append(
            {
                "id": f"ib-{idx}",
                "xPct": round(max(0.0, x_pct), 3),
                "yPct": round(max(0.0, y_pct), 3),
                "wPct": round(min(100.0, w_pct), 3),
                "hPct": round(min(100.0, h_pct), 3),
                "bgColor": bg_hex,
                "isCircle": is_circle,
                "area": round(bw * bh, 1),
            }
        )

    # Largest photo first (Main CV Portrait)
    image_boxes.sort(key=lambda b: b["area"], reverse=True)

    page.close()
    doc.close()

    result = {
        "pageWidth": round(pw, 2),
        "pageHeight": round(ph, 2),
        "textBoxes": text_boxes,
        "imageBoxes": image_boxes,
    }
    with open(json_out, "w", encoding="utf-8") as f:
        json.dump(result, f)

    print(json.dumps({"ok": True, "textBoxes": len(text_boxes), "imageBoxes": len(image_boxes)}))


if __name__ == "__main__":
    main()
