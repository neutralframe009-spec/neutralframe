#!/usr/bin/env python3
"""Generate Neutral Frame OGP image (1200x630, white background, centered logo)."""

from pathlib import Path

from PIL import Image, ImageDraw, ImageFont

ROOT = Path(__file__).resolve().parents[1]
FONT_PATH = ROOT / "assets/fonts/Oswald-Variable.ttf"
OUT_PATH = ROOT / "assets/og-image.png"

WIDTH, HEIGHT = 1200, 630
BG = "#ffffff"
INK = "#111111"
DOT = (17, 17, 17, 77)  # rgba(17,17,17,0.3) on white
FONT_SIZE = 72


def load_font(size: int) -> ImageFont.FreeTypeFont:
    font = ImageFont.truetype(str(FONT_PATH), size=size)
    try:
        font.set_variation_by_axes([700])
    except Exception:
        pass
    return font


def main() -> None:
    image = Image.new("RGB", (WIDTH, HEIGHT), BG)
    draw = ImageDraw.Draw(image)

    main_text = "Neutral Frame"
    dot_text = "."
    font = load_font(FONT_SIZE)

    main_bbox = draw.textbbox((0, 0), main_text, font=font)
    dot_bbox = draw.textbbox((0, 0), dot_text, font=font)

    main_w = main_bbox[2] - main_bbox[0]
    dot_w = dot_bbox[2] - dot_bbox[0]
    text_h = main_bbox[3] - main_bbox[1]
    total_w = main_w + dot_w

    x = (WIDTH - total_w) // 2
    y = (HEIGHT - text_h) // 2 - main_bbox[1]

    draw.text((x, y), main_text, font=font, fill=INK)

    dot_layer = Image.new("RGBA", image.size, (0, 0, 0, 0))
    dot_draw = ImageDraw.Draw(dot_layer)
    dot_draw.text((x + main_w, y), dot_text, font=font, fill=DOT)
    image = Image.alpha_composite(image.convert("RGBA"), dot_layer).convert("RGB")

    OUT_PATH.parent.mkdir(parents=True, exist_ok=True)
    image.save(OUT_PATH, format="PNG", optimize=True)
    print(f"Wrote {OUT_PATH} ({WIDTH}x{HEIGHT})")


if __name__ == "__main__":
    main()
