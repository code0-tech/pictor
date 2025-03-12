import React from "react";
import DSplitPane, {DSplitPaneProps} from "./DSplitPane";
import DSplitter from "./DSplitter";
import {DSplitPaneView, DSplitScreenService, DSplitView} from "./DSplitScreen.service";
import {createStore} from "../../utils/store";
import "./DSplitScreen.style.scss"

export type DSplitScreenDirection = 'vertical' | 'horizontal'

export interface DSplitScreenProps {
    children: React.ReactElement<DSplitPaneProps>[]
    //defaults to horizontal
    direction?: DSplitScreenDirection
}

const DSplitScreen: React.FC<Readonly<DSplitScreenProps>> = (props) => {

    const {children, direction = "horizontal"} = props
    const ref = React.useRef<HTMLDivElement | null>(null)
    const paneRef = React.useRef(new Map<number, HTMLDivElement>())
    const splitterRef = React.useRef(new Map<number, HTMLDivElement>())
    const service = createStore<DSplitView, DSplitScreenService>(DSplitScreenService, (store) => {
        return new DSplitScreenService(store, direction)
    })
    const childrenArray = React.Children.map(children, (child) => {
        return child
    })

    React.useEffect(() => {
        if (paneRef.current.size != React.Children.count(children)) return
        if (splitterRef.current.size != (React.Children.count(children) - 1)) return

        splitterRef.current.forEach((splitter, index) => {
            service.addSplitView(new DSplitView(
                splitter,
                service,
                new DSplitPaneView(
                    paneRef.current.get(index - 1)!!,
                    service,
                    childrenArray[index - 1].props.snap
                ),
                new DSplitPaneView(
                    paneRef.current.get(index)!!,
                    service,
                    childrenArray[index].props.snap
                ),
            ))
        })
    }, [paneRef, splitterRef, children])

    React.useEffect(() => {
        if (!ref.current) return
        setTimeout(() => {
            ref.current?.classList.add("d-split-screen--absolute")
        }, 0)

    }, [ref])

    return <div className={`d-split-screen d-split-screen--${direction}`} ref={ref}>
        <div>
            {
                React.Children.map(children, (child, index) => {
                    return index > 0 ? <DSplitter
                        key={index}
                        ref={(ele) => {
                            splitterRef.current.set(index, ele)
                        }}
                        split={direction}
                    /> : null
                })
            }
        </div>
        <div>

            {
                React.Children.map(children, (child, index) => {
                    return <DSplitPane
                        key={index}
                        ref={(ele) => {
                            paneRef.current.set(index, ele!!)
                        }}
                        children={child.props.children}
                    />
                })
            }
        </div>
    </div>

}

export default DSplitScreen