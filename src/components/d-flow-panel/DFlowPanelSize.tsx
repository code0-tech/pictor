import React from "react";
import {Panel, useReactFlow, useViewport} from "@xyflow/react";
import {ButtonGroup} from "../button-group/ButtonGroup";
import {Button} from "../button/Button";
import {IconFocusCentered, IconMinus, IconPlus} from "@tabler/icons-react";
import {Badge} from "../badge/Badge";
import {Flex} from "../flex/Flex";
import {Text} from "../text/Text";

export const DFlowPanelSize: React.FC = () => {

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
        <Flex align="center" style={{gap: ".35rem"}}>
            <ButtonGroup>
                <Button style={{border: "none"}} variant={"filled"} paddingSize={"xxs"} color={"secondary"}
                        onClick={() => zoomIn()}><IconPlus size={13}/></Button>
                <Button style={{border: "none"}} variant={"filled"} paddingSize={"xxs"} color={"secondary"}
                        onClick={() => zoomOut()}><IconMinus size={13}/></Button>
                <Button style={{border: "none"}} variant={"filled"} paddingSize={"xxs"} color={"secondary"}
                        onClick={() => center()}><IconFocusCentered size={13}/></Button>
            </ButtonGroup>
            <Badge color={"primary"} style={{boxShadow: "none"}}>
                <Text>{getCurrentZoomInPercent()}%</Text>
            </Badge>
        </Flex>
    </Panel>

}