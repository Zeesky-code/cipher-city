#!/usr/bin/env python3
"""Generate a simple OG PNG without external dependencies.

Creates a 1200x630 PNG at frontend/public/og/sultanahmet.png.

Design goals:
- Parchment-like background with subtle vignette
- Dark ink title/subtitle and a small "seal" mark

This is intentionally minimal and deterministic.
"""

from __future__ import annotations

import binascii
import os
import struct
import zlib


WIDTH = 1200
HEIGHT = 630


def _crc32(data: bytes) -> int:
    return binascii.crc32(data) & 0xFFFFFFFF


def _png_chunk(chunk_type: bytes, data: bytes) -> bytes:
    assert len(chunk_type) == 4
    crc = _crc32(chunk_type + data)
    return struct.pack(">I", len(data)) + chunk_type + data + struct.pack(">I", crc)


def _clamp_u8(x: int) -> int:
    return 0 if x < 0 else 255 if x > 255 else x


def _put_pixel(buf: bytearray, x: int, y: int, r: int, g: int, b: int) -> None:
    if x < 0 or y < 0 or x >= WIDTH or y >= HEIGHT:
        return
    idx = y * WIDTH * 3 + x * 3
    buf[idx + 0] = _clamp_u8(r)
    buf[idx + 1] = _clamp_u8(g)
    buf[idx + 2] = _clamp_u8(b)


# A tiny 5x7 bitmap font for uppercase, numbers, space, and a few symbols.
FONT_5X7: dict[str, list[int]] = {
    " ": [0, 0, 0, 0, 0, 0, 0],
    "-": [0, 0, 0, 31, 0, 0, 0],
    ".": [0, 0, 0, 0, 0, 12, 12],
    ":": [0, 12, 12, 0, 12, 12, 0],
    "·": [0, 0, 0, 12, 12, 0, 0],
    "◆": [4, 14, 31, 14, 31, 14, 4],
    "✦": [4, 21, 14, 31, 14, 21, 4],
    "A": [14, 17, 17, 31, 17, 17, 17],
    "B": [30, 17, 17, 30, 17, 17, 30],
    "C": [14, 17, 16, 16, 16, 17, 14],
    "D": [30, 17, 17, 17, 17, 17, 30],
    "E": [31, 16, 16, 30, 16, 16, 31],
    "F": [31, 16, 16, 30, 16, 16, 16],
    "G": [14, 17, 16, 23, 17, 17, 14],
    "H": [17, 17, 17, 31, 17, 17, 17],
    "I": [31, 4, 4, 4, 4, 4, 31],
    "J": [7, 2, 2, 2, 2, 18, 12],
    "K": [17, 18, 20, 24, 20, 18, 17],
    "L": [16, 16, 16, 16, 16, 16, 31],
    "M": [17, 27, 21, 21, 17, 17, 17],
    "N": [17, 25, 21, 19, 17, 17, 17],
    "O": [14, 17, 17, 17, 17, 17, 14],
    "P": [30, 17, 17, 30, 16, 16, 16],
    "Q": [14, 17, 17, 17, 21, 18, 13],
    "R": [30, 17, 17, 30, 20, 18, 17],
    "S": [15, 16, 16, 14, 1, 1, 30],
    "T": [31, 4, 4, 4, 4, 4, 4],
    "U": [17, 17, 17, 17, 17, 17, 14],
    "V": [17, 17, 17, 17, 17, 10, 4],
    "W": [17, 17, 17, 21, 21, 21, 10],
    "X": [17, 17, 10, 4, 10, 17, 17],
    "Y": [17, 17, 10, 4, 4, 4, 4],
    "Z": [31, 1, 2, 4, 8, 16, 31],
    "0": [14, 17, 19, 21, 25, 17, 14],
    "1": [4, 12, 4, 4, 4, 4, 14],
    "2": [14, 17, 1, 2, 4, 8, 31],
    "3": [30, 1, 1, 14, 1, 1, 30],
    "4": [2, 6, 10, 18, 31, 2, 2],
    "5": [31, 16, 16, 30, 1, 1, 30],
    "6": [14, 16, 16, 30, 17, 17, 14],
    "7": [31, 1, 2, 4, 8, 8, 8],
    "8": [14, 17, 17, 14, 17, 17, 14],
    "9": [14, 17, 17, 15, 1, 1, 14],
}


def draw_text(
    rgb: bytearray,
    x: int,
    y: int,
    text: str,
    scale: int,
    color: tuple[int, int, int],
    tracking: int = 1,
) -> None:
    r, g, b = color
    cursor_x = x
    for ch in text:
        glyph = FONT_5X7.get(ch)
        if glyph is None:
            glyph = FONT_5X7[" "]
        for row in range(7):
            bits = glyph[row]
            for col in range(5):
                if bits & (1 << (4 - col)):
                    for dy in range(scale):
                        for dx in range(scale):
                            _put_pixel(rgb, cursor_x + col * scale + dx, y + row * scale + dy, r, g, b)
        cursor_x += (5 * scale) + (tracking * scale)


def main() -> int:
    # Base parchment
    rgb = bytearray(WIDTH * HEIGHT * 3)
    base = (231, 214, 172)
    for y in range(HEIGHT):
        for x in range(WIDTH):
            # Subtle vertical gradient + vignette
            t = y / (HEIGHT - 1)
            r = int(base[0] - 18 * t)
            g = int(base[1] - 26 * t)
            b = int(base[2] - 34 * t)

            dx = (x - WIDTH / 2) / (WIDTH / 2)
            dy = (y - HEIGHT / 2) / (HEIGHT / 2)
            v = dx * dx + dy * dy
            dark = int(28 * v)

            _put_pixel(rgb, x, y, r - dark, g - dark, b - dark)

    # Decorative border
    border = (124, 33, 24)
    for x in range(WIDTH):
        for y in (24, HEIGHT - 25):
            for k in range(2):
                _put_pixel(rgb, x, y + k, *border)
    for y in range(HEIGHT):
        for x in (24, WIDTH - 25):
            for k in range(2):
                _put_pixel(rgb, x + k, y, *border)

    # Title block
    ink = (22, 13, 6)
    accent = (124, 33, 24)

    draw_text(rgb, 86, 150, "THE SULTANAHMET CIPHER", scale=6, color=ink, tracking=2)
    draw_text(rgb, 92, 230, "A SYMBOLOGY HUNT", scale=4, color=accent, tracking=2)
    draw_text(rgb, 92, 275, "ISTANBUL · ON FOOT", scale=4, color=accent, tracking=2)

    # Simple seal (circle)
    cx, cy = 980, 220
    for y in range(cy - 70, cy + 71):
        for x in range(cx - 70, cx + 71):
            dx = x - cx
            dy = y - cy
            d2 = dx * dx + dy * dy
            if 62 * 62 <= d2 <= 68 * 68:
                _put_pixel(rgb, x, y, *accent)
            if d2 <= 54 * 54 and d2 >= 50 * 50:
                _put_pixel(rgb, x, y, *ink)
    draw_text(rgb, cx - 28, cy - 16, "✦", scale=8, color=accent, tracking=1)

    # Footer teaser
    draw_text(rgb, 86, 430, "SOLVE CIPHERS · UNLOCK SEALS · RECOVER FRAGMENTS", scale=3, color=ink, tracking=2)

    # Convert to PNG scanlines with filter byte 0
    raw = bytearray()
    stride = WIDTH * 3
    for y in range(HEIGHT):
        raw.append(0)
        raw.extend(rgb[y * stride : (y + 1) * stride])

    compressed = zlib.compress(bytes(raw), level=9)

    signature = b"\x89PNG\r\n\x1a\n"
    ihdr = struct.pack(">IIBBBBB", WIDTH, HEIGHT, 8, 2, 0, 0, 0)  # 8-bit, RGB
    chunks = [
        _png_chunk(b"IHDR", ihdr),
        _png_chunk(b"IDAT", compressed),
        _png_chunk(b"IEND", b""),
    ]

    out = signature + b"".join(chunks)

    repo_root = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
    out_path = os.path.join(repo_root, "frontend", "public", "og", "sultanahmet.png")
    os.makedirs(os.path.dirname(out_path), exist_ok=True)
    with open(out_path, "wb") as f:
        f.write(out)

    print(f"Wrote {out_path}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
