import React, {ReactNode} from "react";
import "./Col.style.scss"
import {Component, mergeComponentProps} from "../../utils";

export type ColBreakPointRange = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12;

export interface ColType extends Component<HTMLDivElement> {
    children: ReactNode | ReactNode[]
    xs?: ColBreakPointRange
    sm?: ColBreakPointRange
    md?: ColBreakPointRange
    lg?: ColBreakPointRange
    xl?: ColBreakPointRange
    xxl?: ColBreakPointRange
}

export const Col: React.FC<ColType> = (props) => {

    const {children, xs, sm, md, lg, xl, xxl, ...args} = props

    return <div {...mergeComponentProps(`col ${xs ? `col-xs-${xs}` : ""} ${sm ? `col-sm-${sm}` : ""} ${md ? `col-md-${md}` : ""} ${lg ? `col-lg-${lg}` : ""} ${xl ? `col-lg-${xl}` : ""} ${xxl ? `col-xxl-${xxl}` : ""}`, args)}>
        {children}
    </div>
}