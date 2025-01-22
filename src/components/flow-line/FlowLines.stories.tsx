import React from "react";
import {Meta} from "@storybook/react";
import DScreen from "../d-screen/DScreen";
import DScreenBar from "../d-screen/DScreenBar";
import Text from "../text/Text";
import DScreenButton from "../d-screen/DScreenButton";
import {IconDatabase, IconHierarchy3, IconSettings, IconTicket} from "@tabler/icons-react";
import DFullScreen from "../d-fullscreen/DFullScreen";
import FlowLinesProvider, {useFlowLines} from "./FlowLinesProvider"
import Quote from "../quote/Quote";
import Flex from "../flex/Flex";
import {TransformComponent, TransformWrapper} from "react-zoom-pan-pinch";

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

    return <DFullScreen>
        <DScreen>
            <DScreenBar type={"top"} align={"center"}>
                <Text>Home</Text>
                <Text mx={0.5}>/</Text>
                <Text>Organisations</Text>
                <Text mx={0.5}>/</Text>
                <Text>Code0</Text>
                <Text mx={0.5}>/</Text>
                <Text>Projects</Text>
                <Text mx={0.5}>/</Text>
                <Text>Sagittarius</Text>
            </DScreenBar>
            <DScreenBar type={"bottom"}>
                <Text>Test</Text>
            </DScreenBar>
            <DScreenBar type={"left"} justify={"space-between"} resizeable>
                <div style={{display: "flex", flexDirection: "column", gap: ".5rem", overflow: "hidden"}}>
                    <DScreenButton color={"secondary"}>
                        <IconHierarchy3 size={12}/>
                        Flows
                    </DScreenButton>
                    <DScreenButton color={"warning"}>
                        <IconTicket size={12}/>
                        Issues
                    </DScreenButton>
                    <DScreenButton color={"info"}>
                        <IconDatabase size={12}/>
                        Database
                    </DScreenButton>
                </div>
                <div style={{display: "flex", flexDirection: "column", gap: ".5rem", overflow: "hidden"}}>
                    <DScreenButton color={"primary"}>
                        <IconSettings size={12}/>
                        Settings
                    </DScreenButton>
                </div>
            </DScreenBar>
            <DScreenBar type={"right"} resizeable>
                <DScreenButton>
                    Docs
                </DScreenButton>
            </DScreenBar>

            <DScreen>
                <DScreenBar type={"top"} resizeable justify={"flex-end"}>
                    <DScreenButton>
                        Test Run
                    </DScreenButton>
                </DScreenBar>
                <DScreenBar type={"bottom"} resizeable>
                    <DScreenButton>
                        Logs
                    </DScreenButton>
                </DScreenBar>
                <TransformWrapper  initialScale={1}
                                   centerOnInit={true}>
                    <TransformComponent wrapperStyle={{width: "100%", height: "100%"}}>
                        <FlowLinesProvider>
                            <FlowLineExample/>

                        </FlowLinesProvider>
                    </TransformComponent>
                </TransformWrapper>
            </DScreen>
        </DScreen>
    </DFullScreen>
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
            startElement: {
                element: firstRef.current,
                orientation: "BOTTOM"
            },
            endElement: {
                element: secondRef.current,
                orientation: "TOP"
            },
        })

        const id2 = addFlowLine({
            align: "vertical",
            startElement: {
                element: secondRef.current,
                orientation: "BOTTOM"
            },
            endElement: {
                element: thirdRef.current,
                orientation: "TOP"
            },
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