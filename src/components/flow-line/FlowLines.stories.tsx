import React from "react";
import {Meta} from "@storybook/react";
import FlowLinesProvider, {useFlowLines} from "./FlowLinesProvider"
import Quote from "../quote/Quote";
import Flex from "../flex/Flex";
import DZoomPanPinch from "../d-zoom-pan-pinch/DZoomPanPinch";

const meta: Meta = {
    title: "FlowLine",
    parameters: {
        visualTest: {
            selector: 'body'
        },
        layout: "fullscreen"
    },
    component: FlowLinesProvider
}

export default meta

export const VerticalComplexFlowLine = () => {

    return <DZoomPanPinch>
        <FlowLinesProvider>
            <FlowLineExample/>
        </FlowLinesProvider>
    </DZoomPanPinch>
}

const FlowLineExample = () => {

    const {addFlowLine, removeFlowLine} = useFlowLines()
    const firstRef = React.useRef<HTMLDivElement>(null)
    const secondRef = React.useRef<HTMLDivElement>(null)
    const thirdRef = React.useRef<HTMLDivElement>(null)

    React.useEffect(() => {
        if (!(firstRef.current && secondRef.current)) return

        const id1 = addFlowLine({
            align: "vertical",
            startElement: firstRef.current,
            endElement: secondRef.current,
        })

        const id2 = addFlowLine({
            align: "vertical",
            startElement: secondRef.current,
            endElement: thirdRef.current,
        })

        return () => {
            removeFlowLine(id1)
            removeFlowLine(id2)
        }

    }, [firstRef, secondRef]);

    return <Flex p={1} style={{gap: "10rem", flexDirection: "column"}}>
        <div ref={firstRef}>
            <Quote name={"Nico Sammito"}
                   position={"Co-founder"}
                   logo={"https://code0.tech/code0_logo.png"}
                   w={"300px"}>
                My favorite UX feedback from customers is:
                "How is the app so fast?"
                Because we’ve built on Next.js and Vercel since day one, our pages load in an instant,
                which is important when it comes to mission-critical software.
            </Quote>
        </div>
        <div ref={secondRef} style={{position: "relative", left: "10rem"}}>
            <Quote name={"Nico Sammito"}
                   position={"Co-founder"}
                   logo={"https://code0.tech/code0_logo.png"}
                   w={"300px"}>
                My favorite UX feedback from customers is:
                "How is the app so fast?"
                Because we’ve built on Next.js and Vercel since day one, our pages load in an instant,
                which is important when it comes to mission-critical software.
            </Quote>
        </div>
        <div ref={thirdRef} style={{position: "relative", left: "10rem"}}>
            <Quote name={"Nico Sammito"}
                   position={"Co-founder"}
                   logo={"https://code0.tech/code0_logo.png"}
                   w={"300px"}>
                My favorite UX feedback from customers is:
                "How is the app so fast?"
                Because we’ve built on Next.js and Vercel since day one, our pages load in an instant,
                which is important when it comes to mission-critical software.
            </Quote>
        </div>
    </Flex>
}