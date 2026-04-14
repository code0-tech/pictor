import {CSSProperties} from "react";

export type Sizes = "xxs" | "xs" | "sm" | "md" | "lg" | "xl";

export type FontSizes = "0.35" | "0.7" | "0.8" | "1" | "1.2" | "1.3"

export const getDOMSizeFromCodeZeroSize = (size: Sizes | CSSProperties['x']): CSSProperties['x'] => {
    switch (size) {
        case "xxs":
            return "0.35rem"
        case "xs":
            return "0.7rem"
        case "sm":
            return "0.8rem"
        case "md":
            return "1rem"
        case "lg":
            return "1.2rem"
        case "xl":
            return "1.3rem"
        default:
            return size
    }
}