/**
 * Input.tsx
 *
 * A highly customizable and accessible input component with extended features,
 * including dynamic suggestion rendering, validation handling, and structural
 * decoration options. Designed to integrate seamlessly with complex forms,
 * this component provides robust interaction patterns and user guidance.
 */

import React, {LegacyRef, RefObject, useEffect, useMemo, useRef, useState} from "react"

import {Code0Component, mergeCode0Props} from "../../utils"
import {ValidationProps} from "./useForm"

import "./Input.style.scss"

import {InputLabel} from "./InputLabel"
import {InputDescription} from "./InputDescription"
import {InputMessage} from "./InputMessage"

import {Menu, MenuPortal, MenuTrigger} from "../menu/Menu"
import {
    InputSuggestion,
    InputSuggestionMenuContent,
    InputSuggestionMenuContentItems,
    InputSuggestionMenuContentItemsHandle,
} from "./InputSuggestion"
import {InputSyntax, ResolvedVisualSelectionRange} from "./InputSyntax"
import {InputSyntaxSegment, useSyntaxModel} from "./Input.syntax.hook"
import {useSelectionNormalization, useSelectionResolution, useSelectionVisibility} from "./Input.selection.hook"
import {getSelectionMetrics, setElementKey, setSelectionRangeSafe} from "./Input.utils"

export type Code0Input = Omit<
    Omit<Omit<Code0Component<HTMLInputElement>, "left">, "right">,
    "title"
>

export interface InputProps<T> extends Code0Input, ValidationProps<T> {

    suggestions?: InputSuggestion[]
    suggestionsHeader?: React.ReactNode
    suggestionsFooter?: React.ReactNode
    onSuggestionSelect?: (suggestion: InputSuggestion) => void
    transformSyntax?: (value: T, activeSuggestions?: InputSuggestion[]) => InputSyntaxSegment[]
    validationUsesSuggestions?: boolean
    disableOnValue?: (value: T) => boolean

    wrapperComponent?: Code0Component<HTMLDivElement>
    right?: React.ReactNode
    left?: React.ReactNode
    leftType?: "action" | "placeholder" | "icon"
    rightType?: "action" | "placeholder" | "icon"
    title?: React.ReactNode
    description?: React.ReactNode

}

type ActiveSuggestionSpan = {
    id: number
    suggestion: InputSuggestion
    text: string
    start: number
    end: number
}

const InputComponent = React.forwardRef<HTMLInputElement, InputProps<any>>(
    (props: InputProps<any>, ref: RefObject<HTMLInputElement>) => {
        const {
            wrapperComponent = {},
            title,
            description,
            disabled = false,
            left,
            right,
            leftType = "icon",
            rightType = "action",
            formValidation = {valid: true, notValidMessage: null, setValue: null},
            suggestions,
            suggestionsHeader,
            suggestionsFooter,
            onSuggestionSelect,
            disableOnValue = () => false,
            transformSyntax,
            validationUsesSuggestions = false,
            ...rest
        } = props

        const inputRef = ref || useRef<HTMLInputElement>(null)
        const menuRef = useRef<InputSuggestionMenuContentItemsHandle | null>(null)
        const syntaxRef = useRef<HTMLDivElement>(null)
        const shouldPreventCloseRef = useRef(true)
        const selectionAnchorRef = useRef<number | null>(null)
        const suggestionIdRef = useRef(0)
        const activeSuggestionsRef = useRef<InputSuggestion[]>([])

        const [open, setOpen] = useState(false)
        const [value, setValue] = useState<any>(props.defaultValue || props.initialValue || props.placeholder)
        const [activeSuggestionSpans, setActiveSuggestionSpans] = useState<ActiveSuggestionSpan[]>([])
        const [activeSuggestions, setActiveSuggestions] = useState<InputSuggestion[]>([])
        const [visualSelectionRange, setVisualSelectionRange] = useState<{ start: number, end: number } | null>(null)
        const [visualCaretIndex, setVisualCaretIndex] = useState<number | null>(null)
        const [isFocused, setIsFocused] = useState(false)

        const disabledOnValue = React.useMemo(() => disableOnValue(value), [value, disableOnValue])

        const normalizeTextValue = React.useCallback((rawValue: any): string => {
            const normalized = rawValue ?? ""
            return typeof normalized === "string" ? normalized : String(normalized)
        }, [])

        const findClosestOccurrence = React.useCallback((text: string, targetIndex: number, currentValue: string): number | null => {
            if (text.length === 0) return targetIndex <= currentValue.length ? targetIndex : null

            let closestIndex = currentValue.indexOf(text)
            if (closestIndex === -1) return null

            let searchIndex = closestIndex
            while (searchIndex !== -1) {
                if (Math.abs(searchIndex - targetIndex) < Math.abs(closestIndex - targetIndex)) {
                    closestIndex = searchIndex
                }
                searchIndex = currentValue.indexOf(text, searchIndex + 1)
            }

            return closestIndex
        }, [])

        const reconcileSuggestionSpans = React.useCallback((spans: ActiveSuggestionSpan[], currentValue: string) => {
            const nextSpans: ActiveSuggestionSpan[] = []

            spans.forEach((span) => {
                const nextStart = findClosestOccurrence(span.text, span.start, currentValue)
                if (nextStart === null) return

                const nextEnd = nextStart + span.text.length
                const candidateSlice = currentValue.slice(nextStart, nextEnd)

                if (candidateSlice !== span.text) return

                nextSpans.push({...span, start: nextStart, end: nextEnd})
            })

            return nextSpans
        }, [findClosestOccurrence])

        useEffect(() => {
            activeSuggestionsRef.current = activeSuggestions
        }, [activeSuggestions])

        useEffect(() => {
            const el = inputRef.current
            if (!el || !formValidation?.setValue) return

            const handleChange = (event: any) => {
                const nextValue = rest.type !== "checkbox" ? event.target.value : event.target.checked
                const validationValue = validationUsesSuggestions ? activeSuggestionsRef.current : nextValue
                formValidation.setValue?.(validationValue)
            }

            el.addEventListener("change", handleChange)
            return () => el.removeEventListener("change", handleChange)
        }, [formValidation?.setValue, inputRef, rest.type, validationUsesSuggestions])

        useEffect(() => {
            if (!suggestions) return

            const handlePointerDown = (event: PointerEvent) => {
                const target = event.target as Node
                const insideInput = !!inputRef.current?.contains(target)
                const insideSyntax = !!syntaxRef.current?.contains(target)

                shouldPreventCloseRef.current = insideInput || insideSyntax
            }

            document.addEventListener("pointerdown", handlePointerDown, true)
            return () => document.removeEventListener("pointerdown", handlePointerDown, true)
        }, [inputRef, suggestions])

        useEffect(() => {
            const target = inputRef.current
            if (!target) return

            const syncValue = (e: any) => {
                if (disabledOnValue) return
                setValue(e.target.value)
            }

            target.addEventListener("change", syncValue)
            target.addEventListener("input", syncValue)

            return () => {
                target.removeEventListener("change", syncValue)
                target.removeEventListener("input", syncValue)
            }
        }, [disabledOnValue, inputRef])

        useEffect(() => {
            const currentValue = normalizeTextValue(inputRef.current?.value ?? value)

            setActiveSuggestionSpans((prev) => {
                const nextSpans = reconcileSuggestionSpans(prev, currentValue)
                setActiveSuggestions(nextSpans.map((item) => item.suggestion))
                return nextSpans
            })
        }, [normalizeTextValue, reconcileSuggestionSpans, value])

        useEffect(() => {
            if (!formValidation?.setValue) return

            const currentValue = rest.type !== "checkbox"
                ? normalizeTextValue(inputRef.current?.value ?? value)
                : value

            const validationValue = validationUsesSuggestions
                ? activeSuggestions
                : currentValue

            formValidation.setValue(validationValue)
        }, [activeSuggestions, formValidation?.setValue, inputRef, normalizeTextValue, rest.type, validationUsesSuggestions, value])

        const focusInputCaretAtEnd = React.useCallback(() => {
            setTimeout(() => {
                const target = inputRef.current
                if (!target) return

                target.focus({preventScroll: true})
                const caretPosition = target.value.length

                setSelectionRangeSafe(target, caretPosition, caretPosition)

                target.scrollLeft = target.scrollWidth
            }, 0)
        }, [inputRef])

        const transformSyntaxWithSuggestions = React.useMemo(() => {
            if (!transformSyntax) return undefined

            return (nextValue: any, nextActiveSuggestions: InputSuggestion[] = activeSuggestions) =>
                transformSyntax(nextValue, nextActiveSuggestions)
        }, [activeSuggestions, transformSyntax])

        const {
            visualizedSyntaxSegments,
            expandSelectionRangeToBlockBoundaries,
            mapVisualIndexToRawIndex,
            mapRawIndexToVisualIndex,
            totalVisualLength,
        } = useSyntaxModel(value, transformSyntaxWithSuggestions, inputRef)

        const {ensureVisualIndexVisible, syncSyntaxScroll} = useSelectionVisibility(inputRef, syntaxRef)

        const normalizeSelectionForAtomicBlocks = useSelectionNormalization(
            transformSyntaxWithSuggestions,
            expandSelectionRangeToBlockBoundaries,
        )

        const updateVisualSelectionRange = React.useCallback(() => {
            if (!transformSyntaxWithSuggestions) return

            const target = inputRef.current
            if (!target) return

            const {rawStart, rawEnd} = getSelectionMetrics(target)

            const blockAtCaret = visualizedSyntaxSegments.find((segment) => {
                if (segment.type !== "block") return false
                return rawStart > segment.start && rawStart < segment.end
            })

            if (blockAtCaret && rawStart === rawEnd) {
                const distanceToStart = rawStart - blockAtCaret.start
                const distanceToEnd = blockAtCaret.end - rawStart
                const snapRawIndex = distanceToStart <= distanceToEnd ? blockAtCaret.start : blockAtCaret.end

                setSelectionRangeSafe(target, snapRawIndex, snapRawIndex)

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
        }, [ensureVisualIndexVisible, inputRef, mapRawIndexToVisualIndex, syncSyntaxScroll, transformSyntaxWithSuggestions, visualizedSyntaxSegments])

        const resolvedVisualSelectionRange: ResolvedVisualSelectionRange = useSelectionResolution(
            transformSyntaxWithSuggestions,
            inputRef,
            visualSelectionRange,
            visualizedSyntaxSegments,
            mapRawIndexToVisualIndex,
        )

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
            const {selectionStart} = getSelectionMetrics(inputRef.current)
            const anchorIndex = event.shiftKey
                ? (Number.isFinite(selectionStart) ? selectionStart : clampedIndex)
                : clampedIndex

            selectionAnchorRef.current = anchorIndex

            inputRef.current.focus({preventScroll: true})
            setSelectionRangeSafe(inputRef.current, anchorIndex, clampedIndex)

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
            setSelectionRangeSafe(inputRef.current, anchorIndex, clampedIndex)

            updateVisualSelectionRange()
        }, [inputRef, resolveRawIndexFromPointerEvent, updateVisualSelectionRange])

        const handleSyntaxPointerUp = React.useCallback(() => {
            selectionAnchorRef.current = null
        }, [])

        const handleAtomicDeletion = React.useCallback((event: React.KeyboardEvent<HTMLInputElement>): boolean => {
            if (!transformSyntaxWithSuggestions) return false

            const target = event.target as HTMLInputElement
            const {rawStart, rawEnd} = getSelectionMetrics(target)

            const removeRange = (start: number, end: number) => {
                if (start === end) return false

                event.preventDefault()
                const nextValue = `${target.value.slice(0, start)}${target.value.slice(end)}`

                setElementKey(target, "value", nextValue, "input")

                requestAnimationFrame(() => {
                    setSelectionRangeSafe(target, start, start)

                    updateVisualSelectionRange()
                })

                return true
            }

            if (rawStart !== rawEnd) {
                const {start, end, hasBlockOverlap} = expandSelectionRangeToBlockBoundaries(rawStart, rawEnd)

                if (!hasBlockOverlap) return false

                return removeRange(start, end)
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
        }, [expandSelectionRangeToBlockBoundaries, transformSyntaxWithSuggestions, updateVisualSelectionRange, visualizedSyntaxSegments])

        const handleKeyDown = React.useCallback((event: React.KeyboardEvent<HTMLInputElement>) => {
            if (transformSyntaxWithSuggestions) {
                normalizeSelectionForAtomicBlocks(event.target as HTMLInputElement)
            }

            if (transformSyntaxWithSuggestions && (event.key === "ArrowLeft" || event.key === "ArrowRight")) {
                const target = event.target as HTMLInputElement
                const {selectionStart, selectionEnd, rawStart, rawEnd, direction} = getSelectionMetrics(target)
                const visualDelta = event.key === "ArrowLeft" ? -1 : 1

                if (!event.shiftKey) {
                    selectionAnchorRef.current = null
                    const collapsePosition = event.key === "ArrowLeft" ? rawStart : rawEnd

                    const currentVisualIndex = Math.round(mapRawIndexToVisualIndex(collapsePosition))
                    const nextVisualIndex = Math.max(0, Math.min(currentVisualIndex + visualDelta, totalVisualLength))
                    const nextRawIndex = mapVisualIndexToRawIndex(nextVisualIndex)

                    if (!Number.isNaN(nextRawIndex)) {
                        event.preventDefault()
                        const clampedIndex = Math.min(Math.max(Math.round(nextRawIndex), 0), target.value.length)

                        setSelectionRangeSafe(target, clampedIndex, clampedIndex)

                        requestAnimationFrame(() => {
                            syncSyntaxScroll()
                            updateVisualSelectionRange()
                        })
                    }
                } else {
                    const anchorRawIndex = selectionAnchorRef.current ?? (direction === "backward" ? selectionEnd : selectionStart)
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

                        setSelectionRangeSafe(target, rangeStart, rangeEnd, nextDirection)

                        requestAnimationFrame(() => {
                            syncSyntaxScroll()
                            updateVisualSelectionRange()
                        })
                    }
                }

                if (event.defaultPrevented) return
            }

            if (transformSyntaxWithSuggestions && (event.key === "Backspace" || event.key === "Delete")) {
                const handled = handleAtomicDeletion(event)
                if (handled) return
            }

            if (!suggestions) return

            if (event.key === "ArrowDown") {
                event.preventDefault()
                const wasOpen = open
                setOpen(true)
                if (!wasOpen) {
                    setTimeout(() => menuRef.current?.focusFirstItem(), 0)
                } else {
                    menuRef.current?.highlightNextItem()
                }
            } else if (event.key === "ArrowUp") {
                event.preventDefault()
                const wasOpen = open
                setOpen(true)
                if (!wasOpen) {
                    setTimeout(() => menuRef.current?.focusLastItem(), 0)
                } else {
                    menuRef.current?.highlightPreviousItem()
                }
            } else if (event.key === "Enter" && open) {
                const selected = menuRef.current?.selectActiveItem()
                if (selected) {
                    setOpen(false)
                }
            }
        }, [handleAtomicDeletion, mapRawIndexToVisualIndex, mapVisualIndexToRawIndex, normalizeSelectionForAtomicBlocks, open, suggestions, syncSyntaxScroll, totalVisualLength, transformSyntaxWithSuggestions, updateVisualSelectionRange])

        const handleKeyDownCapture = React.useCallback((event: React.KeyboardEvent<HTMLInputElement>) => {
            if (event.key === " " || event.code === "Space") {
                event.stopPropagation()
                // Prevent DropdownMenuTrigger from intercepting space after the first insert
                // while preserving the default input behavior of adding whitespace.
                // @ts-ignore -- nativeEvent may not exist in synthetic typing but is present at runtime
                event.nativeEvent?.stopImmediatePropagation?.()
            }
        }, [])

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
            if (!target || !transformSyntaxWithSuggestions) return

            const syncSelection = () => requestAnimationFrame(updateVisualSelectionRange)

            syncSelection()

            const events = ["select", "keyup", "mouseup", "input", "keydown"]
            events.forEach((event) => target.addEventListener(event, syncSelection))

            return () => {
                events.forEach((event) => target.removeEventListener(event, syncSelection))
            }
        }, [inputRef, transformSyntaxWithSuggestions, updateVisualSelectionRange])

        useEffect(() => {
            if (!transformSyntaxWithSuggestions) return

            const handleSelectionChange = () => {
                if (document.activeElement !== inputRef.current) return
                updateVisualSelectionRange()
            }

            document.addEventListener("selectionchange", handleSelectionChange)
            return () => document.removeEventListener("selectionchange", handleSelectionChange)
        }, [inputRef, transformSyntaxWithSuggestions, updateVisualSelectionRange])

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
            if (transformSyntaxWithSuggestions) return

            setVisualSelectionRange(null)
            setVisualCaretIndex(null)
        }, [transformSyntaxWithSuggestions])

        const applySuggestionValue = React.useCallback((suggestion: InputSuggestion) => {
            if (!inputRef.current) return

            const suggestionRaw = typeof value == "object" ? JSON.stringify(suggestion.value) : suggestion.value
            const suggestionValue = suggestionRaw === undefined || suggestionRaw === null ? "" : String(suggestionRaw)
            const insertMode = suggestion.insertMode ?? "replace"
            const currentValue = inputRef.current.value ?? ""

            let nextValue = currentValue
            let nextCaretPosition: number | null = null
            let insertionStart = 0

            switch (insertMode) {
                case "append": {
                    nextValue = `${currentValue}${suggestionValue}`
                    nextCaretPosition = nextValue.length
                    insertionStart = currentValue.length
                    break
                }
                case "prepend": {
                    nextValue = `${suggestionValue}${currentValue}`
                    nextCaretPosition = suggestionValue.length
                    insertionStart = 0
                    break
                }
                case "insert": {
                    const {rawStart, rawEnd} = getSelectionMetrics(inputRef.current)
                    const {start, end} = transformSyntaxWithSuggestions
                        ? expandSelectionRangeToBlockBoundaries(rawStart, rawEnd)
                        : {start: rawStart, end: rawEnd}

                    nextValue = `${currentValue.slice(0, start)}${suggestionValue}${currentValue.slice(end)}`
                    nextCaretPosition = start + suggestionValue.length
                    insertionStart = start
                    break
                }
                case "replace":
                default: {
                    nextValue = suggestionValue
                    nextCaretPosition = suggestionValue.length
                    insertionStart = 0
                    break
                }
            }

            setElementKey(
                inputRef.current,
                "value",
                nextValue,
                "change",
            )

            setActiveSuggestionSpans((prev) => {
                const nextTextValue = normalizeTextValue(nextValue)
                const reconciledSpans = reconcileSuggestionSpans(prev, nextTextValue)
                const nextSpan: ActiveSuggestionSpan | null = suggestionValue.length
                    ? {
                        id: suggestionIdRef.current++,
                        suggestion,
                        text: suggestionValue,
                        start: insertionStart,
                        end: insertionStart + suggestionValue.length,
                    }
                    : null

                const updatedSpans = nextSpan ? [...reconciledSpans, nextSpan] : reconciledSpans
                setActiveSuggestions(updatedSpans.map((item) => item.suggestion))
                return updatedSpans
            })

            if (nextCaretPosition !== null) {
                requestAnimationFrame(() => {
                    const target = inputRef.current
                    if (!target) return

                    target.focus({preventScroll: true})
                    setSelectionRangeSafe(target, nextCaretPosition, nextCaretPosition)
                })
            }
        }, [expandSelectionRangeToBlockBoundaries, inputRef, normalizeTextValue, reconcileSuggestionSpans, transformSyntaxWithSuggestions, value])

        const syntax = useMemo(() => (
            <InputSyntax
                transformSyntax={transformSyntaxWithSuggestions}
                syntaxRef={syntaxRef}
                visualizedSyntaxSegments={visualizedSyntaxSegments}
                resolvedVisualSelectionRange={resolvedVisualSelectionRange}
                visualCaretIndex={visualCaretIndex}
                isFocused={isFocused}
                onPointerDown={handleSyntaxPointerDown}
                onPointerMove={handleSyntaxPointerMove}
                onPointerUp={handleSyntaxPointerUp}
            />
        ), [handleSyntaxPointerDown, handleSyntaxPointerUp, handleSyntaxPointerMove, isFocused, resolvedVisualSelectionRange, transformSyntaxWithSuggestions, visualCaretIndex, visualizedSyntaxSegments])

        const suggestionMenu = useMemo(() => (
            <Menu
                open={open}
                modal={false}
                onOpenChange={(nextOpen) => {
                    if (!nextOpen && shouldPreventCloseRef.current) {
                        shouldPreventCloseRef.current = false
                        return
                    }

                    setOpen(nextOpen)

                    if (nextOpen) {
                        setTimeout(() => inputRef.current?.focus(), 0)
                    }
                }}
            >
                <MenuTrigger asChild>
                    <input
                        ref={inputRef as LegacyRef<HTMLInputElement>}
                        {...mergeCode0Props(`input__control ${transformSyntaxWithSuggestions ? "input__control--syntax" : ""}`, rest)}
                        onFocus={handleFocus}
                        onBlur={handleBlur}
                        onKeyDownCapture={handleKeyDownCapture}
                        onKeyDown={handleKeyDown}
                        spellCheck={false}
                        disabled={disabled || disabledOnValue}
                    />
                </MenuTrigger>
                <MenuPortal>
                    <InputSuggestionMenuContent inputRef={inputRef}>
                        {suggestionsHeader}
                        <InputSuggestionMenuContentItems
                            /* @ts-ignore */
                            ref={menuRef}
                            inputRef={inputRef}
                            suggestions={suggestions}
                            onSuggestionSelect={(suggestion) => {
                                if (!onSuggestionSelect) {
                                    applySuggestionValue(suggestion)
                                } else {
                                    onSuggestionSelect?.(suggestion)
                                }
                                setOpen(false)
                                if (onSuggestionSelect) {
                                    focusInputCaretAtEnd()
                                }
                            }}
                        />
                        {suggestionsFooter}
                    </InputSuggestionMenuContent>
                </MenuPortal>
            </Menu>
        ), [applySuggestionValue, disabledOnValue, focusInputCaretAtEnd, handleBlur, handleFocus, handleKeyDown, handleKeyDownCapture, inputRef, onSuggestionSelect, open, rest, suggestions, suggestionsFooter, suggestionsHeader, transformSyntaxWithSuggestions])

        return (
            <>
                {title && <InputLabel>{title}</InputLabel>}
                {description && <InputDescription>{description}</InputDescription>}

                <div
                    {...mergeCode0Props(
                        `input ${!formValidation?.valid ? "input--not-valid" : ""}`,
                        wrapperComponent,
                    )}
                >
                    {left && <div className={`input__left input__left--${leftType}`}>{left}</div>}

                    {suggestions ? (
                        suggestionMenu
                    ) : (
                        <input
                            tabIndex={2}
                            ref={inputRef as LegacyRef<HTMLInputElement>}
                            disabled={disabled}
                            onFocus={handleFocus}
                            onBlur={handleBlur}
                            onKeyDownCapture={handleKeyDownCapture}
                            onKeyDown={handleKeyDown}
                            {...mergeCode0Props(`input__control ${transformSyntaxWithSuggestions ? "input__control--syntax" : ""}`, rest)}
                        />
                    )}

                    {syntax}

                    {right &&
                        <div className={`input__right input__right--${rightType}`}>{right}</div>}
                </div>

                {!formValidation?.valid && formValidation?.notValidMessage && (
                    <InputMessage>{formValidation.notValidMessage}</InputMessage>
                )}
            </>
        )
    },
)

export const Input: React.FC<InputProps<any>> = InputComponent as React.FC<InputProps<any>>
