import React from "react";
import {Editor, EditorTokenHighlights} from "../editor/Editor";
import {StreamLanguage, syntaxTree} from "@codemirror/language";
import {EditorState, Extension, keymap, Prec} from "@uiw/react-codemirror";
import {Badge} from "../badge/Badge";
import {hashToColor} from "../d-flow/DFlow.util";
import {Menu, MenuContent, MenuItem, MenuTrigger} from "../menu/Menu";

export type DataTableFilterOperator = "isOneOf" | "isNotOneOf"

export interface DataTableFilterTokens {
    token: string
    operators: DataTableFilterOperator[]
    suggestion?: (token: string, operator: DataTableFilterOperator, applySuggestion: (value: string) => void) => React.ReactNode
}

export interface DataTableFilterInputProps {
    filterTokens?: DataTableFilterTokens[]
}


export const githubQueryLanguage = StreamLanguage.define<{ expecting: "key" | "operator" | "value" }>({
    startState: () => ({expecting: "key"}),
    token(stream, state) {

        if (stream.eatSpace()) {
            if (state.expecting === "value") {
                // After a value and whitespace, expect a new key
                state.expecting = "key";
            }
            return null;
        }

        if (state.expecting === "key") {
            // Key: Expect alphanumeric + dashes followed by = or !=
            if (stream.match(/[\w-]+(?=(!=|=))/)) {
                state.expecting = "operator";
                return "propertyName";
            }
        }

        if (state.expecting === "operator") {
            // Operator: Expect = or !=
            if (stream.match(/^(!=|=)/)) {
                state.expecting = "value";
                return "operator";
            }
        }

        if (state.expecting === "value") {
            // Commas are separators between values, stay in value state
            if (stream.eat(',')) {
                return null;
            }
            // Value: eat all characters that are not a space or comma
            if (stream.eatWhile(/[^ ,]/)) {
                // Stay in value state to allow more comma-separated values
                return "literal";
            }
        }

        stream.next();
        return null;
    }
})


export const DataTableFilterInput: React.FC<DataTableFilterInputProps> = (props) => {

    const {} = props

    const singleLineExtension: Extension = [
        Prec.highest(
            keymap.of([
                {
                    key: "Enter",
                    run: () => true,
                },
            ])
        ),
        EditorState.transactionFilter.of((tr) => {
            return tr.docChanged && tr.newDoc.lines > 1 ? [] : tr;
        }),
    ]

    const tokenHighlights: EditorTokenHighlights = {
        literal: ({content}) => {
            return <Badge>
                {content}
            </Badge>
        },
        operator: ({content}) => {
            if (content == "=") {
                return <Badge color={"tertiary"} style={{boxShadow: "none"}}>
                    is one of
                </Badge>
            } else if (content == "!=") {
                return <Badge color={"tertiary"} style={{boxShadow: "none"}}>
                    is not one of
                </Badge>
            }
            return content
        },
        propertyName: ({content}) => {
            return <Badge color={hashToColor(content)}>
                {content}
            </Badge>
        }
    }

    return <Editor w={"400px"}
                   style={{
                       backgroundColor: "rgba(255,255,255,.1)",
                       padding: "0.35rem",
                       borderRadius: "1rem",
                       boxShadow: "inset 0 1px 1px 0 rgba(255,255,255,.2)",
                   }}
                   tokenHighlights={tokenHighlights}
                   initialValue={'members=233,2323 status!=false'}
                   showTooltips={false}
                   showValidation={false}
                   customSuggestionComponent={true}
                   suggestions={context => {
                       const prevNode = syntaxTree(context.state).resolveInner(context.pos, -1);
                       const node = syntaxTree(context.state).resolveInner(context.pos, -1);
                       const pos = context.state.selection.main.head

                       console.log(prevNode)

                       if (prevNode.type.name != "operator" && prevNode.type.name != "literal") return null

                       return <Menu open={true} modal={false}>
                           <MenuTrigger asChild>
                               <div style={{position: 'absolute', top: 0, left: 0, width: 0, height: 0}}/>
                           </MenuTrigger>
                           <MenuContent onFocusOutside={() => {
                               console.log("sd")
                           }} onKeyDown={event => {
                               console.log(event.key)
                               if (event.key !== "Escape" && event.key !== "ArrowUp" && event.key !== "ArrowDown") {
                                   context.view?.focus()
                               }
                           }}
                                        style={{
                                            position: 'fixed',
                                            top: 0,
                                            left: 0,
                                            pointerEvents: 'auto'
                                        }}>

                               <MenuItem onSelect={() => {
                                   const from = prevNode.type.name === "literal" ? node.from : pos
                                   const to = prevNode.type.name === "literal" ? node.to : pos
                                   context.view?.dispatch({
                                       changes: {from, to, insert: "value"},
                                       selection: {anchor: from + "value".length}
                                   })
                                   context.view?.focus()
                               }}>
                                   false
                               </MenuItem>

                               <MenuItem onSelect={() => {
                                   const from = prevNode.type.name === "literal" ? node.from : pos
                                   const to = prevNode.type.name === "literal" ? node.to : pos
                                   context.view?.dispatch({
                                       changes: {from, to, insert: "value"},
                                       selection: {anchor: from + "value".length}
                                   })
                                   context.view?.focus()
                               }}>
                                   true
                               </MenuItem>
                           </MenuContent>
                       </Menu>
                   }}
                   extensions={[
                       singleLineExtension
                   ]}
                   basicSetup={{
                       lineNumbers: false,
                       foldGutter: false,
                       highlightActiveLine: false,
                       highlightActiveLineGutter: false,
                       dropCursor: false,
                       allowMultipleSelections: false,
                       indentOnInput: false,
                   }}
                   language={githubQueryLanguage}/>
}