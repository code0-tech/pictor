import {Meta} from "@storybook/react";
import {Background, BackgroundVariant} from "@xyflow/react";
import React from "react";
import {DFlowFunctionCard} from "./function/cards/DFlowFunctionCard";
import {DFlow} from "./DFlow";
import {ContextStoreProvider} from "../../utils/contextStore";
import {createReactiveArrayService} from "../../utils/reactiveArrayService";
import {Flow, NodeFunction} from "./DFlow.view";
import {DFlowReactiveService} from "./DFlow.service";
import {useFlowNodes} from "./DFlow.nodes.hook";
import {flow} from "./DFlow.data";
import {useFlowEdges} from "./DFlow.edges.hook";
import {DFlowEdge} from "./DFlowEdge";
import Button from "../button/Button";

export default {
    title: "DFlow",
} as Meta

export const ExampleFlow = () => {

    const [flowStore, flowService] = createReactiveArrayService<Flow, DFlowReactiveService>(DFlowReactiveService, undefined, [new Flow(flow)]);

    return (
        <ContextStoreProvider services={[[flowStore, flowService]]}>
            <Button onClick={() => {
                const flow = flowService.getById("some_database_id")
                if (!flow) return
                const newNode = new NodeFunction({
                    function: {
                        function_id: "std::math::add",
                        runtime_function_id: "std::math::add"
                    },
                    parameters: [{
                        definition: {
                            parameter_id: "std::math::add__firstValue",
                            runtime_parameter_id: "std::math::add__firstValue"
                        },
                        value: 5
                    }, {
                        definition: {
                            parameter_id: "standard::math::add__secondValue",
                            runtime_parameter_id: "standard::math::add__secondValue"
                        },
                        value: 10
                    }]
                })
                flow.startingNode.nextNode!!.nextNode!!.nextNode = newNode
                flowService.update()
            }}>Add Node</Button>
            <Test/>
        </ContextStoreProvider>
    );

}

const Test = () => {

    const initialNodes = useFlowNodes("some_database_id")
    const initialEdges = useFlowEdges("some_database_id")

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
        <Background variant={BackgroundVariant.Dots} color="rgba(255,255,255, .1)" gap={8} size={2}/>
    </DFlow>
}

