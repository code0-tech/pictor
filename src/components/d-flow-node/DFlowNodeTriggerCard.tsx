import React, {memo} from "react";
import {Handle, Node, NodeProps, Position, useReactFlow, useStore} from "@xyflow/react";
import {Text} from "../text/Text";
import {useService, useStore as usePictorStore} from "../../utils/contextStore";
import {FileTabsService} from "../file-tabs/FileTabs.service";
import {Card} from "../card/Card";
import {Flex} from "../flex/Flex";
import {IconBolt, IconChevronDown} from "@tabler/icons-react";
import {Button} from "../button/Button";
import {DFlowTabTrigger} from "../d-flow-file/DFlowTabTrigger";
import {DFlowTypeReactiveService} from "../d-flow-type";
import {Badge} from "../badge/Badge";
import {DFlowNodeProps} from "./DFlowNode";
import {DFlowReactiveService} from "../d-flow";

// @ts-ignore
export type DFlowNodeTriggerCardProps = NodeProps<Node<DFlowNodeProps>>

export const DFlowNodeTriggerCard: React.FC<DFlowNodeTriggerCardProps> = memo((props) => {

    const {data, id} = props
    const fileTabsService = useService(FileTabsService)
    const flowInstance = useReactFlow()
    const flowTypeService = useService(DFlowTypeReactiveService)
    const flowTypeStore = usePictorStore(DFlowTypeReactiveService)
    const flowService = useService(DFlowReactiveService)
    const flowStore = usePictorStore(DFlowReactiveService)

    const flow = React.useMemo(() => flowService.getById(data.flowId), [flowStore, data])
    const definition = React.useMemo(() => flow ? flowTypeService.getById(flow.type?.id) : undefined, [flowTypeStore, flow])

    const width = props.width ?? 0
    const height = props.height ?? 0
    const viewportWidth = useStore(s => s.width)
    const viewportHeight = useStore(s => s.height)

    React.useEffect(() => {
        if (!definition?.id || !flow) return
        fileTabsService.registerTab({
            id: definition?.id!!,
            active: true,
            closeable: true,
            children: <>
                <IconBolt size={12}/>
                <Text size={"sm"}>{definition?.names!![0]?.content}</Text>
            </>,
            content: <DFlowTabTrigger instance={flow}/>,
            show: true
        })
    }, [definition, data.instance, fileTabsService, flow])

    return <Flex align={"center"} style={{flexDirection: "column"}} key={id} data-flow-refernce={id}>
        <Badge color={"info"} style={{
            borderTopRightRadius: "0.35rem",
            borderTopLeftRadius: "0.35rem",
            borderBottomLeftRadius: 0,
            borderBottomRightRadius: 0
        }}>Starting node</Badge>
        <Card variant={"normal"}
              color={"info"}
              paddingSize={"xs"}
              className={fileTabsService.getActiveTab()?.id == definition?.id ? "d-flow-node--active" : undefined}
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
                className={"d-flow-node__handle d-flow-node__handle--source"}
                position={Position.Bottom}
            />
        </Card>
    </Flex>


})