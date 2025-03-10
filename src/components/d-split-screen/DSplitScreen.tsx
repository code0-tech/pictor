import React from "react";
import DSplitPane, {DSplitPaneHandle, DSplitPaneProps} from "./DSplitPane";
import DSplitter from "./DSplitter";

import "./DSplitScreen.style.scss"
import {DSplitPaneView, DSplitScreenService, DSplitView} from "./DSplitScreen.service";
import {createStore} from "../../utils/store";

export type DSplitScreenDirection = 'vertical' | 'horizontal'

export interface DSplitScreenProps {
    children: React.ReactElement<DSplitPaneProps>[]
    //defaults to horizontal
    direction?: DSplitScreenDirection
}

const DSplitScreen: React.FC<Readonly<DSplitScreenProps>> = (props) => {

    const {children, direction = "horizontal"} = props
    const ref = React.useRef<HTMLDivElement | null>(null)
    const service = createStore<DSplitView, DSplitScreenService>(DSplitScreenService, (store) => {
        return new DSplitScreenService(store, direction)
    })

    const store: DSplitPaneView[] = []

    React.useEffect(() => {
        if (!ref.current) return
        setTimeout(() => {
            ref.current?.classList.add("d-split-screen--absolute")
        }, 0)

    }, [ref])

    React.Children.forEach(children, (child, index) => {
        if (!React.isValidElement(child)) return
        store.push(new DSplitPaneView(
            direction === "horizontal" ? child.props.miw as string : child.props.mih as string,
            direction === "horizontal" ? child.props.maw as string : child.props.mah as string,
            child.props.snap
        ))
    })

    React.Children.forEach(children, (child, index) => {
        if (!React.isValidElement(child)) return
        !!store[index + 1] && service.addSplitView(new DSplitView(
            service,
            store[index],
            store[index + 1]
        ))
    })

    return <div className={`d-split-screen d-split-screen--${direction}`} ref={ref}>
        <div>
            {
                Array.from(service.getAllSplitViews()).map((view, index) => {
                    return index < store.length - 1 ? <DSplitter key={index} view={view}/> : null
                })
            }
        </div>
        <div>

            {
                store.map((pane, index) => {

                    /**@ts-ignore**/
                    return <DSplitPane key={index} {...pane}/>
                })
            }
        </div>
    </div>

}

export default DSplitScreen