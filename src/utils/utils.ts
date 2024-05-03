import React, {CSSProperties, HTMLProps, ReactNode, useMemo, useState} from "react";
import mergeProps from "merge-props";
import {Code0Component, Code0ComponentProps} from "./types";


export const getChild = (children: ReactNode | ReactNode[], child: React.FC<any>, required?: boolean): React.ReactElement | undefined => {

    const [childComponent, setChildComponent] = useState<React.ReactElement | undefined>()
    useMemo(() => {
        let found = false
        React.Children.forEach(children, (childT, index) => {
            if (React.isValidElement(childT) && childT.type == child) {
                setChildComponent(childT)
                found = true
            }
            else if (React.Children.count(children) - 1 == index && !found && !childComponent && required) throw new Error(`${child.name} is required`)
        })
    }, [children, child])

    return childComponent
}

export const getContent = (children: ReactNode | ReactNode[], ...child: React.FC<any>[]): ReactNode[] | null => {

    const array = React.Children.toArray(children).filter((childT) => {
        if (!React.isValidElement(childT)) return true;
        return !child.find(value => value == childT.type);
    })

    return array.length == 0 ? null : array
}

export interface Positioning {
    height: number
    width: number
    x: number
    y: number
}

const createStyle = (styles: Code0Component<any>): CSSProperties => ({
    ...(styles.m ? {margin: `${styles.m}rem`} : {}),
    ...(styles.my ? {marginTop: `${styles.my}rem`, marginBottom: `${styles.my}rem`} : {}),
    ...(styles.mx ? {marginLeft: `${styles.mx}rem`, marginRight: `${styles.mx}rem`} : {}),
    ...(styles.mt ? {marginTop: `${styles.mt}rem`} : {}),
    ...(styles.mb ? {marginBottom: `${styles.mb}rem`} : {}),
    ...(styles.ml ? {marginLeft: `${styles.ml}rem`} : {}),
    ...(styles.mr ? {marginRight: `${styles.mr}rem`} : {}),
    ...(styles.p ? {padding: `${styles.p}rem`} : {}),
    ...(styles.py ? {paddingTop: `${styles.py}rem`, paddingBottom: `${styles.py}rem`} : {}),
    ...(styles.px ? {paddingLeft: `${styles.px}rem`, paddingRight: `${styles.px}rem`} : {}),
    ...(styles.pt ? {paddingTop: `${styles.pt}rem`} : {}),
    ...(styles.pb ? {paddingBottom: `${styles.pb}rem`} : {}),
    ...(styles.pl ? {paddingLeft: `${styles.pl}rem`} : {}),
    ...(styles.pr ? {paddingRight: `${styles.pr}rem`} : {}),
    ...(styles.bg ? {backgroundColor: styles.bg} : {}),
    ...(styles.c ? {color: styles.c} : {}),
    ...(styles.opacity ? {opacity: styles.opacity} : {}),
    ...(styles.ff ? {fontFamily: styles.ff} : {}),
    ...(styles.fz ? {fontSize: `${styles.fz}rem`} : {}),
    ...(styles.ta ? {textAlign: styles.ta} : {}),
    ...(styles.w ? {width: styles.w} : {}),
    ...(styles.miw ? {minWidth: styles.miw} : {}),
    ...(styles.maw ? {maxWidth: styles.maw} : {}),
    ...(styles.h ? {height: styles.h} : {}),
    ...(styles.mih ? {minHeight: styles.mih} : {}),
    ...(styles.mah ? {maxHeight: styles.mah} : {}),
    ...(styles.pos ? {position: styles.pos} : {}),
    ...(styles.top ? {top: styles.top} : {}),
    ...(styles.left ? {left: styles.left} : {}),
    ...(styles.bottom ? {bottom: styles.bottom} : {}),
    ...(styles.right ? {right: styles.right} : {}),
    ...(styles.display ? {display: styles.display} : {}),
    ...(styles.flex ? {flex: styles.flex} : {}),
    ...(styles.align ? {alignItems: styles.align} : {}),
    ...(styles.justify ? {justifyContent: styles.justify} : {}),
    ...(styles.tf ? {transform: styles.tf} : {}),

})

export const mergeCode0Props = <T extends HTMLElement>(cn: string, rest: Code0Component<T>): HTMLProps<T> => {

    const style = createStyle(rest)
    const newProps: Code0Component<T> = rest;
    const keys: (keyof Code0ComponentProps)[] = ["m", "my", "mx", "mt", "mb", "ml", "mr", "p", "py", "px", "pt", "pb", "pl", "pr", "bg", "c", "opacity", "ff", "fz", "fw", "lts", "ta", "lh", "fs", "tt", "td", "w", "miw", "maw", "h", "mih", "mah", "bgsz", "bgp", "bgr", "bga", "pos", "top", "left", "bottom", "right", "inset", "display", "flex", "align", "justify", "tf"]

    keys.forEach(key => {
        delete newProps[key]
    })

    return mergeProps(newProps, {
        className: cn,
        ...(Object.keys(style).length !== 0 ? {style: style} : {})
    })
}

export const getWindowPositioning = (): Omit<Omit<Positioning, "x">, "y"> => {
    return {
        height: window.innerHeight,
        width: window.innerWidth
    }
}

export const getPositioning = (node: HTMLElement): Positioning => {
    return {
        width: node.offsetWidth,
        height: node.offsetHeight,
        x: node.getBoundingClientRect().left,
        y: node.getBoundingClientRect().top
    }
}

export const getPositionAroundTarget = (target: HTMLElement, element: HTMLElement, position: 'top' | 'bottom' | 'left' | 'right' = "bottom") => {

    const margin = 8
    const targetPos = getPositioning(target)
    const elementPos = getPositioning(element)
    const windowSize = getWindowPositioning()

    const positionObject = [
        {
            name: "bottom",
            hierarchy: ["top", "left", "right"],
            calculationY: (targetPos.y + targetPos.height + margin),
            calculationX: (targetPos.x),
            conditionFit: ((targetPos.y + targetPos.height + margin + elementPos.height) <= windowSize.height)
        },
        {
            name: "top",
            hierarchy: ["bottom", "left", "right"],
            calculationY: (targetPos.y - margin - elementPos.height),
            calculationX: (targetPos.x),
            conditionFit: ((targetPos.y - margin - elementPos.height) >= 0)
        },
        {
            name: "left",
            hierarchy: ["right", "bottom", "top"],
            calculationY: (targetPos.y),
            calculationX: (targetPos.x - margin - elementPos.width),
            conditionFit: ((targetPos.x - margin - elementPos.width) >= 0)
        },
        {
            name: "right",
            hierarchy: ["left", "bottom", "top"],
            calculationY: (targetPos.y),
            calculationX: (targetPos.x + margin + targetPos.width),
            conditionFit: ((targetPos.x + targetPos.width + margin + elementPos.width) <= windowSize.width)
        }
    ]

    const currentPositionObject = positionObject.find(value => value.name == position)

    if (!currentPositionObject) return {
        position: "bottom",
        y: positionObject[0].calculationY,
        x: positionObject[0].calculationX
    }

    if (currentPositionObject.conditionFit) return {
        position,
        y: currentPositionObject.calculationY,
        x: currentPositionObject.calculationX
    }


    for (let i = 0; i < currentPositionObject.hierarchy.length; i++) {
        const tempPositionObject = positionObject.find(value => value.name == currentPositionObject.hierarchy[i])
        if (tempPositionObject?.conditionFit) return {
            position: tempPositionObject.name,
            y: tempPositionObject.calculationY,
            x: tempPositionObject.calculationX
        }

    }

    return {
        position: "bottom",
        y: positionObject[0].calculationY,
        x: positionObject[0].calculationX
    }

}