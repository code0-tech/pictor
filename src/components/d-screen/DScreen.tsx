import React from "react";
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

export interface VBar extends Code0Component<HTMLDivElement> {
    type: 'top' | 'bottom'
    children: React.ReactNode[] | React.ReactNode
}

const VBar: React.FC<VBar> = (props) => {
    const {type, children, ...rest} = props
    return <div {...mergeCode0Props(`d-screen__v-bar d-screen__v-bar--${type}`, rest)}>
        {children}
    </div>
}

const VBarTop: React.FC<Omit<VBar, "type">> = (props) => <VBar type={"top"} {...props}/>
const VBarBottom: React.FC<Omit<VBar, "type">> = (props) => <VBar type={"bottom"} {...props}/>

export interface HBar extends Code0Component<HTMLDivElement> {
    type: 'left' | 'right'
    children: React.ReactNode[] | React.ReactNode
}

const HBar: React.FC<HBar> = (props) => {
    const {type, children, ...rest} = props
    return <div {...mergeCode0Props(`d-screen__h-bar d-screen__h-bar--${type}`, rest)}>
        {children}
    </div>
}

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

