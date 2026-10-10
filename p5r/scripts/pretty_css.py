from __future__ import annotations

from pathlib import Path


def pretty_css(css: str) -> str:
    out: list[str] = []
    indent = 0
    in_str: str | None = None
    escape = False

    for ch in css:
        if in_str is not None:
            out.append(ch)
            if escape:
                escape = False
            elif ch == "\\":
                escape = True
            elif ch == in_str:
                in_str = None
            continue

        if ch == '"' or ch == "'":
            in_str = ch
            out.append(ch)
            continue

        if ch == "{":
            out.append(" {\n")
            indent += 1
            out.append("  " * indent)
        elif ch == "}":
            indent = max(indent - 1, 0)
            out.append("\n" + "  " * indent + "}\n" + "  " * indent)
        elif ch == ";":
            out.append(";\n" + "  " * indent)
        else:
            out.append(ch)

    pretty = "".join(out)
    # Recover any accidental breaks inside url(data:...;base64,...)
    pretty = pretty.replace("url(data:image/png;\n", "url(data:image/png;")
    pretty = pretty.replace("url(data:font/woff2;\n", "url(data:font/woff2;")
    pretty = pretty.replace("url(data:font/woff;\n", "url(data:font/woff;")
    pretty = pretty.replace(";\n  base64,", ";base64,")
    pretty = pretty.replace(";  base64,", ";base64,")
    pretty = pretty.replace("; base64,", ";base64,")
    while "\n\n" in pretty:
        pretty = pretty.replace("\n\n", "\n")
    if not pretty.endswith("\n"):
        pretty += "\n"
    return pretty


def main() -> None:
    root = Path(__file__).resolve().parents[1]
    src = root / "shared" / "p5ui" / "css" / "p5-ui.css"
    dst = root / "shared" / "p5ui" / "css" / "p5-ui.pretty.css"

    css = src.read_text(encoding="utf-8")
    dst.write_text(pretty_css(css), encoding="utf-8")
    print(f"Wrote {dst} ({dst.stat().st_size} bytes)")


if __name__ == "__main__":
    main()

