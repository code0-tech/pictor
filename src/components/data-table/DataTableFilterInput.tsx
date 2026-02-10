import React from "react"
import {Editor} from "../editor/Editor"
import {StreamLanguage, syntaxTree} from "@codemirror/language"
import {EditorState} from "@uiw/react-codemirror"
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
    suggestion?: (context: CompletionContext, operator: DataTableFilterOperator, currentValue: string, applySuggestion: (value: string, silently?: boolean) => void) => React.ReactNode
}

export interface DataTableFilterInputProps {
    filterTokens?: DataTableFilterTokens[]
    onChange?: (filter: DataTableFilterProps) => void
}

const OP_MAP = {"=": "isOneOf", "!=": "isNotOneOf"} as const
const OP_LABELS = {isOneOf: "is one of", isNotOneOf: "is not one of"} as const
const OP_CHARS = {isOneOf: "=", isNotOneOf: "!="} as const
const strip = (s: string) => s.replace(/^\\|\\$/g, "")

export const createGithubQueryLanguage = (validTokens: string[]) => StreamLanguage.define<{}>({
    startState: () => ({}),
    token(stream) {
        if (stream.eatSpace()) return null;
        // Operatoren erkennen
        if (stream.match('!=')) return "operator";
        if (stream.match('=')) return "operator";
        // Token oder Value erkennen
        if (stream.peek() === '\\') {
            stream.next();
            const chars: string[] = [];
            while (!stream.eol() && stream.peek() !== '\\') chars.push(stream.next()!);
            if (stream.peek() === '\\') {
                stream.next();
                const content = chars.join("");
                if (validTokens.includes(content)) {
                    return "propertyName";
                } else {
                    return "literal";
                }
            }
            return "invalid";
        }
        stream.next();
        return null;
    }
})

export const DataTableFilterInput: React.FC<DataTableFilterInputProps> = ({filterTokens, onChange}) => {
    const language = React.useMemo(() => createGithubQueryLanguage(filterTokens?.map(t => t.token) || []), [filterTokens])

    const parseFilterQuery = React.useCallback((query: string): DataTableFilterProps => {
        if (!query.trim()) return {};
        const filter: DataTableFilterProps = {};
        // Minimal: Splitte an Backslashes, filtere leere Segmente
        const segments = query.split(/\\/).filter(Boolean);
        for (let i = 0; i + 2 < segments.length; i += 3) {
            const token = segments[i];
            const operatorChar = segments[i + 1];
            const valueString = segments[i + 2];
            if (!token || !operatorChar || !valueString) continue;
            const tokenConfig = filterTokens?.find(t => t.token === token);
            if (!tokenConfig) continue;
            const operator = OP_MAP[operatorChar as keyof typeof OP_MAP];
            if (!operator) continue;
            const values = valueString.split(',').map(v => v.trim()).filter(Boolean);
            if (values.length > 0) {
                filter[tokenConfig.key] = {
                    operator,
                    value: values
                };
            }
        }

        return filter;
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
            cursorLeftNode.name === "literal" ? "propertyName" :
            cursorLeftNode.name === "invalid" && context.state.sliceDoc(cursorLeftNode.from, cursorLeftNode.to).startsWith('\\') ? "literal" :
            (() => {
                const textAfterOperator = context.state.sliceDoc(operatorNode.to, context.pos)
                return !textAfterOperator.trim() ? (textAfterOperator.length > 0 ? "propertyName" : "literal") :
                    (textAfterOperator.includes(" ") ? "propertyName" : "literal")
            })()
        const currentPropertyName = propertyNode ? strip(context.state.sliceDoc(propertyNode.from, propertyNode.to)) : ""
        const currentTokenConfig = filterTokens?.find(t => t.token === currentPropertyName)

        const applyTextChange = (startPos: number, endPos: number, newText: string, silently?: boolean) => {
            if (silently) {
                context.view?.dispatch({
                    changes: {from: startPos, to: endPos, insert: newText},
                    selection: {anchor: context.pos},
                    scrollIntoView: false
                })
            } else {
                context.view?.dispatch({
                    changes: {from: startPos, to: endPos, insert: newText},
                    selection: {anchor: startPos + newText.length},
                    scrollIntoView: true
                })
                context.view?.focus()
            }
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
                return (
                    <DataTableFilterSuggestionMenu context={context}>
                        {availableTokens.map(tokenDef => (
                            <MenuItem key={tokenDef.token} onSelect={() => {
                                let insertText = `\\${tokenDef.token}\\`;
                                if (cursorLeftNode.name === "literal") {
                                    const after = context.state.sliceDoc(replaceEndPos, replaceEndPos + 1);
                                    if (after !== "\\") {
                                        insertText = "\\" + insertText;
                                    }
                                }
                                applyTextChange(actualReplaceStart, replaceEndPos, insertText);
                            }}>
                                {tokenDef.token}
                            </MenuItem>
                        ))}
                    </DataTableFilterSuggestionMenu>
                );
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

                const currentValue =
                    cursorRightNode.name === "literal"
                        ? context.state.sliceDoc(cursorRightNode.from, cursorRightNode.to)
                        : "";

                return currentTokenConfig.suggestion(context, selectedOperator, strip(currentValue), (selectedValue, silently) => {
                    const isExistingLiteral = cursorLeftNode.name === "literal" || (cursorLeftNode.name === "invalid" && context.state.sliceDoc(cursorLeftNode.from, cursorLeftNode.to).startsWith('\\'))
                    const replaceStartPos = isExistingLiteral ? cursorLeftNode.from : context.pos
                    const replaceEndPos = isExistingLiteral ? cursorLeftNode.to : cursorRightNode.name === "literal" ? cursorRightNode.to : context.pos

                    applyTextChange(replaceStartPos, replaceEndPos, `\\${selectedValue}\\`, silently)
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
            literal: ({content}) => {
                const splitted = strip(content).split(',')
                if (splitted.length > 1) {
                    return <Badge p={0.175}>
                        {splitted.map((item => <Badge style={{boxShadow: "none"}} color={"secondary"} key={item}>{item}</Badge>))}
                    </Badge>
                }
                return <Badge>{strip(content)}</Badge>
            },
            operator: ({content}) => <Badge color="tertiary" style={{boxShadow: "none"}}>{OP_LABELS[OP_MAP[content as keyof typeof OP_MAP]] || content}</Badge>,
            propertyName: ({content}) => <Badge color={hashToColor(strip(content))}>{strip(content)}</Badge>
        }}
        showTooltips={false}
        showValidation={false}
        customSuggestionComponent={true}
        suggestions={getSuggestions}
        extensions={[
            EditorState.transactionFilter.of((tr) => tr.docChanged && tr.newDoc.lines > 1 ? [] : tr),
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