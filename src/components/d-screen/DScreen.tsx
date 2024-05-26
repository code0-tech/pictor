"use client"

import React, {useEffect, useMemo, useRef, useState} from "react";
import {Code0Component} from "../../utils/types";
import "./DScreen.style.scss"
import {getChild, mergeCode0Props} from "../../utils/utils";

export interface DScreenType extends Code0Component<HTMLDivElement> {
    children: React.ReactElement<Omit<VBar, "type"> & Content>[]
}

const DScreen: React.FC<DScreenType> = (props) => {
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

interface BarProps extends Omit<Code0Component<HTMLDivElement>, "children"> {
    children: React.ReactElement<BarContentProps>[] | React.ReactElement<BarContentProps> | ((collapsed: boolean, collapse: () => void) => React.ReactElement<BarContentProps>[] | React.ReactElement<BarContentProps>)
}

export interface VBar extends BarProps {
    type: 'top' | 'bottom'
}

export interface HBar extends BarProps {
    type: 'left' | 'right'
}

const VBar: React.FC<VBar> = (props) => {
    const {type, children, ...rest} = props
    const [collapsed, setCollapsed] = useState(false)
    const barRef = useRef<HTMLDivElement | null>(null)

    const collapse = () => {
        setCollapsed(prevState => !prevState)
    }

    const child = typeof children === "function" ? useMemo(() => children(collapsed, collapse), [collapsed]) : children

    return <div ref={barRef} {...mergeCode0Props(`d-screen__v-bar d-screen__v-bar--${type}`, rest)}>
        {child}
    </div>
}
const HBar: React.FC<HBar> = (props) => {

    const {type, children, ...rest} = props
    const [collapsed, setCollapsed] = useState(false)
    const barRef = useRef<HTMLDivElement | null>(null)

    const collapse = () => {
        setCollapsed(prevState => !prevState)
    }

    const child = typeof children === "function" ? useMemo(() => children(collapsed, collapse), [collapsed]) : children

    return <div ref={barRef} {...mergeCode0Props(`d-screen__h-bar d-screen__h-bar--${type}`, rest)}>
        {child}
    </div>
}
const VBarTop: React.FC<Omit<VBar, "type">> = (props) => <VBar type={"top"} {...props}/>
const VBarBottom: React.FC<Omit<VBar, "type">> = (props) => <VBar type={"bottom"} {...props}/>
const HBarLeft: React.FC<Omit<HBar, "type">> = (props) => <HBar type={"left"} {...props}/>
const HBarRight: React.FC<Omit<HBar, "type">> = (props) => <HBar type={"right"} {...props}/>

export interface BarContentProps extends Code0Component<HTMLDivElement> {
    children: React.ReactNode | React.ReactNode[]
    mediaMinHeight?: number
    mediaMinWidth?: number
    mediaMaxHeight?: number
    mediaMaxWidth?: number
}

const BarContent: React.FC<BarContentProps> = props => {
    const {
        children,
        mediaMinHeight = 0,
        mediaMinWidth = 0,
        mediaMaxHeight = 0,
        mediaMaxWidth = 0,
        ...rest} = props
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

export interface Content extends Code0Component<HTMLDivElement> {
    children: React.ReactNode[] | React.ReactNode
}

const Content: React.FC<Content> = (props) => {
    const {children, ...rest} = props
    return <div {...mergeCode0Props(`d-screen__content`, rest)}>
        {children}
    </div>
}

export interface Item extends Code0Component<HTMLSpanElement> {
    children: React.ReactNode[] | React.ReactNode
    //defaults to false
    active?: boolean
}

const Item: React.FC<Item> = (props) => {
    const {children, active, ...rest} = props
    return <span {...mergeCode0Props(`d-screen__item ${active ? "d-screen__item--active" : ""}`, rest)}>
        {children}
    </span>
}

export interface CollapsableItemProps extends Code0Component<HTMLDivElement> {
    children: React.ReactNode[] | React.ReactNode
}

const CollapsableItem: React.FC<CollapsableItemProps> = props => {
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

