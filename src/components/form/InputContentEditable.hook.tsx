import React from "react"
import {renderToStaticMarkup} from "react-dom/server.browser"
import type {InputSuggestion} from "./InputSuggestion"
import {InputSyntaxSegment, buildDefaultSyntax} from "./Input.syntax.hook"
import type {ContentEditableEvent} from "react-contenteditable"

/**
 * =========================
 * Types
 * =========================
 */
type EditorPart = string | InputSuggestion | any

type LastTokenMatch = {
    token: string
    range: Range
}

export type UseContentEditableControllerProps = {
    editorRef: React.RefObject<HTMLElement>
    transformSyntax?: ((value: any, appliedSyntaxParts?: (InputSuggestion | any)[]) => InputSyntaxSegment[]) | undefined
    filterSuggestionsByLastToken?: boolean
    onLastTokenChange?: (token: string | null) => void

    // push state back to Input.tsx (value + tokens)
    onStateChange?: (payload: {value: string; tokens: InputSuggestion[]}) => void
}

export type UseContentEditableControllerReturn = {
    editorHtml: string
    setEditorHtml: React.Dispatch<React.SetStateAction<string>>

    initializeFromExternalValue: (externalValue: string) => string
    updateEditorState: (rootEl: HTMLElement | null) => void

    applySuggestionValueSyntax: (suggestion: InputSuggestion) => void

    handlePaste: (event: React.ClipboardEvent<HTMLDivElement>) => void
    handleChange: (event: ContentEditableEvent) => void

    handleKeyDownCapture: (event: React.KeyboardEvent<HTMLDivElement>) => void
    handleKeyDown: (event: React.KeyboardEvent<HTMLDivElement>) => boolean
}

/**
 * =========================
 * Constants / helpers (DOM)
 * =========================
 */
const TOKEN_CLASS = "input__token"
const TOKEN_SELECTED_CLASS = "input__token--selected"
const TOKEN_ATTR = "title"

const ZWSP = "\u200B"
const stripZwsp = (s: string) => (s ?? "").split(ZWSP).join("")
const isZwspTextNode = (n: Node | null) => !!n && n.nodeType === Node.TEXT_NODE && (n.textContent ?? "") === ZWSP

const safeStringify = (value: any) => {
    try {
        return JSON.stringify(value)
    } catch {
        return JSON.stringify({value: String(value ?? "")})
    }
}

const safeParse = (raw: string | null) => {
    if (!raw) return null
    try {
        return JSON.parse(raw)
    } catch {
        return null
    }
}

const normalizeTokenValue = (value: any) => {
    if (value === undefined || value === null) return ""
    if (typeof value === "string") return value
    return safeStringify(value)
}

const normalizeEmptyRoot = (rootEl: HTMLElement) => {
    const html = (rootEl.innerHTML ?? "").trim().toLowerCase()
    if (html === "<br>" || html === "<br/>" || html === "<br />") rootEl.innerHTML = ""
    if (rootEl.childNodes.length === 1 && (rootEl.childNodes[0] as any)?.tagName === "BR") rootEl.innerHTML = ""
}

const isTokenElement = (node: Node): node is HTMLElement => {
    return node instanceof HTMLElement && node.classList.contains(TOKEN_CLASS)
}

const isWithinTokenElement = (node: Node): boolean => {
    let current: Node | null = node
    while (current) {
        if (isTokenElement(current)) return true
        current = current.parentNode
    }
    return false
}

/**
 * IMPORTANT:
 * Token data must NOT contain visuals (children etc.)
 * Visuals are rendered ONLY through transformSyntax (segment.content).
 */
const serializeTokenData = (token: any) => {
    if (token && typeof token === "object") {
        const {children, __contentHtml, ...rest} = token as any
        return rest
    }
    return {value: token}
}

const getTokenDataFromElement = (el: HTMLElement): any => {
    const parsed = safeParse(el.getAttribute(TOKEN_ATTR))
    return parsed ?? {value: el.textContent ?? ""}
}

const createTokenElement = (token: any, contentHtml?: string) => {
    const element = document.createElement("span")
    element.setAttribute("contenteditable", "false")
    element.className = TOKEN_CLASS

    const tokenData = serializeTokenData(token)
    element.setAttribute(TOKEN_ATTR, safeStringify(tokenData))

    if (contentHtml !== undefined) {
        element.innerHTML = contentHtml
    } else {
        const label = tokenData?.label ?? tokenData?.value ?? ""
        element.textContent = String(label ?? "")
    }

    element.style.display = "inline-flex"
    element.style.alignItems = "center"
    element.style.verticalAlign = "middle"
    element.style.userSelect = "text"
    // @ts-ignore
    element.style.webkitUserSelect = "text"

    return element
}

const ensureEditorRange = (rootEl: HTMLElement): Range => {
    const sel = window.getSelection()
    if (sel && sel.rangeCount > 0) {
        const r = sel.getRangeAt(0)
        if (rootEl.contains(r.startContainer)) return r
    }

    const r = document.createRange()
    r.selectNodeContents(rootEl)
    r.collapse(false)

    const s = window.getSelection()
    s?.removeAllRanges()
    s?.addRange(r)
    return r
}

const insertTextAtCaret = (rootEl: HTMLElement | null, text: string) => {
    if (!rootEl) return

    const selection = window.getSelection()
    if (!selection || selection.rangeCount === 0) return

    const range = selection.getRangeAt(0)
    if (!rootEl.contains(range.startContainer)) return

    range.deleteContents()
    const textNode = document.createTextNode(text)
    range.insertNode(textNode)

    const nextRange = document.createRange()
    nextRange.setStartAfter(textNode)
    nextRange.collapse(true)

    selection.removeAllRanges()
    selection.addRange(nextRange)
}

export const serializeEditorParts = (rootEl: HTMLElement | null): EditorPart[] => {
    if (!rootEl) return [""]

    const parts: EditorPart[] = []

    const collect = (node: Node) => {
        if (node.nodeType === Node.TEXT_NODE) {
            const text = stripZwsp(node.textContent ?? "")
            if (text.length) parts.push(text)
            return
        }

        if (node.nodeType !== Node.ELEMENT_NODE) return

        const element = node as HTMLElement

        if (isTokenElement(element)) {
            parts.push(getTokenDataFromElement(element))
            return
        }

        Array.from(node.childNodes).forEach(collect)
    }

    Array.from(rootEl.childNodes).forEach(collect)

    if (!parts.length) return [""]

    return parts.reduce<EditorPart[]>((acc, part) => {
        if (typeof part === "string" && typeof acc[acc.length - 1] === "string") {
            acc[acc.length - 1] = `${acc[acc.length - 1]}${part}`
        } else {
            acc.push(part)
        }
        return acc
    }, [])
}

const partsToTextValue = (parts: EditorPart[]) => {
    return parts
        .map((part) => {
            if (typeof part === "string") return part
            const tokenValue = (part as any)?.value ?? part
            return normalizeTokenValue(tokenValue)
        })
        .join("")
}

const buildSuggestionTokenData = (suggestion: InputSuggestion) => {
    const {children, __contentHtml, ...rest} = suggestion as any
    return rest
}

const getLastTokenBeforeCaret = (rootEl: HTMLElement | null): LastTokenMatch | null => {
    if (!rootEl) return null

    const selection = window.getSelection()
    if (!selection || selection.rangeCount === 0) return null

    const range = selection.getRangeAt(0)
    if (!rootEl.contains(range.startContainer)) return null

    const caretContainer = range.startContainer
    const caretOffset = range.startOffset

    let stopNode: ChildNode | null = null
    if (caretContainer.nodeType === Node.ELEMENT_NODE) {
        const container = caretContainer as Element
        stopNode = container.childNodes[caretOffset] ?? null
    }

    const walker = document.createTreeWalker(
        rootEl,
        NodeFilter.SHOW_ELEMENT | NodeFilter.SHOW_TEXT,
        {
            acceptNode: (node) => {
                if (node.nodeType === Node.TEXT_NODE) {
                    if (isWithinTokenElement(node)) return NodeFilter.FILTER_REJECT
                    if ((node.textContent ?? "") === ZWSP) return NodeFilter.FILTER_REJECT
                    return NodeFilter.FILTER_ACCEPT
                }
                if (node.nodeType === Node.ELEMENT_NODE) {
                    if (isTokenElement(node)) return NodeFilter.FILTER_ACCEPT
                }
                return NodeFilter.FILTER_SKIP
            },
        },
    )

    let lastMatch: LastTokenMatch | null = null
    let current: Node | null = walker.nextNode()

    while (current) {
        if (stopNode && current === stopNode) break

        if (current === caretContainer && current.nodeType === Node.TEXT_NODE) {
            const raw = current.textContent?.slice(0, caretOffset) ?? ""
            const text = stripZwsp(raw)
            const matches = [...text.matchAll(/\S+/g)]
            const last = matches[matches.length - 1]
            if (last && last.index !== undefined) {
                const wordStart = last.index
                const wordEnd = wordStart + last[0].length
                const tokenRange = document.createRange()
                tokenRange.setStart(current, Math.min(wordStart, raw.length))
                tokenRange.setEnd(current, Math.min(wordEnd, raw.length))
                lastMatch = {token: last[0], range: tokenRange}
            }
            break
        }

        if (isTokenElement(current)) {
            lastMatch = null
            current = walker.nextNode()
            continue
        }

        if (current.nodeType === Node.TEXT_NODE) {
            const raw = current.textContent ?? ""
            const text = stripZwsp(raw)
            const matches = [...text.matchAll(/\S+/g)]
            const last = matches[matches.length - 1]
            if (last && last.index !== undefined) {
                const wordStart = last.index
                const wordEnd = wordStart + last[0].length
                const tokenRange = document.createRange()
                tokenRange.setStart(current, Math.min(wordStart, raw.length))
                tokenRange.setEnd(current, Math.min(wordEnd, raw.length))
                lastMatch = {token: last[0], range: tokenRange}
            }
        }

        current = walker.nextNode()
    }

    return lastMatch
}

/**
 * ✅ FIX (caret after deleting last token):
 * Selection can have startContainer = ELEMENT_NODE with an offset (i.e. “between childNodes”).
 */
const getSelectionOffsetsInValue = (rootEl: HTMLElement): {start: number; end: number} | null => {
    const sel = window.getSelection()
    if (!sel || sel.rangeCount === 0) return null

    const range = sel.getRangeAt(0)
    if (!rootEl.contains(range.startContainer) || !rootEl.contains(range.endContainer)) return null

    const nodeValueLength = (node: Node): number => {
        if (node.nodeType === Node.TEXT_NODE) return stripZwsp(node.textContent ?? "").length
        if (node.nodeType === Node.ELEMENT_NODE) {
            const el = node as HTMLElement
            if (isTokenElement(el)) {
                const data = getTokenDataFromElement(el)
                return String(data?.value ?? "").length
            }
            let sum = 0
            Array.from(node.childNodes).forEach((c) => (sum += nodeValueLength(c)))
            return sum
        }
        return 0
    }

    const toOffset = (container: Node, offset: number) => {
        let total = 0

        const walk = (node: Node): boolean => {
            if (node === container) {
                if (node.nodeType === Node.TEXT_NODE) {
                    total += stripZwsp(node.textContent ?? "").slice(0, offset).length
                    return true
                }

                if (node.nodeType === Node.ELEMENT_NODE) {
                    const kids = Array.from(node.childNodes)
                    const clamped = Math.max(0, Math.min(offset, kids.length))
                    for (let i = 0; i < clamped; i++) total += nodeValueLength(kids[i])
                    return true
                }

                return true
            }

            if (node.nodeType === Node.TEXT_NODE) {
                total += stripZwsp(node.textContent ?? "").length
                return false
            }

            if (node.nodeType === Node.ELEMENT_NODE) {
                const el = node as HTMLElement
                if (isTokenElement(el)) {
                    const data = getTokenDataFromElement(el)
                    total += String(data?.value ?? "").length
                    return false
                }
                for (const child of Array.from(node.childNodes)) {
                    const done = walk(child)
                    if (done) return true
                }
            }
            return false
        }

        walk(rootEl)
        return total
    }

    const start = toOffset(range.startContainer, range.startOffset)
    const end = toOffset(range.endContainer, range.endOffset)
    return {start: Math.min(start, end), end: Math.max(start, end)}
}

const setSelectionOffsetsInValue = (rootEl: HTMLElement, start: number, end: number) => {
    const clamp = (n: number) => Math.max(0, n)
    const sOff = clamp(start)
    const eOff = clamp(end)

    const locate = (targetOffset: number): {node: Node; offset: number} => {
        let remaining = targetOffset

        const walk = (node: Node): {node: Node; offset: number} | null => {
            if (node.nodeType === Node.TEXT_NODE) {
                const raw = node.textContent ?? ""
                const len = stripZwsp(raw).length
                if (remaining <= len) return {node, offset: Math.min(remaining, raw.length)}
                remaining -= len
                return null
            }

            if (node.nodeType === Node.ELEMENT_NODE) {
                const el = node as HTMLElement

                if (isTokenElement(el)) {
                    const data = getTokenDataFromElement(el)
                    const tokenLen = String(data?.value ?? "").length
                    const parent = el.parentNode ?? rootEl
                    const idx = Array.from(parent.childNodes).indexOf(el)

                    if (remaining <= 0) return {node: parent, offset: idx}
                    if (remaining < tokenLen) return {node: parent, offset: idx + 1}

                    remaining -= tokenLen
                    return null
                }

                for (const child of Array.from(node.childNodes)) {
                    const res = walk(child)
                    if (res) return res
                }
            }

            return null
        }

        return walk(rootEl) ?? {node: rootEl, offset: rootEl.childNodes.length}
    }

    const startPos = locate(sOff)
    const endPos = locate(eOff)

    const sel = window.getSelection()
    if (!sel) return

    const r = document.createRange()
    try {
        r.setStart(startPos.node, startPos.offset)
        r.setEnd(endPos.node, endPos.offset)
    } catch {
        r.selectNodeContents(rootEl)
        r.collapse(false)
    }

    sel.removeAllRanges()
    sel.addRange(r)
}

/**
 * ✅ Native selection across contenteditable=false tokens
 */
const selectionModify = (root: HTMLElement, alter: "move" | "extend", dir: "left" | "right") => {
    const sel = window.getSelection() as any
    if (!sel || typeof sel.modify !== "function") return false
    if (!root.contains(sel.focusNode as any) || !root.contains(sel.anchorNode as any)) return false

    const direction = dir === "right" ? "forward" : "backward"

    try {
        sel.modify(alter, direction, "character")
        if (isZwspTextNode(sel.focusNode)) sel.modify(alter, direction, "character")
        return true
    } catch {
        return false
    }
}

/**
 * ✅ Delete/Backspace around tokens (ZWSP anchors make this flaky otherwise)
 */
const getRangeInRoot = (root: HTMLElement): Range | null => {
    const sel = window.getSelection()
    if (!sel || sel.rangeCount === 0) return null
    const r = sel.getRangeAt(0)
    if (!root.contains(r.startContainer) || !root.contains(r.endContainer)) return null
    return r
}

const childIndex = (node: Node) => {
    const p = node.parentNode
    if (!p) return -1
    return Array.from(p.childNodes).indexOf(node as ChildNode)
}

const boundaryInParent = (range: Range): {parent: Node; index: number} | null => {
    const container = range.startContainer
    const offset = range.startOffset

    if (container.nodeType === Node.ELEMENT_NODE) return {parent: container, index: offset}

    if (container.nodeType === Node.TEXT_NODE) {
        const textNode = container as Text
        const raw = textNode.textContent ?? ""
        const idx = childIndex(textNode)
        if (idx < 0 || !textNode.parentNode) return null

        if (raw === ZWSP) return {parent: textNode.parentNode, index: idx + (offset > 0 ? 1 : 0)}
        if (offset === 0) return {parent: textNode.parentNode, index: idx}
        if (offset === raw.length) return {parent: textNode.parentNode, index: idx + 1}
        return null
    }

    return null
}

const setCaretAt = (node: Node, offset: number) => {
    const sel = window.getSelection()
    if (!sel) return
    const r = document.createRange()
    r.setStart(node, offset)
    r.collapse(true)
    sel.removeAllRanges()
    sel.addRange(r)
}

const removeZwspNeighbors = (parent: Node, tokenIndex: number) => {
    const before = parent.childNodes[tokenIndex - 1]
    if (before && isZwspTextNode(before)) parent.removeChild(before)

    const idxNow = Math.max(0, Math.min(tokenIndex, parent.childNodes.length - 1))
    const afterNow = parent.childNodes[idxNow + 1]
    if (afterNow && isZwspTextNode(afterNow)) parent.removeChild(afterNow)
}

const tryDeleteAdjacentToken = (root: HTMLElement, mode: "backspace" | "delete") => {
    const range = getRangeInRoot(root)
    if (!range || !range.collapsed) return false

    const b = boundaryInParent(range)
    if (!b) return false

    const parent = b.parent
    const children = parent.childNodes

    const skipZwspBackward = (i: number) => {
        let j = i
        while (j > 0 && isZwspTextNode(children[j - 1])) j--
        return j
    }

    const skipZwspForward = (i: number) => {
        let j = i
        while (j < children.length && isZwspTextNode(children[j])) j++
        return j
    }

    if (mode === "backspace") {
        const idx = skipZwspBackward(b.index)
        const prev = idx > 0 ? children[idx - 1] : null
        if (prev && isTokenElement(prev)) {
            const tokenIndex = idx - 1
            parent.removeChild(prev)
            removeZwspNeighbors(parent, tokenIndex)
            setCaretAt(parent, Math.max(0, Math.min(tokenIndex, parent.childNodes.length)))
            return true
        }
        return false
    }

    const idx = skipZwspForward(b.index)
    const next = children[idx] ?? null
    if (next && isTokenElement(next)) {
        const tokenIndex = idx
        parent.removeChild(next)
        removeZwspNeighbors(parent, tokenIndex)
        setCaretAt(parent, Math.max(0, Math.min(tokenIndex, parent.childNodes.length)))
        return true
    }

    return false
}

const updateTokenSelectionVisual = (root: HTMLElement) => {
    root.querySelectorAll(`.${TOKEN_CLASS}`).forEach((el) => el.classList.remove(TOKEN_SELECTED_CLASS))

    const sel = window.getSelection()
    if (!sel || sel.rangeCount === 0) return
    const range = sel.getRangeAt(0)

    if (!root.contains(range.startContainer) || !root.contains(range.endContainer)) return

    root.querySelectorAll(`.${TOKEN_CLASS}`).forEach((node) => {
        try {
            if (range.intersectsNode(node)) (node as HTMLElement).classList.add(TOKEN_SELECTED_CLASS)
        } catch {
            // ignore
        }
    })
}

const renderEditorFromSegments = (
    rootEl: HTMLElement,
    value: string,
    segments: InputSyntaxSegment[] | undefined | null,
    appliedParts: EditorPart[],
) => {
    normalizeEmptyRoot(rootEl)

    const safeSegments = (segments ?? [])
        .filter(Boolean)
        .filter(
            (s: any) =>
                s &&
                (s.type === "text" || s.type === "block") &&
                Number.isFinite(s.start) &&
                Number.isFinite(s.end) &&
                s.start <= s.end,
        ) as InputSyntaxSegment[]

    const resolved = safeSegments.length ? safeSegments : buildDefaultSyntax(value)

    const tokenQueue = appliedParts.filter((p) => typeof p !== "string")
    const frag = document.createDocumentFragment()

    const appendZwspOnce = () => {
        const last = frag.lastChild
        if (last?.nodeType === Node.TEXT_NODE && (last.textContent ?? "") === ZWSP) return
        frag.appendChild(document.createTextNode(ZWSP))
    }

    resolved.forEach((seg: any) => {
        if (!seg || !seg.type) return

        if (seg.type === "text") {
            const text = typeof seg.content === "string" ? seg.content : value.slice(seg.start, seg.end)
            if (text?.length) frag.appendChild(document.createTextNode(text))
            return
        }

        const raw = value.slice(seg.start, seg.end)

        let tokenData: any | undefined
        if (tokenQueue.length) {
            const next = tokenQueue[0]
            const nextValue = normalizeTokenValue((next as any)?.value ?? next)
            if (!raw || nextValue === raw) {
                tokenData = next
                tokenQueue.shift()
            }
        }
        if (!tokenData) tokenData = {value: raw}

        const contentHtml =
            seg.content && typeof seg.content !== "string"
                ? renderToStaticMarkup(<>{seg.content}</>)
                : undefined

        appendZwspOnce()
        frag.appendChild(createTokenElement(tokenData, contentHtml))
        appendZwspOnce()
    })

    rootEl.innerHTML = ""
    rootEl.appendChild(frag)
    normalizeEmptyRoot(rootEl)
}

/**
 * =========================
 * Hook
 * =========================
 */
export const useContentEditableController = (
    props: UseContentEditableControllerProps,
): UseContentEditableControllerReturn => {
    const {editorRef, transformSyntax, filterSuggestionsByLastToken = false, onLastTokenChange, onStateChange} = props

    const [editorHtml, setEditorHtml] = React.useState<string>("")

    const updateEditorState = React.useCallback(
        (rootEl: HTMLElement | null) => {
            if (!rootEl) return

            normalizeEmptyRoot(rootEl)

            const savedSel = getSelectionOffsetsInValue(rootEl)

            const parts = serializeEditorParts(rootEl)
            const nextValue = partsToTextValue(parts)
            const tokens = parts.filter((p) => typeof p !== "string") as InputSuggestion[]

            if (filterSuggestionsByLastToken) {
                onLastTokenChange?.(getLastTokenBeforeCaret(rootEl)?.token ?? null)
            }

            if (transformSyntax) {
                const segments = transformSyntax(nextValue as any, parts)
                renderEditorFromSegments(rootEl, nextValue, segments, parts)
            }

            if (savedSel) setSelectionOffsetsInValue(rootEl, savedSel.start, savedSel.end)
            else ensureEditorRange(rootEl)

            updateTokenSelectionVisual(rootEl)

            const nextHtml = rootEl.innerHTML ?? ""

            // 🔥 critical: keep ContentEditable "html" in sync with DOM
            setEditorHtml((prev) => (prev === nextHtml ? prev : nextHtml))

            onStateChange?.({value: nextValue, tokens})
        },
        [filterSuggestionsByLastToken, onLastTokenChange, onStateChange, transformSyntax],
    )

    const initializeFromExternalValue = React.useCallback(
        (externalValue: string) => {
            const tmp = document.createElement("div")
            const parts: EditorPart[] = []
            const segments = transformSyntax ? transformSyntax(externalValue as any, parts) : null
            renderEditorFromSegments(tmp, externalValue, segments, parts)
            const html = tmp.innerHTML ?? ""
            setEditorHtml(html)
            return html
        },
        [transformSyntax],
    )

    const applySuggestionValueSyntax = React.useCallback(
        (suggestion: InputSuggestion) => {
            const root = editorRef.current
            if (!root) return

            normalizeEmptyRoot(root)
            root.focus({preventScroll: true})

            const insertMode = suggestion.insertMode ?? "replace"

            const resolveInsertionRange = (): Range => {
                const r = document.createRange()
                switch (insertMode) {
                    case "append":
                        r.selectNodeContents(root)
                        r.collapse(false)
                        return r
                    case "prepend":
                        r.selectNodeContents(root)
                        r.collapse(true)
                        return r
                    case "replace":
                        r.selectNodeContents(root)
                        return r
                    case "insert":
                    default:
                        return ensureEditorRange(root)
                }
            }

            const range = resolveInsertionRange()
            const tokenData = buildSuggestionTokenData(suggestion)

            if (filterSuggestionsByLastToken && insertMode !== "replace") {
                const match = getLastTokenBeforeCaret(root)
                if (match) match.range.deleteContents()
                else range.deleteContents()
            } else {
                range.deleteContents()
            }

            const tokenEl = createTokenElement(tokenData)

            // insert: [ZWSP][TOKEN][ZWSP]
            const beforeZwsp = document.createTextNode(ZWSP)
            const afterZwsp = document.createTextNode(ZWSP)

            range.insertNode(beforeZwsp)
            range.insertNode(tokenEl)
            tokenEl.parentNode?.insertBefore(afterZwsp, tokenEl.nextSibling ?? null)

            // caret behind token (after trailing ZWSP)
            const sel = window.getSelection()
            const r = document.createRange()
            try {
                r.setStart(afterZwsp, 1)
            } catch {
                r.setStartAfter(tokenEl)
            }
            r.collapse(true)
            sel?.removeAllRanges()
            sel?.addRange(r)

            updateEditorState(root)
        },
        [editorRef, filterSuggestionsByLastToken, updateEditorState],
    )

    const handlePaste = React.useCallback(
        (event: React.ClipboardEvent<HTMLDivElement>) => {
            event.preventDefault()
            const text = event.clipboardData.getData("text/plain")
            insertTextAtCaret(editorRef.current, text)
            updateEditorState(editorRef.current)
        },
        [editorRef, updateEditorState],
    )

    const handleChange = React.useCallback(
        (_event: ContentEditableEvent) => {
            // IMPORTANT: we always derive from DOM, not from event.target.value/html
            updateEditorState(editorRef.current)
        },
        [editorRef, updateEditorState],
    )

    const handleKeyDownCapture = React.useCallback((event: React.KeyboardEvent<HTMLDivElement>) => {
        if (event.key === " " || event.code === "Space") {
            event.stopPropagation()
            // @ts-ignore
            event.nativeEvent?.stopImmediatePropagation?.()
        }
    }, [])

    const handleKeyDown = React.useCallback(
        (event: React.KeyboardEvent<HTMLDivElement>) => {
            const root = editorRef.current
            if (!root) return false
            if (document.activeElement !== root) return false

            // Token deletion
            if (event.key === "Backspace" || event.key === "Delete") {
                const removed = tryDeleteAdjacentToken(root, event.key === "Backspace" ? "backspace" : "delete")
                if (removed) {
                    event.preventDefault()
                    event.stopPropagation()
                    updateEditorState(root)
                    return true
                }
            }

            // Arrow selection / movement across tokens
            if (event.key === "ArrowLeft" || event.key === "ArrowRight") {
                const dir = event.key === "ArrowLeft" ? "left" : "right"
                const ok = selectionModify(root, event.shiftKey ? "extend" : "move", dir)
                if (ok) {
                    event.preventDefault()
                    event.stopPropagation()
                    updateTokenSelectionVisual(root)
                    return true
                }
            }

            // Prevent newline in syntax mode
            if (event.key === "Enter") {
                event.preventDefault()
                return true
            }

            return false
        },
        [editorRef, updateEditorState],
    )

    return {
        editorHtml,
        setEditorHtml,
        initializeFromExternalValue,
        updateEditorState,
        applySuggestionValueSyntax,
        handlePaste,
        handleChange,
        handleKeyDownCapture,
        handleKeyDown,
    }
}
