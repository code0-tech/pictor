import {Code0Component} from "../../utils/types";
import React from "react";
import {mergeCode0Props} from "../../utils/utils";
import "./DBar.style.scss"

export interface DBarProps extends Code0Component<HTMLDivElement> {
    children: React.ReactNode[] | React.ReactNode
    orientation?: 'top' | 'bottom' | 'left' | 'right' //defaults to bottom
}

const DBar: React.FC<DBarProps> = props => {

    const {orientation = "bottom", children, ...rest} = props

    return <div {...mergeCode0Props(`d-bar d-bar--${orientation}`, rest)}>
        {children}
    </div>

}

export default DBar;