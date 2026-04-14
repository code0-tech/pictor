import {Component, mergeComponentProps} from "../../utils";
import React from "react";
import "./Flex.style.scss";

interface FlexType extends Component<HTMLDivElement> {
    children: React.ReactNode | React.ReactNode[]
}

export const Flex: React.FC<FlexType> = props => {

    const {children, ...rest} = props

    return <div {...mergeComponentProps("flex", rest)}>
        {children}
    </div>

}