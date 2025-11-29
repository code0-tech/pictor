/**
 * Input.tsx
 *
 * A highly customizable and accessible input component with extended features,
 * including dynamic suggestion rendering, validation handling, and structural
 * decoration options. Designed to integrate seamlessly with complex forms,
 * this component provides robust interaction patterns and user guidance.
 */

import React, {ForwardRefExoticComponent, LegacyRef, RefObject, useEffect, useMemo, useRef, useState} from "react"

import {Code0Component} from "../../utils/types"
import {ValidationProps} from "./useForm"
import {mergeCode0Props} from "../../utils/utils"

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

        const mapVisualIndexToRawIndex = React.useCallback((visualIndex: number): number => {
            const segment = visualizedSyntaxSegments.find((item) => visualIndex >= item.visualStart && visualIndex < item.visualEnd)
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

        const handleSyntaxPointerDown = React.useCallback((event: React.PointerEvent<HTMLDivElement>) => {
            if (!inputRef.current) return

            const target = event.target as HTMLElement

            const rawIndexAttr = target.dataset.rawIndex
            const visualIndexAttr = target.dataset.visualIndex || target.dataset.visualStart || target.dataset.visualEnd

            const rawIndexFromData = rawIndexAttr ? Number(rawIndexAttr) : undefined
            const visualIndexFromData = visualIndexAttr ? Number(visualIndexAttr) : undefined

            const mappedRawIndex = !Number.isNaN(rawIndexFromData as number) && rawIndexFromData !== undefined
                ? rawIndexFromData
                : (visualIndexFromData !== undefined ? mapVisualIndexToRawIndex(visualIndexFromData) : null)

            if (mappedRawIndex === null || Number.isNaN(mappedRawIndex)) return

            event.preventDefault()
            shouldPreventCloseRef.current = true

            const clampedIndex = Math.min(Math.max(mappedRawIndex, 0), inputRef.current.value.length)

            inputRef.current.focus({preventScroll: true})
            try {
                inputRef.current.setSelectionRange(clampedIndex, clampedIndex)
            } catch {
                // Some input types (e.g., number) don't support selection ranges
            }
        }, [inputRef, mapVisualIndexToRawIndex])

        const handleKeyDown = React.useCallback((event: React.KeyboardEvent<HTMLInputElement>) => {
            if (props.transformSyntax && (event.key === "ArrowLeft" || event.key === "ArrowRight")) {
                const target = event.target as HTMLInputElement
                const selectionStart = target.selectionStart ?? 0
                const selectionEnd = target.selectionEnd ?? selectionStart
                const collapsePosition = event.key === "ArrowLeft"
                    ? Math.min(selectionStart, selectionEnd)
                    : Math.max(selectionStart, selectionEnd)

                const currentVisualIndex = mapRawIndexToVisualIndex(collapsePosition)
                const visualDelta = event.key === "ArrowLeft" ? -1 : 1
                const nextVisualIndex = Math.max(0, Math.min(currentVisualIndex + visualDelta, totalVisualLength))
                const nextRawIndex = mapVisualIndexToRawIndex(nextVisualIndex)

                if (!Number.isNaN(nextRawIndex)) {
                    event.preventDefault()
                    const clampedIndex = Math.min(Math.max(nextRawIndex, 0), target.value.length)

                    try {
                        target.setSelectionRange(clampedIndex, clampedIndex)
                    } catch {
                        // Some input types (e.g., number) don't support selection ranges
                    }
                }

                if (event.defaultPrevented) return
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
        }, [focusInputCaretAtEnd, mapRawIndexToVisualIndex, mapVisualIndexToRawIndex, open, props.transformSyntax, suggestions, totalVisualLength])

        const renderSyntaxSegments = React.useCallback((segments: VisualizedInputSyntaxSegment[]) => {
            return segments.map((segment, index) => {
                const key = `${segment.start}-${segment.end}-${index}`

                const content = typeof segment.content === "string"
                    ? segment.content
                    : segment.content ?? null

                const className = segment.type === "block" ? "input__syntax-block" : "input__syntax-text"

                const commonDataAttributes = {
                    "data-visual-start": segment.visualStart,
                    "data-visual-end": segment.visualEnd,
                    "data-visual-length": segment.visualLength,
                    "data-raw-start": segment.start,
                    "data-raw-end": segment.end,
                }

                if (typeof content === "string" && segment.type === "text") {
                    return (
                        <span key={key} className={className} {...commonDataAttributes}>
                            {content.split("").map((char, charIndex) => {
                                const visualIndex = segment.visualStart + charIndex
                                const rawIndex = segment.start + charIndex

                                return (
                                    <span
                                        key={`${key}-${charIndex}`}
                                        className={"input__syntax-char"}
                                        data-visual-index={visualIndex}
                                        data-raw-index={rawIndex}
                                    >
                                        {char}
                                    </span>
                                )
                            })}
                        </span>
                    )
                }

                return (
                    <span key={key} className={className} {...commonDataAttributes}>
                        {content}
                    </span>
                )
            })
        }, [])

        const syntax = React.useMemo(() => {
            if (props.transformSyntax) {
                return (
                    <div className={"input__syntax"} ref={syntaxRef} onPointerDown={handleSyntaxPointerDown}>
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
                        onFocus={() => !open && setOpen(true)} // Open on focus
                        onKeyDown={handleKeyDown}
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