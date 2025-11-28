import React from "react";
import {Panel, useReactFlow, useViewport} from "@xyflow/react";
import {ButtonGroup} from "../../button-group/ButtonGroup";
import {Button} from "../../button/Button";
import {IconFocusCentered, IconMinus, IconPlus} from "@tabler/icons-react";
import {Badge} from "../../badge/Badge";
import {Flex} from "../../flex/Flex";
import {Text} from "../../text/Text";

export const DFlowControl: React.FC = () => {

    const viewport = useViewport();
    const reactFlow = useReactFlow();

    const zoomIn = () => {
        reactFlow.zoomIn()
    }

    const zoomOut = () => {
        reactFlow.zoomOut()
    }

    const center = () => {
        reactFlow.fitView()
    }

    const getCurrentZoomInPercent = () => {
        return Math.round(viewport.zoom * 100);
    }

    return <Panel position="bottom-left">
        <Flex style={{flexDirection: "column", gap: "1rem"}}>
            <Flex align="center" style={{gap: ".7rem"}}>
                <ButtonGroup>
                    <Button style={{border: "none"}} paddingSize={"xxs"} color={"secondary"} onClick={() => zoomIn()}><IconPlus size={15}/></Button>
                    <Button style={{border: "none"}} paddingSize={"xxs"} color={"secondary"} onClick={() => zoomOut()}><IconMinus size={15}/></Button>
                    <Button style={{border: "none"}} paddingSize={"xxs"} color={"secondary"} onClick={() => center()}><IconFocusCentered size={15}/></Button>
                </ButtonGroup>
                <Badge color={"primary"} style={{border: "none"}}>
                    <Text>{getCurrentZoomInPercent()}%</Text>
                </Badge>
            </Flex>
        </Flex>
    </Panel>

}