import {mergeComponentProps} from "../../utils";
import {
    ProgressCircle as ArkProgressCircle,
    ProgressCircleRange,
    ProgressCircleTrack,
    ProgressRoot,
    ProgressRootProps
} from "@ark-ui/react";
import React, {CSSProperties} from "react";
import "./Progress.style.scss"
import {ProgressProps} from "./ProgressLinear";

export type ProgressCircleProps = ProgressProps & Omit<ProgressRootProps, 'value' | 'max' | 'color'> & {
    size?: CSSProperties['width']
    thickness?: CSSProperties['strokeWidth']
}

export const ProgressCircle: React.FC<ProgressCircleProps> = (props) => {

    const {
        color = "white",
        predictionValue = 0,
        dot,
        value,
        max = 100,
        size = 64,
        thickness,
        ...rest
    } = props

    const toLength = (value: string | number | undefined): string | number | undefined =>
        typeof value === "number" ? `${value}px` : value

    return <ProgressRoot value={value} max={max} {...mergeComponentProps('progress-circle', {
        ...rest,
        style: {
            ...rest.style,
            ['--size' as any]: toLength(size),
            ['--thickness' as any]: thickness !== undefined ? toLength(thickness) : 'calc(var(--size) / 8)',
            ['--color' as any]: color
        }
    })}>

        <ArkProgressCircle className="progress-circle__circle">
            <ProgressCircleTrack className="progress-circle__track"/>

            <svg style={{position: 'absolute', width: 0, height: 0, overflow: 'hidden'}}>
                <defs>
                    <pattern
                        id="circle-stripe-overlay"
                        width="5"
                        height="5"
                        patternUnits="userSpaceOnUse"
                        patternTransform="rotate(-45)"
                    >
                        <rect width="5" height="5" fill="var(--color)"/>
                        <rect width="2.5" height="5" fill="rgba(0, 0, 0, 0.25)"/>
                    </pattern>
                </defs>
            </svg>

            <ProgressCircleRange style={{
                ['--percent' as any]: predictionValue
            }} className="progress-circle__prediction"/>

            <ProgressCircleRange className="progress-circle__range"/>
        </ArkProgressCircle>

        <div className="progress-circle__dot">
            {dot}
        </div>
    </ProgressRoot>
}
