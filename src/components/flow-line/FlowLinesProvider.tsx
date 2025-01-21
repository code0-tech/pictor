"use client"

import React from "react";
import "./FlowLines.style.scss"

export interface Coordinates {
    x: number
    y: number
}

export interface FlowLine {
    startPoint: Coordinates
    endPoint: Coordinates
    //defaults to vertical
    align?: 'vertical' | 'horizontal'
    //defaults to code0 branding color
    color?: string
    //TODO: labeling
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
    const [flowLines, setFlowLines] = React.useState<FlowLine[]>([])
    const svgRef = React.useRef<SVGSVGElement>(null)

    const addFlowLine = (flowLine: FlowLine): number => {

        setFlowLines(prevState => {
            return [
                ...prevState,
                {
                    ...flowLine,
                    startPoint: {
                        x: flowLine.startPoint.x - (svgRef.current?.getBoundingClientRect().x ?? 0),
                        y: flowLine.startPoint.y - (svgRef.current?.getBoundingClientRect().y ?? 0)
                    },
                    endPoint: {
                        x: flowLine.endPoint.x - (svgRef.current?.getBoundingClientRect().x ?? 0),
                        y: flowLine.endPoint.y - (svgRef.current?.getBoundingClientRect().y ?? 0)
                    }
                }
            ]
        })

        return flowLines.length
    }

    const removeFlowLine = React.useCallback((id: number) => {
        setFlowLines(prevState => {
            prevState.splice(id, 1)
            return prevState
        })
    }, [flowLines])

    React.useEffect(() => {
        console.log(flowLines)
    }, [flowLines]);

    const svgElement = React.useMemo(() => {
        return <svg ref={svgRef} className={"flow-lines"}>
            {
                flowLines.map((line, index) => {

                    const {color = '#70ffb2', align = 'vertical', startPoint, endPoint} = line

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
