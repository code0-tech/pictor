/**
 * Input.tsx
 *
 * A highly customizable and accessible input component with extended features,
 * including dynamic suggestion rendering, validation handling, and structural
 * decoration options. Designed to integrate seamlessly with complex forms,
 * this component provides robust interaction patterns and user guidance.
 */

import React, {ForwardRefExoticComponent, LegacyRef, RefObject, useEffect, useMemo, useRef, useState} from "react"

import {Code0Component} from "../../utils"
import {ValidationProps} from "./useForm"
import {mergeCode0Props} from "../../utils"

import "./Input.style.scss"

import {InputLabel} from "./InputLabel"
import {InputDescription} from "./InputDescription"
import {InputMessage} from "./InputMessage"

import {Menu, MenuPortal, MenuTrigger} from "../menu/Menu"
import {
    InputSuggestion,
    InputSuggestionMenuContent,
    InputSuggestionMenuContentItems,
    InputSuggestionMenuContentItemsHandle
} from "./InputSuggestion"

// Programmatically set a property (like 'value') and dispatch an event (like 'change')
export const setElementKey = (
    element: HTMLElement,
    key: string,
    value: any,
    event: string
) => {
    const valueSetter = Object.getOwnPropertyDescriptor(element, key)?.set // Try direct setter
    const prototype = Object.getPrototypeOf(element)
    const prototypeValueSetter = Object.getOwnPropertyDescriptor(prototype, key)?.set // Fallback to prototype

    if (valueSetter && valueSetter !== prototypeValueSetter) {
        prototypeValueSetter?.call(element, value) // Use prototype's setter if overridden
    } else {
        valueSetter?.call(element, value) // Use direct setter
    }

    element.dispatchEvent(new Event(event, {bubbles: true})) // Fire change/input event
}

// Base input props without layout-specific keys
export type Code0Input = Omit<
    Omit<Omit<Code0Component<HTMLInputElement>, "left">, "right">,
    "title"
>

// Input component props definition
export type InputSyntaxSegment = {
    type: "text" | "block"
    start: number
    end: number
    visualLength: number
    content?: string | React.ReactNode
}

type VisualizedInputSyntaxSegment = InputSyntaxSegment & {
    visualStart: number
    visualEnd: number
}

export interface InputProps<T> extends Code0Input, ValidationProps<T> {

    suggestions?: InputSuggestion[] // Optional suggestions shown in dropdown
    suggestionsHeader?: React.ReactNode // Custom header above suggestions
    suggestionsFooter?: React.ReactNode // Custom footer below suggestions
    onSuggestionSelect?: (suggestion: InputSuggestion) => void // Callback when a suggestion is selected
    transformSyntax?: (value: T) => InputSyntaxSegment[] // Build a structured syntax model
    disableOnValue?: (value: T) => boolean

    wrapperComponent?: Code0Component<HTMLDivElement> // Props for the wrapping div
    right?: React.ReactNode // Right-side icon or element
    left?: React.ReactNode // Left-side icon or element
    leftType?: "action" | "placeholder" | "icon" // Visual type for left slot
    rightType?: "action" | "placeholder" | "icon" // Visual type for right slot
    title?: React.ReactNode // Input label
    description?: React.ReactNode // Label description below title

}

export const Input: ForwardRefExoticComponent<InputProps<any>> = React.forwardRef(
    (props: InputProps<any>, ref: RefObject<HTMLInputElement>) => {
        const inputRef = ref || useRef<HTMLInputElement>(null) // External ref or fallback internal ref
        const menuRef = useRef<InputSuggestionMenuContentItemsHandle | null>(null) // Ref to suggestion list
        const syntaxRef = useRef<HTMLDivElement | null>(null) // Ref to syntax overlay
        const [open, setOpen] = useState(false) // Dropdown open state
        const shouldPreventCloseRef = useRef(true) // Controls if dropdown should stay open on click
        const [value, setValue] = useState<any>(props.defaultValue || props.initialValue || props.placeholder)
        const [visualSelectionRange, setVisualSelectionRange] = useState<{start: number, end: number} | null>(null)
        const [visualCaretIndex, setVisualCaretIndex] = useState<number | null>(null)
        const [isFocused, setIsFocused] = useState(false)

        const {
            wrapperComponent = {}, // Default empty wrapper props
            title, // Optional input label
            description, // Optional description below label
            disabled = false, // Input disabled state
            left, // Left element (icon/button)
            right, // Right element (icon/button)
            leftType = "icon", // Visual hint for left
            rightType = "action", // Visual hint for right
            formValidation = {valid: true, notValidMessage: null, setValue: null}, // Validation config
            suggestions, // Optional suggestions array
            suggestionsHeader, // Optional header above suggestion list
            suggestionsFooter, // Optional footer below suggestion list
            onSuggestionSelect, // Callback for suggestion selection,
            disableOnValue = () => false,
            ...rest // Remaining native input props
        } = props

        // Sync input value changes to external validation state
        useEffect(() => {
            const el = inputRef.current
            if (!el || !formValidation?.setValue) return

            const handleChange = (event: any) => {
                const value = rest.type !== "checkbox" ? event.target.value : event.target.checked // Support checkbox
                formValidation.setValue?.(value) // Push value to form context
            }

            el.addEventListener("change", handleChange) // Native listener
            return () => el.removeEventListener("change", handleChange) // Cleanup
        }, [formValidation?.setValue])

        // Manage click-outside logic for dropdown
        useEffect(() => {
            if (!suggestions) return

            const handlePointerDown = (event: PointerEvent) => {
                const target = event.target as Node
                const insideInput = !!inputRef.current?.contains(target)
                const insideSyntax = !!syntaxRef.current?.contains(target)

                shouldPreventCloseRef.current = insideInput || insideSyntax // Stay open if click is inside
            }

            document.addEventListener("pointerdown", handlePointerDown, true)
            return () => document.removeEventListener("pointerdown", handlePointerDown, true)
        }, [suggestions])

        const disabledOnValue = React.useMemo(() => disableOnValue(value), [value, disableOnValue])

        useEffect(() => {
            if (!inputRef.current) return
            inputRef.current.addEventListener("change", (e: any) => {
                if (disabledOnValue) return
                setValue(e.target.value)
            })
            inputRef.current.addEventListener("input", (e: any) => {
                if (disabledOnValue) return
                setValue(e.target.value)
            })
        }, [inputRef, disabledOnValue])


        const focusInputCaretAtEnd = React.useCallback(() => {
            setTimeout(() => {
                const target = inputRef.current
                if (!target) return

                target.focus({preventScroll: true})
                const caretPosition = target.value.length

                try {
                    target.setSelectionRange(caretPosition, caretPosition)
                } catch {
                    // Some input types (e.g., number) don't support selection ranges
                }

                target.scrollLeft = target.scrollWidth
            }, 0)
        }, [inputRef])


        const applySuggestionValue = React.useCallback((suggestion: InputSuggestion) => {
            if (!inputRef.current) return

            const suggestionValue = typeof value == "object" ? JSON.stringify(suggestion.value) : suggestion.value
            const insertMode = suggestion.insertMode ?? "replace"

            const nextValue = insertMode === "append"
                ? `${inputRef.current.value ?? ""}${suggestionValue ?? ""}`
                : suggestionValue

            setElementKey(
                inputRef.current,
                "value",
                nextValue,
                "change",
            )

            focusInputCaretAtEnd()
        }, [focusInputCaretAtEnd, inputRef, value])


        const buildDefaultSyntax = React.useCallback((): InputSyntaxSegment[] => {
            const rawValue = value ?? ""
            const textValue = typeof rawValue === "string" ? rawValue : String(rawValue)

            return [{
                type: "text",
                start: 0,
                end: textValue.length,
                visualLength: textValue.length,
                content: textValue,
            }]
        }, [value])

        const syntaxSegments = React.useMemo(() => {
            if (props.transformSyntax) {
                const segments = props.transformSyntax(value)
                if (segments?.length) return segments
            }

            return buildDefaultSyntax()
        }, [buildDefaultSyntax, props.transformSyntax, value])

        const visualizedSyntaxSegments = React.useMemo((): VisualizedInputSyntaxSegment[] => {
            let visualStart = 0

            return syntaxSegments.map((segment) => {
                const nextSegment: VisualizedInputSyntaxSegment = {
                    ...segment,
                    visualStart,
                    visualEnd: visualStart + segment.visualLength,
                }

                visualStart = nextSegment.visualEnd

                return nextSegment
            })
        }, [syntaxSegments])

        const totalVisualLength = React.useMemo(() => {
            const lastSegment = visualizedSyntaxSegments[visualizedSyntaxSegments.length - 1]
            return lastSegment ? lastSegment.visualEnd : 0
        }, [visualizedSyntaxSegments])

        const ensureVisualIndexVisible = React.useCallback((visualIndex: number | null) => {
            if (visualIndex === null) return
            if (!inputRef.current || !syntaxRef.current) return

            const syntaxElement = syntaxRef.current
            const roundedIndex = Math.round(visualIndex)

            const caretElement = syntaxElement.querySelector<HTMLElement>(`[data-visual-index="${roundedIndex}"]`)

            let offsetStart: number | null = null
            let offsetEnd: number | null = null

            if (caretElement) {
                offsetStart = caretElement.offsetLeft
                offsetEnd = caretElement.offsetLeft + caretElement.offsetWidth
            } else {
                const segments = Array.from(
                    syntaxElement.querySelectorAll<HTMLElement>("[data-visual-start][data-visual-end]")
                )

                const matchingSegment = segments.find((segment) => {
                    const segmentStart = Number(segment.dataset.visualStart)
                    const segmentEnd = Number(segment.dataset.visualEnd)

                    return Number.isFinite(segmentStart)
                        && Number.isFinite(segmentEnd)
                        && roundedIndex >= segmentStart
                        && roundedIndex <= segmentEnd
                })

                if (matchingSegment) {
                    const segmentStart = Number(matchingSegment.dataset.visualStart) || 0
                    const segmentEnd = Number(matchingSegment.dataset.visualEnd) || segmentStart
                    const segmentWidth = matchingSegment.offsetWidth
                    const ratio = segmentEnd === segmentStart
                        ? 0
                        : (roundedIndex - segmentStart) / (segmentEnd - segmentStart)

                    offsetStart = matchingSegment.offsetLeft + segmentWidth * ratio
                    offsetEnd = offsetStart
                }
            }

            if (offsetStart === null || offsetEnd === null) return

            const viewStart = syntaxElement.scrollLeft
            const viewEnd = viewStart + syntaxElement.clientWidth
            const padding = 8

            let nextScrollLeft = viewStart

            if (offsetStart - padding < viewStart) {
                nextScrollLeft = Math.max(offsetStart - padding, 0)
            } else if (offsetEnd + padding > viewEnd) {
                nextScrollLeft = Math.max(offsetEnd + padding - syntaxElement.clientWidth, 0)
            }

            if (nextScrollLeft === viewStart) return

            inputRef.current.scrollLeft = nextScrollLeft
            syntaxElement.scrollLeft = nextScrollLeft
        }, [inputRef, syntaxRef])

        const syncSyntaxScroll = React.useCallback(() => {
            if (!inputRef.current || !syntaxRef.current) return

            syntaxRef.current.scrollLeft = inputRef.current.scrollLeft
        }, [inputRef, syntaxRef])

        const mapVisualIndexToRawIndex = React.useCallback((visualIndex: number): number => {
            const segment = visualizedSyntaxSegments.find((item) => visualIndex >= item.visualStart && visualIndex <= item.visualEnd)
            if (!segment) {
                const inputLength = inputRef.current?.value.length ?? 0
                return Math.max(0, Math.min(visualIndex, inputLength))
            }

            const rawLength = segment.end - segment.start
            const clampedVisual = Math.min(Math.max(visualIndex - segment.visualStart, 0), segment.visualLength)

            if (rawLength <= 0) return segment.start
            if (segment.type === "text") {
                return Math.min(segment.start + Math.round(clampedVisual), segment.end)
            }

            if (segment.visualLength <= 0) return segment.start

            const ratio = clampedVisual / segment.visualLength
            return Math.round(segment.start + ratio * rawLength)
        }, [inputRef, visualizedSyntaxSegments])

        const mapRawIndexToVisualIndex = React.useCallback((rawIndex: number): number => {
            const segment = visualizedSyntaxSegments.find((item) => rawIndex >= item.start && rawIndex <= item.end)

            if (!segment) {
                const inputLength = inputRef.current?.value.length ?? 0
                return Math.max(0, Math.min(rawIndex, inputLength))
            }

            const rawLength = segment.end - segment.start
            const clampedRaw = Math.min(Math.max(rawIndex - segment.start, 0), rawLength)

            if (rawLength <= 0) return segment.visualStart
            if (segment.type === "text") {
                return Math.min(segment.visualStart + clampedRaw, segment.visualEnd)
            }

            if (segment.visualLength <= 0) return segment.visualStart

            const ratio = clampedRaw / rawLength
            return Math.min(segment.visualStart + ratio * segment.visualLength, segment.visualEnd)
        }, [inputRef, visualizedSyntaxSegments])

        const resolvedVisualSelectionRange = React.useMemo(() => {
            if (!props.transformSyntax) return null

            const target = inputRef.current
            if (!target) return visualSelectionRange

            const selectionStart = target.selectionStart ?? 0
            const selectionEnd = target.selectionEnd ?? selectionStart

            const rawStart = Math.min(selectionStart, selectionEnd)
            const rawEnd = Math.max(selectionStart, selectionEnd)

            if (rawStart === rawEnd) return null

            let visualStart = mapRawIndexToVisualIndex(rawStart)
            let visualEnd = mapRawIndexToVisualIndex(rawEnd)

            visualizedSyntaxSegments.forEach((segment) => {
                if (segment.type !== "block") return

                const overlaps = rawStart < segment.end && rawEnd > segment.start
                if (!overlaps) return

                visualStart = Math.min(visualStart, segment.visualStart)
                visualEnd = Math.max(visualEnd, segment.visualEnd)
            })

            const clampedStart = Math.min(visualStart, visualEnd)
            const clampedEnd = Math.max(visualStart, visualEnd)

            return {start: clampedStart, end: clampedEnd}
        }, [inputRef, mapRawIndexToVisualIndex, props.transformSyntax, visualSelectionRange, visualizedSyntaxSegments])

        const updateVisualSelectionRange = React.useCallback(() => {
            if (!props.transformSyntax) return

            const target = inputRef.current
            if (!target) return

            const selectionStart = target.selectionStart ?? 0
            const selectionEnd = target.selectionEnd ?? selectionStart

            const rawStart = Math.min(selectionStart, selectionEnd)
            const rawEnd = Math.max(selectionStart, selectionEnd)

            const blockAtCaret = visualizedSyntaxSegments.find((segment) => {
                if (segment.type !== "block") return false
                return rawStart > segment.start && rawStart < segment.end
            })

            if (blockAtCaret && rawStart === rawEnd) {
                const distanceToStart = rawStart - blockAtCaret.start
                const distanceToEnd = blockAtCaret.end - rawStart
                const snapRawIndex = distanceToStart <= distanceToEnd ? blockAtCaret.start : blockAtCaret.end

                try {
                    target.setSelectionRange(snapRawIndex, snapRawIndex)
                } catch {
                    // Some input types (e.g., number) don't support selection ranges
                }

                const caretVisualIndex = snapRawIndex === blockAtCaret.start
                    ? blockAtCaret.visualStart
                    : blockAtCaret.visualEnd

                setVisualSelectionRange(null)
                setVisualCaretIndex(caretVisualIndex)
                requestAnimationFrame(() => {
                    syncSyntaxScroll()
                    ensureVisualIndexVisible(caretVisualIndex)
                })
                return
            }

            if (rawStart === rawEnd) {
                const caretVisualIndex = Math.round(mapRawIndexToVisualIndex(rawStart))

                setVisualSelectionRange(null)
                setVisualCaretIndex(Number.isFinite(caretVisualIndex) ? caretVisualIndex : null)
                requestAnimationFrame(() => {
                    syncSyntaxScroll()
                    ensureVisualIndexVisible(caretVisualIndex)
                })
                return
            }

            let visualStart = mapRawIndexToVisualIndex(rawStart)
            let visualEnd = mapRawIndexToVisualIndex(rawEnd)

            visualizedSyntaxSegments.forEach((segment) => {
                if (segment.type !== "block") return

                const overlaps = rawStart < segment.end && rawEnd > segment.start
                if (!overlaps) return

                visualStart = Math.min(visualStart, segment.visualStart)
                visualEnd = Math.max(visualEnd, segment.visualEnd)
            })

            const clampedStart = Math.min(visualStart, visualEnd)
            const clampedEnd = Math.max(visualStart, visualEnd)

            setVisualCaretIndex(null)
            setVisualSelectionRange({
                start: clampedStart,
                end: clampedEnd,
            })
            const selectionDirection = target.selectionDirection === "backward" ? "backward" : "forward"
            const activeBoundary = selectionDirection === "backward" ? clampedStart : clampedEnd

            requestAnimationFrame(() => {
                syncSyntaxScroll()
                ensureVisualIndexVisible(activeBoundary)
            })
        }, [ensureVisualIndexVisible, inputRef, mapRawIndexToVisualIndex, props.transformSyntax, syncSyntaxScroll, visualizedSyntaxSegments])

        const selectionAnchorRef = useRef<number | null>(null)

        const resolveRawIndexFromElement = React.useCallback((element: HTMLElement | null): number | null => {
            if (!element) return null

            const rawIndexAttr = element.dataset.rawIndex
            const visualIndexAttr = element.dataset.visualIndex || element.dataset.visualStart || element.dataset.visualEnd

            const rawIndexFromData = rawIndexAttr ? Number(rawIndexAttr) : undefined
            const visualIndexFromData = visualIndexAttr ? Number(visualIndexAttr) : undefined

            if (!Number.isNaN(rawIndexFromData as number) && rawIndexFromData !== undefined) {
                return rawIndexFromData
            }

            if (visualIndexFromData !== undefined) {
                return mapVisualIndexToRawIndex(visualIndexFromData)
            }

            return null
        }, [mapVisualIndexToRawIndex])

        const resolveRawIndexFromPointerEvent = React.useCallback((event: React.PointerEvent<HTMLDivElement>) => {
            const element = document.elementFromPoint(event.clientX, event.clientY) as HTMLElement | null
            return resolveRawIndexFromElement(element ?? (event.target as HTMLElement | null))
        }, [resolveRawIndexFromElement])

        const handleSyntaxPointerDown = React.useCallback((event: React.PointerEvent<HTMLDivElement>) => {
            if (!inputRef.current) return

            const mappedRawIndex = resolveRawIndexFromPointerEvent(event)

            if (mappedRawIndex === null || Number.isNaN(mappedRawIndex)) return

            event.preventDefault()
            shouldPreventCloseRef.current = true

            const clampedIndex = Math.min(Math.max(mappedRawIndex, 0), inputRef.current.value.length)
            const anchorIndex = event.shiftKey
                ? (inputRef.current.selectionStart ?? clampedIndex)
                : clampedIndex

            selectionAnchorRef.current = anchorIndex

            inputRef.current.focus({preventScroll: true})
            try {
                inputRef.current.setSelectionRange(anchorIndex, clampedIndex)
            } catch {
                // Some input types (e.g., number) don't support selection ranges
            }

            syntaxRef.current?.setPointerCapture(event.pointerId)
            updateVisualSelectionRange()
        }, [inputRef, resolveRawIndexFromPointerEvent, updateVisualSelectionRange])

        const handleSyntaxPointerMove = React.useCallback((event: React.PointerEvent<HTMLDivElement>) => {
            if (!inputRef.current) return
            if (selectionAnchorRef.current === null) return
            if (!(event.buttons & 1)) {
                selectionAnchorRef.current = null
                return
            }

            const mappedRawIndex = resolveRawIndexFromPointerEvent(event)
            if (mappedRawIndex === null || Number.isNaN(mappedRawIndex)) return

            event.preventDefault()
            const anchorIndex = selectionAnchorRef.current
            const clampedIndex = Math.min(Math.max(mappedRawIndex, 0), inputRef.current.value.length)

            inputRef.current.focus({preventScroll: true})
            try {
                inputRef.current.setSelectionRange(anchorIndex, clampedIndex)
            } catch {
                // Some input types (e.g., number) don't support selection ranges
            }

            updateVisualSelectionRange()
        }, [inputRef, resolveRawIndexFromPointerEvent, updateVisualSelectionRange])

        const handleSyntaxPointerUp = React.useCallback(() => {
            selectionAnchorRef.current = null
        }, [])

        const handleAtomicDeletion = React.useCallback((event: React.KeyboardEvent<HTMLInputElement>): boolean => {
            if (!props.transformSyntax) return false

            const target = event.target as HTMLInputElement
            const selectionStart = target.selectionStart ?? 0
            const selectionEnd = target.selectionEnd ?? selectionStart
            const rawStart = Math.min(selectionStart, selectionEnd)
            const rawEnd = Math.max(selectionStart, selectionEnd)

            const removeRange = (start: number, end: number) => {
                if (start === end) return false

                event.preventDefault()
                const nextValue = `${target.value.slice(0, start)}${target.value.slice(end)}`

                setElementKey(target, "value", nextValue, "input")

                requestAnimationFrame(() => {
                    try {
                        target.setSelectionRange(start, start)
                    } catch {
                        // Some input types (e.g., number) don't support selection ranges
                    }

                    updateVisualSelectionRange()
                })

                return true
            }

            if (rawStart !== rawEnd) {
                let adjustedStart = rawStart
                let adjustedEnd = rawEnd
                let hasBlockOverlap = false

                visualizedSyntaxSegments.forEach((segment) => {
                    if (segment.type !== "block") return

                    const overlaps = rawStart < segment.end && rawEnd > segment.start
                    if (!overlaps) return

                    adjustedStart = Math.min(adjustedStart, segment.start)
                    adjustedEnd = Math.max(adjustedEnd, segment.end)
                    hasBlockOverlap = true
                })

                if (!hasBlockOverlap) return false

                return removeRange(adjustedStart, adjustedEnd)
            }

            const blockBeforeCaret = visualizedSyntaxSegments.find((segment) => {
                if (segment.type !== "block") return false
                return rawStart === segment.end || (rawStart > segment.start && rawStart < segment.end)
            })

            if (event.key === "Backspace" && blockBeforeCaret) {
                return removeRange(blockBeforeCaret.start, blockBeforeCaret.end)
            }

            const blockAfterCaret = visualizedSyntaxSegments.find((segment) => {
                if (segment.type !== "block") return false
                return rawStart === segment.start || (rawStart > segment.start && rawStart < segment.end)
            })

            if (event.key === "Delete" && blockAfterCaret) {
                return removeRange(blockAfterCaret.start, blockAfterCaret.end)
            }

            return false
        }, [props.transformSyntax, updateVisualSelectionRange, visualizedSyntaxSegments])

        const handleKeyDown = React.useCallback((event: React.KeyboardEvent<HTMLInputElement>) => {
            if (props.transformSyntax && (event.key === "ArrowLeft" || event.key === "ArrowRight")) {
                const target = event.target as HTMLInputElement
                const selectionStart = target.selectionStart ?? 0
                const selectionEnd = target.selectionEnd ?? selectionStart
                const selectionDirection = target.selectionDirection === "backward" ? "backward" : "forward"
                const visualDelta = event.key === "ArrowLeft" ? -1 : 1

                if (!event.shiftKey) {
                    selectionAnchorRef.current = null
                    const collapsePosition = event.key === "ArrowLeft"
                        ? Math.min(selectionStart, selectionEnd)
                        : Math.max(selectionStart, selectionEnd)

                    const currentVisualIndex = Math.round(mapRawIndexToVisualIndex(collapsePosition))
                    const nextVisualIndex = Math.max(0, Math.min(currentVisualIndex + visualDelta, totalVisualLength))
                    const nextRawIndex = mapVisualIndexToRawIndex(nextVisualIndex)

                    if (!Number.isNaN(nextRawIndex)) {
                        event.preventDefault()
                        const clampedIndex = Math.min(Math.max(Math.round(nextRawIndex), 0), target.value.length)

                        try {
                            target.setSelectionRange(clampedIndex, clampedIndex)
                        } catch {
                            // Some input types (e.g., number) don't support selection ranges
                        }

                        requestAnimationFrame(() => {
                            syncSyntaxScroll()
                            updateVisualSelectionRange()
                        })
                    }
                } else {
                    const anchorRawIndex = selectionAnchorRef.current ?? (
                        selectionDirection === "backward" ? selectionEnd : selectionStart
                    )
                    selectionAnchorRef.current = anchorRawIndex
                    const activeRawIndex = anchorRawIndex === selectionStart ? selectionEnd : selectionStart
                    const currentVisualIndex = Math.round(mapRawIndexToVisualIndex(activeRawIndex))
                    const nextVisualIndex = Math.max(0, Math.min(currentVisualIndex + visualDelta, totalVisualLength))
                    const nextRawIndex = mapVisualIndexToRawIndex(nextVisualIndex)

                    if (!Number.isNaN(nextRawIndex)) {
                        event.preventDefault()
                        const clampedIndex = Math.min(Math.max(Math.round(nextRawIndex), 0), target.value.length)
                        const nextDirection = clampedIndex < anchorRawIndex ? "backward" : "forward"
                        const rangeStart = Math.min(anchorRawIndex, clampedIndex)
                        const rangeEnd = Math.max(anchorRawIndex, clampedIndex)

                        try {
                            target.setSelectionRange(rangeStart, rangeEnd, nextDirection)
                        } catch {
                            // Some input types (e.g., number) don't support selection ranges
                        }

                        requestAnimationFrame(() => {
                            syncSyntaxScroll()
                            updateVisualSelectionRange()
                        })
                    }
                }

                if (event.defaultPrevented) return
            }

            if (props.transformSyntax && (event.key === "Backspace" || event.key === "Delete")) {
                const handled = handleAtomicDeletion(event)
                if (handled) return
            }

            if (!suggestions) return

            if (event.key === "ArrowDown") {
                event.preventDefault()
                const wasOpen = open
                setOpen(true)
                if (!wasOpen) {
                    setTimeout(() => menuRef.current?.focusFirstItem(), 0) // Open and preselect first item
                } else {
                    menuRef.current?.highlightNextItem() // Navigate down while keeping input focus
                }
            } else if (event.key === "ArrowUp") {
                event.preventDefault()
                const wasOpen = open
                setOpen(true)
                if (!wasOpen) {
                    setTimeout(() => menuRef.current?.focusLastItem(), 0) // Open and preselect last item
                } else {
                    menuRef.current?.highlightPreviousItem() // Navigate up while keeping input focus
                }
            } else if (event.key === "Enter" && open) {
                const selected = menuRef.current?.selectActiveItem()
                if (selected) {
                    setOpen(false)
                    focusInputCaretAtEnd()
                }
            }
        }, [focusInputCaretAtEnd, handleAtomicDeletion, mapRawIndexToVisualIndex, mapVisualIndexToRawIndex, open, props.transformSyntax, syncSyntaxScroll, suggestions, totalVisualLength, updateVisualSelectionRange])

        const handleFocus = React.useCallback(() => {
            setIsFocused(true)
            requestAnimationFrame(() => {
                updateVisualSelectionRange()
                syncSyntaxScroll()
            })

            if (suggestions && !open) {
                setOpen(true)
            }
        }, [open, suggestions, syncSyntaxScroll, updateVisualSelectionRange])

        const handleBlur = React.useCallback(() => {
            setIsFocused(false)
            setVisualCaretIndex(null)
            setVisualSelectionRange(null)
        }, [])

        useEffect(() => {
            const target = inputRef.current
            if (!target || !props.transformSyntax) return

            const syncSelection = () => requestAnimationFrame(updateVisualSelectionRange)

            syncSelection()

            const events = ["select", "keyup", "mouseup", "input", "keydown"]
            events.forEach((event) => target.addEventListener(event, syncSelection))

            return () => {
                events.forEach((event) => target.removeEventListener(event, syncSelection))
            }
        }, [inputRef, props.transformSyntax, updateVisualSelectionRange])

        useEffect(() => {
            if (!props.transformSyntax) return

            const handleSelectionChange = () => {
                if (document.activeElement !== inputRef.current) return
                updateVisualSelectionRange()
            }

            document.addEventListener("selectionchange", handleSelectionChange)
            return () => document.removeEventListener("selectionchange", handleSelectionChange)
        }, [inputRef, props.transformSyntax, updateVisualSelectionRange])

        useEffect(() => {
            const target = inputRef.current
            if (!target) return

            const handleScroll = () => syncSyntaxScroll()
            handleScroll()

            target.addEventListener("scroll", handleScroll)
            return () => target.removeEventListener("scroll", handleScroll)
        }, [inputRef, syncSyntaxScroll])

        useEffect(() => {
            syncSyntaxScroll()
        }, [syncSyntaxScroll, value, visualCaretIndex, visualSelectionRange])

        useEffect(() => {
            if (props.transformSyntax) return

            setVisualSelectionRange(null)
            setVisualCaretIndex(null)
        }, [props.transformSyntax])

        const renderSyntaxSegments = React.useCallback((segments: VisualizedInputSyntaxSegment[]) => {
            let caretRendered = false

            const isVisualRangeSelected = (visualStart: number, visualEnd: number) => {
                if (!resolvedVisualSelectionRange) return false

                return resolvedVisualSelectionRange.start < visualEnd && resolvedVisualSelectionRange.end > visualStart
            }

            const shouldRenderCaret = (visualIndex: number) => {
                if (!isFocused) return false
                if (resolvedVisualSelectionRange) return false
                if (visualCaretIndex === null) return false

                if (caretRendered) return false

                const matches = Math.round(visualCaretIndex) === Math.round(visualIndex)

                if (matches) {
                    caretRendered = true
                }

                return matches
            }

            const renderCaret = (visualIndex: number) => (
                <span
                    key={`caret-${visualIndex}`}
                    className="input__syntax-caret"
                    data-visual-index={visualIndex}
                    aria-hidden
                />
            )

            return segments.map((segment, index) => {
                const key = `${segment.start}-${segment.end}-${index}`

                const content = typeof segment.content === "string"
                    ? segment.content
                    : segment.content ?? null

                const className = [
                    segment.type === "block" ? "input__syntax-block" : "input__syntax-text",
                    segment.type === "block" && isVisualRangeSelected(segment.visualStart, segment.visualEnd)
                        ? "input__syntax-block--selected"
                        : "",
                ].filter(Boolean).join(" ")

                const commonDataAttributes = {
                    "data-visual-start": segment.visualStart,
                    "data-visual-end": segment.visualEnd,
                    "data-visual-length": segment.visualLength,
                    "data-raw-start": segment.start,
                    "data-raw-end": segment.end,
                }

                if (typeof content === "string" && segment.type === "text") {
                    const children: React.ReactNode[] = []

                    content.split("").forEach((char, charIndex) => {
                        const visualIndex = segment.visualStart + charIndex
                        const rawIndex = segment.start + charIndex
                        const isSelected = isVisualRangeSelected(visualIndex, visualIndex + 1)

                        if (shouldRenderCaret(visualIndex)) {
                            children.push(renderCaret(visualIndex))
                        }

                        children.push(
                            <span
                                key={`${key}-${charIndex}`}
                                className={[
                                    "input__syntax-char",
                                    isSelected ? "input__syntax-char--selected" : "",
                                ].filter(Boolean).join(" ")}
                                data-visual-index={visualIndex}
                                data-raw-index={rawIndex}
                            >
                                {char}
                            </span>
                        )
                    })

                    if (shouldRenderCaret(segment.visualEnd)) {
                        children.push(renderCaret(segment.visualEnd))
                    }

                    return (
                        <span key={key} className={className} {...commonDataAttributes}>
                            {children}
                        </span>
                    )
                }

                return (
                    <span key={key} className={className} {...commonDataAttributes}>
                        {shouldRenderCaret(segment.visualStart) && renderCaret(segment.visualStart)}
                        {content}
                        {shouldRenderCaret(segment.visualEnd) && renderCaret(segment.visualEnd)}
                    </span>
                )
            })
        }, [isFocused, resolvedVisualSelectionRange, visualCaretIndex])

        const syntax = React.useMemo(() => {
            if (props.transformSyntax) {
                return (
                    <div
                        className={"input__syntax"}
                        ref={syntaxRef}
                        onPointerDown={handleSyntaxPointerDown}
                        onPointerMove={handleSyntaxPointerMove}
                        onPointerUp={handleSyntaxPointerUp}
                    >
                        {renderSyntaxSegments(visualizedSyntaxSegments)}
                    </div>
                )
            }

            return null
        }, [handleSyntaxPointerDown, props.transformSyntax, renderSyntaxSegments, visualizedSyntaxSegments])

        // Render suggestion menu dropdown
        const suggestionMenu = useMemo(() => (
            <Menu
                open={open} // Controlled open state
                modal={false}
                onOpenChange={(nextOpen) => {
                    if (!nextOpen && shouldPreventCloseRef.current) { // Prevent close if internal click
                        shouldPreventCloseRef.current = false
                        return
                    }

                    setOpen(nextOpen)

                    if (nextOpen) {
                        setTimeout(() => inputRef.current?.focus(), 0) // Refocus input on open
                    }
                }}
            >
                <MenuTrigger asChild>
                    <input
                        ref={inputRef as LegacyRef<HTMLInputElement>} // Cast for TS compatibility
                        {...mergeCode0Props(`input__control ${props.transformSyntax ? "input__control--syntax" : ""}`, rest)}
                        onFocus={handleFocus} // Open on focus
                        onBlur={handleBlur}
                        onKeyDown={handleKeyDown}
                        spellCheck={false}
                        disabled={disabled || disabledOnValue}
                    />
                </MenuTrigger>
                <MenuPortal>
                    <InputSuggestionMenuContent inputRef={inputRef}>
                        {suggestionsHeader} {/* Custom content above suggestions */}
                        <InputSuggestionMenuContentItems
                            /* @ts-ignore */
                            ref={menuRef} // Handle keyboard focus control
                            inputRef={inputRef}
                            suggestions={suggestions}
                            onSuggestionSelect={(suggestion) => {
                                if (!onSuggestionSelect) {
                                    applySuggestionValue(suggestion)
                                }
                                onSuggestionSelect?.(suggestion)
                                setOpen(false)
                                focusInputCaretAtEnd()
                            }}
                        />
                        {suggestionsFooter} {/* Custom content below suggestions */}
                    </InputSuggestionMenuContent>
                </MenuPortal>
            </Menu>
        ), [applySuggestionValue, focusInputCaretAtEnd, handleKeyDown, onSuggestionSelect, open, suggestions, suggestionsFooter, suggestionsHeader, value])

        return (
            <>
                {title && <InputLabel>{title}</InputLabel>} {/* Optional label */}
                {description && <InputDescription>{description}</InputDescription>} {/* Optional description */}

                <div
                    {...mergeCode0Props(
                        `input ${!formValidation?.valid ? "input--not-valid" : ""}`, // Add error class if invalid
                        wrapperComponent
                    )}
                >
                    {left && <div className={`input__left input__left--${leftType}`}>{left}</div>} {/* Left element */}

                    {suggestions ? (
                        suggestionMenu // If suggestions exist, render dropdown version
                    ) : (
                        <input
                            tabIndex={2} // Ensure keyboard tab order
                            ref={inputRef as LegacyRef<HTMLInputElement>}
                            disabled={disabled}
                            onFocus={handleFocus}
                            onBlur={handleBlur}
                            onKeyDown={handleKeyDown}
                            {...mergeCode0Props(`input__control ${props.transformSyntax ? "input__control--syntax" : ""}`, rest)} // Basic input styling and props
                        />
                    )}

                    {syntax}

                    {right &&
                        <div className={`input__right input__right--${rightType}`}>{right}</div>} {/* Right element */}
                </div>

                {!formValidation?.valid && formValidation?.notValidMessage && (
                    <InputMessage>{formValidation.notValidMessage}</InputMessage> // Show validation error
                )}
            </>
        )
    }
)