import React from "react"
import DFlowInputObject from "./DFlowInputObject";

const sampleObject = {
    test: {
        test: "test",
        test2: "test",
        nested: {
            test: "test",
            test2: "test"
        }
    },
    list: [
        {bla: "bla"},
        {blub: [1, 2, 3]}
    ],
    value: "test"
};

export const Test = () => {
    return <DFlowInputObject data={sampleObject} label="Test Object"/>;
}

export default {
    title: "DFlowInputObject",
    component: Test
}