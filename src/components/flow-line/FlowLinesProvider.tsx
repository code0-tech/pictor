"use client"

import React from "react";
import "./FlowLines.style.scss"

interface Coordinates {
    x: number
    y: number
}

interface FlowLineStore {
    startPoint?: Coordinates
    endPoint?: Coordinates
    align?: 'vertical' | 'horizontal'
    color?: string
}

export interface Element {
    element: HTMLDivElement
    orientation: 'TOP' | 'BOTTOM' | 'LEFT' | 'RIGHT'
}

export interface FlowLine extends FlowLineStore {
    startElement: Element
    endElement: Element
}

export interface FlowLinesContext {
    addFlowLine: (flowLine: FlowLine) => number
    removeFlowLine: (id: number) => void
}

export interface FlowLinesProvider {
    children?: React.ReactNode
}

/**
 *
 */
const FlowLinesContext = React.createContext<FlowLinesContext | null>(null)

/**
 *
 */
export const useFlowLines = () => React.useContext(FlowLinesContext) as FlowLinesContext

/**
 *
 * @param props
 * @constructor
 */
const FlowLinesProvider: React.FC<FlowLinesProvider> = (props) => {

    const {children} = props
    const [flowLines, setFlowLines] = React.useState<FlowLineStore[]>([])
    const svgRef = React.useRef<SVGSVGElement | null>(null)

    const calculateCoordinates = (element: Element): Coordinates => {

        const boundingBox = element.element.getBoundingClientRect()
        const orientation = element.orientation

        if (orientation === 'TOP') {
            return {
                x: (boundingBox.x + (boundingBox.width / 2)) - svgRef.current?.getBoundingClientRect().x,
                y: (boundingBox.y) - svgRef.current?.getBoundingClientRect().y
            }
        } else if (orientation === 'BOTTOM') {
            return {
                x: (boundingBox.x + (boundingBox.width / 2)) - svgRef.current?.getBoundingClientRect().x,
                y: (boundingBox.bottom) - svgRef.current?.getBoundingClientRect().y
            }
        } else if (orientation === 'LEFT') {
            return {
                x: (boundingBox.x) - svgRef.current?.getBoundingClientRect().x,
                y: (boundingBox.y + (boundingBox.height / 2)) - svgRef.current?.getBoundingClientRect().y
            }
        }

        return {
            x: (boundingBox.right) - svgRef.current?.getBoundingClientRect().x,
            y: (boundingBox.y + (boundingBox.height / 2)) - svgRef.current?.getBoundingClientRect().y
        }

    }

    /**
     *
     */
    const addFlowLine = React.useCallback((flowLine: FlowLine): number => {
        setFlowLines(prevState => {

            const flowLineStore: FlowLineStore = {
                startPoint: calculateCoordinates(flowLine.startElement),
                endPoint: calculateCoordinates(flowLine.endElement),
                align: flowLine.align,
                color: flowLine.color
            }

            return [
                ...prevState,
                flowLineStore
            ]
        })
        return flowLines.length
    }, [])

    /**
     *
     */
    const removeFlowLine = React.useCallback((id: number) => {
        setFlowLines(prevState => {
            prevState.splice(id, 1)
            return prevState
        })
    }, [flowLines])

    /**
     *
     */
    const svgElement = React.useMemo(() => {
        return <svg ref={svgRef} className={"flow-lines"}>
            {
                flowLines.map((line, index) => {

                    const {color = '#70ffb2', align = 'vertical', startPoint = {x: 0, y: 0}, endPoint = {x: 0, y: 0}} = line

                    const isBottom = startPoint.y < endPoint.y
                    const isTop = startPoint.y > endPoint.y
                    const isRight = startPoint.x < endPoint.x
                    const isLeft = startPoint.x > endPoint.x

                    const height = align == 'vertical' ?
                        ((isBottom ? endPoint.y - startPoint.y : startPoint.y - endPoint.y) - 20 - 1) / 2 :
                        (isBottom ? endPoint.y - startPoint.y : startPoint.y - endPoint.y) - 20 - 2
                    const width = align == 'vertical' ?
                        (isRight ? endPoint.x - startPoint.x : startPoint.x - endPoint.x) - 20 - 2 :
                        ((isRight ? endPoint.x - startPoint.x : startPoint.x - endPoint.x) - 20 - 1) / 2

                    let pathData = `M ${startPoint.x},${startPoint.y}`

                    if (isBottom && isRight) {
                        pathData += align == 'vertical' ? `
                        v${isBottom ? height : -1 * height}
                        a10,10 0 0 0 10,10 
                        h${isRight ? width : -1 * width} 
                        a10,10 0 0 1 10,10 
                        v${isBottom ? height : -1 * height}
                    ` : `
                        h${isRight ? width : -1 * width}
                        a10,10 0 0 1 10,10 
                        v${isBottom ? height : -1 * height} 
                        a10,10 0 0 0 10,10 
                        h${isRight ? width : -1 * width}
                    `
                    } else if (isBottom && isLeft) {
                        pathData += align == 'vertical' ? `
                        v${isBottom ? height : -1 * height}
                        a10,10 0 0 1 -10,10
                        h${isRight ? width : -1 * width}
                        a10,10 0 0 0 -10,10
                        v${isBottom ? height : -1 * height}
                    ` : `
                        h${isRight ? width : -1 * width}
                        a10,10 0 0 0 -10,10 
                        v${isBottom ? height : -1 * height} 
                        a10,10 0 0 1 -10,10 
                        h${isRight ? width : -1 * width}
                    `
                    } else if (isTop && isRight) {
                        pathData += align == 'vertical' ? `
                        v${isBottom ? height : -1 * height}
                        a10,10 0 0 1 10,-10 
                        h${isRight ? width : -1 * width} 
                        a10,10 0 0 0 10,-10 
                        v${isBottom ? height : -1 * height}
                    ` : `
                        h${isRight ? width : -1 * width}
                        a10,10 0 0 0 10,-10 
                        v${isBottom ? height : -1 * height} 
                        a10,10 0 0 1 10,-10 
                        h${isRight ? width : -1 * width}
                    `
                    } else if (isTop && isLeft) {
                        pathData += align == 'vertical' ? `
                        v${isBottom ? height : -1 * height}
                        a10,10 0 0 0 -10,-10 
                        h${isRight ? width : -1 * width} 
                        a10,10 0 0 1 -10,-10 
                        v${isBottom ? height : -1 * height}
                    ` : `
                        h${isRight ? width : -1 * width}
                        a10,10 0 0 1 -10,-10 
                        v${isBottom ? height : -1 * height} 
                        a10,10 0 0 0 -10,-10 
                        h${isRight ? width : -1 * width}
                    `
                    } else if (isRight) {
                        pathData += `h${width + 20 + 2}`
                    } else if (isLeft) {
                        pathData += `h${-1 * (width + 22)}`
                    } else if (isBottom) {
                        pathData += `v${(height * 2) + 21}`
                    } else if (isTop) {
                        pathData += `v${-1 * ((height * 2) + 21)}`
                    }

                    return <path key={index} d={pathData} stroke={color} strokeWidth="1"
                                 strokeLinecap="round" fill="none" strokeLinejoin="round"/>
                })
            }
        </svg>
    }, [flowLines])

    return <FlowLinesContext.Provider value={{addFlowLine, removeFlowLine}}>
        {svgElement}
        {React.useMemo(() => children, [])}
    </FlowLinesContext.Provider>

}

export default FlowLinesProvider
