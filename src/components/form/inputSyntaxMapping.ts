import {InputSyntaxSegment} from "./Input.syntax.hook";

const clamp = (value: number, min: number, max: number) => Math.min(Math.max(value, min), max)

const sortSegments = (segments: InputSyntaxSegment[]): InputSyntaxSegment[] => {
    return [...segments].sort((a, b) => a.start - b.start || a.end - b.end)
}

const getTotalVisualLength = (segments: InputSyntaxSegment[]) =>
    sortSegments(segments).reduce((total, segment) => total + (segment?.visualLength ?? 0), 0)

const getMaxRawIndex = (segments: InputSyntaxSegment[]) =>
    sortSegments(segments).reduce((max, segment) => Math.max(max, segment?.end), 0)

const resolveBlockRawIndex = (segment: InputSyntaxSegment, visualCursor: number, targetVisual: number) => {
    const beforeDistance = Math.abs(targetVisual - visualCursor)
    const afterDistance = Math.abs(targetVisual - (visualCursor + (segment?.visualLength ?? 0)))

    return beforeDistance <= afterDistance ? segment?.start : segment?.end
}

const resolveBlockVisualIndex = (segment: InputSyntaxSegment, visualCursor: number, targetRaw: number) => {
    const beforeDistance = Math.abs(targetRaw - segment?.start)
    const afterDistance = Math.abs(segment?.end - targetRaw)

    return beforeDistance <= afterDistance ? visualCursor : visualCursor + (segment?.visualLength ?? 0)
}

export const visualIndexToRawIndex = (visualIndex: number, segments: InputSyntaxSegment[]): number => {
    if (!segments.length) return 0

    const orderedSegments = sortSegments(segments)
    const totalVisualLength = getTotalVisualLength(orderedSegments)
    const targetVisual = clamp(visualIndex, 0, totalVisualLength)

    let visualCursor = 0
    let lastRawEnd = orderedSegments[0].start

    for (const segment of orderedSegments) {
        const nextVisualCursor = visualCursor + (segment?.visualLength ?? 0)

        if (targetVisual <= nextVisualCursor) {
            if (segment?.type === "block") {
                return resolveBlockRawIndex(segment, visualCursor, targetVisual)
            }

            const rawOffset = clamp(targetVisual - visualCursor, 0, (segment?.visualLength ?? 0))
            return clamp(segment?.start + rawOffset, segment?.start, segment?.end)
        }

        visualCursor = nextVisualCursor
        lastRawEnd = segment?.end
    }

    return lastRawEnd
}

export const rawIndexToVisualIndex = (rawIndex: number, segments: InputSyntaxSegment[]): number => {
    if (!segments.length) return 0

    const orderedSegments = sortSegments(segments)
    const maxRawIndex = getMaxRawIndex(orderedSegments)
    const targetRaw = clamp(rawIndex, 0, maxRawIndex)

    let visualCursor = 0

    for (const segment of orderedSegments) {
        if (targetRaw < segment?.start) {
            return visualCursor
        }

        if (targetRaw <= segment?.end) {
            if (segment?.type === "block") {
                return resolveBlockVisualIndex(segment, visualCursor, targetRaw)
            }

            const rawOffset = clamp(targetRaw - segment?.start, 0, (segment?.visualLength ?? 0))
            return visualCursor + rawOffset
        }

        visualCursor += (segment?.visualLength ?? 0)
    }

    return getTotalVisualLength(orderedSegments)
}
