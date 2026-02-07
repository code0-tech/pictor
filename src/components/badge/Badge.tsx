import React from "react";
import "./Badge.style.scss"
import {Code0Component, Color} from "../../utils/types";
import {mergeCode0Props} from "../../utils/utils";

export interface BadgeType extends Code0Component<HTMLSpanElement> {
    children: React.ReactNode
    // defaults to primary
    color?: Color | string
    border?: boolean
}

type RGBA = {
    r: number
    g: number
    b: number
    a: number
}

export const Badge: React.FC<BadgeType> = (props) => {

    const {color = "primary", border = false, children, ...args} = props

    return (
        <span
            {...mergeCode0Props(
                `badge badge--${color} ${!border ? "badge--border" : ""}`,
                {
                    ...args,
                    style: {
                        ...args.style,
                        "--badge-color-background": mixColorRgb(color, 9),
                        "--badge-color-border": withAlpha(color, 0.1),
                        "--badge-color": withAlpha(color, 0.75),
                    },
                }
            )}
        >
            {children}
        </span>
    )
}

/* ===========================
   Color utilities
   =========================== */

const clamp01 = (v: number) => Math.min(Math.max(v, 0), 1)

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

const mixColorRgb = (color: string, level: number) => {
    const w = clamp01(level * 0.1)

    const c1 = parseCssColorToRgba(color)
    const c2 = parseCssColorToRgba("#070514")

    const mix = (a: number, b: number) =>
        Math.round(a * (1 - w) + b * w)

    return `rgb(${mix(c1.r, c2.r)}, ${mix(c1.g, c2.g)}, ${mix(c1.b, c2.b)})`
}

const withAlpha = (color: string, alpha: number) => {
    const c = parseCssColorToRgba(color)
    return `rgba(${c.r}, ${c.g}, ${c.b}, ${clamp01(alpha)})`
}