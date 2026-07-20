import React from "react";
import {Component, mergeComponentProps} from "../../utils";

export interface DataTablePaginationContextValue {
    //0-indexed current page
    page: number
    //total number of pages (at least 1)
    pageCount: number
    setPage: React.Dispatch<React.SetStateAction<number>>
}

export const DataTablePaginationContext = React.createContext<DataTablePaginationContextValue | null>(null)

export const useDataTablePagination = (): DataTablePaginationContextValue => {
    const context = React.useContext(DataTablePaginationContext)
    if (!context)
        throw new Error("DataTablePagination components must be rendered inside a paginated <DataTable/>")
    return context
}

export interface DataTablePaginationProps extends Component<HTMLDivElement> {
}

/**
 * Layout container for the pagination controls. Place it as a child of a paginated
 * <DataTable/>, which creates the context these controls read from. Fully styleable –
 * compose it with <DataTablePaginationValue/>, the triggers and your own <Text/>/<Button/>.
 */
export const DataTablePagination: React.FC<DataTablePaginationProps> = (props) => {
    return <div {...mergeComponentProps("data-table__pagination", props)}/>
}

/**
 * Renders the 1-indexed current page number. Unstyled – wrap it in your own <Text/> to style it.
 */
export const DataTablePaginationValue: React.FC = () => {
    const {page} = useDataTablePagination()
    return <>{page + 1}</>
}

/**
 * Renders the total number of pages. Unstyled – wrap it in your own <Text/> to style it.
 */
export const DataTableMaxPaginationValue: React.FC = () => {
    const {pageCount} = useDataTablePagination()
    return <>{pageCount}</>
}

export interface DataTablePaginationTriggerProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    //merge behaviour onto the single child element instead of rendering a <button/>
    asChild?: boolean
}

const PaginationTrigger = React.forwardRef<HTMLButtonElement, DataTablePaginationTriggerProps & {
    direction: "forward" | "backward"
}>((props, ref) => {
    const {page, pageCount, setPage} = useDataTablePagination()
    const {direction, asChild, onClick, disabled, children, ...rest} = props

    const atBoundary = direction === "forward" ? page >= pageCount - 1 : page <= 0
    const isDisabled = disabled ?? atBoundary

    const navigate = () => {
        if (isDisabled) return
        setPage(prev => direction === "forward"
            ? Math.min(pageCount - 1, prev + 1)
            : Math.max(0, prev - 1))
    }

    if (asChild && React.isValidElement(children)) {
        const child = children as React.ReactElement<any>
        return React.cloneElement(child, {
            ref,
            disabled: child.props.disabled ?? isDisabled,
            onClick: (event: React.MouseEvent<HTMLButtonElement>) => {
                child.props.onClick?.(event)
                onClick?.(event)
                navigate()
            },
        })
    }

    return <button
        {...rest}
        ref={ref}
        type={"button"}
        disabled={isDisabled}
        onClick={(event) => {
            onClick?.(event)
            navigate()
        }}>
        {children}
    </button>
})

export const DataTablePaginationForwardTrigger = React.forwardRef<HTMLButtonElement, DataTablePaginationTriggerProps>(
    (props, ref) => <PaginationTrigger {...props} direction={"forward"} ref={ref}/>
)

export const DataTablePaginationBackwardsTrigger = React.forwardRef<HTMLButtonElement, DataTablePaginationTriggerProps>(
    (props, ref) => <PaginationTrigger {...props} direction={"backward"} ref={ref}/>
)
