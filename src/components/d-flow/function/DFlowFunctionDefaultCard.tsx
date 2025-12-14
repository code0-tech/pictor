import {Code0Component, InspectionSeverity} from "../../../utils";
import {Handle, Node, NodeProps, Position, useReactFlow, useStore} from "@xyflow/react";
import React, {memo} from "react";
import {Card} from "../../card/Card";
import "./DFlowFunctionDefaultCard.style.scss";
import {Flex} from "../../flex/Flex";
import {IconFile} from "@tabler/icons-react";
import {Text} from "../../text/Text";
import {useService, useStore as usePictorStore} from "../../../utils/contextStore";
import {DFlowFunctionReactiveService} from "./DFlowFunction.service";
import {useFunctionValidation} from "./DFlowFunction.vaildation.hook";
import {DFlowDataTypeReactiveService} from "../data-type";
import {DFlowReactiveService} from "../DFlow.service";
import {FileTabsService} from "../../file-tabs/FileTabs.service";
import {DFlowTabDefault} from "../tab/DFlowTabDefault";
import type {NodeFunction, NodeParameter, Scalars} from "@code0-tech/sagittarius-graphql-types";
import {Badge} from "../../badge/Badge";
import {md5} from "js-md5";

export interface DFlowFunctionDefaultCardDataProps extends Omit<Code0Component<HTMLDivElement>, "scope"> {
    node: NodeFunction
    flowId: Scalars["FlowID"]["output"]
    isParameter: boolean
    linkingId?: string
    depth: number
    scope: number[]
    index: number
}

// @ts-ignore
export type DFlowFunctionDefaultCardProps = NodeProps<Node<DFlowFunctionDefaultCardDataProps>>

export const DFlowFunctionDefaultCard: React.FC<DFlowFunctionDefaultCardProps> = memo((props) => {
    const {data, id, width = 0, height = 0} = props

    const viewportWidth = useStore(s => s.width);
    const viewportHeight = useStore(s => s.height);
    const flowInstance = useReactFlow()
    const fileTabsService = useService(FileTabsService)
    const fileTabsStore = usePictorStore(FileTabsService)
    const flowService = useService(DFlowReactiveService)
    const flowStore = usePictorStore(DFlowReactiveService)
    const functionService = useService(DFlowFunctionReactiveService)
    const functionStore = usePictorStore(DFlowFunctionReactiveService)
    const dataTypeService = useService(DFlowDataTypeReactiveService)
    const dataTypeStore = usePictorStore(DFlowDataTypeReactiveService)
    const edges = useStore(s => s.edges);

    const definition = React.useMemo(() => functionService.getById(data.node.functionDefinition?.id!!), [functionStore, data])
    const validation = useFunctionValidation(definition!!, data.node.parameters!.nodes!.map(p => p?.value!!), dataTypeService!!, props.data.flowId)
    const node = React.useMemo(() => flowService.getNodeById(data.flowId, data.node.id), [flowStore, data])
    const activeTabId = React.useMemo(() => {
        return fileTabsStore.find((t: any) => (t as any).active)?.id
    }, [fileTabsStore, fileTabsService]);

    function isParamConnected(paramId: NodeParameter['id']): boolean {
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

    const splitTemplate = (str: string) =>
        str
            .split(/(\$\{[^}]+\})/)
            .filter(Boolean)
            .flatMap(part =>
                part.startsWith("${")
                    ? [part.slice(2, -1)]          // variable name ohne ${}
                    : part.split(/(\s*,\s*)/)      // Kommas einzeln extrahieren
                        .filter(Boolean)
                        .flatMap(p => p.trim() === "," ? [","] : p.trim() ? [p.trim()] : [])
            );

    const colorHash = md5(id)
    const hashToHue = (md5: string): number => {
        // nimm z.B. 8 Hex-Zeichen = 32 Bit
        const int = parseInt(md5.slice(0, 8), 16)
        return int % 360
    }

    const displayMessage = React.useMemo(() => splitTemplate(definition?.displayMessages?.nodes!![0]?.content!!).map(item => {
        const param = node?.parameters?.nodes?.find(p => {
            const parameterDefinition = definition?.parameterDefinitions?.find(pd => pd.id == p?.id)
            return parameterDefinition?.identifier == item
        })
        const paramDefinition = definition?.parameterDefinitions?.find(pd => pd.id == param?.id)

        if (param) {
            switch (param?.value?.__typename) {
                case "LiteralValue":
                    return <Badge style={{verticalAlign: "middle"}} color={"secondary"}>
                        <Text size={"sm"}>
                            {String(param?.value?.value)}
                        </Text>
                    </Badge>
                case "ReferenceValue":
                    return <Badge style={{verticalAlign: "middle"}}>
                        <Text size={"sm"}>
                            {String(param?.value.node)}-{String(param?.value.depth)}-{String(param?.value.scope)}
                        </Text>
                    </Badge>
                case "NodeFunction":
                    const hash = md5(`${id}-param-${JSON.stringify(param)}`)
                    return <Badge style={{verticalAlign: "middle"}} color={`hsl(${hashToHue(hash)}, 100%, 72%)`} border pos={"relative"}>
                        <Text size={"sm"} style={{color: "inherit"}}>
                            {String(functionService.getById(param?.value?.functionDefinition?.id)?.names?.nodes!![0]?.content)}
                        </Text>
                        <Handle
                            key={param?.id}
                            type={dataTypeService.getDataType(paramDefinition?.dataTypeIdentifier!!)?.variant === "NODE" ? "source" : "target"}
                            position={Position.Bottom}
                            id={`param-${param?.id}`}
                            isConnectable={false}
                            className={"d-flow-viewport-default-card__handle d-flow-viewport-default-card__handle--target"}
                        />
                    </Badge>
            }
            return <Badge style={{verticalAlign: "middle"}} border>
                <Text size={"sm"}>
                    {item}
                </Text>
            </Badge>
        }
        return " " + String(item) + " "
    }), [flowStore, functionStore, data])

    React.useEffect(() => {
        fileTabsService.registerTab({
            id: node?.id!!,
            active: false,
            closeable: true,
            children: <>
                <IconFile color={`hsl(${hashToHue(colorHash)}, 100%, 72%)`} size={12}/>
                <Text size={"sm"}>{definition?.names?.nodes!![0]?.content}</Text>
            </>,
            content: <DFlowTabDefault flowId={props.data.flowId} depthLevel={data.depth} scopeLevel={data.scope}
                                      nodeLevel={data.index} node={data.node}/>
        })
    }, [node?.id, definition, data, fileTabsService])

    return (
        <Card
            key={id}
            data-flow-refernce={id}
            paddingSize={"xs"}
            outline={firstItem.id === id}
            borderColor={activeTabId == node?.id ? "info" : undefined}
            className={activeTabId == node?.id ? "d-flow-viewport-default-card--active" : undefined}
            color={(validation?.filter(v => v.type === InspectionSeverity.ERROR)?.length ?? 0) > 0 ? "error" : "primary"}
            onClick={() => {
                flowInstance.setViewport({
                    x: (viewportWidth / 2) + (props.positionAbsoluteX * -1) - (width / 2),
                    y: (viewportHeight / 2) + (props.positionAbsoluteY * -1) - (height / 2),
                    zoom: 1
                }, {
                    duration: 250,
                })
                fileTabsService.activateTab(node?.id!!)
            }} style={{position: "relative"}}>

            <Handle
                isConnectable={false}
                draggable={false}
                type="target"
                className={"d-flow-viewport-default-card__handle d-flow-viewport-default-card__handle--target"}
                style={{...(data.isParameter ? {right: "2px"} : {top: "2px"})}}
                position={data.isParameter ? Position.Right : Position.Top}
            />

            {/* Ausgang */}
            <Handle
                isConnectable={false}
                type="source"
                style={{...(data.isParameter ? {left: "2px"} : {bottom: "2px"})}}
                className={"d-flow-viewport-default-card__handle d-flow-viewport-default-card__handle--source"}
                position={data.isParameter ? Position.Left : Position.Bottom}
            />
            <Flex align={"center"} style={{gap: "0.7rem"}}>
                <IconFile color={`hsl(${hashToHue(colorHash)}, 100%, 72%)`} size={16}/>
                <Text size={"md"}>{displayMessage}</Text>
            </Flex>
        </Card>
    );
})