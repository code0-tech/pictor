import {Badge, BadgeType} from "../badge/Badge";
import {Flow, NodeFunction, NodeFunctionIdWrapper} from "@code0-tech/sagittarius-graphql-types";
import React from "react";
import {md5} from "js-md5";
import {IconBolt, IconNote} from "@tabler/icons-react";
import {Text} from "../text/Text";
import {useService, useStore} from "../../utils";
import {DFlowFunctionReactiveService, FunctionDefinitionView} from "../d-flow-function";
import {DFlowReactiveService} from "../d-flow";
import {DFlowTypeReactiveService, FlowTypeView} from "../d-flow-type";

export interface DFlowInputNodeBadgeProps extends Omit<BadgeType, 'value' | 'children'> {
    value: NodeFunction | NodeFunctionIdWrapper
    flowId: Flow['id']
    definition?: FunctionDefinitionView | FlowTypeView
}

export const DFlowInputNodeBadge: React.FC<DFlowInputNodeBadgeProps> = (props) => {

    const {value, flowId, definition, ...rest} = props

    const functionService = definition || useService(DFlowFunctionReactiveService)
    const functionStore = definition || useStore(DFlowFunctionReactiveService)
    const flowService = definition || useService(DFlowReactiveService)
    const flowStore = definition || useStore(DFlowReactiveService)
    const flowTypeService = definition || useService(DFlowTypeReactiveService)
    const flowTypeStore = definition || useStore(DFlowTypeReactiveService)

    const isTrigger = value.__typename === "NodeFunctionIdWrapper" && value.id === "gid://sagittarius/NodeFunction/-1"

    const node: NodeFunction | FlowTypeView | NodeFunctionIdWrapper | undefined = React.useMemo(() => {
        if (isTrigger && !definition) {
            const flow = (flowService as DFlowReactiveService).getById(flowId)
            return (flowTypeService as DFlowTypeReactiveService).getById(flow?.type?.id)
        }
        return value.__typename === "NodeFunction" || definition ? value : (flowService as DFlowReactiveService).getNodeById(flowId, value.id)
    }, [flowStore, flowTypeStore])

    const name = React.useMemo(() => {
        if (definition) {
            return definition.names?.[0]?.content
        } else if (isTrigger && node instanceof FlowTypeView) {
            return node.names?.[0]?.content
        }
        return (functionService as DFlowFunctionReactiveService).getById((node as NodeFunction)?.functionDefinition?.id)?.names?.[0]?.content
    }, [functionStore, node])

    const hashRef = md5(md5(value.id || ""))

    const hashToHue = (md5: string): number => {
        const int = parseInt(md5.slice(0, 8), 16)
        return int % 360
    }

    return <Badge style={{verticalAlign: "middle"}}
                  color={isTrigger ? "info" : `hsl(${hashToHue(hashRef)}, 100%, 72%)`}
                  border
                  {...rest}>
        {
            isTrigger
            ? <IconBolt size={12}/>
            : <IconNote size={12}/>
        }
        <Text size={"sm"} style={{color: "inherit"}}>
            {String(name)}
        </Text>
    </Badge>
}