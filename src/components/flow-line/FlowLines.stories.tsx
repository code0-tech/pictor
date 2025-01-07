import React from "react";
import FlowLines from "./FlowLines";
import {Meta} from "@storybook/react";
import DScreen from "../d-screen/DScreen";
import DScreenBar from "../d-screen/DScreenBar";
import Text from "../text/Text";
import DScreenButton from "../d-screen/DScreenButton";
import {IconDatabase, IconHierarchy3, IconSettings, IconTicket} from "@tabler/icons-react";
import DFullScreen from "../d-fullscreen/DFullScreen";

const meta: Meta = {
    title: "FlowLine",
    parameters: {
        visualTest: {
            selector: 'body'
        },
        layout: "fullscreen"
    },
    component: FlowLines
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
                <FlowLines lines={[
                    {
                        align: "horizontal",
                        startPoint: {
                            x: 200,
                            y: 200
                        },
                        endPoint: {
                            x: 100,
                            y: 100
                        }
                    }
                ]}/>
            </DScreen>
        </DScreen>
    </DFullScreen>
}