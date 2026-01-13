import {Code0Component} from "../../utils";
import {Flow, NodeFunction} from "@code0-tech/sagittarius-graphql-types";

export interface DFlowNodeProps extends Record<string, unknown>, Code0Component<HTMLDivElement> {
    nodeId: NodeFunction['id']
    flowId: Flow['id']
    parentNodeId?: NodeFunction['id']
    isParameter?: boolean
    index?: number
}