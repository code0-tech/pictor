import "./DScreen.style.scss"
import React from "react";
import {Code0Component} from "../../utils/types";
import {getChild, getContent} from "../../utils/utils";
import Bar, {DScreenBarProps} from "./DScreenBar";

export interface DScreenProps extends Code0Component<HTMLDivElement> {
    children: React.ReactElement<DScreenBarProps | HTMLElement>[]
}

const DScreen: React.FC<DScreenProps> = (props) => {
    const {children} = props
    const vBarTop = getChild(children, Bar, false, {"type": "top"})
    const vBarBottom = getChild(children, Bar, false, {"type": "bottom"})
    const hBarLeft = getChild(children, Bar, false, {"type": "left"})
    const hBarRight = getChild(children, Bar, false, {"type": "right"})
    const content = getContent(children, Bar)

    return <div className={"d-screen"}>
        {vBarTop ? vBarTop : null}
        {content ? (
            <div data-content className={"d-screen__v-content"}>
                {hBarLeft ? hBarLeft : null}
                <div data-content className={"d-screen__h-content"}>
                    <div className={"d-screen__content"}>
                        {content}
                    </div>
                </div>
                {hBarRight ? hBarRight : null}
            </div>
        ) : null}
        {vBarBottom ? vBarBottom : null}
    </div>
}

export default DScreen as React.FC<DScreenProps>

