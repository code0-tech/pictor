import React, {memo} from "react";
import {Code0Component} from "../../utils";
import {Handle, Node, NodeProps, Position, useReactFlow, useStore} from "@xyflow/react";
import {Text} from "../text/Text";
import {useService} from "../../utils";
import {FileTabsService} from "../file-tabs/FileTabs.service";
import {Card} from "../card/Card";
import {Flex} from "../flex/Flex";
import {IconBolt, IconChevronDown, IconFile} from "@tabler/icons-react";
import {Button} from "../button/Button";
import {DFlowTabTrigger} from "../d-flow-file/DFlowTabTrigger";
import {DFlowTypeReactiveService} from "../d-flow-type";
import {Badge} from "../badge/Badge";
import {Flow} from "@code0-tech/sagittarius-graphql-types";

export interface DFlowNodeTriggerCardDataProps extends Omit<Code0Component<HTMLDivElement>, "scope"> {
    instance: Flow
}

// @ts-ignore
export type DFlowNodeTriggerCardProps = NodeProps<Node<DFlowNodeTriggerCardDataProps>>

export const DFlowNodeTriggerCard: React.FC<DFlowNodeTriggerCardProps> = memo((props) => {

    const {data, id} = props
    const fileTabsService = useService(FileTabsService)
    const flowInstance = useReactFlow()
    const flowTypeService = useService(DFlowTypeReactiveService)
    const definition = flowTypeService.getById(data.instance.type?.id!!)
    const width = props.width ?? 0
    const height = props.height ?? 0
    const viewportWidth = useStore(s => s.width)
    const viewportHeight = useStore(s => s.height)

    React.useEffect(() => {
        if (!definition?.id) return
        fileTabsService.registerTab({
            id: definition?.id!!,
            active: true,
            closeable: true,
            children: <>
                <IconBolt size={12}/>
                <Text size={"sm"}>{definition?.names!![0]?.content}</Text>
            </>,
            content: <DFlowTabTrigger instance={data.instance}/>,
            show: true
        })
    }, [definition, data.instance, fileTabsService])

    return <Flex align={"center"} style={{flexDirection: "column"}} key={id} data-flow-refernce={id}>
        <Badge color={"info"} style={{borderTopRightRadius: "0.35rem", borderTopLeftRadius: "0.35rem", borderBottomLeftRadius: 0, borderBottomRightRadius: 0}}>Starting node</Badge>
        <Card variant={"normal"}
              color={"info"}
              paddingSize={"xs"}
              className={fileTabsService.getActiveTab()?.id == definition?.id ? "d-flow-viewport-default-card--active" : undefined}
              onClick={() => {
                  flowInstance.setViewport({
                      x: (viewportWidth / 2) + (props.positionAbsoluteX * -1) - (width / 2),
                      y: (viewportHeight / 2) + (props.positionAbsoluteY * -1) - (height / 2),
                      zoom: 1
                  }, {
                      duration: 250,
                  })
                  fileTabsService.activateTab(definition?.id!!)
              }}>

            <Flex style={{gap: "1.3rem"}} align={"center"} justify={"space-between"}>
                <Flex style={{gap: "0.7rem"}} align={"center"}>
                    <IconBolt size={16}/>
                    <Text display={"block"} size={"md"}>
                        {definition?.names!![0]?.content ?? definition?.id}
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