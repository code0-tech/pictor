import React from "react";
import {isNodeFunctionObject, NodeFunction, NodeFunctionObject} from "../../DFlow.view";
import TextInput from "../../../form/TextInput";
import Flex from "../../../flex/Flex";
import {useService} from "../../../../utils/contextStore";
import {DFlowFunctionReactiveService} from "../../function/DFlowFunction.service";
import {useSuggestions} from "../../suggestions/DFlowSuggestion.hook";
import {DFlowSuggestionMenuFooter} from "../../suggestions/DFlowSuggestionMenuFooter";
import {toInputSuggestions} from "../../suggestions/DFlowSuggestionMenu.util";
import {isRefObject, RefObject, Value} from "../../data-type/DFlowDataType.view";
import {DFlowReactiveService} from "../../DFlow.service";
import Badge from "../../../badge/Badge";

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

            const submitValue = (value: Value) => {
                parameter.value = value
                flowService.update()
            }

            const submitValueEvent = (event: any) => {
                try {
                    const value = JSON.parse(event.target.value)
                    submitValue(value)
                } catch (e) {
                    // @ts-ignore
                    submitValue(event.target.value == "" ? undefined : event.target.value)
                }
            }

            const parameterDefinition = definition?.parameters!!.find(parameterDefinition => parameterDefinition.parameter_id === parameter.id)
            const result = useSuggestions(parameterDefinition!!.type, [], "some_database_id", depthLevel, scopeLevel, nodeLevel)
            const title = parameterDefinition?.name ? parameterDefinition?.name[0]?.text : parameterDefinition!!.parameter_id
            const description = parameterDefinition?.description ? parameterDefinition?.description[0]?.text : JSON.stringify(parameterDefinition!!.type)
            const defaultValue = parameter.value instanceof NodeFunction ? JSON.stringify(parameter.value.json) : typeof parameter.value == "object" || typeof parameter.value == "boolean" ? JSON.stringify(parameter.value) : parameter.value


            return <div>
                <TextInput title={title}
                           description={description}
                           clearable
                           key={JSON.stringify(parameter.value)}
                           transformValue={value => {
                               try {
                                   if (!value) return value
                                   if (isNodeFunctionObject(JSON.parse(value) as NodeFunctionObject)) {
                                       return <Badge
                                           color={"info"}>{(JSON.parse(value) as NodeFunctionObject).function.function_id}</Badge>
                                   }
                                   if (isRefObject(JSON.parse(value))) {
                                       const refObject = JSON.parse(value) as RefObject
                                       return <Badge
                                           color={"warning"}>{refObject.depth}-{refObject.scope}-{refObject.node}-{JSON.stringify(refObject.type)}</Badge>
                                   }
                               } catch (e) {
                               }
                               return value
                           }}
                           defaultValue={defaultValue}
                           onSuggestionSelect={(suggestion) => {
                               submitValue(suggestion.value)
                           }}
                           onBlur={submitValueEvent}
                           onClear={submitValueEvent}
                           suggestionsFooter={<DFlowSuggestionMenuFooter/>}
                           suggestions={toInputSuggestions(result)}

                />
            </div>
        })}
    </Flex>

}