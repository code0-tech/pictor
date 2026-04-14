import React, {ReactNode} from "react";
import "./Container.style.scss"
import {Component, mergeComponentProps} from "../../utils";

export interface ContainerType extends Component<HTMLDivElement> {
    children: ReactNode | ReactNode[]
}

export const Container: React.FC<ContainerType> = (props) => {

    const {children, ...args} = props

    return <div {...mergeComponentProps("container", args)}>
        {children}
    </div>
}