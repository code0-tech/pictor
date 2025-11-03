import React from "react";
import {NodeFunctionView} from "../DFlow.view";
import TextInput from "../../form/TextInput";
import Flex from "../../flex/Flex";
import {useService} from "../../../utils/contextStore";
import {DFlowFunctionReactiveService} from "../function/DFlowFunction.service";
import {useSuggestions} from "../suggestion/DFlowSuggestion.hook";
import {DFlowSuggestionMenuFooter} from "../suggestion/DFlowSuggestionMenuFooter";
import {toInputSuggestions} from "../suggestion/DFlowSuggestionMenu.util";
import {DFlowReactiveService} from "../DFlow.service";
import {DFlowSuggestion} from "../suggestion/DFlowSuggestion.view";
import {ParameterDefinitionView} from "../function/DFlowFunction.view";
import Badge from "../../badge/Badge";
import {
    LiteralValue,
    NodeFunction,
    NodeParameterValue,
    ReferenceValue,
    Scalars
} from "@code0-tech/sagittarius-graphql-types";

export interface DFlowTabDefaultProps {
    functionInstance: NodeFunctionView
    flowId: Scalars["FlowID"]["output"]
    depthLevel?: number
    scopeLevel?: number[]
    nodeLevel?: number
}

export const DFlowTabDefault: React.FC<DFlowTabDefaultProps> = (props) => {

    const {functionInstance, flowId, depthLevel, scopeLevel, nodeLevel} = props
    const functionService = useService(DFlowFunctionReactiveService)
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
        suggestionsById[parameter.id!!] = useSuggestions(parameterDefinition?.dataTypeIdentifier!!, [], flowId, depthLevel, scopeLevel, nodeLevel)
    })

    return <Flex style={{gap: ".7rem", flexDirection: "column"}}>
        {sortedParameters.map(parameter => {

            const submitValue = (value: NodeParameterValue | undefined) => {
                parameter.value = value
                flowService.update()
            }

            const submitValueEvent = (event: any) => {
                try {
                    const value = JSON.parse(event.target.value) as NodeParameterValue
                    if (!value.__typename) {
                        submitValue(value ? {
                            __typename: "LiteralValue",
                            value: value
                        } : undefined)
                        return
                    }
                    submitValue(value.__typename === "LiteralValue" ? (!!value.value ? value : undefined) : value)
                } catch (e) {
                    // @ts-ignore
                    submitValue(event.target.value == "" || !event.target.value ? undefined : {
                        __typename: "LiteralValue",
                        value: event.target.value
                    } as LiteralValue)
                }
            }

            const parameterDefinition = paramDefinitions[parameter.id!!]
            const result = suggestionsById[parameter.id!!]
            const title = parameterDefinition?.names ? parameterDefinition?.names?.nodes!![0]?.content : parameterDefinition?.id
            const description = parameterDefinition?.descriptions ? parameterDefinition?.descriptions?.nodes!![0]?.content : JSON.stringify(parameterDefinition?.dataTypeIdentifier)
            const defaultValue: string | undefined = parameter.value instanceof NodeFunctionView ? JSON.stringify({
                ...parameter.value.json(),
                __typename: "NodeFunction"
            }) : parameter.value?.__typename === "ReferenceValue" ? JSON.stringify(parameter.value) : parameter.value?.__typename === "LiteralValue" ? typeof parameter.value?.value === "object" ? JSON.stringify(parameter.value?.value) : parameter.value.value : ""

            return <div>
                <TextInput title={title}
                           description={description}
                           clearable
                           key={JSON.stringify(parameter.value)}
                           transformValue={value => {
                               try {
                                   if (!value) return value
                                   if ((JSON.parse(value) as NodeParameterValue).__typename === "NodeFunction") {
                                       const def = functionService.getFunctionDefinition((JSON.parse(value) as NodeFunction).functionDefinition?.id!!)
                                       return <Badge
                                           color={"info"}>{def?.names?.nodes!![0]?.content}</Badge>
                                   }
                                   if ((JSON.parse(value) as NodeParameterValue).__typename === "ReferenceValue") {
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
                           formValidation={{
                               setValue: () => {},
                               valid: parameter.validationResults.length <= 0,
                               notValidMessage: parameter.validationResults.map(value => value.message.nodes!![0]?.content).join(", ")
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