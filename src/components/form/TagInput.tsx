import React, {useCallback, useContext, useEffect, useMemo, useReducer, useRef, useState} from "react"
import {
    EditorInput,
    EditorInputMenu,
    EditorInputMenuProps,
    EditorInputMenuItem,
    EditorInputSubMenu,
    EditorInputSubMenuProps,
    EditorInputTrigger,
    EditorInputTriggerProps,
    EditorInputValue,
    EditorInputValueProps,
    EditorTokenRule, EditorInputMenuItemProps
} from "./EditorInput"
import {InputWrapperProps} from "./InputWrapper"
import {ValidationProps} from "./useForm"
import {Badge} from "../badge/Badge"
import {Text} from "../text/Text"

export interface TagValue {
    value: any
    valueData?: any
}

export interface TagSuggestion {
    value: any
    valueData?: any
    children: React.ReactNode
}

export interface TagInputProps extends Omit<InputWrapperProps, "onChange">, ValidationProps<any> {
    allowCustomValues?: boolean
    onChange?: (tags: TagValue[]) => void
    tagColor?: string
    children?: React.ReactNode
}

interface TagInputContextValue {
    search: string
    allowCustomValues: boolean
    insertToken: (token: string) => void
    registerTag: (key: string, tag: TagInputMenuItemProps) => void
}

export type TagInputTriggerProps = EditorInputTriggerProps
export type TagInputSubMenuProps = EditorInputSubMenuProps
export type TagInputMenuProps = EditorInputMenuProps
export type TagInputMenuItemProps = EditorInputMenuItemProps
export type TagInputValueProps = EditorInputValueProps

const TOKEN_OPEN = "⟦"
const TOKEN_CLOSE = "⟧"

const tokenPattern = new RegExp(`${TOKEN_OPEN}([^${TOKEN_CLOSE}]+)${TOKEN_CLOSE}`, "g")
const tokenOrTextPattern = new RegExp(`(${TOKEN_OPEN}[^${TOKEN_CLOSE}]+${TOKEN_CLOSE})|([^${TOKEN_OPEN}${TOKEN_CLOSE}]+)`, "g")

const encodeToken = (value: any) => `${TOKEN_OPEN}${String(value)}${TOKEN_CLOSE}`
const decodeToken = (token: string) => token.slice(TOKEN_OPEN.length, -TOKEN_CLOSE.length)

const tagsToText = (tags: TagValue[]) => tags.map(tag => encodeToken(tag.value)).join("")
const textToSearch = (text: string) => text.replace(tokenPattern, "").trim()

const insertTokenAtCaret = (text: string, token: string) => {
    let inserted = false
    const withToken = text.replace(tokenOrTextPattern, (_match, existingToken, freeText) => {
        if (existingToken) return existingToken
        if (!inserted && freeText.trim()) {
            inserted = true
            return token
        }
        return ""
    })
    return inserted ? withToken : withToken + token
}

const TagInputContext = React.createContext<TagInputContextValue | null>(null)

const useTagInput = () => {
    const context = useContext(TagInputContext)
    if (!context) throw new Error("TagInput.* components must be used inside <TagInput>")
    return context
}

export const TagInput: React.FC<TagInputProps> = (props) => {
    const {
        allowCustomValues = false,
        onChange,
        formValidation,
        tagColor = "primary",
        value,
        initialValue,
        defaultValue,
        children,
        ...rest
    } = props

    const externalTags = (value ?? initialValue ?? defaultValue) as TagValue[] | undefined

    const [text, setText] = useState(() => tagsToText(externalTags ?? []))

    const tagRegistry = useRef(new Map<string, TagInputMenuItemProps>())
    const [, forceUpdate] = useReducer((count: number) => count + 1, 0)
    const registerTag = useCallback((key: string, tag: TagInputMenuItemProps) => {
        tagRegistry.current.set(key, tag)
        forceUpdate()
    }, [])

    const committedTags = useRef(externalTags)
    const commit = (nextText: string) => {
        const tags = [...nextText.matchAll(tokenPattern)].map(([, inner]): TagValue => {
            const registered = tagRegistry.current.get(inner)
            return {value: registered ? registered.value : inner, valueData: registered?.data}
        })
        committedTags.current = tags
        setText(nextText)
        formValidation?.setValue?.(tags)
        onChange?.(tags)
    }

    useEffect(() => {
        if (externalTags === committedTags.current) return
        committedTags.current = externalTags
        setText(tagsToText(externalTags ?? []))
    }, [externalTags])

    const tokenRules = useMemo<EditorTokenRule[]>(() => [{
        pattern: tokenPattern,
        void: true,
        wrap: matched => {
            const inner = decodeToken(matched)
            const registered = tagRegistry.current.get(inner)
            if (registered) return <>{registered.children}</>
            return <Badge m={0.01} color={tagColor}><Text>{inner}</Text></Badge>
        },
    }], [tagColor])

    const context: TagInputContextValue = {
        search: textToSearch(text),
        allowCustomValues,
        insertToken: token => commit(insertTokenAtCaret(text, token)),
        registerTag,
    }

    return <TagInputContext.Provider value={context}>
        <EditorInput
            {...rest}
            value={text}
            search={context.search}
            tokenRules={tokenRules}
            formValidation={formValidation && {valid: formValidation.valid, notValidMessage: formValidation.notValidMessage}}
            onChange={commit}
            onSelect={token => context.insertToken(String(token))}
        >
            {children}
        </EditorInput>
    </TagInputContext.Provider>
}

export const TagInputMenu: React.FC<TagInputMenuProps> = (props) => <EditorInputMenu {...props}/>

export const TagInputSubMenu: React.FC<TagInputSubMenuProps> = (props) => <EditorInputSubMenu {...props}/>

export const TagInputMenuItem: React.FC<TagInputMenuItemProps> = ({value, data, onlyOnce, aliases, children}) => {
    const {registerTag} = useTagInput()

    const tag = useRef<TagInputMenuItemProps>({value, data, children})
    tag.current.value = value
    tag.current.data = data
    tag.current.children = children
    useEffect(() => registerTag(String(value), tag.current), [value, registerTag])

    return <EditorInputMenuItem
        value={encodeToken(value)}
        data={data}
        onlyOnce={onlyOnce}
        aliases={[String(value), ...(aliases ?? [])]}
    >
        {children}
    </EditorInputMenuItem>
}

export const TagInputValue: React.FC<TagInputValueProps> = ({onKeyDown, ...props}) => {
    const {search, allowCustomValues, insertToken} = useTagInput()

    const commitCustomValue = () => {
        if (allowCustomValues && search) insertToken(encodeToken(search))
    }

    return <EditorInputValue {...props} onKeyDown={event => {
        if (event.key === "Enter" && !event.defaultPrevented) {
            event.preventDefault()
            commitCustomValue()
        } else if (event.key === "," && allowCustomValues) {
            event.preventDefault()
            commitCustomValue()
        }
        onKeyDown?.(event)
    }}/>
}

export const TagInputTrigger: React.FC<TagInputTriggerProps> = (props) => <EditorInputTrigger {...props}/>
