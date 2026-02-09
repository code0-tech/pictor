import React from "react"
import {Editor} from "../editor/Editor"
import {StreamLanguage, syntaxTree} from "@codemirror/language"
import {EditorState, keymap, Prec} from "@uiw/react-codemirror"
import {Badge} from "../badge/Badge"
import {hashToColor} from "../d-flow/DFlow.util"
import {CompletionContext} from "@codemirror/autocomplete"
import {DataTableFilterSuggestionMenu} from "./DataTableFilterSuggestionMenu"
import {MenuItem} from "../menu/Menu"
import {DataTableFilterOperator, DataTableFilterProps} from "./DataTable";

export interface DataTableFilterTokens {
    token: string
    key: string
    operators: DataTableFilterOperator[]
    suggestion?: (context: CompletionContext, operator: DataTableFilterOperator, applySuggestion: (value: string) => void) => React.ReactNode
}

export interface DataTableFilterInputProps {
    filterTokens?: DataTableFilterTokens[]
    onChange?: (filter: DataTableFilterProps) => void
}

const OP_MAP = {"=": "isOneOf", "!=": "isNotOneOf"} as const
const OP_LABELS = {isOneOf: "is one of", isNotOneOf: "is not one of"} as const
const OP_CHARS = {isOneOf: "=", isNotOneOf: "!="} as const
const strip = (s: string) => s.replace(/^\\|\\$/g, "")

export const createGithubQueryLanguage = (validTokens: string[]) => StreamLanguage.define<{
    expecting: "key" | "operator" | "value"
}>({
    startState: () => ({expecting: "key"}),
    token(stream, state) {
        if (stream.eatSpace()) {
            if (state.expecting === "value") state.expecting = "key"
            return null
        }
        if (state.expecting === "key" && stream.peek() === '\\') {
            stream.next()
            const chars: string[] = []
            while (!stream.eol() && stream.peek() !== '\\') chars.push(stream.next()!)
            if (stream.peek() === '\\') {
                stream.next()
                if (validTokens.includes(chars.join(""))) {
                    state.expecting = "operator"
                    return "propertyName"
                }
            }
            return "invalid"
        }
        if (state.expecting === "operator" && stream.match(/^(!=|=)/)) {
            state.expecting = "value"
            return "operator"
        }
        if (state.expecting === "value") {
            if (stream.eat(',')) return null
            if (stream.peek() === '\\') {
                stream.next()
                while (!stream.eol() && stream.peek() !== '\\') stream.next()
                if (stream.peek() === '\\') {
                    stream.next()
                    return "literal"
                }
                return "invalid"
            }
            stream.next()
            return null
        }
        stream.next()
        return null
    }
})

export const DataTableFilterInput: React.FC<DataTableFilterInputProps> = ({filterTokens, onChange}) => {
    const language = React.useMemo(() => createGithubQueryLanguage(filterTokens?.map(t => t.token) || []), [filterTokens])

    const parseFilterQuery = React.useCallback((query: string): DataTableFilterProps => {
        if (!query.trim()) return {}

        const filter: DataTableFilterProps = {}

        // Regular expression to match: \token\operator\value1\,\value2\,...
        const filterPattern = /\\([^\\]+)\\(!=|=)([^\\]*(?:\\[^\\]+\\[^\\]*)*)/g

        let match: RegExpExecArray | null
        while ((match = filterPattern.exec(query)) !== null) {
            const token = match[1]
            const operatorChar = match[2]
            const valuesString = match[3]

            // Find the token config to get the key
            const tokenConfig = filterTokens?.find(t => t.token === token)
            if (!tokenConfig) continue

            const operator = OP_MAP[operatorChar as keyof typeof OP_MAP]
            if (!operator) continue

            // Parse values - they are separated by commas and wrapped in backslashes
            const valueMatches = valuesString.match(/\\([^\\]+)\\/g)
            const values = valueMatches ? valueMatches.map(v => strip(v)) : []

            if (values.length > 0) {
                filter[tokenConfig.key] = {
                    operator,
                    value: values.length === 1 ? values[0] : values
                }
            }
        }

        return filter
    }, [filterTokens])

    const handleEditorChange = React.useCallback((value: string) => {
        const parsedFilter = parseFilterQuery(value)
        onChange?.(parsedFilter)
    }, [parseFilterQuery, onChange])

    const getSuggestions = React.useCallback((context: CompletionContext) => {
        const syntaxTreeRoot = syntaxTree(context.state)
        const cursorLeftNode = syntaxTreeRoot.resolveInner(context.pos, -1)
        const cursorRightNode = syntaxTreeRoot.resolveInner(context.pos, 1)
        const {propertyNode, operatorNode} = (() => {
            const foundNodes = {propertyNode: null as any, operatorNode: null as any}
            for (let currentNode: any = cursorLeftNode; currentNode; currentNode = currentNode.prevSibling) {
                if (currentNode.name === "propertyName" && !foundNodes.propertyNode) foundNodes.propertyNode = currentNode
                if (currentNode.name === "operator" && !foundNodes.operatorNode) foundNodes.operatorNode = currentNode
            }
            return foundNodes
        })()
        const currentInputMode: "propertyName" | "operator" | "literal" | "none" =
            !propertyNode ? "propertyName" :
            context.pos < propertyNode.to ? "propertyName" :
            context.pos === propertyNode.to ? "operator" :
            !operatorNode ? (cursorRightNode.name === "operator" ? "operator" : "operator") :
            context.pos < operatorNode.to ? "operator" :
            context.pos === operatorNode.to ? "literal" :
            cursorLeftNode.name === "literal" ? (
                context.pos === cursorLeftNode.to ? "none" :
                context.pos < cursorLeftNode.to ? "literal" :
                (() => {
                    const textBetween = context.state.sliceDoc(cursorLeftNode.to, context.pos)
                    return textBetween.includes(',') ? "literal" : textBetween.includes(' ') ? "propertyName" : "none"
                })()
            ) :
            cursorLeftNode.name === "invalid" && context.state.sliceDoc(cursorLeftNode.from, cursorLeftNode.to).startsWith('\\') ? "literal" :
            (() => {
                const textAfterOperator = context.state.sliceDoc(operatorNode.to, context.pos)
                return !textAfterOperator.trim() ? (textAfterOperator.length > 0 ? "propertyName" : "literal") :
                    (textAfterOperator.includes(",") || !textAfterOperator.includes(" ") ? "literal" : "propertyName")
            })()
        const currentPropertyName = propertyNode ? strip(context.state.sliceDoc(propertyNode.from, propertyNode.to)) : ""
        const currentTokenConfig = filterTokens?.find(t => t.token === currentPropertyName)

        const applyTextChange = (startPos: number, endPos: number, newText: string) => {
            context.view?.dispatch({
                changes: {from: startPos, to: endPos, insert: newText},
                selection: {anchor: startPos + newText.length},
                scrollIntoView: true
            })
            context.view?.focus()
        }

        if (currentInputMode === "propertyName") {
            const alreadyUsedTokens = new Set<string>()
            const partialWord = context.matchBefore(/\\?[\w-]*/)
            const replaceStartPos = partialWord ? partialWord.from : context.pos
            const cursorInsideProperty = propertyNode && context.pos <= propertyNode.to
            const replaceEndPos = cursorRightNode.name === "propertyName" ? cursorRightNode.to : cursorInsideProperty ? propertyNode.to : context.pos
            const actualReplaceStart = cursorInsideProperty && propertyNode.from < replaceStartPos ? propertyNode.from : replaceStartPos
            const userSearchText = strip(context.state.sliceDoc(actualReplaceStart, context.pos))
            const availableTokens = filterTokens?.filter(t => t.token.startsWith(userSearchText) && !alreadyUsedTokens.has(t.token)) || []

            syntaxTreeRoot.iterate({enter: (node) => {
                if (node.name === "propertyName") alreadyUsedTokens.add(strip(context.state.sliceDoc(node.from, node.to)))
            }})

            if (availableTokens.length) {
                return <DataTableFilterSuggestionMenu context={context}>
                    {availableTokens.map(tokenDef => (
                        <MenuItem key={tokenDef.token} onSelect={() => applyTextChange(actualReplaceStart, replaceEndPos, `\\${tokenDef.token}\\`)}>
                            {tokenDef.token}
                        </MenuItem>
                    ))}
                </DataTableFilterSuggestionMenu>
            }
        }

        if (currentInputMode === "operator" && currentTokenConfig) {
            const partialWord = context.matchBefore(/[!=]+/)
            const replaceStartPos = partialWord ? partialWord.from : context.pos
            const cursorInsideOperator = operatorNode && context.pos <= operatorNode.to
            const replaceEndPos = cursorRightNode.name === "operator" ? cursorRightNode.to : cursorInsideOperator ? operatorNode.to : context.pos
            const actualReplaceStart = cursorInsideOperator && operatorNode.from < replaceStartPos ? operatorNode.from : replaceStartPos

            return <DataTableFilterSuggestionMenu context={context}>
                {currentTokenConfig.operators.map(operatorType => (
                    <MenuItem key={operatorType} onSelect={() => applyTextChange(actualReplaceStart, replaceEndPos, OP_CHARS[operatorType])}>
                        {OP_LABELS[operatorType]}
                    </MenuItem>
                ))}
            </DataTableFilterSuggestionMenu>
        }

        if (currentInputMode === "literal" && currentTokenConfig?.suggestion) {
            const operatorText = operatorNode ? context.state.sliceDoc(operatorNode.from, operatorNode.to) : ""
            const selectedOperator = OP_MAP[operatorText as keyof typeof OP_MAP]

            if (selectedOperator && currentTokenConfig.operators.includes(selectedOperator)) {
                return currentTokenConfig.suggestion(context, selectedOperator, (selectedValue) => {
                    const isExistingLiteral = cursorLeftNode.name === "literal" || (cursorLeftNode.name === "invalid" && context.state.sliceDoc(cursorLeftNode.from, cursorLeftNode.to).startsWith('\\'))
                    const replaceStartPos = isExistingLiteral ? cursorLeftNode.from : context.pos
                    const replaceEndPos = isExistingLiteral ? cursorLeftNode.to : cursorRightNode.name === "literal" ? cursorRightNode.to : context.pos
                    applyTextChange(replaceStartPos, replaceEndPos, `\\${selectedValue}\\`)
                })
            }
        }

        return null
    }, [filterTokens])

    return <Editor
        w="100%"
        initialValue=""
        onChange={handleEditorChange}
        style={{
            backgroundColor: "rgba(255,255,255,.1)",
            padding: "0.35rem",
            boxSizing: "border-box",
            borderRadius: "1rem",
            boxShadow: "inset 0 1px 1px 0 rgba(255,255,255,.2)",
        }}
        tokenHighlights={{
            literal: ({content}) => <Badge>{strip(content)}</Badge>,
            operator: ({content}) => <Badge color="tertiary" style={{boxShadow: "none"}}>{OP_LABELS[OP_MAP[content as keyof typeof OP_MAP]] || content}</Badge>,
            propertyName: ({content}) => <Badge color={hashToColor(strip(content))}>{strip(content)}</Badge>
        }}
        showTooltips={false}
        showValidation={false}
        customSuggestionComponent={true}
        suggestions={getSuggestions}
        extensions={[
            EditorState.transactionFilter.of((tr) => {
                // Erlaube Änderungen, die den gesamten Text löschen
                if (tr.docChanged && tr.newDoc.length === 0) {
                    return tr
                }
                // Blockiere nur Änderungen, die mehrere Zeilen erstellen
                return tr.docChanged && tr.newDoc.lines > 1 ? [] : tr
            })

        ]}
        basicSetup={{
            lineNumbers: false,
            foldGutter: false,
            highlightActiveLine: false,
            highlightActiveLineGutter: false,
            dropCursor: false,
            indentOnInput: false,
        }}
        language={language}
    />
}