import React from "react";
import DSplitPane, {DSplitPaneProps} from "./pane/DSplitPane";
import DSplitter from "./DSplitter";
import {DSplitPaneView, DSplitScreenService} from "./DSplitScreen.service";
import {createStore} from "../../utils/store";
import "./DSplitScreen.style.scss"
import {DSplitView} from "./DSplitter.view";

export type DSplitScreenDirection = 'vertical' | 'horizontal'

export interface DSplitScreenProps {
    children: React.ReactElement<DSplitPaneProps>[]
    //defaults to horizontal
    direction?: DSplitScreenDirection
}

const DSplitScreen: React.FC<Readonly<DSplitScreenProps>> = (props) => {

    const {children, direction = "horizontal"} = props
    const ref = React.useRef<HTMLDivElement | null>(null)
    const paneElementRef = React.useRef(new Map<number, HTMLDivElement>())
    const splitterElementRef = React.useRef(new Map<number, HTMLDivElement>())
    const paneRef = React.useRef(new Map<number, DSplitPaneView>())
    const service = createStore<DSplitView, DSplitScreenService>(DSplitScreenService, (store) => {
        return new DSplitScreenService(store, direction)
    })

    //if every splitter and pane element is rendered
    //set the panes and splitter elements together in their respected views
    //to prevent issues with not be able to access the elements
    React.useEffect(() => {
        if (paneElementRef.current.size != React.Children.count(children)) return
        if (splitterElementRef.current.size != (React.Children.count(children) - 1)) return

        service.getAllPaneViews().forEach((paneView, index) => {
            paneView.setElement(paneElementRef.current.get(index) as HTMLDivElement)
        })

        service.getAllSplitViews().forEach((splitView, index) => {
            splitView.setSplitter(splitterElementRef.current.get(index) as HTMLDivElement)
        })

    }, [splitterElementRef, splitterElementRef])

    React.useEffect(() => {
        if (!ref.current) return
        setTimeout(() => ref.current?.classList.add("d-split-screen--absolute"), 0)
    }, [ref])

    //create a view element for every pane
    React.Children.forEach(children, (child, index) => {
        paneRef.current.set(index, new DSplitPaneView(
            service,
            child.props
        ))
    })

    //register split view with panes into the store
    paneRef.current.forEach((paneView, key) => {
        key < paneRef.current.size - 1 && service.setSplitView(key, new DSplitView(
            service,
            paneView,
            paneRef.current.get(key + 1) as DSplitPaneView,
        ))
    })


    return <div className={`d-split-screen d-split-screen--${direction}`} ref={ref}>
        <div>
            {
                service.getAllSplitViews().map((view, index) => {
                    return <DSplitter
                        key={index}
                        splitView={view}
                        ref={(ele: HTMLDivElement) => {
                            splitterElementRef.current.set(index, ele)
                        }}
                        split={direction}
                    />
                })
            }
        </div>
        <div>

            {
                service.getAllPaneViews().map((paneView, index) => {
                    return <DSplitPane
                        key={index}
                        ref={(ele) => {
                            paneElementRef.current.set(index, ele!!)
                        }}
                        {...paneView.getProps()}
                    />
                })
            }
        </div>
    </div>

}

export default DSplitScreen