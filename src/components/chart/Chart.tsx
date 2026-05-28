"use client"

import * as React from "react"
import * as RechartsPrimitive from "recharts"
import type { TooltipValueType } from "recharts"
import "./Chart.style.scss"

// Format: { THEME_NAME: CSS_SELECTOR }
const THEMES = { light: "", dark: ".dark" } as const

const INITIAL_DIMENSION = { width: 320, height: 200 } as const

const joinClassNames = (...classes: Array<string | undefined | null | false>) => classes.filter(Boolean).join(" ")

export type ChartConfig = Record<string, {
    label?: React.ReactNode
    icon?: React.ComponentType
} & (
    | { color?: string; theme?: never }
    | { color?: never; theme: Record<keyof typeof THEMES, string> }
)>

type ChartContextProps = {
    config: ChartConfig
}

interface ChartContainerProps extends React.ComponentProps<"div"> {
    config: ChartConfig
    children: React.ComponentProps<typeof RechartsPrimitive.ResponsiveContainer>["children"]
    initialDimension?: {
        width: number
        height: number
    }
}

const ChartContext = React.createContext<ChartContextProps | null>(null)

function useChart() {
    const context = React.useContext(ChartContext)
    if (!context) throw new Error("useChart must be used within a <ChartContainer />")
    return context
}

function ChartContainer({ id, className, children, config, initialDimension = INITIAL_DIMENSION, ...props}: ChartContainerProps) {
    const uniqueId = React.useId()
    const chartId = `chart-${id ?? uniqueId.replace(/:/g, "")}`

    return (
        <ChartContext.Provider value={{ config }}>
            <div
                data-slot="chart"
                data-chart={chartId}
                className={joinClassNames("chart", className)}
                {...props}
            >
                <ChartStyle id={chartId} config={config} />
                <RechartsPrimitive.ResponsiveContainer initialDimension={initialDimension}>
                    {children}
                </RechartsPrimitive.ResponsiveContainer>
            </div>
        </ChartContext.Provider>
    )
}

const ChartStyle = ({ id, config }: { id: string; config: ChartConfig }) => {
    const colorConfig = Object.entries(config).filter(([, config]) => config.theme ?? config.color)
    if (!colorConfig.length) return null

    return (
        <style
            dangerouslySetInnerHTML={{__html: Object.entries(THEMES)
                .map(([theme, prefix]) => `
                        ${prefix} [data-chart=${id}] {
                        ${colorConfig
                        .map(([key, itemConfig]) => {
                            const color = itemConfig.theme?.[theme as keyof typeof itemConfig.theme] ?? itemConfig.color
                            return color ? `  --color-${key}: ${color};` : null
                        })
                        .join("\n")}
                    }
                `
            ).join("\n")}}
        />
    )
}

const ChartTooltip = RechartsPrimitive.Tooltip

interface ChartTooltipContentProps
    extends Omit<React.ComponentProps<typeof RechartsPrimitive.Tooltip>, "content">,
        Omit<React.ComponentProps<"div">, "content"> {
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

function ChartTooltipContent({
    active,
    payload,
    className,
    indicator = "dot",
    hideLabel = false,
    hideIndicator = false,
    label,
    labelFormatter,
    labelClassName,
    formatter,
    color,
    nameKey,
    labelKey,
}: ChartTooltipContentProps) {
    const { config } = useChart()

    const tooltipLabel = React.useMemo(() => {
        if (hideLabel || !payload?.length) return null

        const [item] = payload
        const key = `${labelKey ?? item?.dataKey ?? item?.name ?? "value"}`
        const itemConfig = getPayloadConfigFromPayload(config, item, key)
        const value = !labelKey && typeof label === "string"
            ? (config[label]?.label ?? label)
            : itemConfig?.label

        if (labelFormatter) {
            return (
                <div className={joinClassNames("chart__tooltip-label", labelClassName)}>
                    {labelFormatter(value, payload)}
                </div>
            )
        }

        if (!value) return null

        return <div className={joinClassNames("chart__tooltip-label", labelClassName)}>{value}</div>
    }, [label, labelFormatter, payload, hideLabel, labelClassName, config, labelKey])

    if (!active || !payload?.length) return null

    const nestLabel = payload.length === 1 && indicator !== "dot"

    return (
        <div className={joinClassNames("chart__tooltip", className)}>
            {!nestLabel ? tooltipLabel : null}
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
                                className={joinClassNames(
                                    "chart__tooltip-row",
                                    indicator === "dot" && "chart__tooltip-row--dot"
                                )}
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
                                                    className={joinClassNames(
                                                        "chart__tooltip-indicator",
                                                        indicator === "dot" &&
                                                            "chart__tooltip-indicator--dot",
                                                        indicator === "line" &&
                                                            "chart__tooltip-indicator--line",
                                                        indicator === "dashed" &&
                                                            "chart__tooltip-indicator--dashed",
                                                        nestLabel &&
                                                            indicator === "dashed" &&
                                                            "chart__tooltip-indicator--nest"
                                                    )}
                                                    style={
                                                        {
                                                            "--color-bg": indicatorColor,
                                                            "--color-border": indicatorColor,
                                                        } as React.CSSProperties
                                                    }
                                                />
                                            )
                                        )}
                                        <div
                                            className={joinClassNames(
                                                "chart__tooltip-content",
                                                nestLabel && "chart__tooltip-content--nest"
                                            )}
                                        >
                                            <div className="chart__tooltip-meta">
                                                {nestLabel ? tooltipLabel : null}
                                                <span className="chart__tooltip-name">
                                                    {itemConfig?.label ?? item.name}
                                                </span>
                                            </div>
                                            {item.value != null && (
                                                <span className="chart__tooltip-value">
                                                    {typeof item.value === "number"
                                                        ? item.value.toLocaleString()
                                                        : String(item.value)}
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

const ChartLegend = RechartsPrimitive.Legend

interface ChartLegendContentProps
    extends Omit<React.ComponentProps<"div">, "dangerouslySetInnerHTML"> {
    payload?: ReadonlyArray<RechartsPrimitive.LegendPayload>
    verticalAlign?: "top" | "bottom" | "middle"
    hideIcon?: boolean
    nameKey?: string
}

function ChartLegendContent({
    className,
    hideIcon = false,
    payload,
    verticalAlign = "bottom",
    nameKey,
}: ChartLegendContentProps) {
    const { config } = useChart()
    if (!payload?.length) return null

    return (
        <div
            className={joinClassNames(
                "chart__legend",
                verticalAlign === "top" ? "chart__legend--top" : "chart__legend--bottom",
                className
            )}
        >
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
                                <div
                                    className="chart__legend-swatch"
                                    style={{ backgroundColor: item.color }}
                                />
                            )}
                            {itemConfig?.label}
                        </div>
                    )
                })}
        </div>
    )
}

function getPayloadConfigFromPayload(
    config: ChartConfig,
    payload: unknown,
    key: string
) {
    if (typeof payload !== "object" || payload === null) return undefined

    const payloadPayload =
        "payload" in payload &&
            typeof payload.payload === "object" &&
            payload.payload !== null
            ? payload.payload
            : undefined

    let configLabelKey: string = key

    if (key in payload && typeof payload[key as keyof typeof payload] === "string") {
        configLabelKey = payload[key as keyof typeof payload] as string
    } else if (payloadPayload && key in payloadPayload && typeof payloadPayload[key as keyof typeof payloadPayload] === "string") {
        configLabelKey = payloadPayload[key as keyof typeof payloadPayload] as string
    }

    return configLabelKey in config ? config[configLabelKey] : config[key]
}

export {
    ChartContainer,
    ChartTooltip,
    ChartTooltipContent,
    ChartLegend,
    ChartLegendContent,
    ChartStyle,
}
