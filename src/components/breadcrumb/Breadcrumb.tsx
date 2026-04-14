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

    const count = React.Children.count(children)

    return (
        <div {...mergeComponentProps(`breadcrumb`, rest)}>
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