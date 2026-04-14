import {md5} from "js-md5";

export type Color = "primary" | "secondary" | "tertiary" | "info" | "success" | "warning" | "error";

export const Colors: Color[] = ["primary", "secondary", "info", "success", "warning", "error"]


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