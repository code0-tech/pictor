import React, { useId } from "react";
import "./Character.style.scss";
import { Color, Component, mergeComponentProps } from "../../utils";

export type CharacterMood = "idle" | "happy" | "thinking" | "error" | "loading"

export interface CharacterType extends Component<HTMLDivElement> {
    color?: Color | string
    mood?: CharacterMood
    size?: number
}

const DESIGN_COLORS: Record<string, string> = {
    primary:   "#070514",
    secondary: "#bfbfbf",
    tertiary:  "#ffffff",
    info:      "#70ffb2",
    success:   "#29BF12",
    warning:   "#FFBE0B",
    error:     "#D90429",
    purple:    "#e270ff",
    mint:      "#c7ff70",
}

const resolveColor = (color: string): string => DESIGN_COLORS[color] ?? color

const BLOB_PATH =
    "M 100 176 " +
    "C 58 176, 38 158, 38 128 " +
    "C 38 100, 50 80, 62 73 " +
    "C 65 58, 72 46, 80 49 " +
    "C 86 52, 92 64, 96 74 " +
    "C 99 75, 101 75, 104 74 " +
    "C 108 62, 118 40, 128 43 " +
    "C 138 46, 140 60, 138 75 " +
    "C 152 78, 162 100, 162 128 " +
    "C 162 158, 142 176, 100 176 Z"

const EYE_L = { cx: 82,  cy: 130 }
const EYE_R = { cx: 120, cy: 130 }

export const Character: React.FC<CharacterType> = (props) => {
    const { color = "purple", mood = "idle", size = 140, ...args } = props
    const uid           = useId()
    const resolvedColor = resolveColor(color)

    const hlGradId    = `${uid}-hl`
    const shGradId    = `${uid}-sh`
    const grainId     = `${uid}-grain`
    const grainMaskId = `${uid}-gm`
    const clipId      = `${uid}-clip`

    return (
        <div
            {...mergeComponentProps(`character character--${mood}`, {
                ...args,
                style: {
                    ...args.style,
                    width: size,
                    height: size,
                    "--character-color": resolvedColor,
                } as React.CSSProperties,
            })}
        >
            <svg className="character__svg" viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">

                <path className="character__blob" d={BLOB_PATH} />

                {/* Both eyes share a "look-around" group so the gaze drifts together */}
                <g className="character__eyes-motion">
                    <g className="character__eye-outer character__eye--left">
                        <g className="character__eye-inner">
                            <ellipse className="character__eye-shape" cx={EYE_L.cx} cy={EYE_L.cy} />
                        </g>
                    </g>
                    <g className="character__eye-outer character__eye--right">
                        <g className="character__eye-inner">
                            <ellipse className="character__eye-shape" cx={EYE_R.cx} cy={EYE_R.cy} />
                        </g>
                    </g>
                </g>
            </svg>
        </div>
    )
}
