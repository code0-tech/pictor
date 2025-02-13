import React from "react";
import DSplitPane, {DSplitPaneHandle, DSplitPaneProps} from "./DSplitPane";
import DSplitter from "./DSplitter";

import "./DSplitScreen.style.scss"

export type DSplitScreenDirection = 'vertical' | 'horizontal'

export interface DSplitScreenProps {
    children: React.ReactElement<DSplitPaneProps>[]
    //defaults to horizontal
    direction?: DSplitScreenDirection
}

const DSplitScreen: React.FC<Readonly<DSplitScreenProps>> = (props) => {

    const {children, direction = "horizontal"} = props
    const store: DSplitPaneProps[] = []

    React.Children.forEach(children, (child, index) => {

        if (!React.isValidElement(child)) return

        store.push({
            ref: (child as any).ref ?? React.useRef(null),
            key: index,
            ...child.props,
            direction: direction as DSplitScreenDirection
        })

    })


    return <div className={`d-split-screen d-split-screen--${direction}`}>
        {
            store.map((pane, index) => {

                return <React.Fragment key={index}>
                    <DSplitPane {...pane}/>
                    {/**display line splitter only between panes**/}
                    {index < store.length - 1 ? <DSplitter
                        direction={direction as DSplitScreenDirection}
                        firstPane={pane.ref as React.RefObject<DSplitPaneHandle & HTMLDivElement>}
                        secondPane={store[index + 1].ref as React.RefObject<DSplitPaneHandle & HTMLDivElement>}/> : null}
                </React.Fragment>
            })
        }
    </div>

}

export default DSplitScreen