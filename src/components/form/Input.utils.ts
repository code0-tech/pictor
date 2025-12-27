// Programmatically set a property (like 'value') and dispatch an event (like 'change')
export const setElementKey = (
    element: HTMLElement,
    key: string,
    value: any,
    event: string,
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

export const setSelectionRangeSafe = (
    target: HTMLInputElement,
    start: number,
    end: number,
    direction?: "forward" | "backward" | "none",
) => {
    try {
        target.setSelectionRange(start, end, direction)
    } catch {
        // Some input types (e.g., number) don't support selection ranges
    }
}

export const getSelectionMetrics = (target: HTMLInputElement) => {
    const selectionStart = target.selectionStart ?? 0
    const selectionEnd = target.selectionEnd ?? selectionStart

    return {
        selectionStart,
        selectionEnd,
        rawStart: Math.min(selectionStart, selectionEnd),
        rawEnd: Math.max(selectionStart, selectionEnd),
        direction: target.selectionDirection === "backward" ? "backward" : "forward",
    }
}
