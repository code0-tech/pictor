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
import {DFlowSuggestion} from "../../suggestions/DFlowSuggestion.view";
import {ParameterDefinition} from "../../function/DFlowFunction.view";
import Badge from "../../../badge/Badge";
import {DFlowDataTypeReactiveService} from "../../data-type/DFlowDataType.service";
import {useReturnType} from "../../function/DFlowFunction.return.hook";
import {resolveGenericKeys} from "../../../../utils/generics";

export interface DFlowViewportFileTabsContentProps {
    functionInstance: NodeFunction
    depthLevel?: number
    scopeLevel?: number[]
    nodeLevel?: number
}

export const DFlowViewportDefaultTabContent: React.FC<DFlowViewportFileTabsContentProps> = (props) => {

    const {functionInstance, depthLevel, scopeLevel, nodeLevel} = props
    const functionService = useService(DFlowFunctionReactiveService)
    const dataTypeService = useService(DFlowDataTypeReactiveService)
    const flowService = useService(DFlowReactiveService)
    const definition = functionService.getFunctionDefinition(functionInstance.id)
    const paramDefinitions = React.useMemo(() => {
        const map: Record<string, ParameterDefinition> = {}
        definition?.parameters?.forEach(pd => {
            map[pd.parameter_id] = pd
        })
        return map
    }, [definition?.parameters])

    const sortedParameters = React.useMemo(() => {
        return [...(functionInstance.parameters || [])].sort((a, b) => a.id.localeCompare(b.id))
    }, [functionInstance.parameters])

    const suggestionsById: Record<string, DFlowSuggestion[]> = {}
    sortedParameters.forEach(parameter => {
        const parameterDefinition = paramDefinitions[parameter.id]
        suggestionsById[parameter.id] = useSuggestions(parameterDefinition?.type, [], "some_database_id", depthLevel, scopeLevel, nodeLevel)
    })

    const returnType = useReturnType(definition!!, sortedParameters.map(p => p.value as Value), dataTypeService)
    const genericTypeMap = resolveGenericKeys(definition!!, sortedParameters.map(p => p.value as Value), dataTypeService)
    return <Flex style={{gap: ".7rem", flexDirection: "column"}}>
        {sortedParameters.map(parameter => {

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

            const parameterDefinition = paramDefinitions[parameter.id]
            const result = suggestionsById[parameter.id]
            const title = parameterDefinition?.name ? parameterDefinition?.name[0]?.text : parameterDefinition!!.parameter_id
            const description = parameterDefinition?.description ? parameterDefinition?.description[0]?.text : JSON.stringify(parameterDefinition!!.type)
            const defaultValue = parameter.value instanceof NodeFunction ? JSON.stringify(parameter.value.json) : typeof parameter.value == "object" || typeof parameter.value == "boolean" ? JSON.stringify(parameter.value) : parameter.value


            return <div>
                {JSON.stringify(dataTypeService.getTypeFromValue(parameter.value as Value))}
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
                           disableOnValue={value => {
                               if (!value) return false
                               try {
                                   return isNodeFunctionObject(JSON.parse(value) as NodeFunctionObject) || isRefObject(JSON.parse(value))
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