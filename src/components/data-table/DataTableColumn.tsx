import React from "react";
import {Code0Component, mergeCode0Props} from "../../utils";

export interface DataTableColumnProps extends Code0Component<HTMLTableCellElement>{
    children?: React.ReactNode | React.ReactNode[]
}

export const DataTableColumn: React.FC<DataTableColumnProps> = (props) => {

    const {children, ...rest} = props

    // @ts-ignore
    return <td {...mergeCode0Props("", rest)}>
        {children}
    </td>

}