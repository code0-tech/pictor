import React from "react";
import {mergeCode0Props} from "../../utils/utils";
import {Code0Component} from "../../utils/types";
import "./Breadcrumb.style.scss"
import {IconChevronRight} from "@tabler/icons-react";

export interface BreadcrumbProps extends Code0Component<HTMLDivElement> {
    splitter?: React.ReactNode //defaults to slash (/)
    children?: React.ReactNode | React.ReactNode[];
}

export const Breadcrumb: React.FC<BreadcrumbProps> = props => {

    const {splitter = <IconChevronRight size={16}/>, children, ...rest} = props

    const count = React.Children.count(children)

    return (
        <div {...mergeCode0Props(`breadcrumb`, rest)}>
            {React.Children.map(children, (child, index) => (
                <React.Fragment key={index}>
                    {child}
                    {index < count - 1 ? (
                        <span className="breadcrumb__splitter">{splitter}</span>
                    ) : null}
                </React.Fragment>
            ))}
        </div>
    )
}