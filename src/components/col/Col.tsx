import React, {ReactNode} from "react";
import "./Col.style.scss"
import {Code0Component} from "../../utils/types";
import {mergeCode0Props} from "../../utils/utils";

export type ColBreakPointRange = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12;

export interface ColType extends Code0Component<HTMLDivElement> {
    children: ReactNode | ReactNode[]
    xs?: ColBreakPointRange
    sm?: ColBreakPointRange
    md?: ColBreakPointRange
    lg?: ColBreakPointRange
    xl?: ColBreakPointRange
    xxl?: ColBreakPointRange
}

const Col: React.FC<ColType> = (props) => {

    const {children, xs, sm, md, lg, xl, xxl, ...args} = props

    return <div {...mergeCode0Props(`col ${xs ? `col-xs-${xs}` : ""} ${sm ? `col-sm-${sm}` : ""} ${md ? `col-md-${md}` : ""} ${lg ? `col-lg-${lg}` : ""} ${xl ? `col-lg-${xl}` : ""} ${xxl ? `col-xxl-${xxl}` : ""}`, args)}>
        {children}
    </div>
}

export default Col