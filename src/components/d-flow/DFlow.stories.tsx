import {Meta} from "@storybook/react";
import {Background, BackgroundVariant} from "@xyflow/react";
import React from "react";
import {DFlowFunctionCard} from "./function/cards/DFlowFunctionCard";
import {DFlow} from "./DFlow";

export default {
    title: "DFlow",
} as Meta

export const ExampleFlow = () => {

    const initialNodes = [
        {id: 'n1', draggable: false, position: {x: 0, y: 0}, type: "default", data: {label: 'Node 1'}},
        {id: 'n2', draggable: false, position: {x: 0, y: 0}, type: "default", data: {label: 'Node 2'}},
    ];
    const initialEdges = [{id: 'n1-n2', source: 'n1', target: 'n2'}];

    const nodeTypes = {
        default: DFlowFunctionCard,
    };

    return (
        <DFlow
            nodes={initialNodes}
            edges={initialEdges}
            nodeTypes={nodeTypes}
            fitView
        >
            <Background variant={BackgroundVariant.Dots} color="#bbb"/>
        </DFlow>
    );

}

