import {Badge, BadgeType} from "../badge/Badge";
import {Flow, ReferenceValue} from "@code0-tech/sagittarius-graphql-types";
import React from "react";
import {Text} from "../text/Text";
import {Flex} from "../flex/Flex";
import {DFlowInputNodeBadge} from "./DFlowInputNodeBadge";
import {FunctionDefinitionView} from "../d-flow-function";
import {FlowTypeView} from "../d-flow-type";
import {IconVariable} from "@tabler/icons-react";

export interface DFlowInputReferenceBadge extends Omit<BadgeType, 'value' | 'children'> {
    value: ReferenceValue
    flowId: Flow['id']
    definition?: FunctionDefinitionView | FlowTypeView
}

export const DFlowInputReferenceBadge: React.FC<DFlowInputReferenceBadge> = (props) => {

    const {value, flowId, definition, ...rest} = props
    const content = React.useMemo(() => {
        console.log(value)
        if (value.nodeFunctionId && flowId) {
            return <Flex align={"center"} display={"inline-flex"}>
                <DFlowInputNodeBadge definition={definition} value={{
                    id: value.nodeFunctionId,
                    __typename: "NodeFunctionIdWrapper"
                }} flowId={flowId}/>
                {"inputTypeIdentifier" in value && value.inputTypeIdentifier ? "." + value.inputTypeIdentifier : ""}
                {value.referencePath ? "." + (value.referencePath?.map(path => path.path).join(".") ?? "") : ""}
            </Flex>
        }
        return `{{ ${String(value.depth)}-${String(value.scope)}-${String(value.node)}-${value.referencePath?.map(path => path.path).join(".") ?? ""} }}`
    }, [value])

    return <Badge style={{verticalAlign: "middle"}}
                  color={"warning"}
                  py={"0"}
                  border
                  {...rest}>
        <IconVariable size={12}/>
        <Text size={"sm"} style={{color: "inherit"}}>
            {content}
        </Text>
    </Badge>
}