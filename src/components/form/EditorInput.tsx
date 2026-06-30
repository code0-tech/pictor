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

export interface EditorInputProps extends Omit<InputWrapperProps, 'onChange'>, ValidationProps<any> {
    language?: StreamLanguage<unknown>
    suggestions?: (context: CompletionContext) => CompletionResult
    extensions?: Extension[]
    disabled?: boolean
    readonly?: boolean
    tokenStyles?: TagStyle[]
    onChange?: (value: string) => void
}

const EMPTY_EXTENSIONS: Extension[] = []
const EMPTY_TOKEN_STYLES: TagStyle[] = []

const BASIC_SETUP = {
    lineNumbers: false,
    foldGutter: false,
    highlightActiveLine: false,
    highlightActiveLineGutter: false,
} as const

const THEME_SETTINGS = {
    background: 'transparent',
    backgroundImage: '',
    foreground: 'rgba(255,255,255, 0.75)',
    caret: 'gray',
    selection: 'rgba(112,179,255,0.25)',
    selectionMatch: 'rgba(112,179,255,0.1)',
    fontSize: "0.8rem",
    fontFamily: '"Inter", sans-serif',
    letterSpacing: "-0.5px",
    fontWeight: "400",
    gutterBackground: 'transparent',
    gutterForeground: 'rgba(255,255,255, 0.5)',
    gutterBorder: 'transparent',
    gutterActiveForeground: 'rgba(255,255,255, 1)',
    lineHighlight: 'rgba(255,255,255, 0.1)',
} as const

const BASE_TOKEN_STYLES: TagStyle[] = [
    {tag: t.squareBracket, color: hashToColor("squareBracket")},
    {tag: t.bracket, color: hashToColor("bracket")},
    {tag: t.string, color: hashToColor("Text")},
    {tag: t.bool, color: hashToColor("Boolean")},
    {tag: t.number, color: hashToColor("Number")},
]

const DEFAULT_THEME = createTheme({
    theme: 'light',
    settings: THEME_SETTINGS,
    styles: BASE_TOKEN_STYLES,
})

export const EditorInput: React.FC<EditorInputProps> = React.memo((props) => {

    const {
        title, right, left, rightType, leftType,
        language, description,
        extensions = EMPTY_EXTENSIONS,
        tokenStyles = EMPTY_TOKEN_STYLES,
        formValidation, onChange, wrapperComponent, ...rest
    } = props

    const internalExtensions = React.useMemo<Extension[]>(
        () => {
            const base = language ? [...extensions, language] : extensions;
            return [...base];
        },
        [extensions, language]
    )

    const myTheme = React.useMemo(
        () => tokenStyles.length === 0
            ? DEFAULT_THEME
            : createTheme({
                theme: 'light',
                settings: THEME_SETTINGS,
                styles: [...BASE_TOKEN_STYLES, ...tokenStyles],
            }),
        [tokenStyles]
    )

    const setValue = formValidation?.setValue
    const handleChange = React.useCallback((value: string) => {
        setValue?.(value)
        onChange?.(value)
    }, [setValue, onChange])

    const mergedProps = React.useMemo(
        () => mergeComponentProps("editor-input", rest),
        [rest]
    )

    return <InputWrapper title={title}
                         description={description}
                         right={right}
                         left={left}
                         rightType={rightType}
                         leftType={leftType}
                         formValidation={formValidation}
                         wrapperComponent={wrapperComponent}
    >

        <CodeMirror extensions={internalExtensions}
                    onChange={handleChange}
                    theme={myTheme}
                    indentWithTab={false}
                    {...mergedProps}
                    basicSetup={BASIC_SETUP}/>
    </InputWrapper>
})

EditorInput.displayName = "EditorInput"