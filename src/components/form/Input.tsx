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

import {InputSyntaxSegment} from "./Input.syntax.hook"
import {getSelectionMetrics, setElementKey, setSelectionRangeSafe} from "./Input.utils"
import {Card} from "../card/Card"

import {useContentEditableController} from "./InputContentEditable.hook"

export type Code0Input = Omit<
    Omit<Omit<Code0Component<HTMLInputElement>, "left">, "right">,
    "title"
>

export interface InputProps<T> extends Code0Input, ValidationProps<T> {
    suggestions?: InputSuggestion[]
    suggestionsHeader?: React.ReactNode
    suggestionsFooter?: React.ReactNode
    onSuggestionSelect?: (suggestion: InputSuggestion) => void
    transformSyntax?: (value: T, appliedSyntaxParts?: (InputSuggestion | any)[]) => InputSyntaxSegment[]
    validationUsesSyntax?: boolean
    disableOnValue?: (value: T) => boolean
    filterSuggestionsByLastToken?: boolean
    onLastTokenChange?: (token: string | null) => void
    enforceUniqueSuggestions?: boolean
    suggestionsEmptyState?: React.ReactNode

    wrapperComponent?: Code0Component<HTMLDivElement>
    right?: React.ReactNode
    left?: React.ReactNode
    leftType?: "action" | "placeholder" | "icon"
    rightType?: "action" | "placeholder" | "icon"
    title?: React.ReactNode
    description?: React.ReactNode
}

export type InputElement = HTMLInputElement | HTMLDivElement

export type InputActiveSuggestionSpan = {
    id: number
    suggestion: InputSuggestion
    text: string
    start: number
    end: number
}

const normalizeTextValue = (rawValue: any): string => {
    const normalized = rawValue ?? ""
    return typeof normalized === "string" ? normalized : String(normalized)
}

const normalizeTokenValue = (value: any) => {
    if (value === undefined || value === null) return ""
    if (typeof value === "string") return value
    try {
        return JSON.stringify(value)
    } catch {
        return String(value ?? "")
    }
}

const getLastTokenBeforeCaretInInput = (inputEl: HTMLInputElement | null) => {
    if (!inputEl) return null
    const value = inputEl.value ?? ""
    const caret = inputEl.selectionStart ?? value.length
    const textBeforeCaret = value.slice(0, caret)
    const match = textBeforeCaret.match(/\S+$/)
    if (!match || match.index === undefined) return null
    const token = match[0]
    const start = match.index
    const end = start + token.length
    return {token, start, end}
}

const InputComponent = React.forwardRef<InputElement, InputProps<any>>(
    (props: InputProps<any>, ref: React.Ref<InputElement>) => {
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
            validationUsesSyntax = false,
            filterSuggestionsByLastToken = false,
            enforceUniqueSuggestions = false,
            onLastTokenChange,
            suggestionsEmptyState,
            ...rest
        } = props

        const {
            onFocus: userOnFocus,
            onBlur: userOnBlur,
            onKeyDown: userOnKeyDown,
            onKeyDownCapture: userOnKeyDownCapture,
            onChange: userOnChange,
            onInput: userOnInput,
            ...inputProps
        } = rest

        const wrapperRef = useRef<HTMLDivElement>(null)
        const inputRef = useRef<HTMLInputElement>(null)
        const editorRef = useRef<HTMLElement>(null as any)

        const menuRef = useRef<InputSuggestionMenuContentItemsHandle | null>(null)
        const menuContentRef = useRef<HTMLDivElement | null>(null)

        const shouldPreventCloseRef = useRef(false)
        const suggestionIdRef = useRef(0)
        const lastValidationValueRef = useRef<any>(null)

        const externalValue = inputProps.value ?? props.initialValue ?? props.defaultValue

        const [open, setOpen] = useState(false)
        const openRef = useRef(false)
        const setOpenSafe = React.useCallback((next: boolean) => {
            openRef.current = next
            setOpen(next)
        }, [])

        const [value, setValue] = useState<any>(externalValue)
        const [activeSuggestionSpans, setActiveSuggestionSpans] = useState<InputActiveSuggestionSpan[]>([])
        const [activeSuggestions, setActiveSuggestions] = useState<InputSuggestion[]>([])
        const [lastTokenBeforeCaret, setLastTokenBeforeCaret] = useState<string | null>(null)
        const [syntaxSegments, setSyntaxSegments] = useState<InputSyntaxSegment[] | null>(null)

        const isSyntaxMode = Boolean(transformSyntax)
        const disabledOnValue = useMemo(() => disableOnValue(value), [disableOnValue, value])
        const activeControlRef = useMemo(
            () => (isSyntaxMode ? (editorRef as any) : inputRef) as RefObject<InputElement>,
            [isSyntaxMode],
        )

        React.useImperativeHandle(ref, () => activeControlRef.current ?? null, [activeControlRef])

        const mergedInputProps = useMemo(
            () => ({...inputProps, onChange: userOnChange, onInput: userOnInput}),
            [inputProps, userOnChange, userOnInput],
        )

        const mergedEditableProps = useMemo(() => {
            const {value: _value, defaultValue: _defaultValue, ...restProps} = inputProps as Record<string, any>
            return mergeCode0Props("input__control", restProps)
        }, [inputProps])

        const focusControl = React.useCallback(() => {
            const target = activeControlRef.current
            if (!target || disabled || disabledOnValue) return
            target.focus({preventScroll: true})
        }, [activeControlRef, disabled, disabledOnValue])

        const openIfSuggestions = React.useCallback(() => {
            if (suggestions) setOpenSafe(true)
        }, [suggestions, setOpenSafe])

        const updateLastTokenState = React.useCallback(
            (token: string | null) => {
                if (!filterSuggestionsByLastToken) return
                setLastTokenBeforeCaret(token)
                if (token) setOpenSafe(true)
                onLastTokenChange?.(token)
            },
            [filterSuggestionsByLastToken, onLastTokenChange, setOpenSafe],
        )

        const syncValidationValue = React.useCallback(
            (currentValue: any, currentSegments: InputSyntaxSegment[] | null) => {
                if (!formValidation?.setValue) return

                const currentValueNormalized = inputProps.type !== "checkbox" ? normalizeTextValue(currentValue) : currentValue
                const validationValue = validationUsesSyntax ? currentSegments : currentValueNormalized

                if (Object.is(lastValidationValueRef.current, validationValue)) return
                lastValidationValueRef.current = validationValue
                formValidation.setValue(validationValue)
            },
            [formValidation?.setValue, inputProps.type, validationUsesSyntax],
        )

        const contentEditable = useContentEditableController({
            editorRef,
            transformSyntax: transformSyntax as any,
            filterSuggestionsByLastToken,
            onLastTokenChange: updateLastTokenState,
            onStateChange: ({value: nextValue, tokens, segments}) => {
                setValue(nextValue)
                setActiveSuggestions(tokens)
                setSyntaxSegments(segments ?? null)
                syncValidationValue(nextValue, segments ?? null)
            },
        })

        /**
         * ✅ FIX: ContentEditable has no defaultValue; init once, never re-init while typing
         * (prevents "1ms visible then disappears")
         */
        const didInitSyntaxRef = useRef(false)
        useEffect(() => {
            if (!isSyntaxMode || !transformSyntax) return
            if (didInitSyntaxRef.current) return

            const nextValue = normalizeTextValue(externalValue)
            setValue(nextValue)
            contentEditable.initializeFromExternalValue(nextValue)
            if (validationUsesSyntax && transformSyntax) {
                setSyntaxSegments(transformSyntax(nextValue as any, []))
            }

            didInitSyntaxRef.current = true
        }, [isSyntaxMode, transformSyntax, externalValue, validationUsesSyntax, contentEditable])

        /**
         * Controlled sync for plain input only
         */
        useEffect(() => {
            if (isSyntaxMode) return
            if (inputProps.value === undefined) return
            setValue(inputProps.value)
        }, [inputProps.value, isSyntaxMode])

        /**
         * Validation sync
         */
        useEffect(() => {
            syncValidationValue(value, syntaxSegments)
        }, [syncValidationValue, syntaxSegments, value])

        // GLOBAL pointerdown capture: keep open when clicking inside, otherwise close immediately
        useEffect(() => {
            if (!suggestions) return

            const onPointerDownCapture = (event: PointerEvent) => {
                const target = event.target as Node
                const insideEditor = !!editorRef.current?.contains(target)
                const insideInput = !!inputRef.current?.contains(target)
                const insideMenu = !!menuContentRef.current?.contains(target)
                const insideWrapper = !!wrapperRef.current?.contains(target)

                const inside = insideEditor || insideInput || insideMenu || insideWrapper
                shouldPreventCloseRef.current = inside

                // ✅ THIS is the important part: if click is outside, close NOW (not via blur)
                if (!inside && openRef.current) setOpenSafe(false)
            }

            document.addEventListener("pointerdown", onPointerDownCapture, true)
            return () => document.removeEventListener("pointerdown", onPointerDownCapture, true)
        }, [suggestions, setOpenSafe])

        useEffect(() => {
            const wrapperEl = wrapperRef.current
            if (!wrapperEl) return

            const handleFocusIn = () => openIfSuggestions()
            wrapperEl.addEventListener("focusin", handleFocusIn)

            return () => wrapperEl.removeEventListener("focusin", handleFocusIn)
        }, [openIfSuggestions])

        /**
         * =========================
         * Suggestions / filtering
         * =========================
         */
        const findClosestOccurrence = React.useCallback(
            (text: string, targetIndex: number, currentValue: string): number | null => {
                if (text.length === 0) return targetIndex <= currentValue.length ? targetIndex : null
                let closestIndex = currentValue.indexOf(text)
                if (closestIndex === -1) return null
                let searchIndex = closestIndex
                while (searchIndex !== -1) {
                    if (Math.abs(searchIndex - targetIndex) < Math.abs(closestIndex - targetIndex)) closestIndex = searchIndex
                    searchIndex = currentValue.indexOf(text, searchIndex + 1)
                }
                return closestIndex
            },
            [],
        )

        const reconcileSuggestionSpans = React.useCallback(
            (spans: InputActiveSuggestionSpan[], currentValue: string) => {
                const nextSpans: InputActiveSuggestionSpan[] = []
                spans.forEach((span) => {
                    const nextStart = findClosestOccurrence(span.text, span.start, currentValue)
                    if (nextStart === null) return
                    const nextEnd = nextStart + span.text.length
                    if (currentValue.slice(nextStart, nextEnd) !== span.text) return
                    nextSpans.push({...span, start: nextStart, end: nextEnd})
                })
                return nextSpans
            },
            [findClosestOccurrence],
        )

        useEffect(() => {
            if (isSyntaxMode) return
            const currentValue = normalizeTextValue(inputRef.current?.value ?? value)
            setActiveSuggestionSpans((prev) => {
                const nextSpans = reconcileSuggestionSpans(prev, currentValue)
                setActiveSuggestions(nextSpans.map((s) => s.suggestion))
                return nextSpans
            })
        }, [isSyntaxMode, reconcileSuggestionSpans, value])

        useEffect(() => {
            if (!filterSuggestionsByLastToken || isSyntaxMode) return

            const target = inputRef.current
            if (!target) return

            const updateToken = () => updateLastTokenState(getLastTokenBeforeCaretInInput(target)?.token ?? null)

            target.addEventListener("input", updateToken)
            target.addEventListener("keyup", updateToken)
            target.addEventListener("mouseup", updateToken)
            updateToken()

            return () => {
                target.removeEventListener("input", updateToken)
                target.removeEventListener("keyup", updateToken)
                target.removeEventListener("mouseup", updateToken)
            }
        }, [filterSuggestionsByLastToken, isSyntaxMode, updateLastTokenState])

        const filteredSuggestions = useMemo(() => {
            if (!filterSuggestionsByLastToken) return suggestions
            if (!suggestions) return suggestions

            const token = lastTokenBeforeCaret?.trim()
            if (!token?.length) return suggestions

            return suggestions.filter((s) => String(s?.value ?? "").toLowerCase().startsWith(token.toLowerCase()))
        }, [filterSuggestionsByLastToken, lastTokenBeforeCaret, suggestions])

        const availableSuggestions = useMemo(() => {
            if (!enforceUniqueSuggestions) return filteredSuggestions
            if (!filteredSuggestions) return filteredSuggestions

            if (isSyntaxMode) {
                const activeKeys = new Set((activeSuggestions ?? []).map((s) => normalizeTokenValue((s as any)?.value ?? s)))
                return filteredSuggestions.filter((s) => !activeKeys.has(normalizeTokenValue(s?.value ?? s)))
            }

            const activeSet = new Set(activeSuggestionSpans.map((span) => span.suggestion))
            return filteredSuggestions.filter((s) => !activeSet.has(s))
        }, [activeSuggestionSpans, activeSuggestions, enforceUniqueSuggestions, filteredSuggestions, isSyntaxMode])

        /**
         * =========================
         * Apply suggestions (plain)
         * =========================
         */
        const applySuggestionValuePlain = React.useCallback(
            (suggestion: InputSuggestion) => {
                if (!inputRef.current) return

                const suggestionRaw = typeof value == "object" ? JSON.stringify(suggestion.value) : suggestion.value
                const suggestionValue = suggestionRaw === undefined || suggestionRaw === null ? "" : String(suggestionRaw)
                const insertMode = suggestion.insertMode ?? "replace"
                const currentValue = inputRef.current.value ?? ""

                let nextValue = currentValue
                let nextCaretPosition: number | null = null
                let insertionStart = 0

                const tokenMatch = filterSuggestionsByLastToken ? getLastTokenBeforeCaretInInput(inputRef.current) : null
                if (filterSuggestionsByLastToken && tokenMatch) {
                    nextValue = `${currentValue.slice(0, tokenMatch.start)}${suggestionValue}${currentValue.slice(tokenMatch.end)}`
                    nextCaretPosition = tokenMatch.start + suggestionValue.length
                    insertionStart = tokenMatch.start
                } else {
                    switch (insertMode) {
                        case "append":
                            nextValue = `${currentValue}${suggestionValue}`
                            nextCaretPosition = nextValue.length
                            insertionStart = currentValue.length
                            break
                        case "prepend":
                            nextValue = `${suggestionValue}${currentValue}`
                            nextCaretPosition = suggestionValue.length
                            insertionStart = 0
                            break
                        case "insert": {
                            const {rawStart, rawEnd} = getSelectionMetrics(inputRef.current)
                            nextValue = `${currentValue.slice(0, rawStart)}${suggestionValue}${currentValue.slice(rawEnd)}`
                            nextCaretPosition = rawStart + suggestionValue.length
                            insertionStart = rawStart
                            break
                        }
                        case "replace":
                        default:
                            nextValue = suggestionValue
                            nextCaretPosition = suggestionValue.length
                            insertionStart = 0
                            break
                    }
                }

                setElementKey(inputRef.current, "value", nextValue, "change")

                setActiveSuggestionSpans((prev) => {
                    const nextTextValue = normalizeTextValue(nextValue)
                    const reconciledSpans = reconcileSuggestionSpans(prev, nextTextValue)
                    const nextSpan: InputActiveSuggestionSpan | null = suggestionValue.length
                        ? {
                            id: suggestionIdRef.current++,
                            suggestion,
                            text: suggestionValue,
                            start: insertionStart,
                            end: insertionStart + suggestionValue.length,
                        }
                        : null

                    const updated = nextSpan ? [...reconciledSpans, nextSpan] : reconciledSpans
                    setActiveSuggestions(updated.map((i) => i.suggestion))
                    return updated
                })

                if (nextCaretPosition !== null) {
                    requestAnimationFrame(() => {
                        const target = inputRef.current
                        if (!target) return
                        target.focus({preventScroll: true})
                        setSelectionRangeSafe(target, nextCaretPosition, nextCaretPosition)
                    })
                }
            },
            [filterSuggestionsByLastToken, reconcileSuggestionSpans, value],
        )

        const handleSuggestionSelect = React.useCallback(
            (suggestion: InputSuggestion) => {
                if (isSyntaxMode) contentEditable.applySuggestionValueSyntax(suggestion)
                else applySuggestionValuePlain(suggestion)

                onSuggestionSelect?.(suggestion)

                if (isSyntaxMode) {
                    const target = activeControlRef.current
                    // React won't fire onChange/onInput for contentEditable tokens; emulate it
                    requestAnimationFrame(() => {
                        if (!target) return
                        const synthetic = {type: "change", target, currentTarget: target} as any
                        target.dispatchEvent(new Event("input", {bubbles: true}))
                        userOnInput?.(synthetic)
                        userOnChange?.(synthetic)
                    })
                }

                setOpenSafe(false)
                shouldPreventCloseRef.current = false

                requestAnimationFrame(() => {
                    focusControl()
                })
            },
            [activeControlRef, applySuggestionValuePlain, contentEditable, focusControl, isSyntaxMode, onSuggestionSelect, setOpenSafe, userOnChange, userOnInput],
        )

        /**
         * =========================
         * Events
         * =========================
         */
        const handleFocus = React.useCallback(
            (event: React.FocusEvent<HTMLInputElement | HTMLDivElement>) => {
                openIfSuggestions()
                userOnFocus?.(event as any)
            },
            [openIfSuggestions, userOnFocus],
        )

        const handleBlur = React.useCallback(
            (event: React.FocusEvent<HTMLInputElement | HTMLDivElement>) => {
                if (shouldPreventCloseRef.current) {
                    userOnBlur?.(event as any)
                    return
                }
                setOpenSafe(false)
                userOnBlur?.(event as any)
            },
            [userOnBlur, setOpenSafe],
        )

        const handleKeyDownCapture = React.useCallback(
            (event: React.KeyboardEvent<HTMLInputElement | HTMLDivElement>) => {
                if (isSyntaxMode) {
                    contentEditable.handleKeyDownCapture(event as any)
                    userOnKeyDownCapture?.(event as any)
                    return
                }

                if (event.key === " " || event.code === "Space") {
                    event.stopPropagation()
                    // @ts-ignore
                    event.nativeEvent?.stopImmediatePropagation?.()
                }
                userOnKeyDownCapture?.(event as any)
            },
            [contentEditable, isSyntaxMode, userOnKeyDownCapture],
        )

        const handleKeyDown = React.useCallback(
            (event: React.KeyboardEvent<HTMLInputElement | HTMLDivElement>) => {
                if (suggestions) {
                    if (event.key === "ArrowDown") {
                        event.preventDefault()
                        event.stopPropagation()

                        if (!openRef.current) {
                            setOpenSafe(true)
                            setTimeout(() => menuRef.current?.focusFirstItem?.(), 0)
                        } else {
                            menuRef.current?.highlightNextItem?.()
                        }
                        return
                    }

                    if (event.key === "ArrowUp") {
                        event.preventDefault()
                        event.stopPropagation()

                        if (!openRef.current) {
                            setOpenSafe(true)
                            setTimeout(() => menuRef.current?.focusLastItem?.(), 0)
                        } else {
                            menuRef.current?.highlightPreviousItem?.()
                        }
                        return
                    }

                    if (event.key === "Enter" && openRef.current) {
                        event.preventDefault()
                        event.stopPropagation()
                        const selected = menuRef.current?.selectActiveItem?.()
                        if (selected) setOpenSafe(false)
                        return
                    }

                    if (event.key === "Escape" && openRef.current) {
                        event.preventDefault()
                        event.stopPropagation()
                        setOpenSafe(false)
                        return
                    }
                }

                if (isSyntaxMode) {
                    const handled = contentEditable.handleKeyDown(event as any)
                    if (handled) {
                        userOnKeyDown?.(event as any)
                        return
                    }
                }

                if (isSyntaxMode && event.key === "Enter") {
                    event.preventDefault()
                    userOnKeyDown?.(event as any)
                    return
                }

                userOnKeyDown?.(event as any)
            },
            [contentEditable, isSyntaxMode, suggestions, setOpenSafe, userOnKeyDown],
        )

        /**
         * =========================
         * Render control
         * =========================
         */
        const control = isSyntaxMode ? (
            <div
                ref={editorRef as any}
                {...mergedEditableProps}
                contentEditable={!disabled && !disabledOnValue}
                suppressContentEditableWarning
                aria-disabled={disabled || disabledOnValue}
                onInput={(event) => {
                    contentEditable.updateEditorState(editorRef.current)
                    const target = event.currentTarget
                    const synthetic = {type: "change", target, currentTarget: target} as any
                    userOnInput?.(synthetic)
                    userOnChange?.(synthetic)
                }}
                onPaste={contentEditable.handlePaste}
                onFocus={handleFocus}
                onBlur={handleBlur}
                onKeyDownCapture={handleKeyDownCapture}
                onKeyDown={handleKeyDown}
                spellCheck={false}
            />
        ) : (
            <input
                ref={inputRef as LegacyRef<HTMLInputElement>}
                {...mergeCode0Props("input__control", mergedInputProps)}
                onFocus={handleFocus}
                onBlur={handleBlur}
                onKeyDownCapture={handleKeyDownCapture}
                onKeyDown={handleKeyDown}
                spellCheck={false}
                disabled={disabled || disabledOnValue}
            />
        )

        const handleWrapperPointerDown = React.useCallback(
            (event: React.PointerEvent<HTMLDivElement>) => {
                if (disabled || disabledOnValue) return
                const target = event.target as HTMLElement
                if (menuContentRef.current?.contains(target)) return
                shouldPreventCloseRef.current = true
                focusControl()
                openIfSuggestions()
            },
            [disabled, disabledOnValue, focusControl, openIfSuggestions],
        )

        useEffect(() => {
            const wrapper = wrapperRef.current
            if (!wrapper) return

            const handleFocusOut = (event: FocusEvent) => {
                const nextTarget = event.relatedTarget as Node | null
                if (nextTarget && wrapper.contains(nextTarget)) return
                handleBlur(event as any)
            }

            wrapper.addEventListener("focusout", handleFocusOut)
            return () => wrapper.removeEventListener("focusout", handleFocusOut)
        }, [handleBlur])

        const suggestionMenu = useMemo(
            () => (
                <Menu
                    open={open}
                    modal={false}
                    onOpenChange={(nextOpen) => {
                        if (!nextOpen && shouldPreventCloseRef.current) return
                        setOpenSafe(nextOpen)
                    }}
                >
                    <MenuTrigger asChild>
                        <button
                            type="button"
                            tabIndex={-1}
                            aria-hidden
                            style={{position: "absolute", inset: 0, opacity: 0, pointerEvents: "none"}}
                            onMouseDown={(e) => e.preventDefault()}
                        />
                    </MenuTrigger>

                    {control}

                    <MenuPortal>
                        <div
                            ref={menuContentRef}
                            onPointerDownCapture={() => {
                                shouldPreventCloseRef.current = true
                            }}
                            onMouseDownCapture={(e) => {
                                e.preventDefault()
                                shouldPreventCloseRef.current = true
                            }}
                        >
                            <InputSuggestionMenuContent
                                color={"secondary"}
                                inputRef={activeControlRef as RefObject<HTMLInputElement>}
                            >
                                {suggestionsHeader}
                                <Card paddingSize={"xxs"} mt={-0.35} mx={-0.35} style={{borderWidth: "2px"}}>
                                    {availableSuggestions?.length === 0 && suggestionsEmptyState}
                                    {!!availableSuggestions?.length && (
                                        <InputSuggestionMenuContentItems
                                            /* @ts-ignore */
                                            ref={menuRef}
                                            inputRef={activeControlRef as RefObject<HTMLInputElement>}
                                            suggestions={availableSuggestions}
                                            onSuggestionSelect={handleSuggestionSelect}
                                        />
                                    )}
                                </Card>
                                {suggestionsFooter}
                            </InputSuggestionMenuContent>
                        </div>
                    </MenuPortal>
                </Menu>
            ),
            [
                open,
                control,
                isSyntaxMode,
                availableSuggestions,
                suggestionsHeader,
                suggestionsFooter,
                suggestionsEmptyState,
                handleSuggestionSelect,
                activeControlRef,
                setOpenSafe,
            ],
        )

        return (
            <div>
                {title && <InputLabel>{title}</InputLabel>}
                {description && <InputDescription>{description}</InputDescription>}

                <div
                    ref={wrapperRef}
                    {...mergeCode0Props(`input ${!formValidation?.valid ? "input--not-valid" : ""}`, wrapperComponent)}
                    onPointerDown={handleWrapperPointerDown}
                >
                    {left && <div className={`input__left input__left--${leftType}`}>{left}</div>}
                    {suggestions ? suggestionMenu : control}
                    {right && <div className={`input__right input__right--${rightType}`}>{right}</div>}
                </div>

                {!formValidation?.valid && formValidation?.notValidMessage && (
                    <InputMessage>{formValidation.notValidMessage}</InputMessage>
                )}
            </div>
        )
    },
)

export const Input: React.FC<InputProps<any>> = InputComponent as React.FC<InputProps<any>>
