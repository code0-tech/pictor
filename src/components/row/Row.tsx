import React, {ReactNode} from "react";
import "./Row.style.scss"
import {Component, mergeComponentProps} from "../../utils";

export interface RowType extends Component<HTMLDivElement> {
    children: ReactNode | ReactNode[]
}

export const Row: React.FC<RowType> = (props) => {

    const {children, ...args} = props

    return <div {...mergeComponentProps("row", args)}>
        {children}
    </div>
}