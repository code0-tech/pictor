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
    onChange?: (value: string) => void
    placeholder?: string
}

type CustomText = {text: string; tokenRuleIndex?: number; tokenText?: string; tokenMatch?: RegExpExecArray}

const textToSlate = (text: string): Descendant[] =>
    (text || "").split("\n").map(line => ({type: "paragraph" as const, children: [{text: line}]}))

const slateToText = (value: Descendant[]): string =>
    value.map(n => SlateNode.string(n)).join("\n")

const EMPTY_TOKEN_RULES: EditorTokenRule[] = []

export const EditorInput: React.FC<EditorInputProps> = React.memo((props) => {

    const {
        title, right, left, rightType, leftType,
        description, wrapperComponent,
        tokenRules = EMPTY_TOKEN_RULES,
        suggestions,
        suggestionsEmptyState,
        onSuggestionSelect: onSuggestionSelectProp,
        formValidation, onChange,
        disabled = false, readonly = false,
        placeholder,
        value: valueProp, initialValue: initialValueProp, defaultValue: defaultValueProp,
        required: _required,
        ...rest
    } = props

    const externalText = String(valueProp ?? initialValueProp ?? defaultValueProp ?? "")

    const editor = useMemo(() => withHistory(withReact(createEditor())), [])

    // eslint-disable-next-line react-hooks/exhaustive-deps
    const initialSlateValue = useMemo(() => textToSlate(externalText), [])

    const prevTextRef = useRef(externalText)

    // Read at onChange time (handleChange is defined before `open` / the position
    // updater exist), so keep the latest values in refs.
    const openRef = useRef(false)
    const updateTriggerPositionRef = useRef<(() => void) | undefined>(undefined)

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

    const setFormValue = formValidation?.setValue
    const handleChange = useCallback((newValue: Descendant[]) => {
        // Slate fires onChange for selection changes too — keep the menu anchored
        // to the caret as it moves while the suggestions are open.
        if (openRef.current) updateTriggerPositionRef.current?.()
        const text = slateToText(newValue)
        if (text === prevTextRef.current) return
        prevTextRef.current = text
        setFormValue?.(text)
        onChange?.(text)
    }, [setFormValue, onChange])

    const decorate = useCallback(([node, path]: any) => {
        const ranges: any[] = []
        if (!Text.isText(node) || !tokenRules.length) return ranges
        const {text} = node
        tokenRules.forEach((rule, ri) => {
            const re = new RegExp(rule.pattern.source, rule.pattern.flags.includes("g") ? rule.pattern.flags : rule.pattern.flags + "g")
            let match: RegExpExecArray | null
            while ((match = re.exec(text)) !== null) {
                if (!match[0].length) break
                ranges.push({anchor: {path, offset: match.index}, focus: {path, offset: match.index + match[0].length}, tokenRuleIndex: ri, tokenText: match[0], tokenMatch: match})
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
                return <span {...attributes}><span style={rule.style} className={rule.className}>{children}</span></span>
            }
        }
        return <span {...attributes}>{children}</span>
    }, [tokenRules])

    const [open, setOpen] = useState(false)
    const itemsHandleRef = useRef<InputSuggestionMenuContentItemsHandle>(null)
    const editorContainerRef = useRef<HTMLDivElement>(null)
    const triggerRef = useRef<HTMLButtonElement>(null)
    const blurTimer = useRef<ReturnType<typeof setTimeout>>()

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
        } catch { rect = null }
        // Collapsed selections can report an empty rect — fall back to the editor start.
        if (!rect || (!rect.width && !rect.height && !rect.left && !rect.top)) rect = container.getBoundingClientRect()

        const wrapperRect = wrapper.getBoundingClientRect()
        btn.style.left = `${rect.left - wrapperRect.left}px`
        btn.style.top = `${rect.top - wrapperRect.top}px`
        btn.style.width = "0px"
        btn.style.height = `${rect.height || parseFloat(getComputedStyle(container).lineHeight) || 16}px`
    }, [editor])

    openRef.current = open
    updateTriggerPositionRef.current = updateTriggerPosition

    // A ref-like handle that focuses the Slate editor. The InputSuggestion menu
    // uses this to keep the caret in the editor while the menu is open, so the
    // menu never steals focus (which would otherwise blur the editor and make
    // typing impossible).
    const editorFocusRef = useMemo(
        () => ({current: {focus: () => { try { ReactEditor.focus(editor) } catch { /* not mounted yet */ } }}}),
        [editor]
    ) as unknown as React.RefObject<HTMLInputElement>

    // When the menu is opened via keyboard we want to highlight an item straight
    // away, but the items only mount once `open` flips — so remember the intent
    // and apply it in an effect after the menu (and its handle) has mounted.
    const pendingHighlightRef = useRef<null | "first" | "last">(null)

    const openMenu = useCallback(() => {
        if (blurTimer.current) clearTimeout(blurTimer.current)
        if (!suggestions) return
        // Position the anchor at the caret *before* Radix measures it on open.
        updateTriggerPosition()
        setOpen(true)
    }, [suggestions, updateTriggerPosition])

    React.useEffect(() => {
        if (!open) {
            pendingHighlightRef.current = null
            return
        }
        // Correct the anchor position once the menu has actually mounted.
        updateTriggerPosition()
        const highlight = pendingHighlightRef.current
        if (!highlight) return
        let raf = 0
        const apply = () => {
            const handle = itemsHandleRef.current
            if (!handle) {
                raf = requestAnimationFrame(apply)
                return
            }
            if (highlight === "first") handle.focusFirstItem()
            else handle.focusLastItem()
            pendingHighlightRef.current = null
        }
        apply()
        return () => { if (raf) cancelAnimationFrame(raf) }
    }, [open])

    // Defer closing so a transient blur (e.g. Radix moving focus on open, or a
    // click on a menu item) doesn't close the menu before focus returns.
    const scheduleClose = useCallback(() => {
        if (blurTimer.current) clearTimeout(blurTimer.current)
        blurTimer.current = setTimeout(() => setOpen(false), 150)
    }, [])

    const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
        if (!suggestions) return
        const handle = itemsHandleRef.current

        // Ctrl+Space opens the suggestions — the only open trigger. Works on
        // Windows/Linux cleanly (Alt+Space would collide with the OS window menu);
        // on macOS it may need the input-source switch shortcut disabled.
        if (e.ctrlKey && e.code === "Space") {
            e.preventDefault()
            if (!open) {
                pendingHighlightRef.current = "first"
                openMenu()
            } else {
                handle?.focusFirstItem()
            }
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
    }, [suggestions, open, openMenu])


    const editorContent = (
        <div {...mergeComponentProps("editor-input", rest)} ref={editorContainerRef}>
            <Editable
                className="input-wrapper__control"
                decorate={decorate}
                renderLeaf={renderLeaf}
                readOnly={disabled || readonly}
                spellCheck={false}
                placeholder={placeholder}
                onBlur={scheduleClose}
                onKeyDown={handleKeyDown}
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
                    ? {...(wrapperComponent ?? {}), style: {position: "relative" as const, ...(wrapperComponent as any)?.style}}
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
                                style={{position: "absolute", left: 0, top: 0, width: 0, height: 0, opacity: 0, pointerEvents: "none"}}
                            />
                        </MenuTrigger>
                        <MenuPortal>
                            <InputSuggestionMenuContent
                                color="primary"
                                inputRef={editorFocusRef}
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
                                    inputRef={editorFocusRef}
                                    onSuggestionSelect={(s) => {
                                        onSuggestionSelectProp?.(s)
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
