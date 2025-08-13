import React from "react";
import {Panel, useReactFlow, useViewport} from "@xyflow/react";
import ButtonGroup from "../../button-group/ButtonGroup";
import Button from "../../button/Button";
import {IconFocusCentered, IconMinus, IconPlus} from "@tabler/icons-react";
import Badge from "../../badge/Badge";
import Flex from "../../flex/Flex";

export const DFlowViewportControls: React.FC = () => {

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
        <Flex align="stretch" style={{gap: ".35rem"}}>
            <ButtonGroup>
                <Button color={"secondary"} onClick={() => zoomIn()}><IconPlus size={15}/></Button>
                <Button color={"secondary"} onClick={() => zoomOut()}><IconMinus size={15}/></Button>
                <Button color={"secondary"} onClick={() => center()}><IconFocusCentered size={15}/></Button>
            </ButtonGroup>
            <Badge color={"secondary"}>{getCurrentZoomInPercent()}%</Badge>
        </Flex>
    </Panel>

}