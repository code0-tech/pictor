import React from "react";
import {mergeComponentProps, Component} from "../../utils";
import "./Breadcrumb.style.scss"
import {IconChevronRight} from "@tabler/icons-react";

export interface BreadcrumbProps extends Component<HTMLDivElement> {
    splitter?: React.ReactNode //defaults to slash (/)
    children?: React.ReactNode | React.ReactNode[];
}

export const Breadcrumb: React.FC<BreadcrumbProps> = props => {

    const {splitter = <IconChevronRight size={16}/>, children, ...rest} = props

    const validChildren = React.Children.toArray(children).filter(child => child != null)
    const count = validChildren.length

    return (
        <div {...mergeComponentProps(`breadcrumb`, rest)}>
            {validChildren.map((child, index) => (
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