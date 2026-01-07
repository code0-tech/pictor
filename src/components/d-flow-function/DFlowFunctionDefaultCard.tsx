import {Code0Component, InspectionSeverity, underlineBySeverity} from "../../utils";
import {Handle, Node, NodeProps, Position, useReactFlow, useStore} from "@xyflow/react";
import React, {CSSProperties, memo} from "react";
import {Card} from "../card/Card";
import "./DFlowFunctionDefaultCard.style.scss";
import {Flex} from "../flex/Flex";
import {IconNote} from "@tabler/icons-react";
import {Text} from "../text/Text";
import {useService, useStore as usePictorStore} from "../../utils/contextStore";
import {DFlowFunctionReactiveService} from "./DFlowFunction.service";
import {useNodeValidation} from "../d-flow-validation/DNodeValidation.hook";
import {DFlowReactiveService} from "../d-flow";
import {FileTabsService} from "../file-tabs/FileTabs.service";
import {DFlowTabDefault} from "../d-flow-file/DFlowTabDefault";
import type {NodeFunction, Scalars} from "@code0-tech/sagittarius-graphql-types";
import {Badge} from "../badge/Badge";
import {md5} from "js-md5";
import {DFlowInputLiteralBadge} from "../d-flow-input/DFlowInputLiteralBadge";
import {DFlowInputReferenceBadge} from "../d-flow-input/DFlowInputReferenceBadge";
import {DFlowInputNodeBadge} from "../d-flow-input/DFlowInputNodeBadge";

export interface DFlowFunctionDefaultCardDataProps extends Omit<Code0Component<HTMLDivElement>, "scope"> {
    nodeId: NodeFunction['id']
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

    const node = React.useMemo(() => flowService.getNodeById(data.flowId, data.nodeId), [flowStore, data])
    const definition = React.useMemo(() => node ? functionService.getById(node.functionDefinition?.id!!) : undefined, [functionStore, data, node])
    const validation = useNodeValidation(data.nodeId, data.flowId)
    const activeTabId = React.useMemo(() => {
        return fileTabsStore.find((t: any) => (t as any).active)?.id
    }, [fileTabsStore, fileTabsService]);

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

    const colorHash = md5(md5(data.nodeId!))
    const hashToHue = (md5: string): number => {
        // nimm z.B. 8 Hex-Zeichen = 32 Bit
        const int = parseInt(md5.slice(0, 8), 16)
        return int % 360
    }

    const displayMessage = React.useMemo(() => splitTemplate(definition?.displayMessages!![0]?.content ?? "").map(item => {
        const param = node?.parameters?.nodes?.find(p => {
            const parameterDefinition = definition?.parameterDefinitions?.find(pd => pd.id == p?.id)
            return parameterDefinition?.identifier == item
        })

        const parameterValidation = validation?.filter(v => v.parameterId === param?.id)
        const decorationStyle: CSSProperties =
            parameterValidation?.length
                ? underlineBySeverity[parameterValidation[0].type]
                : {};

        if (param) {
            switch (param?.value?.__typename) {
                case "LiteralValue":
                    return <div style={{...decorationStyle, display: "inline-block"}}>
                        <DFlowInputLiteralBadge value={param.value}/>
                    </div>
                case "ReferenceValue":
                    return <div style={{...decorationStyle, display: "inline-block"}}>
                        <DFlowInputReferenceBadge value={param.value}/>
                    </div>
                case "NodeFunctionIdWrapper":
                    return <div style={{...decorationStyle, display: "inline-block"}}>
                        <DFlowInputNodeBadge value={param.value} flowId={props.data.flowId}/>
                        <Handle
                            key={param?.id}
                            type={"target"}
                            position={Position.Right}
                            id={`param-${param?.id}`}
                            isConnectable={false}
                            className={"d-flow-viewport-default-card__handle d-flow-viewport-default-card__handle--target"}
                        />
                    </div>
            }
            return <Badge style={{verticalAlign: "middle"}} border>
                <Text size={"sm"}>
                    {item}
                </Text>
            </Badge>
        }
        return " " + String(item) + " "
    }), [flowStore, functionStore, data, definition])

    React.useEffect(() => {
        if (!node?.id) return
        fileTabsService.registerTab({
            id: node.id,
            active: false,
            closeable: true,
            children: <>
                <IconNote color={`hsl(${hashToHue(colorHash)}, 100%, 72%)`} size={12}/>
                <Text size={"sm"}>{definition?.names!![0]?.content}</Text>
            </>,
            content: <DFlowTabDefault flowId={props.data.flowId} node={node}/>
        })
    }, [node?.id, definition, data])

    return (
        <Card
            key={id}
            data-flow-refernce={id}
            paddingSize={"xs"}
            outline={firstItem.id === id}
            borderColor={activeTabId == node?.id ? "info" : undefined}
            className={activeTabId == node?.id ? "d-flow-viewport-default-card--active" : undefined}
            color={"primary"}
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
                <IconNote color={`hsl(${hashToHue(colorHash)}, 100%, 72%)`} size={16}/>
                <Text size={"md"}>{displayMessage}</Text>
            </Flex>
        </Card>
    );
})
