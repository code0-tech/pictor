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