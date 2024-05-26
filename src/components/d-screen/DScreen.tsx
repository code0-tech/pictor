import React, {useCallback, useEffect, useMemo, useRef, useState} from "react";
import {Code0Component} from "../../utils/types";
import "./DScreen.style.scss"
import {getChild, mergeCode0Props} from "../../utils/utils";

export interface DScreenType extends Code0Component<HTMLDivElement> {
    children: React.ReactElement<Omit<VBar, "type"> & Content>[]
}

/**
 *
 * @constructor
 *
 * @example
 *
 * <DScreen>
 *     <DScreen.VBar>
 *     </DScreen.VBar>
 *     <DScreen.VContent>
 *         <DScreen.HBar type="left">
 *         </DScreen.HBar>
 *         <DScreen.HContent>
 *         </DScreen.HContent>
 *         <DScreen.HBar type="right">
 *         </DScreen.HBar>
 *     </DScreen.VContent>
 *     <DScreen.VBar>
 *     </DScreen.VBar>
 * </DScreen>
 *
 * @example
 *
 * <DScreen>
 *     <DScreen.VBar.Top>
 *      <DScreen.VBar.Bottom>
 *     <DScreen.HBar.Left>
 *     <DScreen.HBar.Right>
 *     <DScreen.Content>
 *
 */
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
    children: React.ReactNode[] | React.ReactNode | ((size: number, collapsed: boolean, collapse: () => void) => React.ReactNode | React.ReactNode[])
    defaultSize?: number
    maxSizes?: number[]
}

export interface VBar extends BarProps {
    type: 'top' | 'bottom'
}

export interface HBar extends BarProps {
    type: 'left' | 'right'
}

const VBar: React.FC<VBar> = (props) => {
    const {type, children, ...rest} = props
    return <div {...mergeCode0Props(`d-screen__v-bar d-screen__v-bar--${type}`, rest)}>
        <div {...mergeCode0Props(`d-screen__v-bar-content`, rest)}>
            {typeof children === "function" ? children(1, false, () => {}) : children}
        </div>
    </div>
}
const HBar: React.FC<HBar> = (props) => {

    const {type, children, maxSizes, defaultSize = 0, ...rest} = props

    const [size, setSize] = useState<number>(defaultSize)
    const [collapsed, setCollapsed] = useState(false)
    const barRef = useRef<HTMLDivElement | null>(null)

    const callback = () => {
        if (!barRef.current || collapsed) return
        const width = window.innerWidth
        const matchingSize = maxSizes?.sort((a, b) => b - a).find((size) => size <= width) ?? 0
        setSize(matchingSize)
    }

    const collapse = () => {
        setCollapsed(prevState => {
            const newValue = !prevState
            const minSize = maxSizes?.sort((a, b) => a - b)[0] ?? 0
            newValue && setSize(minSize)
            return newValue
        })
    }


    useEffect(() => {
        if (!barRef.current) return
        window.addEventListener("resize", callback)
        callback()
        return () => {
            window.removeEventListener("resize", callback)
        }
    }, [collapsed])

    const child = typeof children === "function" ? useMemo(() => children(size, collapsed, collapse), [size, collapsed]) : children

    return <div ref={barRef} {...mergeCode0Props(`d-screen__h-bar d-screen__h-bar--${type}`, rest)}>
        <div {...mergeCode0Props(`d-screen__h-bar-content`, rest)}>
            {child}
        </div>
    </div>
}
const VBarTop: React.FC<Omit<VBar, "type">> = (props) => <VBar type={"top"} {...props}/>
const VBarBottom: React.FC<Omit<VBar, "type">> = (props) => <VBar type={"bottom"} {...props}/>
const HBarLeft: React.FC<Omit<HBar, "type">> = (props) => <HBar type={"left"} {...props}/>
const HBarRight: React.FC<Omit<HBar, "type">> = (props) => <HBar type={"right"} {...props}/>

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
    Item
})

