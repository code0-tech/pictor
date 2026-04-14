"use client"

import {Component, mergeComponentProps} from "../../utils";
import React from "react";
import "./FullScreen.style.scss"

export interface FullScreenProps extends Component<HTMLDivElement> {
    children: React.ReactNode | React.ReactNode[]
}

export const FullScreen: React.FC<FullScreenProps> = props => {

    const divRef = React.useRef<HTMLDivElement>(null);

    React.useEffect(() => {
        if (!divRef.current) return

        window.addEventListener("resize", () => {
            const vw = Math.round(window.visualViewport?.width ?? window.innerWidth);
            const vh = Math.round(window.visualViewport?.height ?? window.innerHeight);
            divRef.current!!.style.height = vh + "px";
            divRef.current!!.style.width = vw + "px";
        })
        const vw = Math.round(window.visualViewport?.width ?? window.innerWidth);
        const vh = Math.round(window.visualViewport?.height ?? window.innerHeight);
        divRef.current!!.style.height = vh + "px";
        divRef.current!!.style.width = vw + "px";
    }, [divRef])

    return <div {...mergeComponentProps("d-full-screen", props)} ref={divRef}>
        {props.children}
    </div>
}