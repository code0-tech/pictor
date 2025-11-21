import React, {memo} from "react";
import {Code0Component} from "../../../utils/types";
import {FlowView} from "../DFlow.view";
import {Handle, Node, NodeProps, Position, useReactFlow, useStore} from "@xyflow/react";
import {Text} from "../../text/Text";
import {useService} from "../../../utils/contextStore";
import {FileTabsService} from "../../file-tabs/FileTabs.service";
import {Card} from "../../card/Card";
import {Flex} from "../../flex/Flex";
import {IconBolt, IconChevronDown} from "@tabler/icons-react";
import {Button} from "../../button/Button";
import {DFlowTabTrigger} from "../tab/DFlowTabTrigger";
import {DFlowTypeReactiveService} from "../type/DFlowType.service";
import {Badge} from "../../badge/Badge";

export interface DFlowFunctionTriggerCardDataProps extends Omit<Code0Component<HTMLDivElement>, "scope"> {
    instance: FlowView
}

// @ts-ignore
export type DFlowFunctionTriggerCardProps = NodeProps<Node<DFlowFunctionTriggerCardDataProps>>

export const DFlowFunctionTriggerCard: React.FC<DFlowFunctionTriggerCardProps> = memo((props) => {

    const {data, id} = props
    const fileTabsService = useService(FileTabsService)
    const flowInstance = useReactFlow()
    const flowTypeService = useService(DFlowTypeReactiveService)
    const definition = flowTypeService.getById(data.instance.type?.id!!)
    const width = props.width ?? 0
    const height = props.height ?? 0
    const viewportWidth = useStore(s => s.width)
    const viewportHeight = useStore(s => s.height)

    return <Flex align={"center"} style={{flexDirection: "column", gap: "0.35rem"}}>
        <Badge color={"primary"}>START</Badge>
        <Card variant={"normal"}
              color={"success"}
              paddingSize={"xs"}
              className={fileTabsService.getActiveTab()?.id == id ? "d-flow-viewport-default-card--active" : undefined}
              onClick={() => {
                  flowInstance.setViewport({
                      x: (viewportWidth / 2) + (props.positionAbsoluteX * -1) - (width / 2),
                      y: (viewportHeight / 2) + (props.positionAbsoluteY * -1) - (height / 2),
                      zoom: 1
                  }, {
                      duration: 250,
                  })
                  fileTabsService.add({
                      id: id,
                      active: true,
                      closeable: true,
                      children: <Text size={"md"}>{definition?.names?.nodes!![0]?.content}</Text>,
                      content: <DFlowTabTrigger instance={data.instance}/>
                  })
              }}>

            <Flex style={{gap: "1.3rem"}} align={"center"} justify={"space-between"}>
                <Flex style={{gap: "0.7rem"}} align={"center"}>
                    <IconBolt size={16}/>
                    <Text display={"block"} size={"md"}>
                        {definition?.names?.nodes!![0]?.content ?? definition?.id}
                    </Text>
                </Flex>
                <Flex align={"center"} style={{gap: "0.7rem"}}>
                    <Button p={"0"} paddingSize={"xxs"} variant={"none"} disabled>
                        <IconChevronDown size={16}/>
                    </Button>
                </Flex>
            </Flex>

            {/* Ausgang */}
            <Handle
                isConnectable={false}
                type="source"
                style={{bottom: "2px"}}
                className={"d-flow-viewport-default-card__handle d-flow-viewport-default-card__handle--source"}
                position={Position.Bottom}
            />
        </Card>
    </Flex>


})