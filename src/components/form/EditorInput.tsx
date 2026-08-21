import React, {useCallback, useEffect, useMemo, useRef, useState} from "react"
import {createEditor, Descendant, Editor, Node as SlateNode, Range, Text, Transforms} from "slate"
import {Editable, ReactEditor, RenderElementProps, RenderLeafProps, Slate, withReact} from "slate-react"
import {withHistory} from "slate-history"
import {ValidationProps} from "./useForm"
import {InputWrapper, InputWrapperProps} from "./InputWrapper"
import {Component, mergeComponentProps} from "../../utils"
import {
    Menu,
    MenuContent,
    MenuContentProps,
    MenuItem,
    MenuItemProps,
    MenuPortal,
    MenuSub,
    MenuSubContent,
    MenuSubTrigger,
    MenuTrigger
} from "../menu/Menu"
import "./EditorInput.style.scss"

export interface EditorTokenRule {
    pattern: RegExp
    wrap?: (matchedText: string, children: React.ReactNode, match: RegExpExecArray) => React.ReactNode
    style?: React.CSSProperties
    className?: string
    void?: boolean
}

export interface EditorInputProps extends Omit<InputWrapperProps, "onChange" | "onSelect">, ValidationProps<any> {
    tokenRules?: EditorTokenRule[]
    onSelect?: (value: any, data: any) => void
    search?: string
    disabled?: boolean
    readonly?: boolean
    singleLine?: boolean
    onChange?: (value: string) => void
    placeholder?: string
    children?: React.ReactNode
}

export type EditorInputValueProps = Component<HTMLDivElement>
export type EditorInputTriggerProps = Component<HTMLButtonElement>
export type EditorInputMenuProps = MenuContentProps
export type EditorInputMenuItemProps = MenuItemProps & {
    value: any
    data?: any
    onlyOnce?: boolean
    aliases?: string[]
}

export interface EditorInputSubMenuProps {
    label: React.ReactNode
    children: React.ReactNode
}

type CustomText = { text: string; tokenRuleIndex?: number; tokenText?: string; tokenMatch?: RegExpExecArray }

type TokenElement = {
    type: "token"
    ruleIndex: number
    token: string
    match?: RegExpExecArray
    children: [{ text: string }]
}

interface RegisteredItem {
    getValue: () => any
    getData: () => any
    el: React.RefObject<HTMLElement | null>
    parentId: string | null
    onActivate?: () => void
}

interface EditorInputContextValue {
    editor: ReactEditor
    tokenRules: EditorTokenRule[]
    singleLine: boolean
    disabled: boolean
    readonly: boolean
    placeholder?: string
    search?: string
    documentText: string

    open: boolean
    setOpen: (open: boolean) => void
    openMenu: () => void

    editorContainerRef: React.RefObject<HTMLDivElement | null>
    triggerRef: React.RefObject<HTMLButtonElement | null>
    updateTriggerPosition: () => void
    scheduleClose: () => void
    cancelClose: () => void

    registerItem: (id: string, item: RegisteredItem) => () => void
    activeId: string | null
    setActiveId: (id: string | null) => void
    highlightNext: () => void
    highlightPrevious: () => void
    focusFirst: () => void
    selectActive: () => boolean
    select: (value: any, data: any) => void
    openSubId: string | null
    enterSub: (id: string) => void
    exitSub: () => void
    openActiveSub: () => boolean
}

const isTokenElement = (node: any): node is TokenElement => node?.type === "token"

const lineToChildren = (line: string, rules: EditorTokenRule[]): Descendant[] => {
    const matches: { start: number; end: number; ruleIndex: number; token: string; match: RegExpExecArray }[] = []
    rules.forEach((rule, ri) => {
        if (!rule.void) return
        const re = new RegExp(rule.pattern.source, rule.pattern.flags.includes("g") ? rule.pattern.flags : rule.pattern.flags + "g")
        let m: RegExpExecArray | null
        while ((m = re.exec(line)) !== null) {
            if (!m[0].length) break
            matches.push({start: m.index, end: m.index + m[0].length, ruleIndex: ri, token: m[0], match: m})
        }
    })
    matches.sort((a, b) => a.start - b.start)

    const children: Descendant[] = []
    let pos = 0
    matches.forEach(mt => {
        if (mt.start < pos) return
        if (mt.start > pos) children.push({text: line.slice(pos, mt.start)})
        else if (children.length && isTokenElement(children[children.length - 1])) children.push({text: ""})
        const token: TokenElement = {
            type: "token",
            ruleIndex: mt.ruleIndex,
            token: mt.token,
            match: mt.match,
            children: [{text: ""}]
        }
        children.push(token as unknown as Descendant)
        pos = mt.end
    })
    if (pos < line.length) children.push({text: line.slice(pos)})

    if (!children.length || isTokenElement(children[0])) children.unshift({text: ""})
    if (isTokenElement(children[children.length - 1])) children.push({text: ""})
    return children
}

const textToSlate = (text: string, rules: EditorTokenRule[]): Descendant[] =>
    (text || "").split("\n").map(line => ({type: "paragraph" as const, children: lineToChildren(line, rules)}))

const nodeToString = (node: Descendant): string => {
    if (Text.isText(node)) return node.text
    if (isTokenElement(node)) return node.token
    return (node.children as Descendant[]).map(nodeToString).join("")
}

const slateToText = (value: Descendant[]): string =>
    value.map(nodeToString).join("\n")

const EditorInputContext = React.createContext<EditorInputContextValue | null>(null)

const SubMenuIdContext = React.createContext<string | null>(null)

const useEditorInputContext = (): EditorInputContextValue => {
    const ctx = React.useContext(EditorInputContext)
    if (!ctx) throw new Error("EditorInput.* components must be used inside <EditorInput>")
    return ctx
}

export const EditorInput: React.FC<EditorInputProps> = (props) => {

    const {
        title, right, left, rightType, leftType,
        description, wrapperComponent,
        tokenRules = [],
        onSelect,
        search,
        formValidation, onChange,
        disabled = false,
        readonly = false,
        singleLine = false,
        placeholder,
        value: valueProp,
        initialValue,
        defaultValue,
        children,
    } = props

    const rawText = String(valueProp ?? initialValue ?? defaultValue ?? "")
    const externalText = singleLine ? rawText.replace(/\n/g, " ") : rawText

    const editor = useMemo(() => {
        const instance = withHistory(withReact(createEditor()))
        const {isInline, isVoid} = instance
        instance.isInline = element => isTokenElement(element) || isInline(element)
        instance.isVoid = element => isTokenElement(element) || isVoid(element)
        return instance
    }, [])

    // eslint-disable-next-line react-hooks/exhaustive-deps
    const initialSlateValue = useMemo(() => textToSlate(externalText, tokenRules), [])

    const prevTextRef = useRef(externalText)
    const [documentText, setDocumentText] = useState(externalText)

    useEffect(() => {
        if (externalText === prevTextRef.current) return
        prevTextRef.current = externalText
        setDocumentText(externalText)
        if (slateToText(editor.children) === externalText) return
        const next = textToSlate(externalText, tokenRules)
        Editor.withoutNormalizing(editor, () => {
            Transforms.deselect(editor)
            const previousCount = editor.children.length
            Transforms.insertNodes(editor, next, {at: [0]})
            for (let i = 0; i < previousCount; i++)
                Transforms.removeNodes(editor, {at: [next.length]})
        })
        try {
            Transforms.select(editor, Editor.end(editor, []))
        } catch {
        }
    }, [externalText, editor, tokenRules])

    const [open, setOpen] = useState(false)
    const editorContainerRef = useRef<HTMLDivElement>(null)
    const triggerRef = useRef<HTMLButtonElement>(null)
    const blurTimer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined)

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
        if (!rect || (!rect.width && !rect.height && !rect.left && !rect.top)) rect = container.getBoundingClientRect()

        const wrapperRect = wrapper.getBoundingClientRect()
        btn.style.left = `${rect.left - wrapperRect.left}px`
        btn.style.top = `${rect.top - wrapperRect.top}px`
        btn.style.width = "0px"
        btn.style.height = `${rect.height || parseFloat(getComputedStyle(container).lineHeight) || 16}px`
    }, [editor])

    const setFormValue = formValidation?.setValue
    const handleChange = useCallback((newValue: Descendant[]) => {
        if (open) updateTriggerPosition()
        const text = slateToText(newValue)
        if (text === prevTextRef.current) return
        prevTextRef.current = text
        setDocumentText(text)
        setFormValue?.(text)
        onChange?.(text)
    }, [open, updateTriggerPosition, setFormValue, onChange])

    const openMenu = useCallback(() => {
        if (!triggerRef.current) return
        if (blurTimer.current) clearTimeout(blurTimer.current)
        updateTriggerPosition()
        setOpen(true)
    }, [updateTriggerPosition])

    useEffect(() => {
        if (open) updateTriggerPosition()
    }, [open, updateTriggerPosition])

    const scheduleClose = useCallback(() => {
        if (blurTimer.current) clearTimeout(blurTimer.current)
        blurTimer.current = setTimeout(() => setOpen(false), 150)
    }, [])

    const cancelClose = useCallback(() => {
        if (blurTimer.current) clearTimeout(blurTimer.current)
    }, [])

    const itemsRef = useRef<Map<string, RegisteredItem>>(new Map())
    const [activeId, setActiveIdState] = useState<string | null>(null)
    const activeIdRef = useRef<string | null>(null)
    const setActiveId = useCallback((id: string | null) => {
        activeIdRef.current = id
        setActiveIdState(id)
    }, [])

    const [openSubId, setOpenSubIdState] = useState<string | null>(null)
    const openSubIdRef = useRef<string | null>(null)
    const setOpenSubId = useCallback((id: string | null) => {
        openSubIdRef.current = id
        setOpenSubIdState(id)
    }, [])

    const registerItem = useCallback((id: string, item: RegisteredItem) => {
        itemsRef.current.set(id, item)
        return () => {
            itemsRef.current.delete(id)
            if (activeIdRef.current === id) setActiveId(null)
        }
    }, [setActiveId])

    const orderedIds = useCallback(() => {
        return Array.from(itemsRef.current.entries())
            .filter(([, item]) => item.el.current && item.parentId === openSubIdRef.current)
            .sort((a, b) => {
                const rel = a[1].el.current!.compareDocumentPosition(b[1].el.current!)
                return rel & Node.DOCUMENT_POSITION_FOLLOWING ? -1 : 1
            })
            .map(([id]) => id)
    }, [])

    const highlightTo = useCallback((id: string | null) => {
        setActiveId(id)
        if (id) itemsRef.current.get(id)?.el.current?.scrollIntoView({block: "nearest"})
    }, [setActiveId])

    const highlightNext = useCallback(() => {
        const ids = orderedIds()
        if (!ids.length) return
        const current = activeIdRef.current
        const index = current === null ? -1 : ids.indexOf(current)
        highlightTo(ids[Math.min(index + 1, ids.length - 1)] ?? ids[0])
    }, [orderedIds, highlightTo])

    const highlightPrevious = useCallback(() => {
        const ids = orderedIds()
        if (!ids.length) return
        const current = activeIdRef.current
        const index = current === null ? ids.length : ids.indexOf(current)
        highlightTo(ids[Math.max(index - 1, 0)] ?? ids[ids.length - 1])
    }, [orderedIds, highlightTo])

    const focusFirst = useCallback(() => {
        const ids = orderedIds()
        if (ids.length) highlightTo(ids[0])
    }, [orderedIds, highlightTo])

    const select = useCallback((value: any, data: any) => {
        onSelect?.(value, data)
        setOpen(false)
    }, [onSelect])

    const selectActive = useCallback(() => {
        const id = activeIdRef.current
        if (!id) return false
        const item = itemsRef.current.get(id)
        if (!item) return false
        if (item.onActivate) {
            item.onActivate()
            return true
        }
        setTimeout(() => select(item.getValue(), item.getData()), 0)
        return true
    }, [select])

    const enterSub = useCallback((id: string) => {
        setOpenSubId(id)
        setTimeout(() => {
            const ids = Array.from(itemsRef.current.entries())
                .filter(([, item]) => item.el.current && item.parentId === id)
                .sort((a, b) => (a[1].el.current!.compareDocumentPosition(b[1].el.current!) & Node.DOCUMENT_POSITION_FOLLOWING ? -1 : 1))
                .map(([itemId]) => itemId)
            if (ids.length) highlightTo(ids[0])
        }, 20)
    }, [setOpenSubId, highlightTo])

    const exitSub = useCallback(() => {
        const trigger = openSubIdRef.current
        if (trigger === null) return
        setOpenSubId(null)
        setActiveId(trigger)
    }, [setOpenSubId, setActiveId])

    const openActiveSub = useCallback(() => {
        const id = activeIdRef.current
        if (!id) return false
        const item = itemsRef.current.get(id)
        if (!item?.onActivate) return false
        item.onActivate()
        return true
    }, [])

    useEffect(() => {
        if (!open) {
            setActiveId(null)
            setOpenSubId(null)
        }
    }, [open, setActiveId, setOpenSubId])

    const ctx = useMemo<EditorInputContextValue>(() => ({
        editor, tokenRules, singleLine, disabled, readonly, placeholder, search, documentText,
        open, setOpen, openMenu,
        editorContainerRef, triggerRef, updateTriggerPosition, scheduleClose, cancelClose,
        registerItem, activeId, setActiveId, highlightNext, highlightPrevious, focusFirst, selectActive, select,
        openSubId, enterSub, exitSub, openActiveSub,
    }), [
        editor, tokenRules, singleLine, disabled, readonly, placeholder, search, documentText,
        open, openMenu, updateTriggerPosition, scheduleClose, cancelClose,
        registerItem, activeId, setActiveId, highlightNext, highlightPrevious, focusFirst, selectActive, select,
        openSubId, enterSub, exitSub, openActiveSub,
    ])

    return (
        <Slate editor={editor} initialValue={initialSlateValue} onChange={handleChange}>
            <EditorInputContext.Provider value={ctx}>
                <Menu open={open} modal={false} onOpenChange={(next) => !next && setOpen(false)}>
                    <InputWrapper
                        title={title} description={description}
                        right={right} left={left}
                        rightType={rightType} leftType={leftType}
                        formValidation={formValidation}
                        wrapperComponent={{
                            ...(wrapperComponent ?? {}),
                            style: {position: "relative" as const, ...(wrapperComponent as any)?.style},
                        }}
                    >
                        {children}
                    </InputWrapper>
                </Menu>
            </EditorInputContext.Provider>
        </Slate>
    )
}

export const EditorInputValue: React.FC<EditorInputValueProps> = (props) => {
    const {
        editor, tokenRules, singleLine, disabled, readonly, placeholder,
        open, openMenu, setOpen, editorContainerRef, scheduleClose, cancelClose,
        highlightNext, highlightPrevious, focusFirst, selectActive,
        openSubId, exitSub, openActiveSub,
    } = useEditorInputContext()

    const decorate = useCallback(([node, path]: any) => {
        const ranges: any[] = []
        if (!Text.isText(node) || !tokenRules.length) return ranges
        const {text} = node
        tokenRules.forEach((rule, ri) => {
            if (rule.void) return
            const re = new RegExp(rule.pattern.source, rule.pattern.flags.includes("g") ? rule.pattern.flags : rule.pattern.flags + "g")
            let match: RegExpExecArray | null
            while ((match = re.exec(text)) !== null) {
                if (!match[0].length) break
                ranges.push({
                    anchor: {path, offset: match.index},
                    focus: {path, offset: match.index + match[0].length},
                    tokenRuleIndex: ri,
                    tokenText: match[0],
                    tokenMatch: match,
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
                    <span style={rule.style} className={rule.className}>{children}</span>
                </span>
            }
        }
        return <span {...attributes}>{children}</span>
    }, [tokenRules])

    const renderElement = useCallback((elementProps: RenderElementProps) => {
        const {attributes, children, element} = elementProps
        if (isTokenElement(element)) {
            const rule = tokenRules[element.ruleIndex]
            const content = rule?.wrap
                ? rule.wrap(element.token, null, element.match ?? ([] as unknown as RegExpExecArray))
                : <span style={rule?.style} className={rule?.className}>{element.token}</span>
            return <span {...attributes}>
                <span contentEditable={false} className="editor-input__token"
                      style={{userSelect: "none"}}>{content}</span>
                {children}
            </span>
        }
        return <div {...attributes} style={{position: "relative"}}>{children}</div>
    }, [tokenRules])

    const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
        if (singleLine && e.key === "Enter") e.preventDefault()

        if (e.ctrlKey && e.code === "Space") {
            e.preventDefault()
            if (!open) openMenu()
            else focusFirst()
            return
        }

        if (open) {
            if (e.key === "ArrowDown") {
                e.preventDefault()
                highlightNext()
                return
            }
            if (e.key === "ArrowUp") {
                e.preventDefault()
                highlightPrevious()
                return
            }
            if (e.key === "ArrowRight" && openActiveSub()) {
                e.preventDefault()
                return
            }
            if (e.key === "ArrowLeft" && openSubId !== null) {
                e.preventDefault()
                exitSub()
                return
            }
            if (e.key === "Enter") {
                if (selectActive()) e.preventDefault()
                return
            }
            if (e.key === "Escape") {
                e.preventDefault()
                if (openSubId !== null) exitSub()
                else setOpen(false)
                return
            }
        }

        if ((e.key === "ArrowLeft" || e.key === "ArrowRight") && !e.shiftKey
            && tokenRules.some(rule => rule.void)
            && editor.selection && Range.isCollapsed(editor.selection)) {
            e.preventDefault()
            const reverse = e.key === "ArrowLeft"
            Transforms.move(editor, {unit: "offset", reverse})
            const landed = editor.selection
            if (landed && Range.isCollapsed(landed)) {
                const parent = SlateNode.parent(editor, landed.anchor.path)
                if (!Text.isText(parent) && Editor.isVoid(editor, parent as any)) {
                    Transforms.move(editor, {unit: "offset", reverse})
                }
            }
        }
    }, [singleLine, tokenRules, editor, open, openMenu, focusFirst, highlightNext, highlightPrevious, selectActive, setOpen, openSubId, exitSub, openActiveSub])

    return (
        <div {...mergeComponentProps("editor-input", props)} ref={editorContainerRef}>
            <Editable
                className={singleLine ? "input-wrapper__control input-wrapper__control--single-line" : "input-wrapper__control"}
                decorate={decorate}
                renderLeaf={renderLeaf}
                renderElement={renderElement}
                readOnly={disabled || readonly}
                spellCheck={false}
                placeholder={placeholder}
                onBlur={scheduleClose}
                onFocus={cancelClose}
                onKeyDown={handleKeyDown}
                onPaste={singleLine ? (e) => {
                    e.preventDefault()
                    editor.insertText(e.clipboardData.getData("text/plain").replace(/\r?\n/g, " "))
                } : undefined}
            />
        </div>
    )
}

export const EditorInputTrigger: React.FC<EditorInputTriggerProps> = (props) => {
    const {triggerRef} = useEditorInputContext()
    return <MenuTrigger asChild>
        <button
            ref={triggerRef}
            type="button"
            tabIndex={-1}
            aria-hidden
            onMouseDown={(e) => e.preventDefault()}
            {...mergeComponentProps("editor-input__menu-anchor", props)}
        />
    </MenuTrigger>
}

export const EditorInputMenu: React.FC<EditorInputMenuProps> = (props) => {
    const {editor, editorContainerRef} = useEditorInputContext()
    const {children, ...rest} = props

    const contentProps = {
        color: "primary",
        align: "start",
        sideOffset: 8,
        onContextMenuCapture: (e: React.SyntheticEvent) => e.stopPropagation(),
        onCloseAutoFocus: (e: Event) => e.preventDefault(),
        onOpenAutoFocus: (e: Event) => {
            e.preventDefault()
            ReactEditor.focus(editor)
        },
        onFocusCapture: () => ReactEditor.focus(editor),
        onInteractOutside: (e: { target: EventTarget | null; preventDefault: () => void }) => {
            const target = e.target as Node | null
            if (target && editorContainerRef.current?.contains(target)) e.preventDefault()
        },
        ...rest,
    } as MenuContentProps

    return <MenuPortal>
        <MenuContent {...contentProps}>
            {children}
        </MenuContent>
    </MenuPortal>
}

export const EditorInputMenuItem: React.FC<EditorInputMenuItemProps> = (props) => {
    const {value, data, children, onlyOnce, aliases, ...rest} = props
    const {editor, registerItem, activeId, setActiveId, select, search, documentText} = useEditorInputContext()
    const parentId = React.useContext(SubMenuIdContext)

    const id = React.useId()
    const elRef = useRef<HTMLElement | null>(null)
    const dataRef = useRef({value, data})
    dataRef.current = {value, data}

    const alreadyPresent = !!onlyOnce && documentText.includes(String(value))
    const query = search?.trim().toLowerCase() ?? ""
    const matchesSearch = !query || [
        typeof children === "string" ? children : String(value),
        ...(aliases ?? []),
    ].some(text => text.toLowerCase().includes(query))
    const hidden = alreadyPresent || !matchesSearch

    useEffect(() => {
        if (hidden) return
        return registerItem(id, {
            getValue: () => dataRef.current.value,
            getData: () => dataRef.current.data,
            el: elRef,
            parentId,
        })
    }, [id, registerItem, parentId, hidden])

    if (hidden) return null

    const isActive = activeId === id

    return <MenuItem
        {...rest}
        ref={(el) => {
            elRef.current = el
        }}
        textValue={""}
        data-focus={isActive || undefined}
        onPointerDown={(event) => {
            event.preventDefault()
            setActiveId(id)
            ReactEditor.focus(editor)
        }}
        onPointerMove={(event) => {
            event.preventDefault()
            event.stopPropagation()
            if (activeId !== id) setActiveId(id)
        }}
        onSelect={() => setTimeout(() => select(dataRef.current.value, dataRef.current.data), 0)}
    >
        {children}
    </MenuItem>
}

export const EditorInputSubMenu: React.FC<EditorInputSubMenuProps> = ({label, children}) => {
    const {editor, registerItem, activeId, setActiveId, openSubId, enterSub, exitSub} = useEditorInputContext()
    const parentId = React.useContext(SubMenuIdContext)

    const id = React.useId()
    const elRef = useRef<HTMLElement | null>(null)

    useEffect(() => registerItem(id, {
        getValue: () => undefined,
        getData: () => undefined,
        el: elRef,
        parentId,
        onActivate: () => enterSub(id),
    }), [id, registerItem, parentId, enterSub])

    const subContentProps = {
        onOpenAutoFocus: (e: Event) => {
            e.preventDefault()
            ReactEditor.focus(editor)
        },
        onFocusCapture: () => ReactEditor.focus(editor),
        onCloseAutoFocus: (e: Event) => e.preventDefault(),
        onFocusOutside: (e: Event) => e.preventDefault(),
        onInteractOutside: (e: Event) => e.preventDefault(),
    } as any

    return <MenuSub
        open={openSubId === id}
        onOpenChange={(next) => {
            if (next && openSubId !== id) enterSub(id)
            else if (!next && openSubId === id) exitSub()
        }}
    >
        <MenuSubTrigger
            ref={(el: HTMLDivElement | null) => {
                elRef.current = el
            }}
            data-focus={activeId === id || undefined}
            onPointerDown={(e) => {
                e.preventDefault()
                setActiveId(id)
                ReactEditor.focus(editor)
            }}
            onPointerMove={() => {
                if (activeId !== id) setActiveId(id)
            }}
        >
            {label}
        </MenuSubTrigger>
        <MenuSubContent color="primary" {...subContentProps}>
            <SubMenuIdContext.Provider value={id}>
                {children}
            </SubMenuIdContext.Provider>
        </MenuSubContent>
    </MenuSub>
}
