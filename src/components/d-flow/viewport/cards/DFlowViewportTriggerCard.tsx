import React, {memo} from "react";
import {Code0Component} from "../../../../utils/types";
import {Flow} from "../../DFlow.view";
import {Handle, Node, NodeProps, Position, useReactFlow, useStore} from "@xyflow/react";
import Text from "../../../text/Text";
import {useService} from "../../../../utils/contextStore";
import {FileTabsService} from "../../../file-tabs/FileTabs.service";
import Card from "../../../card/Card";
import CardSection from "../../../card/CardSection";
import Flex from "../../../flex/Flex";
import {IconBolt, IconLayoutNavbarCollapseFilled} from "@tabler/icons-react";
import Button from "../../../button/Button";
import Badge from "../../../badge/Badge";
import {DFlowViewportTriggerTabContent} from "../file-tabs/DFlowViewportTriggerTabContent";

export interface DFlowViewportTriggerCardDataProps extends Omit<Code0Component<HTMLDivElement>, "scope"> {
    instance: Flow
}

// @ts-ignore
export type DFlowViewportTriggerCardProps = NodeProps<Node<DFlowViewportTriggerCardDataProps>>

export const DFlowViewportTriggerCard: React.FC<DFlowViewportTriggerCardProps> = memo((props) => {

    const {data, id} = props
    const fileTabsService = useService(FileTabsService)
    const flowInstance = useReactFlow()
    const width = props.width ?? 0
    const height = props.height ?? 0
    const viewportWidth = useStore(s => s.width)
    const viewportHeight = useStore(s => s.height)

    return <Card variant={"filled"} color={"info"} style={{padding: "0.35rem"}}
                 borderColor={fileTabsService.getActiveTab()?.id == id ? "info" : undefined}
                 className={fileTabsService.getActiveTab()?.id == id ? "d-flow-viewport-default-card--active" : undefined}
                 onClick={() => {
                     flowInstance.setViewport({
                         x: (viewportWidth / 2) + (props.positionAbsoluteX * -1) - (width / 2),
                         y: (viewportHeight / 2) + (props.positionAbsoluteY * -1) - (height / 2),
                         zoom: 1
                     }, {
                         duration: 0,
                     })
                     fileTabsService.add({
                         id: id,
                         active: true,
                         closeable: true,
                         children: <Text size={"md"}>{data.instance.id}</Text>,
                         content: <DFlowViewportTriggerTabContent instance={data.instance}/>
                     })
                 }}>
        <Flex mb={"0.35"} style={{gap: "0.35rem"}} align={"center"} justify={"space-between"}>
            <Badge color={"info"}>
                <Flex style={{gap: "0.35rem"}} align={"center"}>
                    <IconBolt size={16}/>
                    Trigger
                </Flex>
            </Badge>
            <Button disabled>
                <IconLayoutNavbarCollapseFilled size={16}/>
            </Button>
        </Flex>

        <Card
            color={"secondary"}
            style={{borderRadius: "calc(1rem - 0.35rem)"}}>
            <CardSection border maw={"300px"}>
                <Text mb={0.35} display={"block"} size={"md"}>{data.instance.id}</Text>
                <Text>Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy.</Text>
            </CardSection>
        </Card>

        {/* Ausgang */}
        <Handle
            isConnectable={false}
            type="source"
            style={{bottom: "2px"}}
            className={"d-flow-viewport-default-card__handle d-flow-viewport-default-card__handle--source"}
            position={Position.Bottom}
        />
    </Card>


})