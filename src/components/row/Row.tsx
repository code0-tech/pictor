import React, {ReactNode} from "react";
import "./Row.style.scss"
import {Code0Component} from "../../utils/types";
import {mergeCode0Props} from "../../utils/utils";

export interface RowType extends Code0Component<HTMLDivElement> {
    children: ReactNode | ReactNode[]
}

export const Row: React.FC<RowType> = (props) => {

    const {children, ...args} = props

    return <div {...mergeCode0Props("row", args)}>
        {children}
    </div>
}