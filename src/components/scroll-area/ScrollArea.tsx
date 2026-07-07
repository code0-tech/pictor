"use client"

import React from "react";
import {ComponentProps, mergeComponentProps} from "../../utils";
import * as RadixScrollArea from "@radix-ui/react-scroll-area";
import "./ScrollArea.style.scss"

export type ScrollAreaProps = ComponentProps & RadixScrollArea.ScrollAreaProps;
export type ScrollAreaViewportProps = ComponentProps & RadixScrollArea.ScrollAreaViewportProps;
export type ScrollAreaScrollbarProps = ComponentProps & RadixScrollArea.ScrollAreaScrollbarProps;
export type ScrollAreaThumbProps = ComponentProps & RadixScrollArea.ScrollAreaThumbProps;
export type ScrollAreaCornerProps = ComponentProps & RadixScrollArea.ScrollAreaCornerProps;

export const ScrollArea: React.FC<ScrollAreaProps> = (props) => {
    return <RadixScrollArea.ScrollArea {...mergeComponentProps("scroll-area", props)} />
}
export const ScrollAreaViewport: React.FC<ScrollAreaViewportProps> = (props) => {
    return <RadixScrollArea.ScrollAreaViewport {...mergeComponentProps("scroll-area__viewport", props)} />
}
export const ScrollAreaScrollbar: React.FC<ScrollAreaScrollbarProps> = (props) => {
    return <RadixScrollArea.ScrollAreaScrollbar {...mergeComponentProps("scroll-area__scrollbar", props)} />
}
export const ScrollAreaThumb: React.FC<ScrollAreaThumbProps> = (props) => {
    return <RadixScrollArea.ScrollAreaThumb {...mergeComponentProps("scroll-area__thumb", props)} />
}
export const ScrollAreaCorner: React.FC<ScrollAreaCornerProps> = (props) => {
    return <RadixScrollArea.ScrollAreaCorner {...mergeComponentProps("scroll-area__corner", props)} />
}

export type AutoScrollAreaProps = ScrollAreaProps

/**
 * ScrollArea that sizes itself to its content and scrolls once the content
 * exceeds the available height of the surrounding Radix popper (menus,
 * sub menus, tooltips). Used internally by MenuContent, MenuSubContent,
 * ContextMenuContent, ContextMenuSubContent and TooltipContent.
 */
export const AutoScrollArea: React.FC<AutoScrollAreaProps> = (props) => {
    const {children, mah = "var(--radix-popper-available-height, 100vh)", ...rest} = props
    const contentRef = React.useRef<HTMLDivElement>(null)
    const [height, setHeight] = React.useState<number>()

    React.useLayoutEffect(() => {
        const el = contentRef.current
        if (!el) return
        const observer = new ResizeObserver((entries) => {
            const entry = entries[0]
            if (entry) setHeight(entry.contentRect.height)
        })
        observer.observe(el)
        return () => observer.disconnect()
    }, [])

    return <ScrollArea className={"scroll-area--auto"} mah={mah}
                       h={height !== undefined ? `${height}px` : undefined} {...rest}>
        <ScrollAreaViewport>
            <div ref={contentRef}>
                {children}
            </div>
        </ScrollAreaViewport>
        <ScrollAreaScrollbar orientation={"vertical"}>
            <ScrollAreaThumb/>
        </ScrollAreaScrollbar>
    </ScrollArea>
}