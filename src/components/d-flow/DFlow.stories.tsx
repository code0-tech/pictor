import React from "react";
import {Meta} from "@storybook/react";
import {createReactiveArrayService} from "../../utils/reactiveArrayStore";
import Button from "../button/Button";
import {DFlowService} from "./DFlow.service";
import {Flow} from "./DFlow.view";
import Text from "../text/Text";
import {flow} from "./DFlow.data";

const meta: Meta = {
    title: "Flows"
}

export default meta

export const Test = () => {

    const [store, service] = createReactiveArrayService<Flow, DFlowService>(DFlowService)

    return React.useMemo(() => {
        console.log("rendering")
        return <>
            <Button onClick={() => {
                service.add(new Flow(flow))
            }}>Flow hinzufügen</Button>
            <Button onClick={() => {
                service.update()
            }}>Update</Button>
            {service.values().map((item) => {
                return <FlowId id={item.id}/>
            })}
        </>
    }, [store])

}

const FlowId = React.memo((props: {id: string}) => {
    console.log(props.id)
    return <div><Text>{props.id}</Text></div>
})