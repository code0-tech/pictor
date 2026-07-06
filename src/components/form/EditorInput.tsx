import React, {useCallback, useMemo, useRef, useState} from "react"
import {createEditor, Descendant, Editor, Node as SlateNode, Text, Transforms} from "slate"
import {Editable, ReactEditor, RenderLeafProps, Slate, withReact} from "slate-react"
import {withHistory} from "slate-history"
import {ValidationProps} from "./useForm"
import {InputWrapper, InputWrapperProps} from "./InputWrapper"
import {mergeComponentProps} from "../../utils"
import {Menu, MenuPortal, MenuTrigger} from "../menu/Menu"
import {
    InputSuggestion,
    InputSuggestionMenuContent,
    InputSuggestionMenuContentItems,
    InputSuggestionMenuContentItemsHandle
} from "./InputSuggestion"
import "./EditorInput.style.scss"

export interface EditorTokenRule {
    pattern: RegExp
    /**
     * Wrap a matched token. `children` is Slate's leaf content — include it
     * somewhere so cursor positioning stays accurate.
     */
    wrap?: (matchedText: string, children: React.ReactNode, match: RegExpExecArray) => React.ReactNode
    style?: React.CSSProperties
    className?: string
}

export interface EditorInputProps extends Omit<InputWrapperProps, "onChange">, ValidationProps<any> {
    tokenRules?: EditorTokenRule[]
    suggestions?: InputSuggestion[]
    suggestionsEmptyState?: React.ReactNode
    onSuggestionSelect?: (suggestion: InputSuggestion) => void
    disabled?: boolean
    readonly?: boolean
    /** Render as a single-line input: Enter is blocked, newlines in pasted or external values become spaces. */
    singleLine?: boolean
    onChange?: (value: string) => void
    placeholder?: string
}

type CustomText = { text: string; tokenRuleIndex?: number; tokenText?: string; tokenMatch?: RegExpExecArray }

const textToSlate = (text: string): Descendant[] =>
    (text || "").split("\n").map(line => ({type: "paragraph" as const, children: [{text: line}]}))

const slateToText = (value: Descendant[]): string =>
    value.map(n => SlateNode.string(n)).join("\n")

export const EditorInput: React.FC<EditorInputProps> = React.memo((props) => {

    const {
        title,
        right,
        left,
        rightType,
        leftType,
        description, wrapperComponent,
        tokenRules = [],
        suggestions,
        suggestionsEmptyState,
        onSuggestionSelect,
        formValidation, onChange,
        disabled = false,
        readonly = false,
        singleLine = false,
        placeholder,
        value: valueProp,
        initialValue,
        defaultValue,
        required,
        ...rest
    } = props

    // In single-line mode, newlines never reach the document: they are stripped
    // here (external values), on Enter (keydown), and on paste.
    const rawText = String(valueProp ?? initialValue ?? defaultValue ?? "")
    const externalText = singleLine ? rawText.replace(/\n/g, " ") : rawText

    const editor = useMemo(() => withHistory(withReact(createEditor())), [])

    // eslint-disable-next-line react-hooks/exhaustive-deps
    const initialSlateValue = useMemo(() => textToSlate(externalText), [])

    const prevTextRef = useRef(externalText)

    // Sync external value resets (e.g. form reset)
    React.useEffect(() => {
        if (externalText === prevTextRef.current) return
        prevTextRef.current = externalText
        if (slateToText(editor.children) === externalText) return
        const next = textToSlate(externalText)
        Editor.withoutNormalizing(editor, () => {
            Transforms.delete(editor, {at: {anchor: Editor.start(editor, []), focus: Editor.end(editor, [])}})
            Transforms.insertNodes(editor, next, {at: [0]})
            while (editor.children.length > next.length)
                Transforms.removeNodes(editor, {at: [editor.children.length - 1]})
        })
    }, [externalText, editor])

    const decorate = useCallback(([node, path]: any) => {
        const ranges: any[] = []
        if (!Text.isText(node) || !tokenRules.length) return ranges
        const {text} = node
        tokenRules.forEach((rule, ri) => {
            const re = new RegExp(rule.pattern.source, rule.pattern.flags.includes("g") ? rule.pattern.flags : rule.pattern.flags + "g")
            let match: RegExpExecArray | null
            while ((match = re.exec(text)) !== null) {
                if (!match[0].length) break
                ranges.push({
                    anchor: {path, offset: match.index},
                    focus: {path, offset: match.index + match[0].length},
                    tokenRuleIndex: ri,
                    tokenText: match[0],
                    tokenMatch: match
                })
            }
        })
        return ranges
    }, [tokenRules])

    const renderLeaf = useCallback(({attributes, children, leaf}: RenderLeafProps) => {
        const l = leaf as CustomText
        if (l.tokenRuleIndex !== undefined) {
            const rule = tokenRules[l.tokenRuleIndex]
            if (rule) {
                if (rule.wrap) return <span {...attributes}>{rule.wrap(l.tokenText ?? "", children, l.tokenMatch ?? [] as any)}</span>
                return <span {...attributes}>
                    <span style={rule.style} className={rule.className}>
                        {children}
                    </span>
                </span>
            }
        }
        return <span {...attributes}>{children}</span>
    }, [tokenRules])

    const [open, setOpen] = useState(false)
    const itemsHandleRef = useRef<InputSuggestionMenuContentItemsHandle>(null)
    const editorContainerRef = useRef<HTMLDivElement>(null)
    const triggerRef = useRef<HTMLButtonElement>(null)
    const blurTimer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined)

    // Move the invisible Radix trigger to sit right behind the caret, so the
    // suggestion menu is anchored under the text cursor instead of the start of
    // the input. Positioned absolutely inside `.input-wrapper` (its offset parent).
    const updateTriggerPosition = useCallback(() => {
        const btn = triggerRef.current
        const container = editorContainerRef.current
        const wrapper = container?.parentElement
        if (!btn || !container || !wrapper) return

        let rect: DOMRect | null = null
        try {
            if (editor.selection) rect = ReactEditor.toDOMRange(editor, editor.selection).getBoundingClientRect()
        } catch {
            rect = null
        }
        // Collapsed selections can report an empty rect — fall back to the editor start.
        if (!rect || (!rect.width && !rect.height && !rect.left && !rect.top)) rect = container.getBoundingClientRect()

        const wrapperRect = wrapper.getBoundingClientRect()
        btn.style.left = `${rect.left - wrapperRect.left}px`
        btn.style.top = `${rect.top - wrapperRect.top}px`
        btn.style.width = "0px"
        btn.style.height = `${rect.height || parseFloat(getComputedStyle(container).lineHeight) || 16}px`
    }, [editor])

    const setFormValue = formValidation?.setValue
    const handleChange = useCallback((newValue: Descendant[]) => {
        // Slate fires onChange for selection changes too — keep the menu anchored
        // to the caret as it moves while the suggestions are open.
        if (open) updateTriggerPosition()
        const text = slateToText(newValue)
        if (text === prevTextRef.current) return
        prevTextRef.current = text
        setFormValue?.(text)
        onChange?.(text)
    }, [open, updateTriggerPosition, setFormValue, onChange])

    const openMenu = useCallback(() => {
        if (blurTimer.current) clearTimeout(blurTimer.current)
        if (!suggestions) return
        // Position the anchor at the caret *before* Radix measures it on open.
        updateTriggerPosition()
        setOpen(true)
    }, [suggestions, updateTriggerPosition])

    React.useEffect(() => {
        if (!open) return
        updateTriggerPosition()
    }, [open])

    // Defer closing so a transient blur (e.g. Radix moving focus on open, or a
    // click on a menu item) doesn't close the menu before focus returns.
    const scheduleClose = useCallback(() => {
        if (blurTimer.current) clearTimeout(blurTimer.current)
        blurTimer.current = setTimeout(() => setOpen(false), 150)
    }, [])

    const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
        // No line breaks in single-line mode (menu selection below still works —
        // it calls preventDefault itself).
        if (singleLine && e.key === "Enter") e.preventDefault()
        if (!suggestions) return
        const handle = itemsHandleRef.current

        // Ctrl+Space opens the suggestions — the only open trigger. Works on
        // Windows/Linux cleanly (Alt+Space would collide with the OS window menu);
        // on macOS it may need the input-source switch shortcut disabled.
        if (e.ctrlKey && e.code === "Space") {
            e.preventDefault()
            if (!open) openMenu()
            else handle?.focusFirstItem()
            return
        }

        // Arrow keys only navigate while the menu is open; they don't open it.
        if (!open || !handle) return
        if (e.key === "ArrowDown") {
            e.preventDefault()
            handle.highlightNextItem()
        } else if (e.key === "ArrowUp") {
            e.preventDefault()
            handle.highlightPreviousItem()
        } else if (e.key === "Enter") {
            const selected = handle.selectActiveItem()
            if (selected) {
                e.preventDefault()
                setOpen(false)
            }
        } else if (e.key === "Escape") {
            e.preventDefault()
            setOpen(false)
        }
    }, [suggestions, open, openMenu, singleLine])


    const editorContent = (
        <div {...mergeComponentProps("editor-input", rest)} ref={editorContainerRef}>
            <Editable
                className={singleLine ? "input-wrapper__control input-wrapper__control--single-line" : "input-wrapper__control"}
                decorate={decorate}
                renderLeaf={renderLeaf}
                readOnly={disabled || readonly}
                spellCheck={false}
                placeholder={placeholder}
                onBlur={scheduleClose}
                // A transient blur (focus bounced back by the menu) must not
                // close the menu — cancel the pending close on refocus.
                onFocus={() => {
                    if (blurTimer.current) clearTimeout(blurTimer.current)
                }}
                onKeyDown={handleKeyDown}
                onPaste={singleLine ? (e) => {
                    // Like a native <input>: paste plain text with newlines as spaces.
                    e.preventDefault()
                    editor.insertText(e.clipboardData.getData("text/plain").replace(/\r?\n/g, " "))
                } : undefined}
            />
        </div>
    )

    return (
        <Slate editor={editor} initialValue={initialSlateValue} onChange={handleChange}>
            <InputWrapper
                title={title} description={description}
                right={right} left={left}
                rightType={rightType} leftType={leftType}
                formValidation={formValidation}
                wrapperComponent={suggestions
                    ? {
                        ...(wrapperComponent ?? {}),
                        style: {position: "relative" as const, ...(wrapperComponent as any)?.style}
                    }
                    : wrapperComponent
                }
            >
                {suggestions ? (
                    <Menu open={open} modal={false} onOpenChange={(next) => !next && setOpen(false)}>
                        {editorContent}
                        <MenuTrigger asChild>
                            <button
                                ref={triggerRef}
                                type="button"
                                tabIndex={-1}
                                aria-hidden
                                onMouseDown={(e) => e.preventDefault()}
                                className="editor-input__menu-anchor"
                            />
                        </MenuTrigger>
                        <MenuPortal>
                            <InputSuggestionMenuContent
                                color="primary"
                                onInteractOutside={(e) => {
                                    // The Slate editor is a contenteditable <div>, not an
                                    // <input>, so keep the menu open while the user clicks
                                    // or types inside it.
                                    const target = e.target as Node | null
                                    if (target && editorContainerRef.current?.contains(target)) e.preventDefault()
                                }}
                            >
                                {suggestions.length === 0 && suggestionsEmptyState}
                                <InputSuggestionMenuContentItems
                                    ref={itemsHandleRef}
                                    suggestions={suggestions}
                                    onSuggestionSelect={(s) => {
                                        onSuggestionSelect?.(s)
                                        setOpen(false)
                                    }}
                                />
                            </InputSuggestionMenuContent>
                        </MenuPortal>
                    </Menu>
                ) : editorContent}
            </InputWrapper>
        </Slate>
    )
})
