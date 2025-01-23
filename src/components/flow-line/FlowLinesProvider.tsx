"use client"

import React from "react";
import "./FlowLines.style.scss"

interface Coordinates {
    x: number
    y: number
}


interface FlowLineStore {
    startPoint: Coordinates
    endPoint: Coordinates
    align?: FlowLineAlignment
    color?: string
}

export type FlowLineAlignment = 'vertical' | 'horizontal'

export interface FlowLine extends Partial<FlowLineStore> {
    startElement: HTMLDivElement
    endElement: HTMLDivElement
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

    /**
     *  This function calculates the linking coordinates within the starting element
     *  in relation to the ending element.
     *  For vertical alignment its only possible to connect from TOP to BOTTOM.
     *  For horizontal alignment its only possible to connect from RIGHT to LEFT.
     *  Also, the opposite is possible for both.
     *
     *  Currently, the default behaviour is the RIGHT connection coordinates.
     *
     *  This function is also memorized with no dependencies to increase performance.
     */
    const calculateCoordinates = React.useCallback((startElement: HTMLElement, endElement: HTMLElement, alignment: FlowLineAlignment = "vertical"): Coordinates => {

        const bBStartElement = startElement.getBoundingClientRect()
        const bBEndElement = endElement.getBoundingClientRect()

        if (alignment === 'vertical' && bBEndElement.y <= bBStartElement.y) {
            return {
                x: (bBStartElement.x + (bBStartElement.width / 2)) - svgRef.current?.getBoundingClientRect().x,
                y: (bBStartElement.y) - svgRef.current?.getBoundingClientRect().y
            }
        } else if (alignment === 'vertical' && bBStartElement.y <= bBEndElement.y) {
            return {
                x: (bBStartElement.x + (bBStartElement.width / 2)) - svgRef.current?.getBoundingClientRect().x,
                y: (bBStartElement.bottom) - svgRef.current?.getBoundingClientRect().y
            }
        } else if (alignment === 'horizontal' && bBEndElement.x >= bBStartElement.x) {
            return {
                x: (bBStartElement.x) - svgRef.current?.getBoundingClientRect().x,
                y: (bBStartElement.y + (bBStartElement.height / 2)) - svgRef.current?.getBoundingClientRect().y
            }
        }

        return {
            x: (bBStartElement.right) - svgRef.current?.getBoundingClientRect().x,
            y: (bBStartElement.y + (bBStartElement.height / 2)) - svgRef.current?.getBoundingClientRect().y
        }

    }, [])

    /**
     * Adds a line between to HTMLElements to the flow-line-store.
     * It also transforms the elements to real calculated coordinates.
     */
    const addFlowLine = React.useCallback((flowLine: FlowLine): number => {
        setFlowLines(prevState => {

            const flowLineStore: FlowLineStore = {
                startPoint: calculateCoordinates(flowLine.startElement, flowLine.endElement, flowLine.align),
                endPoint: calculateCoordinates(flowLine.endElement, flowLine.startElement, flowLine.align),
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
     * Removes a generated line from store based upon the line id.
     *
     * @todo check if flowLines are needed as dependency to increase performance
     */
    const removeFlowLine = React.useCallback((id: number) => {
        setFlowLines(prevState => {
            prevState.splice(id, 1)
            return prevState
        })
    }, [flowLines])

    /**
     * Rendered svg paths based on calculated start / end points.
     * This function is memorized by flowLines to minimize the rendering.
     *
     * @todo minimize mapping function to reduce overall complexity
     */
    const svgElement = React.useMemo(() => {
        return <svg ref={svgRef} className={"flow-lines"}>
            {
                flowLines.map((line, index) => {

                    const {
                        color = '#70ffb2',
                        align = 'vertical',
                        startPoint = {x: 0, y: 0},
                        endPoint = {x: 0, y: 0}
                    } = line

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
