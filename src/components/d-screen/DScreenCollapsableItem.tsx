import {Code0Component} from "../../utils/types";
import React from "react";
import {mergeCode0Props} from "../../utils/utils";

export interface DScreenCollapsableItemProps extends Code0Component<HTMLDivElement> {
    children: React.ReactNode[] | React.ReactNode
}

const DScreenCollapsableItem: React.FC<DScreenCollapsableItemProps> = props => {
    const {children, ...rest} = props
    return <div {...mergeCode0Props(`d-screen__collapsable-item`, rest)}>
        {children}
    </div>
}

export default DScreenCollapsableItem as React.FunctionComponent<DScreenCollapsableItemProps>