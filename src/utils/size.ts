import {CSSProperties} from "react";

export type Sizes = "xxxs" | "xxs" | "xs" | "sm" | "md" | "lg" | "xl" | "xxl" | "xxxl";

// Perfect Fourth scale (ratio 1.333, base 1rem)
export type FontSizes = "0.316" | "0.422" | "0.563" | "0.75" | "1" | "1.333" | "1.777" | "2.369" | "3.157"

export const getSize = (size: Sizes | CSSProperties['x']): CSSProperties['x'] => {
    switch (size) {
        case "xxxs":
            return "0.316rem"
        case "xxs":
            return "0.422rem"
        case "xs":
            return "0.563rem"
        case "sm":
            return "0.75rem"
        case "md":
            return "1rem"
        case "lg":
            return "1.333rem"
        case "xl":
            return "1.777rem"
        case "xxl":
            return "2.369rem"
        case "xxxl":
            return "3.157rem"
        default:
            return size
    }
}