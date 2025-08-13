import {Meta} from "@storybook/react";
import {Background, BackgroundVariant, Panel} from "@xyflow/react";
import React, {useEffect} from "react";
import {DFlowViewportDefaultCard} from "./viewport/cards/DFlowViewportDefaultCard";
import {DFlowViewportGroupCard} from "./viewport/cards/DFlowViewportGroupCard";
import {DFlow} from "./DFlow";
import {ContextStoreProvider} from "../../utils/contextStore";
import {createReactiveArrayService} from "../../utils/reactiveArrayService";
import {Flow} from "./DFlow.view";
import {DFlowReactiveService} from "./DFlow.service";
import {useFlowViewportNodes} from "./viewport/DFlowViewport.nodes.hook";
import {flow1} from "./DFlow.data";
import {useFlowViewportEdges} from "./viewport/DFlowViewport.edges.hook";
import {DFlowViewportEdge} from "./viewport/DFlowViewportEdge";
import {DataType} from "./data-type/DFlowDataType.view";
import {FunctionDefinition} from "./function/DFlowFunction.view";
import {dataTypes} from "./data-type/DFlowDataType.data";
import {functionData} from "./function/DFlowFunction.data";
import {DFlowDataTypeReactiveService} from "./data-type/DFlowDataType.service";
import {DFlowFunctionReactiveService} from "./function/DFlowFunction.service";
import {DFlowSuggestion} from "./suggestions/DFlowSuggestion.view";
import {DFlowReactiveSuggestionService} from "./suggestions/DFlowSuggestion.service";
import {DFlowViewportControls} from "./viewport/DFlowViewportControls";

export default {
    title: "DFlow",
} as Meta

export const ExampleFlow = () => {

    const functionsData: FunctionDefinition[] = functionData.map((fd) => new FunctionDefinition(fd))

    const [dataTypeStore, dataTypeService] = createReactiveArrayService<DataType, DFlowDataTypeReactiveService>(DFlowDataTypeReactiveService);
    const [functionStore, functionService] = createReactiveArrayService<FunctionDefinition, DFlowFunctionReactiveService>(DFlowFunctionReactiveService, undefined, functionsData);
    const [flowStore, flowService] = createReactiveArrayService<Flow, DFlowReactiveService>(DFlowReactiveService, undefined, [new Flow(flow1)]);
    const [suggestionStore, suggestionService] = createReactiveArrayService<DFlowSuggestion, DFlowReactiveSuggestionService>(DFlowReactiveSuggestionService);

    useEffect(() => {
        dataTypes.map((dt) => dataTypeService.add(new DataType(dt, dataTypeService)))
    }, []);

    return (
        <ContextStoreProvider
            services={[[dataTypeStore, dataTypeService], [functionStore, functionService], [flowStore, flowService], [suggestionStore, suggestionService]]}>
            <Test/>
        </ContextStoreProvider>
    );

}

const Test = () => {

    const initialNodes = useFlowViewportNodes("some_database_id")
    const initialEdges = useFlowViewportEdges("some_database_id")

    const nodeTypes = {
        default: DFlowViewportDefaultCard,
        group: DFlowViewportGroupCard,
    }

    const edgeTypes = {
        default: DFlowViewportEdge
    }

    return <DFlow
        nodes={initialNodes}
        edges={initialEdges}
        nodeTypes={nodeTypes}
        edgeTypes={edgeTypes}
        fitView
    >
        <Background variant={BackgroundVariant.Dots} color="rgba(255,255,255, .1)" gap={8} size={2}/>
        <DFlowViewportControls/>
    </DFlow>
}

