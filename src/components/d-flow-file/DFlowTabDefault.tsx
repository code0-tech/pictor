import React from "react";
import {TextInput} from "../form";
import {Flex} from "../flex/Flex";
import {useService} from "../../utils";
import {DFlowFunctionReactiveService} from "../d-flow-function";
import {useSuggestions} from "../d-flow-suggestion/DFlowSuggestion.hook";
import {DFlowSuggestionMenuFooter} from "../d-flow-suggestion/DFlowSuggestionMenuFooter";
import {toInputSuggestions} from "../d-flow-suggestion/DFlowSuggestionMenu.util";
import {DFlowReactiveService} from "../d-flow";
import {DFlowSuggestion} from "../d-flow-suggestion";
import {ParameterDefinitionView} from "../d-flow-function";
import {Badge} from "../badge/Badge";
import type {
    LiteralValue,
    NodeFunction, NodeParameterValue,
    ReferenceValue,
    Scalars
} from "@code0-tech/sagittarius-graphql-types";
import {InputSyntaxSegment} from "../form/Input.syntax.hook";
import {useNodeValidation} from "../d-flow-validation/DNodeValidation.hook";
import {md5} from "js-md5";
import {IconCirclesRelation} from "@tabler/icons-react";
import {MenuItem} from "../menu/Menu";
import {Text} from "../text/Text";

export interface DFlowTabDefaultProps {
    node: NodeFunction
    flowId: Scalars["FlowID"]["output"]
}

export const DFlowTabDefault: React.FC<DFlowTabDefaultProps> = (props) => {

    const {node, flowId} = props
    const functionService = useService(DFlowFunctionReactiveService)
    const flowService = useService(DFlowReactiveService)
    const [, startTransition] = React.useTransition()

    const definition = functionService.getById(node.functionDefinition?.id!!)
    const paramDefinitions = React.useMemo(() => {
        const map: Record<string, ParameterDefinitionView> = {}
        definition?.parameterDefinitions?.forEach(pd => {
            map[pd.id!!] = pd
        })
        return map
    }, [definition?.parameterDefinitions])

    const sortedParameters = React.useMemo(() => {
        return [...(node.parameters?.nodes || [])].sort((a, b) => a!!.id!!.localeCompare(b?.id!!))
    }, [node.parameters])

    const suggestionsById: Record<string, DFlowSuggestion[]> = {}
    sortedParameters.forEach(parameter => {
        const parameterDefinition = paramDefinitions[parameter?.id!!]
        suggestionsById[parameter?.id!!] = useSuggestions(flowId, node.id, parameter?.id)
    })

    const validation = useNodeValidation(node.id, flowId)

    return <Flex style={{gap: ".7rem", flexDirection: "column"}}>
        {sortedParameters.map(parameter => {

            if (!parameter) return null

            const submitValue = (value: NodeFunction | LiteralValue | ReferenceValue | undefined) => {
                startTransition(async () => {
                    await flowService.setParameterValue(flowId, node.id!!, parameter.id!!, value)
                })

            }
            const submitValueEvent = (event: any) => {
                try {
                    const value = JSON.parse(event.target.value) as NodeFunction | LiteralValue | ReferenceValue
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
            const defaultValue: string | undefined = parameter.value?.__typename === "LiteralValue" ? (typeof parameter.value?.value === "object" ? JSON.stringify(parameter.value?.value) : parameter.value.value) : JSON.stringify(parameter.value)

            const validationForParameter = validation?.find(v => v.parameterId === parameter.id)

            return <div>
                <TextInput title={title}
                           description={description}
                           clearable
                           key={JSON.stringify(parameter.value)}
                           transformSyntax={(value): InputSyntaxSegment[] => {
                               const rawValue = value ?? ""
                               const textValue = typeof rawValue === "string" ? rawValue : String(rawValue)

                               const buildTextSegment = (text: string): InputSyntaxSegment[] => [{
                                   type: "text",
                                   start: 0,
                                   end: text.length,
                                   visualLength: text.length,
                                   content: text,
                               }]

                               const buildBlockSegment = (node: React.ReactNode): InputSyntaxSegment[] => [{
                                   type: "block",
                                   start: 0,
                                   end: textValue.length,
                                   visualLength: 1,
                                   content: node,
                               }]

                               try {

                                   const parsed = JSON.parse(textValue) as NodeParameterValue
                                   if (parsed?.__typename === "NodeFunctionIdWrapper") {
                                       const node = flowService.getNodeById(flowId, parsed.id)
                                       const functionDefinition = functionService.getById(node?.functionDefinition?.id)
                                       return buildBlockSegment(
                                           <Badge color={"info"}>{functionDefinition?.names?.nodes!![0]?.content}</Badge>
                                       )
                                   }

                                   if (parsed?.__typename === "ReferenceValue") {
                                       const refObject = parsed as ReferenceValue
                                       const colorHash = md5(md5(refObject.nodeFunctionId!))
                                       const hashToHue = (md5: string): number => {
                                           // nimm z.B. 8 Hex-Zeichen = 32 Bit
                                           const int = parseInt(md5.slice(0, 8), 16)
                                           return int % 360
                                       }
                                       return buildBlockSegment(
                                           <Badge color={`hsl(${hashToHue(colorHash)}, 100%, 72%)`} border style={{verticalAlign: "middle"}}>
                                               <IconCirclesRelation size={12}/>
                                               {refObject.depth}-{refObject.scope}-{refObject.node}
                                           </Badge>
                                       )
                                   }
                               } catch (e) {
                                   // fall through to text rendering
                               }

                               return buildTextSegment(textValue)
                           }}
                           defaultValue={defaultValue}
                           onSuggestionSelect={(suggestion) => {
                               submitValue(suggestion.value)
                           }}
                           suggestionsEmptyState={<MenuItem><Text>No suggestion found</Text></MenuItem>}
                           formValidation={{
                               setValue: () => {},
                               valid: !validationForParameter,
                               notValidMessage: validationForParameter?.message.nodes!![0]?.content || ""
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
