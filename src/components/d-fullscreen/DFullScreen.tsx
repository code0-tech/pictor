"use client"

import {Code0Component} from "../../utils/types";
import React from "react";

export interface DFullScreenProps extends Code0Component<HTMLDivElement> {
    children: React.ReactNode | React.ReactNode[]
}

const DFullScreen: React.FC<DFullScreenProps> = props => {

    const [dimensions, setDimensions] = React.useState<number[]>([])

    React.useEffect(() => {
        window.addEventListener("resize", () => {
            setDimensions([window.innerWidth, window.innerHeight])
        })
        setDimensions([window.innerWidth, window.innerHeight])
    }, [])

    return <div style={{
        position: "relative",
        overflow: "hidden",
        ...(dimensions[0] ? {width: dimensions[0]} : {}),
        ...(dimensions[1] ? {height: dimensions[1]} : {})
    }}>
        {props.children}
    </div>
}

export default Object.assign(DFullScreen)