import React from "react"
import {DFlowInputObject} from "./DFlowInputObject";

const sampleObject =  [{blub: [1, 2, 3]}];

export const Test = () => {
    return <DFlowInputObject data={sampleObject} label="Test Object"/>;
}

export default {
    title: "DFlowInputObject",
    component: Test
}