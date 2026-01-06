import {Badge, BadgeType} from "../badge/Badge";
import {Flow, NodeFunction, NodeFunctionIdWrapper} from "@code0-tech/sagittarius-graphql-types";
import React from "react";
import {md5} from "js-md5";
import {IconCirclesRelation, IconNote} from "@tabler/icons-react";
import {Text} from "../text/Text";
import {useService, useStore} from "../../utils";
import {DFlowFunctionReactiveService} from "../d-flow-function";
import {DFlowReactiveService} from "../d-flow";

export interface DFlowInputNodeBadgeProps extends Omit<BadgeType, 'value' | 'children'> {
    value: NodeFunction | NodeFunctionIdWrapper
    flowId: Flow['id']
}

export const DFlowInputNodeBadge: React.FC<DFlowInputNodeBadgeProps> = (props) => {

    const {value, flowId, ...rest} = props

    const functionService = useService(DFlowFunctionReactiveService)
    const functionStore = useStore(DFlowFunctionReactiveService)
    const flowService = useService(DFlowReactiveService)
    const flowStore = useStore(DFlowReactiveService)

    const node = React.useMemo(() => {
        return flowService.getNodeById(flowId, value.id)
    }, [flowStore])

    const name = React.useMemo(() => {
        return functionService.getById(node?.functionDefinition?.id)?.names?.nodes?.[0]?.content
    }, [functionStore, node])

    const hashRef = md5(md5(value.id || ""))

    const hashToHue = (md5: string): number => {
        const int = parseInt(md5.slice(0, 8), 16)
        return int % 360
    }

    return <Badge style={{verticalAlign: "middle"}}
                  color={`hsl(${hashToHue(hashRef)}, 100%, 72%)`}
                  border
                  {...rest}>
        <IconNote size={12}/>
        <Text size={"sm"} style={{color: "inherit"}}>
            {String(name)}
        </Text>
    </Badge>
}