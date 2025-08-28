import React from "react";
import {NodeFunction} from "../../DFlow.view";
import TextInput from "../../../form/TextInput";
import Flex from "../../../flex/Flex";
import {useService} from "../../../../utils/contextStore";
import {DFlowFunctionReactiveService} from "../../function/DFlowFunction.service";
import {useSuggestions} from "../../suggestions/DFlowSuggestion.hook";
import {DFlowSuggestionMenuFooter} from "../../suggestions/DFlowSuggestionMenuFooter";
import {toInputSuggestions} from "../../suggestions/DFlowSuggestionMenu.util";
import {Value} from "../../data-type/DFlowDataType.view";
import {DFlowReactiveService} from "../../DFlow.service";
import InputMessage from "../../../form/InputMessage";

export interface DFlowViewportFileTabsContentProps {
    functionInstance: NodeFunction
    depthLevel?: number
    scopeLevel?: number[]
    nodeLevel?: number
}

export const DFlowViewportFileTabsContent: React.FC<DFlowViewportFileTabsContentProps> = (props) => {

    const {functionInstance, depthLevel, scopeLevel, nodeLevel} = props
    const functionService = useService(DFlowFunctionReactiveService)
    const flowService = useService(DFlowReactiveService)
    const definition = functionService.getFunctionDefinition(functionInstance.id)
    return <Flex style={{gap: ".7rem", flexDirection: "column"}}>
        {functionInstance.parameters!!.map(parameter => {

            const parameterDefinition = definition?.parameters!!.find(parameterDefinition => parameterDefinition.parameter_id === parameter.id)
            const result = useSuggestions(parameterDefinition!!.type, [], "some_database_id", depthLevel, scopeLevel, nodeLevel)

            const enterValue = (value: Value) => {
                parameter.value = value
                flowService.update()
            }

            return <div>
                <TextInput title={parameterDefinition!!.parameter_id}
                           description={JSON.stringify(parameterDefinition!!.type)}
                           clearable
                           defaultValue={parameter.value instanceof NodeFunction ? JSON.stringify(parameter.value.json) : JSON.stringify(parameter.value)}
                           onSuggestionSelect={(suggestion) => {
                               enterValue(suggestion.value)
                           }}
                           onBlur={event => {
                               enterValue(JSON.parse(event.target.value))
                           }}
                           suggestionsFooter={<DFlowSuggestionMenuFooter/>}
                           suggestions={toInputSuggestions(result)}

                />
            </div>
        })}
    </Flex>

}