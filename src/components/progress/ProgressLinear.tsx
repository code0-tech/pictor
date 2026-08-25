import {ComponentProps, mergeComponentProps} from "../../utils";
import * as Radix from "@radix-ui/react-progress"
import React, {CSSProperties} from "react";
import "./Progress.style.scss"

export type ProgressProps = ComponentProps & {
    value?: number | null
    max?: number
    color?: CSSProperties['background']
    dot?: React.ReactNode
    predictionValue?: number | null
}

export type ProgressLinearProps = ProgressProps & Omit<Radix.ProgressProps, 'value' | 'max' | 'color'>

export const ProgressLinear: React.FC<ProgressLinearProps> = (props) => {

    const {color = "white", predictionValue, dot, ...rest} = props

    const progress = ((Math.min(props.value ?? 0, props.max ?? 100)) / (props.max ?? 100)) * 100;
    const transformValue = `translateX(-${100 - progress}%)`;

    const progressPrediction = ((Math.min(props.predictionValue ?? 0, props.max ?? 100)) / (props.max ?? 100)) * 100;
    const transformPredictionValue = `translateX(-${100 - progressPrediction}%)`;

    return <Radix.Progress {...mergeComponentProps('progress-linear', {
        ...rest,
        style: {
            ...rest.style,
            ['--progress' as any]: progress,
            ['--progressPrediction' as any]: progressPrediction,
            ['--color' as any]: color,
        }
    })}>

        <div className={"progress-linear__dot"}>
            {dot}
        </div>

        <div style={{
            width: "100%",
            height: "100%",
            overflow: "hidden",
            borderRadius: "inherit",
            position: "relative",
        }}>
            <Radix.ProgressIndicator
                className="progress-linear__indicator"
                style={{
                    transform: transformValue
                }}/>
            {typeof props.predictionValue === "number" && <Radix.ProgressIndicator
                className="progress-linear__indicator progress-linear__indicator--prediction"
                style={{
                    transform: transformPredictionValue
                }}/>}
        </div>
    </Radix.Progress>
}
