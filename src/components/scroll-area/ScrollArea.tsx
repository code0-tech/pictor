import React from "react";
import {Code0ComponentProps} from "../../utils/types";
import * as RadixScrollArea from "@radix-ui/react-scroll-area";
import {mergeCode0Props} from "../../utils/utils";
import "./ScrollArea.style.scss"

export type ScrollAreaProps = Code0ComponentProps & RadixScrollArea.ScrollAreaProps;
export type ScrollAreaViewportProps = Code0ComponentProps & RadixScrollArea.ScrollAreaViewportProps;
export type ScrollAreaScrollbarProps = Code0ComponentProps & RadixScrollArea.ScrollAreaScrollbarProps;
export type ScrollAreaThumbProps = Code0ComponentProps & RadixScrollArea.ScrollAreaThumbProps;
export type ScrollAreaCornerProps = Code0ComponentProps & RadixScrollArea.ScrollAreaCornerProps;

export const ScrollArea: React.FC<ScrollAreaProps> = (props) => {
    return <RadixScrollArea.ScrollArea {...mergeCode0Props("scroll-area", props)} />
}
export const ScrollAreaViewport: React.FC<ScrollAreaViewportProps> = (props) => {
    return <RadixScrollArea.ScrollAreaViewport {...mergeCode0Props("scroll-area__viewport", props)} />
}
export const ScrollAreaScrollbar: React.FC<ScrollAreaScrollbarProps> = (props) => {
    return <RadixScrollArea.ScrollAreaScrollbar {...mergeCode0Props("scroll-area__scrollbar", props)} />
}
export const ScrollAreaThumb: React.FC<ScrollAreaThumbProps> = (props) => {
    return <RadixScrollArea.ScrollAreaThumb {...mergeCode0Props("scroll-area__thumb", props)} />
}
export const ScrollAreaCorner: React.FC<ScrollAreaCornerProps> = (props) => {
    return <RadixScrollArea.ScrollAreaCorner {...mergeCode0Props("scroll-area__corner", props)} />
}