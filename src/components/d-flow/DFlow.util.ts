import {md5} from "js-md5";

const GOLDEN_ANGLE = 137.50776405003785

const extractIdNumber = (s: string) => {
    const m = s.match(/\/(\d+)\s*$/)
    return m ? Number(m[1]) : null
}

export const hashToColor = (s: string): string => {
    const n = extractIdNumber(s)
    if (n != null) {
        const range = 320
        const hue = 25 + ((n * GOLDEN_ANGLE) % range)
        return `hsl(${hue}, 100%, 72%)`
    }

    const h = md5(md5(s))
    const a = parseInt(h.slice(0, 8), 16)
    return `hsl(${25 + (a % 320)}, 100%, 72%)`
}