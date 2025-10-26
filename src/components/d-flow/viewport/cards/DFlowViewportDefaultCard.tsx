import {Code0Component} from "../../../../utils/types";
import {Handle, Node, NodeProps, Position, useReactFlow, useStore, useStoreApi} from "@xyflow/react";
import {NodeFunctionView, NodeParameterView} from "../../DFlow.view";
import React, {memo} from "react";
import Card from "../../../card/Card";
import "./DFlowViewportDefaultCard.style.scss";
import CardSection from "../../../card/CardSection";
import Flex from "../../../flex/Flex";
import {
    IconAlertTriangle,
    IconArrowRightCircle, IconCopy,
    IconDots,
    IconExclamationCircle,
    IconFileLambdaFilled,
    IconLayoutNavbarCollapseFilled,
    IconMessageExclamation,
    IconTrash
} from "@tabler/icons-react";
import Text from "../../../text/Text";
import Button from "../../../button/Button";
import {Menu, MenuContent, MenuItem, MenuLabel, MenuPortal, MenuTrigger} from "../../../menu/Menu";
import Badge from "../../../badge/Badge";
import {useService} from "../../../../utils/contextStore";
import {DFlowFunctionReactiveService} from "../../function/DFlowFunction.service";
import {useFunctionValidation} from "../../function/DFlowFunction.vaildation.hook";
import {DFlowDataTypeReactiveService} from "../../data-type/DFlowDataType.service";
import {InspectionSeverity} from "../../../../utils/inspection";
import {DFlowReactiveService} from "../../DFlow.service";
import {DFlowSuggestionMenu} from "../../suggestions/DFlowSuggestionMenu";
import {useSuggestions} from "../../suggestions/DFlowSuggestion.hook";
import {FileTabsService} from "../../../file-tabs/FileTabs.service";
import {DFlowViewportDefaultTabContent} from "../file-tabs/DFlowViewportDefaultTabContent";
import {DataTypeVariant, Maybe, Scalars} from "@code0-tech/sagittarius-graphql-types";

export interface DFlowViewportDefaultCardDataProps extends Omit<Code0Component<HTMLDivElement>, "scope"> {
    instance: NodeFunctionView
    flowId: Scalars["FlowID"]["output"]
    isParameter: boolean
    depth: number
    scope: number[]
    index: number
}

// @ts-ignore
export type DFlowViewportDefaultCardProps = NodeProps<Node<DFlowViewportDefaultCardDataProps>>

export const DFlowViewportDefaultCard: React.FC<DFlowViewportDefaultCardProps> = memo((props) => {
    const {data, id} = props;
    const viewportWidth = useStore(s => s.width);
    const viewportHeight = useStore(s => s.height);
    const flowInstance = useReactFlow()
    const flowStoreApi = useStoreApi()
    const fileTabsService = useService(FileTabsService)
    const flowService = useService(DFlowReactiveService)
    const functionService = useService(DFlowFunctionReactiveService)
    const dataTypeService = useService(DFlowDataTypeReactiveService)
    const definition = functionService.getFunctionDefinition(data.instance.functionDefinition?.id!!)
    //TODO: some problems with react memorization here, need to investigate and also with hook calling
    const validation = useFunctionValidation(definition!!, data.instance.parameters!!.map(p => p.value!! instanceof NodeFunctionView ? p.value.json()!! : p.value!!), dataTypeService!!, props.data.flowId)
    const edges = useStore(s => s.edges);
    const width = props.width ?? 0
    const height = props.height ?? 0

    // Helper, ob zu diesem Parameter eine Edge existiert:
    function isParamConnected(paramId: Maybe<Scalars["NodeParameterID"]["output"]>): boolean {
        return edges.some(e =>
            e.target === id &&
            e.targetHandle === `param-${paramId}`
        );
    }

    const firstItem = useStore((s) => {
        const children = s.nodes.filter((n) => n.parentId === props.parentId);
        let start: any | undefined = undefined;
        children.forEach((n) => {
            const idx = (n.data as any)?.index ?? Infinity;
            const startIdx = (start?.data as any)?.index ?? Infinity;
            if (!start || idx < startIdx) {
                start = n;
            }
        });
        return start;
    })

    return (
        <Card
            outline={firstItem.id === id}
            borderColor={fileTabsService.getActiveTab()?.id == id ? "info" : undefined}
            className={fileTabsService.getActiveTab()?.id == id ? "d-flow-viewport-default-card--active" : undefined}
            color={(validation?.filter(v => v.type === InspectionSeverity.ERROR)?.length ?? 0) > 0 ? "error" : "secondary"}
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
                    children: <Text size={"md"}>{data.instance.id}</Text>,
                    content: <DFlowViewportDefaultTabContent depthLevel={data.depth} scopeLevel={data.scope}
                                                             nodeLevel={data.index} functionInstance={data.instance}/>
                })
            }} style={{position: "relative"}}>

            <CardSection border>
                <Flex align={"center"} justify={"space-between"} style={{gap: "0.7rem"}}>
                    <Flex align={"center"} style={{gap: "0.7rem"}}>
                        <IconFileLambdaFilled size={16}/>
                        <Text size={"md"}>{definition?.names?.nodes!![0]?.content}</Text>
                    </Flex>
                    <Flex align={"center"} style={{gap: "0.7rem"}}>
                        <Menu onOpenChange={event => {
                            setTimeout(() => {
                                flowStoreApi.setState({
                                    nodesDraggable: !event,
                                    nodesConnectable: !event,
                                    elementsSelectable: !event,
                                });
                            }, 250) // Timeout to ensure the menu is fully opened before changing the state
                        }}>
                            <MenuTrigger asChild>
                                <Button variant={"none"}>
                                    <IconDots size={16}/>
                                </Button>
                            </MenuTrigger>
                            <MenuPortal>
                                <MenuContent>
                                    <MenuLabel>Actions</MenuLabel>
                                    <MenuItem onClick={() => {
                                        data.instance.deleteNextNode()
                                        flowService.update()
                                    }}><IconTrash size={16}/> Delete node</MenuItem>
                                    <MenuItem disabled><IconCopy size={16}/> Copy node</MenuItem>
                                </MenuContent>
                            </MenuPortal>
                        </Menu>
                        <Button disabled>
                            <IconLayoutNavbarCollapseFilled size={16}/>
                        </Button>
                    </Flex>
                </Flex>
            </CardSection>

            <Handle
                isConnectable={false}
                draggable={false}
                type="target"
                className={"d-flow-viewport-default-card__handle d-flow-viewport-default-card__handle--target"}
                style={{...(data.isParameter ? {right: "2px"} : {top: "2px"})}}
                position={data.isParameter ? Position.Right : Position.Top}
            />

            {(validation?.length ?? 0) > 0 ? (
                <div className={"d-flow-viewport-default-card__inspection"}>
                    <Flex style={{gap: "0.35rem"}}>
                        {(validation?.filter(v => v.type === InspectionSeverity.ERROR)?.length ?? 0) > 0 ? (
                            <Badge color={"error"}>
                                <Flex align={"center"} style={{gap: "0.35rem"}}>
                                    <IconExclamationCircle size={12}/>
                                    {validation?.filter(v => v.type === InspectionSeverity.ERROR)?.length}
                                </Flex>
                            </Badge>
                        ) : null}

                        {(validation?.filter(v => v.type === InspectionSeverity.WARNING)?.length ?? 0) > 0 ? (
                            <Badge color={"warning"}>
                                <Flex align={"center"} style={{gap: "0.35rem"}}>
                                    <IconAlertTriangle size={12}/>
                                    {validation?.filter(v => v.type === InspectionSeverity.WARNING)?.length}
                                </Flex>
                            </Badge>
                        ) : null}

                        {(validation?.filter(v => v.type === InspectionSeverity.GRAMMAR)?.length ?? 0) > 0 ? (
                            <Badge>
                                <Flex align={"center"} style={{gap: "0.35rem"}}>
                                    <IconMessageExclamation size={12}/>
                                    {validation?.filter(v => v.type === InspectionSeverity.GRAMMAR)?.length}
                                </Flex>
                            </Badge>
                        ) : null}
                    </Flex>
                </div>
            ) : null}

            {data.instance.parameters?.some(param => {
                const parameter = definition?.parameterDefinitions!!.find(p => p.id == param.id)
                const isNodeDataType = dataTypeService.getDataType(parameter?.dataTypeIdentifier!!)?.variant === DataTypeVariant.Node;
                return (param.value instanceof NodeFunctionView && !isNodeDataType) || (!param.value)
            }) ? (
                <CardSection>
                    {/* Dynamische Parameter-Eingänge (rechts), nur wenn wirklich verbunden */}
                    {data.instance.parameters?.map((param: NodeParameterView, index: number) => {


                        const parameter = definition?.parameterDefinitions!!.find(p => p.id == param.id)
                        const isNodeDataType = dataTypeService.getDataType(parameter?.dataTypeIdentifier!!)?.variant === DataTypeVariant.Node;
                        const result = useSuggestions(parameter?.dataTypeIdentifier ?? undefined, [], "some_database_id", data.depth, data.scope, data.index)

                        return (param.value instanceof NodeFunctionView && !isNodeDataType) || (!param.value) ?
                            <Flex key={index} pos={"relative"} justify={"space-between"} align={"center"}>
                                {parameter?.names?.nodes!![0]?.content ?? param.id}
                                {!param.value ? (
                                    <DFlowSuggestionMenu onSuggestionSelect={suggestion => {
                                        param.value = suggestion.value
                                        flowService.update()
                                    }} suggestions={result} triggerContent={<Button
                                        variant={"none"}><IconArrowRightCircle size={12}/></Button>}/>
                                ) : null}
                                <Handle
                                    key={param.id}
                                    type="target"
                                    position={Position.Right}
                                    style={{
                                        position: "absolute",
                                        transform: isNodeDataType ? "translate(-50%, -50%)" : "translate(50%, -50%)",
                                        top: "50%",
                                        right: isNodeDataType ? "50%" : "0"
                                    }}
                                    id={`param-${param.id}`}
                                    isConnectable={false}
                                    hidden={!isParamConnected(param.id!!)}
                                    className={"d-flow-viewport-default-card__handle d-flow-viewport-default-card__handle--target"}
                                />
                            </Flex> : null
                    })}
                </CardSection>
            ) : null}

            {/* Ausgang */}
            <Handle
                isConnectable={false}
                type="source"
                style={{...(data.isParameter ? {left: "2px"} : {bottom: "2px"})}}
                className={"d-flow-viewport-default-card__handle d-flow-viewport-default-card__handle--source"}
                position={data.isParameter ? Position.Left : Position.Bottom}
            />
        </Card>
    );
})