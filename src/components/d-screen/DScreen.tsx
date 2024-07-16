"use client"

import React, {useEffect, useMemo, useRef, useState} from "react";
import {Code0Component} from "../../utils/types";
import "./DScreen.style.scss"
import {getChild, mergeCode0Props} from "../../utils/utils";

export interface DScreenProps extends Code0Component<HTMLDivElement> {
    children: React.ReactElement<Omit<DScreenVBarProps, "type"> & DScreenContentProps>[]
}

const DScreen: React.FC<DScreenProps> = (props) => {
    const {children} = props
    const vBarTop = getChild(children, VBarTop, false)
    const vBarBottom = getChild(children, VBarBottom, false)
    const hBarLeft = getChild(children, HBarLeft, false)
    const hBarRight = getChild(children, HBarRight, false)
    const content = getChild(children, Content, true)
    return <div className={"d-screen"}>
        {vBarTop ? vBarTop : null}
        {content ? (
            <div className={"d-screen__v-content"}>
                {hBarLeft ? hBarLeft : null}
                <div className={"d-screen__h-content"}>
                    {content}
                </div>
                {hBarRight ? hBarRight : null}
            </div>
        ) : null}
        {vBarBottom ? vBarBottom : null}
    </div>
}

interface DScreenBarProps extends Omit<Code0Component<HTMLDivElement>, "children"> {
    children: React.ReactElement<DScreenBarContentProps>[] | React.ReactElement<DScreenBarContentProps> | ((collapsed: boolean, collapse: () => void) => React.ReactElement<DScreenBarContentProps>[] | React.ReactElement<DScreenBarContentProps>)
    //defaults to false
    collapsed?: boolean
    resizeable?: boolean
}

export interface DScreenVBarProps extends DScreenBarProps {
    type: 'top' | 'bottom'
}

export interface DScreenHBarProps extends DScreenBarProps {
    type: 'left' | 'right'
}

const Bar = <T extends DScreenBarProps>(barType: 'v' | 'h'): React.FC<T> => (props) => {
    const {type, children, collapsed = false, resizeable = false, ...rest} = props
    const [stateCollapsed, setStateCollapsed] = useState(collapsed)
    const barRef = useRef<HTMLDivElement | null>(null)
    const resizeRef = useRef<HTMLDivElement | null>(null)

    useEffect(() => {

        const startW = barRef.current?.offsetWidth ?? 0
        const startH = barRef.current?.offsetHeight ?? 0
        const minW = barRef.current?.style.minWidth ? parseFloat(barRef.current.style.minWidth) : 0
        const maxW = barRef.current?.style.maxWidth ? parseFloat(barRef.current.style.maxWidth) : Infinity
        const minH = barRef.current?.style.minHeight ? parseFloat(barRef.current.style.minHeight) : 0
        const maxH = barRef.current?.style.maxHeight ? parseFloat(barRef.current.style.maxHeight) : Infinity

        const mouseDown = () => {
            console.log("mousedown")
            const selection = document.getSelection()
            if (selection) selection.removeAllRanges()

            const disableSelect = (event: MouseEvent) => {
                event.preventDefault();
            }

            const mouseMove = (event: MouseEvent) => {
                //calculate new width
                const parentOfBar = barRef.current?.parentElement
                let spacing, mousePosition, widthPixel, widthPercent

                if (barType === "h" && type === "left") {
                    spacing = barRef.current?.getBoundingClientRect().left ?? 0
                    mousePosition = event.clientX
                    widthPixel = Math.max(Math.min((mousePosition - spacing), maxW), minW)
                    const widthPixelAttaching = widthPixel <= (startW + 25) && widthPixel >= (startW - 25) ? startW : widthPixel
                    widthPercent = Math.max(Math.min((((widthPixelAttaching) / (parentOfBar?.offsetWidth ?? 0)) * 100), 100), 0)
                } else if (barType === "h" && type === "right") {
                    spacing = (barRef.current?.getBoundingClientRect().right ?? 0) - (parentOfBar?.offsetWidth ?? 0)
                    mousePosition = (parentOfBar?.offsetWidth ?? 0) - event.clientX
                    widthPixel = Math.max(Math.min((spacing + mousePosition), maxW), minW)
                    const widthPixelAttaching = widthPixel <= (startW + 25) && widthPixel >= (startW - 25) ? startW : widthPixel
                    widthPercent = Math.max(Math.min((((widthPixelAttaching) / ((parentOfBar?.offsetWidth ?? 0))) * 100), 100), 0)
                } else if (barType === "v" && type === "top") {
                    spacing = barRef.current?.getBoundingClientRect().top ?? 0
                    mousePosition = event.clientY
                    widthPixel = Math.max(Math.min((mousePosition - spacing), maxH), minH)
                    const widthPixelAttaching = widthPixel <= (startH + 25) && widthPixel >= (startH - 25) ? startH : widthPixel
                    widthPercent = Math.max(Math.min((((widthPixelAttaching) / (parentOfBar?.offsetHeight ?? 0)) * 100), 100), 0)
                } else if (barType === "v" && type === "bottom") {
                    spacing = (barRef.current?.getBoundingClientRect().bottom ?? 0) - (parentOfBar?.offsetHeight ?? 0)
                    mousePosition = (parentOfBar?.offsetHeight ?? 0) - event.clientY
                    widthPixel = Math.max(Math.min((spacing + mousePosition), maxH), minH)
                    const widthPixelAttaching = widthPixel <= (startH + 25) && widthPixel >= (startH - 25) ? startH : widthPixel
                    widthPercent = Math.max(Math.min((((widthPixelAttaching) / ((parentOfBar?.offsetHeight ?? 0))) * 100), 100), 0)
                }

                //set new width
                if (barType === "h" && barRef.current) {
                    barRef.current.style.minWidth = `${widthPercent}%`
                    barRef.current.style.width = `${widthPercent}%`
                } else if (barType === "v" && barRef.current) {
                    barRef.current.style.minHeight = `${widthPercent}%`
                    barRef.current.style.height = `${widthPercent}%`
                }


            }

            const mouseUpListener = (event: MouseEvent) => {
                console.log("mouseup")
                window.removeEventListener("mousemove", mouseMove)
                window.removeEventListener("touchmove", mouseMove)
                window.removeEventListener("mouseup", mouseUpListener)
                window.removeEventListener("touchend", mouseUpListener)
                window.removeEventListener("selectstart", disableSelect)
            }
            window.addEventListener("mouseup", mouseUpListener)
            window.addEventListener("touchend", mouseUpListener)
            window.addEventListener('selectstart', disableSelect);
            barRef.current && window.addEventListener("mousemove", mouseMove)
            barRef.current && window.addEventListener("touchmove", mouseMove)

        }
        resizeRef.current && resizeRef.current?.addEventListener("mousedown", mouseDown)
        resizeRef.current && resizeRef.current?.addEventListener("touchstart", mouseDown)

        return () => {
            window.removeEventListener("mousedown", mouseDown)
            window.removeEventListener("touchstart", mouseDown)
        }

    }, [barRef, resizeRef]);

    const collapse = () => {
        setStateCollapsed(prevState => !prevState)
    }

    const child = typeof children === "function" ? useMemo(() => children(stateCollapsed, collapse), [stateCollapsed]) : children

    return <div ref={barRef} {...mergeCode0Props(`d-screen__${barType}-bar d-screen__${barType}-bar--${type}`, rest)}>
        {resizeable && <div ref={resizeRef} className={`d-screen__${barType}-bar__resizable d-screen__${barType}-bar__resizable--${type}`} {...rest}/>}
        {child}
    </div>
}

const VBar: React.FC<DScreenVBarProps> = Bar("v")
const HBar: React.FC<DScreenHBarProps> = Bar("h")
const VBarTop: React.FC<Omit<DScreenVBarProps, "type">> = (props) => <VBar type={"top"} {...props}/>
const VBarBottom: React.FC<Omit<DScreenVBarProps, "type">> = (props) => <VBar type={"bottom"} {...props}/>
const HBarLeft: React.FC<Omit<DScreenHBarProps, "type">> = (props) => <HBar type={"left"} {...props}/>
const HBarRight: React.FC<Omit<DScreenHBarProps, "type">> = (props) => <HBar type={"right"} {...props}/>

export interface DScreenBarContentProps extends Code0Component<HTMLDivElement> {
    children: React.ReactNode | React.ReactNode[]
    mediaMinHeight?: number
    mediaMinWidth?: number
    mediaMaxHeight?: number
    mediaMaxWidth?: number
}

const BarContent: React.FC<DScreenBarContentProps> = props => {
    const {
        children,
        mediaMinHeight = 0,
        mediaMinWidth = 0,
        mediaMaxHeight = 0,
        mediaMaxWidth = 0,
        ...rest
    } = props
    const contentRef = useRef<HTMLDivElement | null>(null)

    const resizeCallback = () => {
        if (!contentRef.current) return
        if ((window.innerWidth >= mediaMinWidth && window.innerWidth < (mediaMaxWidth == 0 ? window.innerWidth + 1 : mediaMaxWidth))
            && (window.innerHeight >= mediaMinHeight && window.innerHeight < (mediaMaxHeight == 0 ? window.innerHeight + 1 : mediaMaxHeight))) {
            contentRef.current.style.display = "flex"
        } else {
            contentRef.current.style.display = "none"
        }
    }

    useEffect(() => {
        window.addEventListener('resize', resizeCallback)
        resizeCallback()
        return () => window.removeEventListener('resize', resizeCallback)
    }, [mediaMinHeight, mediaMinWidth, mediaMaxHeight, mediaMaxWidth])

    return <div ref={contentRef} {...mergeCode0Props(`d-screen__bar-content`, rest)}>
        {props.children}
    </div>
}

export interface DScreenContentProps extends Code0Component<HTMLDivElement> {
    children: React.ReactNode[] | React.ReactNode
}

const Content: React.FC<DScreenContentProps> = (props) => {
    const {children, ...rest} = props
    return <div {...mergeCode0Props(`d-screen__content`, rest)}>
        {children}
    </div>
}

export interface DScreenItemProps extends Code0Component<HTMLSpanElement> {
    children: React.ReactNode[] | React.ReactNode
    //defaults to false
    active?: boolean
}

const Item: React.FC<DScreenItemProps> = (props) => {
    const {children, active, ...rest} = props
    return <span {...mergeCode0Props(`d-screen__item ${active ? "d-screen__item--active" : ""}`, rest)}>
        {children}
    </span>
}

export interface DScreenCollapsableItemProps extends Code0Component<HTMLDivElement> {
    children: React.ReactNode[] | React.ReactNode
}

const CollapsableItem: React.FC<DScreenCollapsableItemProps> = props => {
    const {children, ...rest} = props
    return <div {...mergeCode0Props(`d-screen__collapsable-item`, rest)}>
        {children}
    </div>
}

export default Object.assign(DScreen, {
    VBar: {
        Top: VBarTop,
        Bottom: VBarBottom
    },
    HBar: {
        Left: HBarLeft,
        Right: HBarRight
    },
    Content,
    Item,
    BarContent,
    CollapsableItem
})

