import React from "react";
import {Editor, EditorTokenHighlights} from "../editor/Editor";
import { StreamLanguage } from "@codemirror/language";
import {Extension, keymap, Prec, EditorState} from "@uiw/react-codemirror";

export interface DataTableFilterInputProps {

}


export const githubQueryLanguage = StreamLanguage.define({
    token(stream) {

        if (stream.eatSpace()) return null;
        if (stream.match(/\b(AND|OR)\b/)) return "keyword";
        if (stream.match(/-/)) return "operator";
        if (stream.match(/\w+:(?:"[^"]*"|[^\s]+)/)) return "propertyName";
        if (stream.match(/"[^"]*"/)) return "string";

        stream.next();
        return "content";
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
        keyword: ({content}) => {
            return <span style={{color: "red", fontWeight: "bold"}}>{content}</span>
        },
        operator: ({content}) => {
            return <span style={{color: "orange", fontWeight: "bold"}}>{content}</span>
        },
        propertyName: ({content}) => {
            return <span style={{color: "yellow", fontWeight: "bold"}}>{content}</span>
        },
        string: ({content}) => {
            return <span style={{color: "green"}}>{content}</span>
        }
    }

    return <Editor w={"200px"}
                   style={{
                       backgroundColor: "rgba(255,255,255,.1)",
                       padding: "0.35rem"
                   }}
                   tokenHighlights={tokenHighlights}
                   initialValue={'is:"sdsd" AND is:"sd"'}
                   showTooltips={false}
                   showValidation={false}
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
                   language={githubQueryLanguage} />
}