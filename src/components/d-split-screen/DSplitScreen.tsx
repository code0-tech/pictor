import React from "react";
import DSplitPane, {DSplitPaneProps} from "./pane/DSplitPane";
import DSplitter from "./splitter/DSplitter";
import {DSplitScreenService} from "./DSplitScreen.service";
import {createService} from "../../utils/store";
import {DSplitPaneView} from "./pane/DSplitPane.view";
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
    const paneElementRef = React.useRef(new Map<number, HTMLDivElement>())
    const splitterElementRef = React.useRef(new Map<number, HTMLDivElement>())
    const [_, service] = createService<DSplitPaneView, DSplitScreenService>(DSplitScreenService, (store) => {
        return new DSplitScreenService(store, direction)
    }, React.Children.map(children, (child) => {
        return new DSplitPaneView(direction, child.props)
    }))

    //when the component is rendered
    //set the panes and splitter elements together in their respected views
    //to prevent issues with not be able to access the elements
    React.useEffect(() => {

        const childrenVisible = service.activePaneViews.length

        if (paneElementRef.current.size < childrenVisible) return
        if (splitterElementRef.current.size < (childrenVisible - 1)) return

        service.activePaneViews.forEach((paneView, index) => {
            paneView.setElement(paneElementRef.current.get(index) as HTMLDivElement)
        })

        service.splitViews.forEach((splitView, index) => {
            splitView.setSplitter(splitterElementRef.current.get(index) as HTMLDivElement)
        })
    })

    React.Children.forEach(children, (child, index) =>
        // @ts-ignore
        React.useImperativeHandle(child.props.ref, () => ({
            show: () => service.showPaneView(index),
            hide: () => service.hidePaneView(index)
        }))
    )


    return <div className={`d-split-screen d-split-screen--absolute d-split-screen--${direction}`}
                ref={ref}
                key={service.activePaneViews.length}>
        <div>
            {
                service.splitViews.map((view, index) => {
                    return <DSplitter
                        splitView={view}
                        ref={(ele: HTMLDivElement) => {
                            ele && splitterElementRef.current.set(index, ele)
                        }}
                        split={direction}
                    />
                })
            }
        </div>
        <div>

            {
                service.activePaneViews.map((paneView, index) => {
                    return <DSplitPane
                        {...paneView.getProps()}
                        //@ts-ignore
                        ref={(ele: HTMLDivElement) => {
                            ele && paneElementRef.current.set(index, ele)
                        }}
                    />
                })
            }
        </div>
    </div>

}

export default DSplitScreen