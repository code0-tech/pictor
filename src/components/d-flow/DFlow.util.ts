import {md5} from "js-md5";

const hashToHue = (md5: string): number => {
    const int = parseInt(md5.slice(0, 8), 16)
    return 25 + (int % (345 - 25))
}

export const hashToColor = (string: string): string => {
    const hue = hashToHue(md5(md5(string)))
    return `hsl(${hue}, 100%, 72%)`
}