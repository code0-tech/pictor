"use client"

import {Code0Component} from "../../utils/types";
import React from "react";
import {mergeCode0Props} from "../../utils/utils";
import "./DFullScreen.style.scss"

export interface DFullScreenProps extends Code0Component<HTMLDivElement> {
    children: React.ReactNode | React.ReactNode[]
}

export const DFullScreen: React.FC<DFullScreenProps> = props => {

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

    return <div {...mergeCode0Props("d-full-screen", props)} ref={divRef}>
        {props.children}
    </div>
}