"use client"

import React from "react";
import {Flex} from "../flex/Flex";
import {Button} from "../button/Button";
import {IconDatabase, IconFile, IconMessageChatbot} from "@tabler/icons-react";
import {Text} from "../text/Text";
import {DResizableHandle, DResizablePanel, DResizablePanelGroup} from "../d-resizable/DResizable";
import {DFlowFolder} from "./folder";
import {DFlowTabs} from "./tab/DFlowTabs";
import {DLayout} from "../d-layout/DLayout";

export interface DFlowBuilderProps {

}

export const DFlowBuilder: React.FC<DFlowBuilderProps> = (props) => {
    return <DLayout rightContent={
        <Flex p={0.35} style={{flexDirection: "column", gap: "0.7rem"}}>
            <Button>
                <IconFile size={16}/>
            </Button>
            <Button variant={"none"} paddingSize={"xs"}>
                <IconDatabase size={16}/>
            </Button>
            <Button variant={"none"} paddingSize={"xs"}>
                <IconMessageChatbot size={16}/>
            </Button>
        </Flex>
    } bottomContent={
        <Flex p={0.35} style={{gap: "0.7rem"}}>
            <Button variant={"none"} paddingSize={"xxs"}>
                <Text>Logbook</Text>
            </Button>
            <Button variant={"none"} paddingSize={"xxs"}>
                <Text>Problems</Text>
            </Button>
        </Flex>
    }>
        <DResizablePanelGroup direction={"horizontal"}>
            <DResizablePanel id={"1"} order={1} p={1} defaultSize={15}>
                <DFlowFolder flowId={"gid://sagittarius/Flow/1"}/>
            </DResizablePanel>
            <DResizableHandle/>
            <DResizablePanel id={"2"} order={2}>
                <></>
            </DResizablePanel>
            <DResizableHandle/>
            <DResizablePanel id={"3"} order={3} defaultSize={25}>
                <DFlowTabs/>
            </DResizablePanel>
        </DResizablePanelGroup>
    </DLayout>
}