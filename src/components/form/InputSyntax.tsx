import React from "react"

import {VisualizedInputSyntaxSegment} from "./Input.syntax.hook"

export type ResolvedVisualSelectionRange = { start: number, end: number } | null

export interface InputSyntaxProps {
    transformSyntax?: ((value: any) => any)
    syntaxRef: React.RefObject<HTMLDivElement | null>
    visualizedSyntaxSegments: VisualizedInputSyntaxSegment[]
    resolvedVisualSelectionRange: ResolvedVisualSelectionRange
    visualCaretIndex: number | null
    isFocused: boolean
    onPointerDown: (event: React.PointerEvent<HTMLDivElement>) => void
    onPointerMove: (event: React.PointerEvent<HTMLDivElement>) => void
    onPointerUp: (event: React.PointerEvent<HTMLDivElement>) => void
}

const renderSyntaxSegments = (
    segments: VisualizedInputSyntaxSegment[],
    isFocused: boolean,
    resolvedVisualSelectionRange: ResolvedVisualSelectionRange,
    visualCaretIndex: number | null,
) => {
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
                        key={`${key}-char-${charIndex}`}
                        data-visual-index={visualIndex}
                        data-raw-index={rawIndex}
                        className={isSelected ? "input__syntax-char--selected" : ""}
                        aria-hidden
                    >
                        {char === " " ? "\u00A0" : char}
                    </span>,
                )
            })

            if (shouldRenderCaret(segment.visualEnd)) {
                children.push(renderCaret(segment.visualEnd))
            }

            return (
                <span
                    key={key}
                    className={className}
                    aria-hidden
                    {...commonDataAttributes}
                >
                    {children}
                </span>
            )
        }

        return (
            <span
                key={key}
                className={className}
                aria-hidden
                {...commonDataAttributes}
            >
                {shouldRenderCaret(segment.visualStart) && renderCaret(segment.visualStart)}
                {content}
                {shouldRenderCaret(segment.visualEnd) && renderCaret(segment.visualEnd)}
            </span>
        )
    })
}

export const InputSyntax = ({
                                transformSyntax,
                                syntaxRef,
                                visualizedSyntaxSegments,
                                resolvedVisualSelectionRange,
                                visualCaretIndex,
                                isFocused,
                                onPointerDown,
                                onPointerMove,
                                onPointerUp,
                            }: InputSyntaxProps) => {
    if (!transformSyntax) return null

    return (
        <div
            className="input__syntax"
            ref={syntaxRef}
            onPointerDown={onPointerDown}
            onPointerMove={onPointerMove}
            onPointerUp={onPointerUp}
        >
            {renderSyntaxSegments(
                visualizedSyntaxSegments,
                isFocused,
                resolvedVisualSelectionRange,
                visualCaretIndex,
            )}
        </div>
    )
}
