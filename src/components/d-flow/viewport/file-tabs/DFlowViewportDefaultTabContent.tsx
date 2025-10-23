import React from "react";
import {NodeFunctionView} from "../../DFlow.view";
import TextInput from "../../../form/TextInput";
import Flex from "../../../flex/Flex";
import {useService} from "../../../../utils/contextStore";
import {DFlowFunctionReactiveService} from "../../function/DFlowFunction.service";
import {useSuggestions} from "../../suggestions/DFlowSuggestion.hook";
import {DFlowSuggestionMenuFooter} from "../../suggestions/DFlowSuggestionMenuFooter";
import {toInputSuggestions} from "../../suggestions/DFlowSuggestionMenu.util";
import {DFlowReactiveService} from "../../DFlow.service";
import {DFlowSuggestion} from "../../suggestions/DFlowSuggestion.view";
import {ParameterDefinitionView} from "../../function/DFlowFunction.view";
import Badge from "../../../badge/Badge";
import {DFlowDataTypeReactiveService} from "../../data-type/DFlowDataType.service";
import {useReturnType} from "../../function/DFlowFunction.return.hook";
import {resolveGenericKeys} from "../../../../utils/generics";
import {NodeFunction, NodeParameterValue, ReferenceValue} from "@code0-tech/sagittarius-graphql-types";

export interface DFlowViewportFileTabsContentProps {
    functionInstance: NodeFunctionView
    depthLevel?: number
    scopeLevel?: number[]
    nodeLevel?: number
}

export const DFlowViewportDefaultTabContent: React.FC<DFlowViewportFileTabsContentProps> = (props) => {

    const {functionInstance, depthLevel, scopeLevel, nodeLevel} = props
    const functionService = useService(DFlowFunctionReactiveService)
    const dataTypeService = useService(DFlowDataTypeReactiveService)
    const flowService = useService(DFlowReactiveService)
    const definition = functionService.getFunctionDefinition(functionInstance.functionDefinition?.id!!)
    const paramDefinitions = React.useMemo(() => {
        const map: Record<string, ParameterDefinitionView> = {}
        definition?.parameterDefinitions?.forEach(pd => {
            map[pd.id!!] = pd
        })
        return map
    }, [definition?.parameterDefinitions])

    const sortedParameters = React.useMemo(() => {
        return [...(functionInstance.parameters || [])].sort((a, b) => a.id!!.localeCompare(b.id!!))
    }, [functionInstance.parameters])

    const suggestionsById: Record<string, DFlowSuggestion[]> = {}
    sortedParameters.forEach(parameter => {
        const parameterDefinition = paramDefinitions[parameter.id!!]
        suggestionsById[parameter.id!!] = useSuggestions(parameterDefinition?.dataTypeIdentifier!!, [], "some_database_id", depthLevel, scopeLevel, nodeLevel)
    })

    const returnType = useReturnType(definition!!, sortedParameters.map(p => p.value as NodeParameterValue), dataTypeService)
    const genericTypeMap = resolveGenericKeys(definition!!, sortedParameters.map(p => p.value as NodeParameterValue), dataTypeService)
    return <Flex style={{gap: ".7rem", flexDirection: "column"}}>
        {sortedParameters.map(parameter => {

            const submitValue = (value: NodeParameterValue) => {
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

            const parameterDefinition = paramDefinitions[parameter.id!!]
            const result = suggestionsById[parameter.id!!]
            const title = parameterDefinition?.names ? parameterDefinition?.names?.nodes!![0]?.content : parameterDefinition?.id
            const description = parameterDefinition?.descriptions ? parameterDefinition?.descriptions?.nodes!![0]?.content : JSON.stringify(parameterDefinition?.dataTypeIdentifier)
            const defaultValue = parameter.value instanceof NodeFunctionView ? JSON.stringify(parameter.value) : typeof parameter.value == "object" || typeof parameter.value == "boolean" ? JSON.stringify(parameter.value) : parameter.value


            return <div>
                {JSON.stringify(dataTypeService.getTypeFromValue(parameter.value as NodeParameterValue))}
                <TextInput title={title}
                           description={description}
                           clearable
                           key={JSON.stringify(parameter.value)}
                           transformValue={value => {
                               try {
                                   if (!value) return value
                                   if ((value as NodeParameterValue).__typename === "NodeFunction") {
                                       return <Badge
                                           color={"info"}>{(JSON.parse(value) as NodeFunction).id}</Badge>
                                   }
                                   if ((value as NodeParameterValue).__typename === "ReferenceValue") {
                                       const refObject = JSON.parse(value) as ReferenceValue
                                       return <Badge
                                           color={"warning"}>{refObject.depth}-{refObject.scope}-{refObject.node}-{JSON.stringify(refObject.dataTypeIdentifier)}</Badge>
                                   }
                               } catch (e) {
                               }
                               return value
                           }}
                           disableOnValue={value => {
                               if (!value) return false
                               try {
                                   return (value as NodeParameterValue).__typename === "NodeFunction" || (value as NodeParameterValue).__typename === "ReferenceValue"
                               } catch (e) {
                               }
                               return false
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
        {JSON.stringify(returnType)}
        <br/>
        <br/>
        {JSON.stringify(genericTypeMap)}
    </Flex>

}