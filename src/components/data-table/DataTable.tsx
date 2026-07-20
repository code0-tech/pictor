import React from "react";
import "./DataTable.style.scss"
import {Component, mergeComponentProps} from "../../utils";
import {Flex} from "../flex/Flex";
import {DataTableHeader} from "./DataTableHeader";
import {DataTablePaginationContext} from "./DataTablePagination";

export type DataTableFilterOperator = "isOneOf" | "isNotOneOf"

export interface DataTableFilterProps {
    [key: string]: {
        operator: DataTableFilterOperator
        value: string | string[]
    }
}

export interface DataTableSortProps {
    [key: string]: 'asc' | 'desc' | undefined
}

export type DataTableRowRenderer<T> = (item: T, index: number) => React.ReactNode

export interface DataTableProps<T> extends Omit<Component<HTMLTableElement>, 'data' | 'children' | 'onSelect'> {
    data: Array<T>
    sort?: DataTableSortProps
    filter?: DataTableFilterProps
    limit?: number
    //when enabled the table splits its rows into pages of `limit` (default 10) and creates the pagination context
    pagination?: boolean
    loading?: boolean
    loadingComponent?: React.ReactNode
    emptyComponent?: React.ReactNode
    onSelect?: (item: T | undefined) => void
    //the row renderer (function child) plus an optional <DataTableHeader/> and any pagination controls, e.g. <DataTablePagination/>, to render below the table
    children?: DataTableRowRenderer<T> | React.ReactNode | Array<DataTableRowRenderer<T> | React.ReactNode>
}

const getNestedValue = (obj: any, path: string): any => {
    return path.split('.').reduce((acc, part) => {
        if (acc === null || acc === undefined) return undefined;

        if (Array.isArray(acc)) {
            return acc.map(item => item?.[part]).filter(val => val !== undefined);
        }

        return acc[part];
    }, obj);
};


export const DataTable = <T, >(props: DataTableProps<T>) => {

    const {
        data,
        sort,
        filter,
        limit,
        pagination,
        loading,
        loadingComponent,
        emptyComponent,
        onSelect,
        children,
        ...rest
    } = props

    const [page, setPage] = React.useState(0)

    // children may hold the row renderer (a function), an optional <DataTableHeader/> and pagination controls (elements)
    const childArray: Array<DataTableRowRenderer<T> | React.ReactNode> = Array.isArray(children) ? children : [children]
    const renderRow = childArray.find((child): child is DataTableRowRenderer<T> => typeof child === "function")
    const headerNode = childArray.find((child) => React.isValidElement(child) && child.type === DataTableHeader) as React.ReactNode
    const footerNodes = childArray.filter((child) => typeof child !== "function" && child !== headerNode) as React.ReactNode[]

    const filteredData = data.filter(item => {
        return Object.entries(filter || {}).every(([key, {operator, value}]) => {

            const itemValue = getNestedValue(item, key);

            if (operator === "isOneOf" && !Array.isArray(value) && !Array.isArray(itemValue)) {
                return itemValue === value;
            }

            if (operator === "isOneOf" && !Array.isArray(value) && Array.isArray(itemValue)) {
                return Array.from(itemValue).includes(value)
            }

            if (operator === "isOneOf" && Array.isArray(value) && !Array.isArray(itemValue)) {
                return Array.from(value).some(val => val === itemValue)
            }

            if (operator === "isOneOf" && Array.isArray(value) && Array.isArray(itemValue)) {
                return Array.from(value).some(val => Array.from(itemValue).includes(val))
            }

            return false

        })
    })

    const sortedData = React.useMemo(() => {
        if (!sort) return filteredData

        return [...filteredData].sort((a, b) => {
            for (const [key, direction] of Object.entries(sort)) {
                const aValue = getNestedValue(a, key);
                const bValue = getNestedValue(b, key);

                if (aValue < bValue) return direction === 'asc' ? -1 : 1;
                if (aValue > bValue) return direction === 'asc' ? 1 : -1;
            }
            return 0;
        })
    }, [filteredData, sort])

    const pageSize = typeof limit === "number" ? limit : 10
    const pageCount = pagination ? Math.max(1, Math.ceil(sortedData.length / pageSize)) : 1
    // clamp: filtering/sorting can shrink the data below the current page
    const currentPage = Math.min(page, pageCount - 1)

    React.useEffect(() => {
        if (page !== currentPage) setPage(currentPage)
    }, [page, currentPage])

    const visibleData = pagination
        ? sortedData.slice(currentPage * pageSize, currentPage * pageSize + pageSize)
        : typeof limit === "number" ? sortedData.slice(0, limit) : sortedData

    // @ts-ignore
    const table = <table {...mergeComponentProps("data-table", rest)}>
        {headerNode}
        <tbody>
        {visibleData.map((item, i) => {
            return <tr className={"data-table__row"} onClick={() => onSelect?.(item)}>
                {renderRow?.(item, i)}
            </tr>
        })}
        {sortedData.length === 0 && !loading && emptyComponent ? (
            <tr className={"data-table__row"} onClick={() => onSelect?.(undefined)}>
                {emptyComponent}
            </tr>
        ) : null}
        </tbody>
    </table>

    if (!pagination) return table

    // DataTable owns the pagination state and provides the context that the controls
    // (e.g. a <DataTablePagination/> placed as a child) read from.
    return <DataTablePaginationContext.Provider value={{page: currentPage, pageCount, setPage}}>
        <Flex style={{flexDirection: "column", gap: "0.5rem"}}>
            {table}
            {footerNodes.map((node, i) => <React.Fragment key={i}>{node}</React.Fragment>)}
        </Flex>
    </DataTablePaginationContext.Provider>
}