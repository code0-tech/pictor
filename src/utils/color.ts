import {md5} from "js-md5";

export type Color = "primary" | "secondary" | "tertiary" | "info" | "success" | "warning" | "error";

export const Colors: Color[] = ["primary", "secondary", "info", "success", "warning", "error"]

type RGBA = {
    r: number
    g: number
    b: number
    a: number
}

const GOLDEN_ANGLE = 137.50776405003785

const extractIdNumber = (s: string) => {
    const m = s.match(/\/(\d+)\s*$/)
    return m ? Number(m[1]) : null
}

export const hashToColor = (s: string, from: number = 25, to: number = 320): string => {
    const range = to - from;
    const n = extractIdNumber(s);
    if (n != null) {
        const hue = from + ((n * GOLDEN_ANGLE) % range);
        return `hsl(${hue}, 100%, 72%)`;
    }

    const h = md5(md5(s));
    const a = parseInt(h.slice(0, 8), 16);
    return `hsl(${from + (a % range)}, 100%, 72%)`;
}

const parseCssColorToRgba = (color: string): RGBA => {
    if (typeof document === "undefined") {
        return {r: 0, g: 0, b: 0, a: 1}
    }

    const el = document.createElement("span")
    el.style.color = color
    document.body.appendChild(el)

    const computed = getComputedStyle(el).color
    document.body.removeChild(el)

    const match = computed.match(
        /rgba?\(\s*([\d.]+)\s*,\s*([\d.]+)\s*,\s*([\d.]+)(?:\s*,\s*([\d.]+))?\s*\)/
    )

    if (!match) {
        return {r: 0, g: 0, b: 0, a: 1}
    }

    return {
        r: Math.round(Number(match[1])),
        g: Math.round(Number(match[2])),
        b: Math.round(Number(match[3])),
        a: match[4] !== undefined ? Number(match[4]) : 1,
    }
}

const clamp01 = (v: number) => Math.min(Math.max(v, 0), 1)

export const withAlpha = (color: string, alpha: number) => {
    const c = parseCssColorToRgba(color)
    return `rgba(${c.r}, ${c.g}, ${c.b}, ${clamp01(alpha)})`
}