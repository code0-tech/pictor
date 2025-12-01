import React from "react"

import {InputSuggestion} from "./InputSuggestion"

export type InputSyntaxSegment = {
    type: "text" | "block"
    start: number
    end: number
    visualLength?: number
    content?: string | React.ReactNode
}

export type VisualizedInputSyntaxSegment = InputSyntaxSegment & {
    visualStart: number
    visualEnd: number
}

export const buildDefaultSyntax = (value: any): InputSyntaxSegment[] => {
    const rawValue = value ?? ""
    const textValue = typeof rawValue === "string" ? rawValue : String(rawValue)

    return [{
        type: "text",
        start: 0,
        end: textValue.length,
        visualLength: textValue.length,
        content: textValue,
    }]
}

export const visualizeSyntaxSegments = (
    syntaxSegments: InputSyntaxSegment[],
): VisualizedInputSyntaxSegment[] => {
    let visualStart = 0

    return syntaxSegments.map((segment) => {
        const nextSegment: VisualizedInputSyntaxSegment = {
            ...segment,
            visualStart,
            visualEnd: visualStart + (segment?.visualLength ?? 0),
        }

        visualStart = nextSegment.visualEnd

        return nextSegment
    })
}

const clamp = (value: number, min: number, max: number) => Math.max(min, Math.min(value, max))

export const useSyntaxModel = (
    value: any,
    transformSyntax: (
        (value: any, appliedSyntaxParts?: (InputSuggestion | any)[]) => InputSyntaxSegment[]
    ) | undefined,
    inputRef: React.RefObject<HTMLInputElement>,
    appliedSyntaxParts?: (InputSuggestion | any)[],
) => {
    const syntaxSegments = React.useMemo(() => {
        if (transformSyntax) {
            const segments = transformSyntax(value, appliedSyntaxParts)
            if (segments?.length) return segments
        }

        return buildDefaultSyntax(value)
    }, [appliedSyntaxParts, transformSyntax, value])

    const visualizedSyntaxSegments = React.useMemo(
        () => visualizeSyntaxSegments(syntaxSegments),
        [syntaxSegments],
    )

    const expandSelectionRangeToBlockBoundaries = React.useCallback((rawStart: number, rawEnd: number) => {
        let adjustedStart = Math.min(rawStart, rawEnd)
        let adjustedEnd = Math.max(rawStart, rawEnd)
        let hasBlockOverlap = false

        visualizedSyntaxSegments.forEach((segment) => {
            if (segment.type !== "block") return

            const overlaps = adjustedStart < segment.end && adjustedEnd > segment.start
            if (!overlaps) return

            adjustedStart = Math.min(adjustedStart, segment.start)
            adjustedEnd = Math.max(adjustedEnd, segment.end)
            hasBlockOverlap = true
        })

        return {start: adjustedStart, end: adjustedEnd, hasBlockOverlap}
    }, [visualizedSyntaxSegments])

    const mapVisualIndexToRawIndex = React.useCallback((visualIndex: number): number => {
        const segment = visualizedSyntaxSegments.find((item) => visualIndex >= item.visualStart && visualIndex <= item.visualEnd)
        if (!segment) {
            const inputLength = inputRef.current?.value.length ?? 0
            return clamp(visualIndex, 0, inputLength)
        }

        const rawLength = segment.end - segment.start
        const clampedVisual = clamp(visualIndex - segment.visualStart, 0, (segment?.visualLength ?? 0))

        if (rawLength <= 0) return segment.start
        if (segment.type === "text") {
            return Math.min(segment.start + Math.round(clampedVisual), segment.end)
        }

        if ((segment?.visualLength ?? 0) <= 0) return segment.start

        const ratio = clampedVisual / (segment?.visualLength ?? 0)
        return Math.round(segment.start + ratio * rawLength)
    }, [inputRef, visualizedSyntaxSegments])

    const mapRawIndexToVisualIndex = React.useCallback((rawIndex: number): number => {
        const segment = visualizedSyntaxSegments.find((item) => rawIndex >= item.start && rawIndex <= item.end)

        if (!segment) {
            const inputLength = inputRef.current?.value.length ?? 0
            return clamp(rawIndex, 0, inputLength)
        }

        const rawLength = segment.end - segment.start
        const clampedRaw = clamp(rawIndex - segment.start, 0, rawLength)

        if (rawLength <= 0) return segment.visualStart
        if (segment.type === "text") {
            return Math.min(segment.visualStart + clampedRaw, segment.visualEnd)
        }

        if ((segment?.visualLength ?? 0) <= 0) return segment.visualStart

        const ratio = clampedRaw / rawLength
        return Math.min(segment.visualStart + ratio * (segment?.visualLength ?? 0), segment.visualEnd)
    }, [inputRef, visualizedSyntaxSegments])

    const totalVisualLength = React.useMemo(() => {
        const lastSegment = visualizedSyntaxSegments[visualizedSyntaxSegments.length - 1]
        return lastSegment ? lastSegment.visualEnd : 0
    }, [visualizedSyntaxSegments])

    return {
        syntaxSegments,
        visualizedSyntaxSegments,
        expandSelectionRangeToBlockBoundaries,
        mapVisualIndexToRawIndex,
        mapRawIndexToVisualIndex,
        totalVisualLength,
    }
}
