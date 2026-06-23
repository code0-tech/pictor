"use client"

import * as React from "react"
import * as RechartsPrimitive from "recharts"
import "./Chart.style.scss"
import { Component, mergeComponentProps } from "../../utils"

interface ChartItem {
    label?: React.ReactNode
    icon?: React.ComponentType
    color?: string
}

export type ChartConfig = Record<string, ChartItem>

interface ChartContextProps {
    config: ChartConfig
}

interface ChartContainerProps extends Component<HTMLDivElement> {
    config: ChartConfig
    children: React.ComponentProps<typeof RechartsPrimitive.ResponsiveContainer>["children"]
    initialDimension?: {
        width: number
        height: number
    }
}

const ChartContext = React.createContext<ChartContextProps | null>(null)

const useChart = () => {
    const context = React.useContext(ChartContext)
    if (!context) throw new Error("useChart must be used within a <ChartContainer />")
    return context
}

export const ChartContainer: React.FC<ChartContainerProps> = (props) => {
    const { id, className, children, config, initialDimension = { width: 320, height: 200 }, style, ...rest } = props
    const uniqueId = React.useId()
    const chartId = `chart-${id ?? uniqueId.replace(/:/g, "")}`

    const chartVars = React.useMemo(() => {
        return Object.entries(config).reduce(
            (acc, [key, item]) => {
                if (item.color) {
                    acc[`--color-${key}` as `--${string}`] = item.color
                }

                return acc
            },
            {} as React.CSSProperties & Record<`--${string}`, string | number | undefined>
        )
    }, [config])

    return (
        <ChartContext.Provider value={{ config }}>
            <div
                data-slot="chart"
                data-chart={chartId}
                style={{
                    ...chartVars,
                    ...style,
                }}
                {...mergeComponentProps("chart", rest)}
            >
                <RechartsPrimitive.ResponsiveContainer initialDimension={initialDimension}>{children}</RechartsPrimitive.ResponsiveContainer>
            </div>
        </ChartContext.Provider>
    )
}

interface ChartTooltipContentProps
    extends Omit<React.ComponentProps<typeof RechartsPrimitive.Tooltip>, "content">, Omit<React.ComponentProps<"div">, "content"> {
    payload?: RechartsPrimitive.TooltipPayload
    label?: string | number
    labelClassName?: string
    hideLabel?: boolean
    hideIndicator?: boolean
    indicator?: "line" | "dot" | "dashed"
    nameKey?: string
    labelKey?: string
    color?: string
}

export const ChartTooltipContent: React.FC<ChartTooltipContentProps> = (props) => {
    const {
        active,
        payload,
        className,
        indicator = "dot",
        hideLabel = false,
        hideIndicator = false,
        label,
        labelClassName,
        labelFormatter,
        formatter,
        color,
        nameKey,
        labelKey,
        ...rest
    } = props
    const { config } = useChart()

    const tooltipLabel = () => {
        if (hideLabel || !payload?.length) return null

        const [item] = payload
        const key = `${labelKey ?? item?.dataKey ?? item?.name ?? "value"}`
        const itemConfig = getPayloadConfigFromPayload(config, item, key)
        const value = !labelKey && typeof label === "string" ? (config[label]?.label ?? label) : itemConfig?.label

        if (labelFormatter) {
            return (
                <div
                    {...mergeComponentProps("chart__tooltip-label", {
                        className: labelClassName,
                    })}
                >
                    {labelFormatter(value, payload)}
                </div>
            )
        }

        if (!value) return null

        return (
            <div
                {...mergeComponentProps("chart__tooltip-label", {
                    className: labelClassName,
                })}
            >
                {value}
            </div>
        )
    }

    if (!active || !payload?.length) return null

    const nestLabel = payload.length === 1 && indicator !== "dot"

    return (
        <div {...mergeComponentProps("chart__tooltip", { className })} {...rest}>
            {!nestLabel && tooltipLabel()}
            <div className="chart__tooltip-body">
                {payload
                    .filter((item) => item.type !== "none")
                    .map((item, index) => {
                        const key = `${nameKey ?? item.name ?? item.dataKey ?? "value"}`
                        const itemConfig = getPayloadConfigFromPayload(config, item, key)
                        const indicatorColor = color ?? item.payload?.fill ?? item.color

                        return (
                            <div
                                key={index}
                                {...mergeComponentProps("chart__tooltip-row", {
                                    className: indicator === "dot" && "chart__tooltip-row--dot",
                                })}
                            >
                                {formatter && item?.value !== undefined && item.name ? (
                                    formatter(item.value, item.name, item, index, item.payload)
                                ) : (
                                    <>
                                        {itemConfig?.icon ? (
                                            <itemConfig.icon />
                                        ) : (
                                            !hideIndicator && (
                                                <div
                                                    {...mergeComponentProps(
                                                        `
                                                            chart__tooltip-indicator
                                                            ${indicator === "dot" ? "chart__tooltip-indicator--dot" : ""}
                                                            ${indicator === "line" ? "chart__tooltip-indicator--line" : ""}
                                                            ${indicator === "dashed" ? "chart__tooltip-indicator--dashed" : ""}
                                                            ${nestLabel && indicator === "dashed" ? "chart__tooltip-indicator--nest" : ""}
                                                            `,
                                                        {
                                                            style: {
                                                                "--color-bg": indicatorColor,
                                                                "--color-border": indicatorColor,
                                                            } as React.CSSProperties,
                                                        }
                                                    )}
                                                />
                                            )
                                        )}
                                        <div {...mergeComponentProps(`chart__tooltip-content ${nestLabel ? "chart__tooltip-content--nest" : ""}`, {})}>
                                            <div className="chart__tooltip-meta">
                                                {nestLabel && tooltipLabel()}
                                                <span className="chart__tooltip-name">{itemConfig?.label ?? item.name}</span>
                                            </div>
                                            {item.value != null && (
                                                <span className="chart__tooltip-value">
                                                    {typeof item.value === "number" ? item.value.toLocaleString() : String(item.value)}
                                                </span>
                                            )}
                                        </div>
                                    </>
                                )}
                            </div>
                        )
                    })}
            </div>
        </div>
    )
}

interface ChartLegendContentProps extends Omit<React.ComponentProps<"div">, "dangerouslySetInnerHTML"> {
    payload?: ReadonlyArray<RechartsPrimitive.LegendPayload>
    verticalAlign?: "top" | "bottom" | "middle"
    hideIcon?: boolean
    nameKey?: string
}

export const ChartLegendContent: React.FC<ChartLegendContentProps> = (props) => {
    const { className, hideIcon = false, payload, verticalAlign = "bottom", nameKey } = props
    const { config } = useChart()
    if (!payload?.length) return null

    return (
        <div {...mergeComponentProps(`chart__legend ${verticalAlign === "top" ? "chart__legend--top" : "chart__legend--bottom"}`, { className })}>
            {payload
                .filter((item) => item.type !== "none")
                .map((item, index) => {
                    const key = `${nameKey ?? item.dataKey ?? "value"}`
                    const itemConfig = getPayloadConfigFromPayload(config, item, key)

                    return (
                        <div key={index} className="chart__legend-item">
                            {itemConfig?.icon && !hideIcon ? (
                                <itemConfig.icon />
                            ) : (
                                <div className="chart__legend-swatch" style={{ backgroundColor: item.color }} />
                            )}
                            {itemConfig?.label}
                        </div>
                    )
                })}
        </div>
    )
}

const getPayloadConfigFromPayload = (config: ChartConfig, payload: unknown, key: string) => {
    if (typeof payload !== "object" || payload === null) return config[key]

    const item = payload as {
        dataKey?: unknown
        name?: unknown
        payload?: Record<string, unknown>
    }

    const candidates = [key, typeof item.dataKey === "string" ? item.dataKey : undefined, typeof item.name === "string" ? item.name : undefined]

    for (const candidate of candidates) {
        if (candidate && candidate in config) {
            return config[candidate]
        }
    }

    return undefined
}
