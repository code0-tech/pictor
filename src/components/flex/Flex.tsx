import {Code0Component} from "../../utils/types";
import React from "react";
import {mergeCode0Props} from "../../utils/utils";
import "./Flex.style.scss";

interface FlexType extends Code0Component<HTMLDivElement> {
    children: React.ReactNode | React.ReactNode[]
}

export const Flex: React.FC<FlexType> = props => {

    const {children, ...rest} = props

    return <div {...mergeCode0Props("flex", rest)}>
        {children}
    </div>

}