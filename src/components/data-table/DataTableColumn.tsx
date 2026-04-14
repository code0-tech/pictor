import React from "react";
import {Component, mergeComponentProps} from "../../utils";

export interface DataTableColumnProps extends Component<HTMLTableCellElement>{
    children?: React.ReactNode | React.ReactNode[]
}

export const DataTableColumn: React.FC<DataTableColumnProps> = (props) => {

    const {children, ...rest} = props

    // @ts-ignore
    return <td {...mergeComponentProps("", rest)}>
        {children}
    </td>

}