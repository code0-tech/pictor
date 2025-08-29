import React from "react";
import {Flow} from "../../DFlow.view";
import {useService} from "../../../../utils/contextStore";
import {DFlowReactiveService} from "../../DFlow.service";
import TextInput from "../../../form/TextInput";
import Flex from "../../../flex/Flex";

export interface DFlowViewportTriggerTabContentProps {
    instance: Flow
}

export const DFlowViewportTriggerTabContent: React.FC<DFlowViewportTriggerTabContentProps> = (props) => {

    const {instance} = props
    const flowService = useService(DFlowReactiveService)

    return <Flex style={{gap: ".7rem", flexDirection: "column"}}>
        {instance.settings?.map(setting => {
            return <div>
                <TextInput/>
            </div>
        })}
    </Flex>
}