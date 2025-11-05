import React, {ReactNode} from "react";
import "./Container.style.scss"
import {Code0Component} from "../../utils/types";
import {mergeCode0Props} from "../../utils/utils";

export interface ContainerType extends Code0Component<HTMLDivElement> {
    children: ReactNode | ReactNode[]
}

export const Container: React.FC<ContainerType> = (props) => {

    const {children, ...args} = props

    return <div {...mergeCode0Props("container", args)}>
        {children}
    </div>
}