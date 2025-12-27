import React from "react"

export type InputSyntaxSegment = {
    type: "text" | "block"
    start: number
    end: number
    visualLength?: number
    content?: string | React.ReactNode
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
