import React, {RefObject} from "react"

import {getSelectionMetrics, setSelectionRangeSafe, useSyncSyntaxScroll} from "./Input.utils"
import {ResolvedVisualSelectionRange} from "./InputSyntax"
import {VisualizedInputSyntaxSegment} from "./Input.syntax.hook"

export const useSelectionVisibility = (
    inputRef: RefObject<HTMLInputElement | null>,
    syntaxRef: RefObject<HTMLDivElement | null>,
) => {
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
                syntaxElement.querySelectorAll<HTMLElement>("[data-visual-start][data-visual-end]"),
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

    const syncSyntaxScroll = useSyncSyntaxScroll(inputRef, syntaxRef)

    return {ensureVisualIndexVisible, syncSyntaxScroll}
}

export const useSelectionNormalization = (
    transformSyntax: ((value: any) => any) | undefined,
    expandSelectionRangeToBlockBoundaries: (rawStart: number, rawEnd: number) => {start: number, end: number, hasBlockOverlap: boolean},
) => React.useCallback((target: HTMLInputElement) => {
    if (!transformSyntax) return

    const {selectionStart, selectionEnd} = getSelectionMetrics(target)
    if (selectionStart === selectionEnd) return

    const {start, end, hasBlockOverlap} = expandSelectionRangeToBlockBoundaries(selectionStart, selectionEnd)

    if (!hasBlockOverlap) return
    if (start === selectionStart && end === selectionEnd) return

    setSelectionRangeSafe(target, start, end)
}, [expandSelectionRangeToBlockBoundaries, transformSyntax])

export const useSelectionResolution = (
    transformSyntax: ((value: any) => any) | undefined,
    inputRef: RefObject<HTMLInputElement>,
    visualSelectionRange: {start: number, end: number} | null,
    visualizedSyntaxSegments: VisualizedInputSyntaxSegment[],
    mapRawIndexToVisualIndex: (rawIndex: number) => number,
) => React.useMemo((): ResolvedVisualSelectionRange => {
    if (!transformSyntax) return null

    const target = inputRef.current
    if (!target) return visualSelectionRange

    const {rawStart, rawEnd} = getSelectionMetrics(target)

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
}, [inputRef, mapRawIndexToVisualIndex, transformSyntax, visualSelectionRange, visualizedSyntaxSegments])
