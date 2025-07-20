import {Meta} from "@storybook/react";
import {Background, BackgroundVariant} from "@xyflow/react";
import React from "react";
import {DFlowFunctionCard} from "./function/cards/DFlowFunctionCard";
import {DFlow} from "./DFlow";
import {ContextStoreProvider} from "../../utils/contextStore";
import {createReactiveArrayService} from "../../utils/reactiveArrayService";
import {Flow} from "./DFlow.view";
import {DFlowReactiveService} from "./DFlow.service";
import {useFlowNodes} from "./DFlow.nodes.hook";
import {flow} from "./DFlow.data";
import {useFlowEdges} from "./DFlow.edges.hook";
import {DFlowEdge} from "./DFlowEdge";

export default {
    title: "DFlow",
} as Meta

export const ExampleFlow = () => {

    const [flowStore, flowService] = createReactiveArrayService<Flow, DFlowReactiveService>(DFlowReactiveService, undefined, [new Flow(flow)]);


    return (
        <ContextStoreProvider services={[[flowStore, flowService]]}>
            <Test/>
        </ContextStoreProvider>
    );

}

const Test = () => {

    const initialNodes = useFlowNodes("some_database_id")
    const initialEdges = useFlowEdges("some_database_id")

    console.log(initialNodes, initialEdges)

    const nodeTypes = {
        default: DFlowFunctionCard,
    }

    const edgeTypes = {
        default: DFlowEdge
    }

    return <DFlow
        nodes={initialNodes}
        edges={initialEdges}
        nodeTypes={nodeTypes}
        edgeTypes={edgeTypes}
        fitView
    >
        <Background variant={BackgroundVariant.Dots} color="#bbb"/>
    </DFlow>
}

