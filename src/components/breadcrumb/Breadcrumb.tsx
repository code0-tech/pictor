import React from "react";
import {mergeCode0Props} from "../../utils/utils";
import {Code0Component} from "../../utils/types";
import "./Breadcrumb.style.scss"

export interface BreadcrumbProps extends Code0Component<HTMLDivElement> {
    splitter?: React.ReactNode //defaults to slash (/)
    children?: React.ReactNode | React.ReactNode[];
}

export const Breadcrumb: React.FC<BreadcrumbProps> = props => {

    const {splitter = "/", children, ...rest} = props

    return <div {...mergeCode0Props(`breadcrumb`, rest)}>
        {
            React.Children.map(children, (child, index) => {
                return <>
                    {child}
                    {index <= (React.Children.count(child)) ? <span className={"breadcrumb__splitter"}>{splitter}</span> : null}
                </>
            })
        }
    </div>
}