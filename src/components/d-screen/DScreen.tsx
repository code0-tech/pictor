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
}

export interface DScreenVBarProps extends DScreenBarProps {
    type: 'top' | 'bottom'
}

export interface DScreenHBarProps extends DScreenBarProps {
    type: 'left' | 'right'
}

const Bar = <T extends DScreenBarProps>(barType: 'v' | 'h'): React.FC<T> => (props) => {
    const {type, children, collapsed = false, ...rest} = props
    const [stateCollapsed, setStateCollapsed] = useState(collapsed)
    const barRef = useRef<HTMLDivElement | null>(null)

    const collapse = () => {
        setStateCollapsed(prevState => !prevState)
    }

    const child = typeof children === "function" ? useMemo(() => children(stateCollapsed, collapse), [stateCollapsed]) : children

    return <div ref={barRef} {...mergeCode0Props(`d-screen__${barType}-bar d-screen__${barType}-bar--${type}`, rest)}>
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

