import React from "react";
import {Component, mergeComponentProps} from "../../utils";

export interface DataTableHeaderProps extends Component<HTMLTableSectionElement> {
    children?: React.ReactNode | React.ReactNode[]
}

/**
 * Optional header for a <DataTable/>. Place it as a child (alongside the row renderer) and fill it
 * with <DataTableHeaderColumn/> cells that line up with the columns your row renderer emits.
 */
export const DataTableHeader: React.FC<DataTableHeaderProps> = (props) => {

    const {children, ...rest} = props

    // @ts-ignore
    return <thead {...mergeComponentProps("data-table__header", rest)}>
        <tr className={"data-table__header-row"}>
            {children}
        </tr>
    </thead>

}

export interface DataTableHeaderColumnProps extends Component<HTMLTableCellElement> {
    children?: React.ReactNode | React.ReactNode[]
}

export const DataTableHeaderColumn: React.FC<DataTableHeaderColumnProps> = (props) => {

    const {children, ...rest} = props

    // @ts-ignore
    return <th {...mergeComponentProps("data-table__header-column", rest)}>
        {children}
    </th>

}
