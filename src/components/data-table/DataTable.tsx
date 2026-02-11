import React from "react";
import "./DataTable.style.scss"
import {Code0Component, mergeCode0Props} from "../../utils";

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

export interface DataTableProps<T> extends Omit<Code0Component<HTMLTableElement>, 'data' | 'children' | 'onSelect'> {
    data: Array<T>
    sort?: DataTableSortProps
    filter?: DataTableFilterProps
    loading?: boolean
    loadingComponent?: React.ReactNode
    emptyComponent?: React.ReactNode
    onSelect?: (item: T | undefined) => void
    children?: (item: T, index: number) => React.ReactNode
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

    const {data, sort, filter, loading, loadingComponent, emptyComponent, onSelect, children, ...rest} = props

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

    // @ts-ignore
    return <table {...mergeCode0Props("data-table", rest)}>
        {sortedData.map((item, i) => {
            return <tr className={"data-table__row"} onClick={() => onSelect?.(item)}>
                {children?.(item, i)}
            </tr>
        })}
        {sortedData.length === 0 && !loading && emptyComponent ? (
            <tr className={"data-table__row"} onClick={() => onSelect?.(undefined)}>
                {emptyComponent}
            </tr>
        ) : null}
    </table>
}