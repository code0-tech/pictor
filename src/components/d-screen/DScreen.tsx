"use client"

import React, {useEffect, useMemo, useRef, useState} from "react";
import {Code0Component} from "../../utils/types";
import "./DScreen.style.scss"
import {getChild, mergeCode0Props} from "../../utils/utils";
import {IconLayoutBottombarExpand} from "@tabler/icons-react";

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
            <div data-content className={"d-screen__v-content"}>
                {hBarLeft ? hBarLeft : null}
                <div data-content className={"d-screen__h-content"}>
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
    //defaults to 20px
    resizeAreaDimensions?: number
}

export interface DScreenVBarProps extends DScreenBarProps {
    type: 'top' | 'bottom'
}

export interface DScreenHBarProps extends DScreenBarProps {
    type: 'left' | 'right'
}

const Bar = <T extends DScreenBarProps>(barType: 'v' | 'h'): React.FC<T> => (props) => {
    const {
        type = barType === "v" ? "left" : "top",
        children,
        collapsed = false,
        resizeable = false,
        resizeAreaDimensions = 20,
        ...rest
    } = props
    const [stateCollapsed, setStateCollapsed] = useState(collapsed)
    const [sizePercent, setSizePercent] = useState<number>(Infinity)
    const barRef = useRef<HTMLDivElement | null>(null)
    const barResizeRef = useRef<HTMLDivElement | null>(null)

    useEffect(() => {

        const startW = barRef.current?.offsetWidth ?? 0
        const startH = barRef.current?.offsetHeight ?? 0
        const minW = barRef.current?.style.minWidth ? parseFloat(barRef.current.style.minWidth) : 0
        const maxW = barRef.current?.style.maxWidth ? parseFloat(barRef.current.style.maxWidth) : Infinity
        const minH = barRef.current?.style.minHeight ? parseFloat(barRef.current.style.minHeight) : 0
        const maxH = barRef.current?.style.maxHeight ? parseFloat(barRef.current.style.maxHeight) : Infinity

        const calcElementCoordinates = (element: HTMLElement | null) => {
            const height = element?.offsetHeight ?? 0
            const width = element?.offsetWidth ?? 0

            const leftX = element?.getBoundingClientRect().left ?? 0
            const rightX = leftX + width
            const topY = element?.getBoundingClientRect().top ?? 0
            const bottomY = topY + height

            return {
                height,
                width,
                leftX,
                rightX,
                topY,
                bottomY
            }
        }

        const mouseInArea = (coordinates: any, mouseX: number, mouseY: number) => {
            return mouseX >= coordinates.leftX
                && mouseX <= coordinates.rightX
                && mouseY >= coordinates.topY
                && mouseY <= coordinates.bottomY
        }

        const isInResizeArea = (event: MouseEvent | TouchEvent) => {
            let inResizeArea = false

            const mousePositionY = (event instanceof MouseEvent ? event.clientY : event.touches[0].clientY)
            const mousePositionX = (event instanceof MouseEvent ? event.clientX : event.touches[0].clientX)

            const barCoordinates = calcElementCoordinates(barRef.current)
            const barResizeCoordinates = calcElementCoordinates(barResizeRef.current)

            const mouseOverResize = mouseInArea(barResizeCoordinates, mousePositionX, mousePositionY)

            if (barType === "h" && type === "left")
                inResizeArea = (mousePositionX >= (barCoordinates.rightX - resizeAreaDimensions)
                    && mousePositionX <= (barCoordinates.rightX + resizeAreaDimensions))
                    || mouseOverResize
            else if (barType === "h" && type === "right")
                inResizeArea = (mousePositionX >= (barCoordinates.leftX - resizeAreaDimensions)
                    && mousePositionX <= (barCoordinates.leftX + resizeAreaDimensions))
                    || mouseOverResize
            else if (barType === "v" && type === "top")
                inResizeArea = (mousePositionY >= (barCoordinates.bottomY - resizeAreaDimensions)
                    && mousePositionY <= (barCoordinates.bottomY + resizeAreaDimensions)
                    && mousePositionX >= barCoordinates.leftX
                    && mousePositionX <= barCoordinates.rightX)
                    || mouseOverResize
            else if (barType === "v" && type === "bottom")
                inResizeArea = (mousePositionY >= (barCoordinates.topY - resizeAreaDimensions)
                    && mousePositionY <= (barCoordinates.topY + resizeAreaDimensions)
                    && mousePositionX >= barCoordinates.leftX
                    && mousePositionX <= barCoordinates.rightX)
                    || mouseOverResize

            if (inResizeArea && barRef.current) barRef.current.dataset!!.resize = 'true'
            else if (!inResizeArea && barRef.current) delete barRef.current.dataset!!.resize

            const barParent = barRef.current?.parentElement
            const barContent = barParent?.querySelectorAll(":scope > [data-content]") ?? []
            const barActiveChildrenBars = barContent[0]?.querySelectorAll("[data-resize]") ?? []
            const barActiveBars = barParent?.querySelectorAll("[data-resize]") ?? []

            return inResizeArea && (barActiveChildrenBars.length < 1) && (barActiveBars.length < 2)
        }

        const manageResizeStyle = (isInResizeArea: boolean) => {
            const oppositeType = type === "left" ? "right" : type === "right" ? "left" : type === "top" ? "bottom" : "top"
            const border = `border${[...oppositeType][0].toUpperCase() + [...oppositeType].slice(1).join('')}Color` as "borderTopColor" | "borderLeftColor" | "borderBottomColor" | "borderRightColor"

            if (isInResizeArea && barRef.current) {
                barRef.current.style[border] = "#70ffb2"
            } else if (!isInResizeArea && barRef.current) {
                barRef.current.style[border] = ""
            }

            const resize = document.querySelector("[data-resize]")
            if (resize) document.body.style.cursor = resize.hasAttribute("data-horizontal-bar") ? "col-resize" : "row-resize"
            else document.body.style.cursor = ""
        }

        const mouseMove = (event: MouseEvent | TouchEvent) => {

            setStateCollapsed(false)

            //calculate new width
            const parentOfBar = barRef.current?.parentElement
            let localSizePercent = Infinity

            if (barType === "h" && type === "left") {
                const spacing = barRef.current?.getBoundingClientRect().left ?? 0
                const mousePosition = (event instanceof MouseEvent ? event.clientX : event.touches[0].clientX)
                const widthPixel = Math.max(Math.min((mousePosition - spacing), maxW), minW)
                const widthPixelAttaching = widthPixel <= (startW + 25) && widthPixel >= (startW - 25) ? startW : widthPixel
                localSizePercent = Math.max(Math.min((((widthPixelAttaching) / (parentOfBar?.offsetWidth ?? 0)) * 100), 100), 0)
            } else if (barType === "h" && type === "right") {
                const spacing = (barRef.current?.getBoundingClientRect().right ?? 0) - (parentOfBar?.offsetWidth ?? 0)
                const mousePosition = (parentOfBar?.offsetWidth ?? 0) - (event instanceof MouseEvent ? event.clientX : event.touches[0].clientX)
                const widthPixel = Math.max(Math.min((spacing + mousePosition), maxW), minW)
                const widthPixelAttaching = widthPixel <= (startW + 25) && widthPixel >= (startW - 25) ? startW : widthPixel
                localSizePercent = Math.max(Math.min((((widthPixelAttaching) / ((parentOfBar?.offsetWidth ?? 0))) * 100), 100), 0)
            } else if (barType === "v" && type === "top") {
                const spacing = barRef.current?.getBoundingClientRect().top ?? 0
                const mousePosition = (event instanceof MouseEvent ? event.clientY : event.touches[0].clientY)
                const widthPixel = Math.max(Math.min((mousePosition - spacing), maxH), minH)
                const widthPixelAttaching = widthPixel <= (startH + 25) && widthPixel >= (startH - 25) ? startH : widthPixel
                localSizePercent = Math.max(Math.min((((widthPixelAttaching) / (parentOfBar?.offsetHeight ?? 0)) * 100), 100), 0)
            } else if (barType === "v" && type === "bottom") {
                const spacing = (barRef.current?.getBoundingClientRect().bottom ?? 0) - (parentOfBar?.offsetHeight ?? 0)
                const mousePosition = (parentOfBar?.offsetHeight ?? 0) - (event instanceof MouseEvent ? event.clientY : event.touches[0].clientY)
                const widthPixel = Math.max(Math.min((spacing + mousePosition), maxH), minH)
                const widthPixelAttaching = widthPixel <= (startH + 25) && widthPixel >= (startH - 25) ? startH : widthPixel
                localSizePercent = Math.max(Math.min((((widthPixelAttaching) / ((parentOfBar?.offsetHeight ?? 0))) * 100), 100), 0)
            }

            //set to state
            setSizePercent(localSizePercent)

            //set new width
            if (barType === "h" && barRef.current) {
                barRef.current.style.minWidth = `${localSizePercent}%`
                barRef.current.style.maxWidth = `${localSizePercent}%`
                barRef.current.style.width = `${localSizePercent}%`
            } else if (barType === "v" && barRef.current) {
                barRef.current.style.minHeight = `${localSizePercent}%`
                barRef.current.style.height = `${localSizePercent}%`
            }
        }

        const mouseDown = (event: MouseEvent | TouchEvent) => {

            const inResizeArea = isInResizeArea(event)
            if (!inResizeArea) return

            manageResizeStyle(inResizeArea)

            const selection = document.getSelection()
            if (selection) selection.removeAllRanges()

            const disableSelect = (event: MouseEvent) => {
                event.preventDefault();
            }

            const mouseUpListener = (event: MouseEvent) => {
                const inResizeArea = isInResizeArea(event)
                manageResizeStyle(inResizeArea)

                window.removeEventListener("touchcancel", mouseUpListener)
                window.removeEventListener("touchend", mouseUpListener)
                window.removeEventListener("mouseup", mouseUpListener)

                window.removeEventListener("selectstart", disableSelect)

                window.removeEventListener("mousemove", mouseMove)
                window.removeEventListener("touchmove", mouseMove)
            }

            window.addEventListener("touchcancel", mouseUpListener)
            window.addEventListener("touchend", mouseUpListener)
            window.addEventListener("mouseup", mouseUpListener)

            window.addEventListener('selectstart', disableSelect);

            window.addEventListener("mousemove", mouseMove)
            window.addEventListener("touchmove", mouseMove)

        }

        const mouseMoveWindow = (event: MouseEvent | TouchEvent) => {
            const inResizeArea = isInResizeArea(event)
            manageResizeStyle(inResizeArea)
        }

        window.addEventListener("mousemove", mouseMoveWindow)
        window.addEventListener("touchstart", mouseDown)
        window.addEventListener("mousedown", mouseDown)

        return () => {
            window.removeEventListener("mousemove", mouseMoveWindow)
            window.removeEventListener("touchstart", mouseDown)
            window.removeEventListener("mousedown", mouseDown)
        }

    }, [barRef, barResizeRef]);

    const collapse = () => {
        setStateCollapsed(prevState => {
            if (!prevState && resizeable && barRef.current && barType === "h") {
                barRef.current.style.minWidth = ""
                barRef.current.style.width = ""
            } else if (!prevState && resizeable && barRef.current && barType === "v") {
                barRef.current.style.minHeight = ""
                barRef.current.style.height = ""
            }
            return !prevState
        })

    }

    const child = typeof children === "function" ? useMemo(() => children(stateCollapsed, collapse), [stateCollapsed]) : children

    return <div ref={barRef} {...(barType === "h" ? {"data-horizontal-bar": true} : {"data-vertical-bar": true})} {...mergeCode0Props(`d-screen__${barType}-bar d-screen__${barType}-bar--${type}`, rest)}>

        {sizePercent <= 1 && <div ref={barResizeRef}
                                  className={`d-screen__${barType}-bar__resizable-label d-screen__${barType}-bar__resizable-label--${type}`}>
            <IconLayoutBottombarExpand/>
        </div>}

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

