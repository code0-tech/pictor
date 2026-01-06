import React from "react";
import {TextInput, TextInputProps} from "../form";
import {Flow, NodeFunction, NodeParameter, ReferenceValue} from "@code0-tech/sagittarius-graphql-types";
import {MenuItem} from "../menu/Menu";
import {Text} from "../text/Text";
import {DFlowSuggestionMenuFooter} from "../d-flow-suggestion/DFlowSuggestionMenuFooter";
import {toInputSuggestions} from "../d-flow-suggestion/DFlowSuggestionMenu.util";
import {InputSyntaxSegment} from "../form/Input.syntax.hook";
import {Badge} from "../badge/Badge";
import {md5} from "js-md5";
import {IconCirclesRelation} from "@tabler/icons-react";
import {useService, useStore} from "../../utils";
import {DFlowFunctionReactiveService} from "../d-flow-function";
import {DFlowReactiveService} from "../d-flow";
import {useSuggestions} from "../d-flow-suggestion/DFlowSuggestion.hook";
import {DFlowSuggestion} from "../d-flow-suggestion";

export interface DFlowInputDefaultProps extends TextInputProps {
    flowId: Flow['id']
    nodeId: NodeFunction['id']
    parameterId: NodeParameter['id']
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

export const DFlowInputDefault: React.FC<DFlowInputDefaultProps> = (props) => {

    const {flowId, nodeId, parameterId, ...rest} = props

    const functionService = useService(DFlowFunctionReactiveService)
    const functionStore = useStore(DFlowFunctionReactiveService)
    const flowService = useService(DFlowReactiveService)
    const flowStore = useStore(DFlowReactiveService)
    const suggestions = rest.suggestions || useSuggestions(flowId, nodeId, parameterId)

    const transformSyntax = React.useCallback((value: string): InputSyntaxSegment[] => {

        const textValue = String(value ?? "")
        let cursor = 0

        const buildTextSegment = (text: string): InputSyntaxSegment => {
            const segment = {
                type: "text",
                value: text,
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
                value: value,
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

            if (value?.__typename === "LiteralValue") {
                return buildTextSegment(value.value)
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
    }, [functionStore, flowStore])

    return <TextInput suggestionsEmptyState={<MenuItem><Text>No suggestion found</Text></MenuItem>}
                      suggestionsFooter={<DFlowSuggestionMenuFooter/>}
                      filterSuggestionsByLastToken
                      enforceUniqueSuggestions
                      validationUsesSyntax
                      transformSyntax={transformSyntax}
                      suggestions={rest.suggestions ? rest.suggestions : toInputSuggestions(suggestions as DFlowSuggestion[])}
                      {...rest}

    />
}
