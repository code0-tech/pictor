import {ComponentProps, mergeComponentProps} from "../../utils";
import * as Radix from "@radix-ui/react-progress"
import React, {CSSProperties} from "react";
import "./Progress.style.scss"

export type ProgressProps = ComponentProps & Radix.ProgressProps & {
    color?: CSSProperties['background']
    predictionValue?: number | null
}

export const Progress: React.FC<ProgressProps> = (props) => {

    const {color = "white", predictionValue, ...rest} = props

    const progress = ((Math.min(props.value ?? 0, props.max ?? 100)) / (props.max ?? 100)) * 100;
    const transformValue = `translateX(-${100 - progress}%)`;

    const progressPrediction = ((Math.min(props.predictionValue ?? 0, props.max ?? 100)) / (props.max ?? 100)) * 100;
    const transformPredictionValue = `translateX(-${100 - progressPrediction}%)`;

    return <Radix.Progress {...mergeComponentProps('progress', {
        ...rest,
        style: {
            ...rest.style,
            ['--progress' as any]: progress,
            ['--progressPrediction' as any]: progressPrediction,
            ['--color' as any]: color,
        }
    })}>

        <div className={"progress__dot"}/>

        <div style={{
            width: "100%",
            height: "100%",
            overflow: "hidden",
            borderRadius: "inherit",
            position: "relative",
        }}>
            <Radix.ProgressIndicator
                className="progress__indicator"
                style={{
                    transform: transformValue
                }}/>
            {typeof props.predictionValue === "number" && <Radix.ProgressIndicator
                className="progress__indicator progress__indicator--prediction"
                style={{
                    transform: transformPredictionValue
                }}/>}
        </div>
    </Radix.Progress>
}