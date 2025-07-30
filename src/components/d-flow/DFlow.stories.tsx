import {Meta} from "@storybook/react";
import {Background, BackgroundVariant} from "@xyflow/react";
import React, {useEffect} from "react";
import {DFlowFunctionCard} from "./function/cards/DFlowFunctionCard";
import {DFlow} from "./DFlow";
import {ContextStoreProvider} from "../../utils/contextStore";
import {createReactiveArrayService} from "../../utils/reactiveArrayService";
import {Flow, NodeFunction} from "./DFlow.view";
import {DFlowReactiveService} from "./DFlow.service";
import {useFlowNodes} from "./DFlow.nodes.hook";
import {flow, flow1} from "./DFlow.data";
import {useFlowEdges} from "./DFlow.edges.hook";
import {DFlowEdge} from "./DFlowEdge";
import Button from "../button/Button";
import {DataType} from "./data-type/DFlowDataType.view";
import {FunctionDefinition} from "./function/DFlowFunction.view";
import {dataTypes} from "./data-type/DFlowDataType.data";
import {functionData} from "./function/DFlowFunction.data";
import {DFlowDataTypeReactiveService} from "./data-type/DFlowDataType.service";
import {DFlowFunctionReactiveService} from "./function/DFlowFunction.service";
import {DFlowSuggestion} from "./suggestions/DFlowSuggestion.view";
import {DFlowReactiveSuggestionService} from "./suggestions/DFlowSuggestion.service";

export default {
    title: "DFlow",
} as Meta

export const ExampleFlow = () => {

    const functionsData: FunctionDefinition[] = functionData.map((fd) => new FunctionDefinition(fd))

    const [dataTypeStore, dataTypeService] = createReactiveArrayService<DataType, DFlowDataTypeReactiveService>(DFlowDataTypeReactiveService);
    const [functionStore, functionService] = createReactiveArrayService<FunctionDefinition, DFlowFunctionReactiveService>(DFlowFunctionReactiveService, undefined, functionsData);
    const [flowStore, flowService] = createReactiveArrayService<Flow, DFlowReactiveService>(DFlowReactiveService, undefined, [new Flow(flow)]);
    const [suggestionStore, suggestionService] = createReactiveArrayService<DFlowSuggestion, DFlowReactiveSuggestionService>(DFlowReactiveSuggestionService);

    useEffect(() => {
        dataTypes.map((dt) => dataTypeService.add(new DataType(dt, dataTypeService)))
    }, []);

    return (
        <ContextStoreProvider
            services={[[dataTypeStore, dataTypeService], [functionStore, functionService], [flowStore, flowService], [suggestionStore, suggestionService]]}>
            <Button onClick={() => {
                const flow = flowService.getById("some_database_id")
                if (!flow) return
                const newNode = new NodeFunction({
                    function: {
                        function_id: "std::math::add",
                        runtime_function_id: "std::math::add_2"
                    },
                    parameters: [{
                        definition: {
                            parameter_id: "std::math::add__firstValue",
                            runtime_parameter_id: "std::math::add__firstValue"
                        },
                        value: 50
                    }, {
                        definition: {
                            parameter_id: "standard::math::add__secondValue",
                            runtime_parameter_id: "standard::math::add__secondValue"
                        },
                        value: 100
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

