import React from "react";
import {ValidationProps} from "./useForm";
import {InputWrapper, InputWrapperProps} from "./InputWrapper";
import {CompletionContext, CompletionResult} from "@codemirror/autocomplete";
import CodeMirror, {Extension} from "@uiw/react-codemirror";
import {StreamLanguage, TagStyle} from "@codemirror/language";
import {createTheme} from "@uiw/codemirror-themes";
import {tags as t} from "@lezer/highlight";
import {hashToColor, mergeComponentProps} from "../../utils";
import "./EditorInput.style.scss"

export interface EditorInputProps extends InputWrapperProps, ValidationProps<any> {
    language?: StreamLanguage<unknown>
    suggestions?: (context: CompletionContext) => CompletionResult
    extensions?: Extension[]
    disabled?: boolean
    readonly?: boolean
    tokenStyles?: TagStyle[]
}

export const EditorInput: React.FC<EditorInputProps> = (props) => {

    const {title, right, left, rightType, leftType, language, description, extensions = [], tokenStyles = [], formValidation, ...rest} = props

    const internalExtensions: Extension[] = [...extensions, language!]

    const myTheme = React.useMemo(
        () => createTheme({
            theme: 'light',
            settings: {
                background: 'transparent',
                backgroundImage: '',
                foreground: 'rgba(255,255,255, 0.75)',
                caret: 'gray',
                selection: 'rgba(112,179,255,0.25)',
                selectionMatch: 'rgba(112,179,255,0.1)',
                fontSize: "0.8rem",
                gutterBackground: 'transparent',
                gutterForeground: 'rgba(255,255,255, 0.5)',
                gutterBorder: 'transparent',
                gutterActiveForeground: 'rgba(255,255,255, 1)',
                lineHighlight: 'rgba(255,255,255, 0.1)',
            },
            styles: [
                {tag: t.squareBracket, color: hashToColor("squareBracket")},
                {tag: t.bracket, color: hashToColor("bracket")},
                {tag: t.string, color: hashToColor("Text")},
                {tag: t.bool, color: hashToColor("Boolean")},
                {tag: t.number, color: hashToColor("Number")},
                ...tokenStyles
            ]
        }),
        [tokenStyles]
    )

    return <InputWrapper title={title}
                         description={description}
                         right={right}
                         left={left}
                         rightType={rightType}
                         leftType={leftType}
                         formValidation={formValidation}>

        <CodeMirror extensions={internalExtensions} theme={myTheme} {...mergeComponentProps("editor-input", rest)} basicSetup={{
            lineNumbers: false,
            foldGutter: false,
            highlightActiveLine: false,
            highlightActiveLineGutter: false,
        }}/>
    </InputWrapper>
}