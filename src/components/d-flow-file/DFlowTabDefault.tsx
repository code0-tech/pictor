import React from "react";
import {TextInput, useForm} from "../form";
import {Flex} from "../flex/Flex";
import {useService} from "../../utils";
import {DFlowFunctionReactiveService, ParameterDefinitionView} from "../d-flow-function";
import {useSuggestions} from "../d-flow-suggestion/DFlowSuggestion.hook";
import {DFlowSuggestionMenuFooter} from "../d-flow-suggestion/DFlowSuggestionMenuFooter";
import {toInputSuggestions} from "../d-flow-suggestion/DFlowSuggestionMenu.util";
import {DFlowReactiveService} from "../d-flow";
import {DFlowSuggestion} from "../d-flow-suggestion";
import {Badge} from "../badge/Badge";
import type {NodeFunction, ReferenceValue, Scalars} from "@code0-tech/sagittarius-graphql-types";
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

export const splitTextAndObjects = (input: string) => {
    const result: (string | Record<string, any>)[] = []

    let currentText = ""
    let currentObject = ""
    let braceLevel = 0
    let inString: '"' | "'" | "" = ""
    let escaped = false

    const pushText = () => {
        if (currentText) result.push(currentText)
        currentText = ""
    }

    const parseObject = (value: string) => {
        try {
            return JSON.parse(value)
        } catch {
            try {
                return JSON.parse(
                    value
                        .replace(/'/g, `"`)
                        .replace(/([{,]\s*)([A-Za-z_$][\w$]*)(\s*:)/g, `$1"$2"$3`)
                )
            } catch {
                return {}
            }
        }
    }

    input.split("").forEach(char => {
        if (braceLevel > 0) {
            currentObject += char

            if (escaped) {
                escaped = false
                return
            }

            if (char === "\\") {
                escaped = true
                return
            }

            if (inString) {
                if (char === inString) inString = ""
                return
            }

            if (char === `"` || char === `'`) {
                inString = char as any
                return
            }

            if (char === "{") braceLevel++
            if (char === "}") braceLevel--

            if (braceLevel === 0) {
                result.push(parseObject(currentObject))
                currentObject = ""
            }

            return
        }

        if (char === "{") {
            pushText()
            braceLevel = 1
            currentObject = "{"
            return
        }

        currentText += char
    })

    pushText()
    return result
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

    const initialValues = React.useMemo(() => {
        const values: Record<string, any> = {}
        sortedParameters.forEach(parameter => {
            values[parameter?.id!!] = parameter?.value?.__typename === "LiteralValue" ? (typeof parameter.value?.value === "object" ? JSON.stringify(parameter.value?.value) : parameter.value.value) : JSON.stringify(parameter?.value)
        })
        return values
    }, [sortedParameters])

    const validations = React.useMemo(() => {
        const values: Record<string, any> = {}
        sortedParameters.forEach(parameter => {
            values[parameter?.id!!] = (_: any) => {
                const validationForParameter = validation?.find(v => v.parameterId === parameter?.id)
                if (validationForParameter) {
                    return validationForParameter.message.nodes!![0]?.content || "Invalid value"
                }
                return null
            }
        })
        return values
    }, [sortedParameters])


    const transformSyntax = (value: string): InputSyntaxSegment[] => {

        const rawValue = value ?? ""
        const textValue = typeof rawValue === "string" ? rawValue : String(rawValue)

        let cursor = 0

        const buildTextSegment = (text: string): InputSyntaxSegment => {
            const segment = {
                type: "text",
                start: cursor,
                end: cursor + text.length,
                visualLength: text.length,
                content: text,
            } as InputSyntaxSegment
            cursor += text.length
            return segment
        }

        const buildBlockSegment = (node: React.ReactNode, value: Record<string, any>): InputSyntaxSegment => {
            const segment = {
                type: "block",
                start: cursor,
                end: cursor + JSON.stringify(value).length,
                visualLength: 1,
                content: node,
            } as InputSyntaxSegment
            cursor += JSON.stringify(value).length
            return segment
        }

        return splitTextAndObjects(textValue).map(value => {

            if (typeof value !== "object") {
                return buildTextSegment(value)
            }

            if (value?.__typename === "NodeFunctionIdWrapper") {
                const node = flowService.getNodeById(flowId, value.id)
                const functionDefinition = functionService.getById(node?.functionDefinition?.id)
                return buildBlockSegment(
                    <Badge color={"info"}>{functionDefinition?.names?.nodes!![0]?.content}</Badge>,
                    value
                )
            }

            if (value?.__typename === "NodeFunction") {
                const functionDefinition = functionService.getById(value?.functionDefinition?.id)
                return buildBlockSegment(
                    <Badge color={"info"}>{functionDefinition?.names?.nodes!![0]?.content}</Badge>,
                    value
                )
            }

            if (value?.__typename === "ReferenceValue") {
                const refObject = value as ReferenceValue
                const colorHash = md5(md5(refObject.nodeFunctionId!))
                const hashToHue = (md5: string): number => {
                    const int = parseInt(md5.slice(0, 8), 16)
                    return int % 360
                }
                return buildBlockSegment(
                    <Badge color={`hsl(${hashToHue(colorHash)}, 100%, 72%)`} border style={{verticalAlign: "middle"}}>
                        <IconCirclesRelation size={12}/>
                        {refObject.depth}-{refObject.scope}-{refObject.node}
                    </Badge>,
                    value
                )
            }
            return buildTextSegment(value as any as string)
        })
    }

    const [inputs, validate] = useForm({
        initialValues: initialValues,
        validate: validations,
        onSubmit: (values) => {
            console.log(values)
        }
    })

    React.useEffect(() => {
        validate()
    })

    return <Flex style={{gap: ".7rem", flexDirection: "column"}}>
        {sortedParameters.map(parameter => {

            if (!parameter) return null

            // const submitValue = (value: NodeFunction | LiteralValue | ReferenceValue | undefined) => {
            //     startTransition(async () => {
            //         await flowService.setParameterValue(flowId, node.id!!, parameter.id!!, value)
            //     })
            //
            // }
            // const submitValueEvent = (event: any) => {
            //     console.log(event.currentTarget.textContent)
            //     try {
            //         const value = JSON.parse(event.target.value) as NodeFunction | LiteralValue | ReferenceValue
            //         if (!value.__typename) {
            //             submitValue(value ? {
            //                 __typename: "LiteralValue",
            //                 value: value
            //             } : undefined)
            //             return
            //         }
            //         submitValue(value.__typename === "LiteralValue" ? (!!value.value ? value : undefined) : value)
            //     } catch (e) {
            //         // @ts-ignore
            //         submitValue(event.target.value == "" || !event.target.value ? undefined : {
            //             __typename: "LiteralValue",
            //             value: event.target.value
            //         } as LiteralValue)
            //     }
            // }
            const parameterDefinition = paramDefinitions[parameter.id!!]
            const result = suggestionsById[parameter.id!!]
            const title = parameterDefinition?.names ? parameterDefinition?.names?.nodes!![0]?.content : parameterDefinition?.id
            const description = parameterDefinition?.descriptions ? parameterDefinition?.descriptions?.nodes!![0]?.content : JSON.stringify(parameterDefinition?.dataTypeIdentifier)
            // const defaultValue: string | undefined = parameter.value?.__typename === "LiteralValue" ? (typeof parameter.value?.value === "object" ? JSON.stringify(parameter.value?.value) : parameter.value.value) : JSON.stringify(parameter.value)
            //
            // const validationForParameter = validation?.find(v => v.parameterId === parameter.id)

            return <div>
                <TextInput title={title}
                           description={description}
                           clearable
                           suggestionsEmptyState={<MenuItem><Text>No suggestion found</Text></MenuItem>}
                           suggestionsFooter={<DFlowSuggestionMenuFooter/>}
                           filterSuggestionsByLastToken
                           enforceUniqueSuggestions
                           transformSyntax={transformSyntax}
                           suggestions={toInputSuggestions(result)}
                           {...inputs.getInputProps(parameter.id!!)}

                />
            </div>
        })}
    </Flex>

}
