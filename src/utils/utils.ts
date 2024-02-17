import React, {ReactNode, useEffect, useMemo, useState} from "react";

export type Variant = "primary" | "secondary" | "info" | "success" | "warning" | "error";

export const Variants: Variant[] = ["primary", "secondary", "info", "success", "warning", "error"]

export type Size = "xs" | "sm" | "md" | "lg" | "xl";

export const Sizes: Size[] = ["xs", "sm", "md", "lg", "xl"]


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