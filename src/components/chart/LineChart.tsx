"use client"

import * as React from "react"
import * as RechartsPrimitive from "recharts"
import {
    ChartContainer,
    ChartLegendContent,
    ChartTooltipContent,
    type ChartConfig
} from "./Chart"

export type ChartLines = Omit<React.ComponentProps<typeof RechartsPrimitive.Line>,"dataKey" | "name"> & {
    dataKey: string
    label?: React.ReactNode
    color?: string
    name?: string
}

export interface LineChartProps<TData extends Record<string, unknown>>
    extends Omit<React.ComponentProps<typeof RechartsPrimitive.LineChart>, "data"> {
    data: TData[]
    lines: ChartLines[]
    xKey: string
    config?: ChartConfig
    showGrid?: boolean
    showXAxis?: boolean
    showYAxis?: boolean
    showTooltip?: boolean
    showLegend?: boolean
    containerProps?: Omit<React.ComponentProps<typeof ChartContainer>, "children" | "config">
    gridProps?: React.ComponentProps<typeof RechartsPrimitive.CartesianGrid>
    xAxisProps?: Omit<React.ComponentProps<typeof RechartsPrimitive.XAxis>, "dataKey">
    yAxisProps?: React.ComponentProps<typeof RechartsPrimitive.YAxis>
    tooltipProps?: React.ComponentProps<typeof RechartsPrimitive.Tooltip>
    legendProps?: React.ComponentProps<typeof RechartsPrimitive.Legend>
}

export function LineChart<TData extends Record<string, unknown>>({
    data,
    lines,
    xKey,
    config,
    showGrid = true,
    showXAxis = true,
    showYAxis = true,
    showTooltip = true,
    showLegend = true,
    containerProps,
    gridProps,
    xAxisProps,
    yAxisProps,
    tooltipProps,
    legendProps,
    ...chartProps
}: LineChartProps<TData>) {
    const resolvedConfig = React.useMemo<ChartConfig>(() => {
        if (config) return config
        return lines.reduce((acc, line) => {
            const lineColor = line.color ?? (typeof line.stroke === "string" ? line.stroke : undefined)
            acc[line.dataKey] = { label: line.label ?? line.name ?? line.dataKey, color: lineColor }
            return acc
        }, {} as ChartConfig)
    }, [config, lines])

    const { content: tooltipContent, ...tooltipRest } = tooltipProps ?? {}
    const { content: legendContent, ...legendRest } = legendProps ?? {}

    return (
        <ChartContainer config={resolvedConfig} {...containerProps}>
            <RechartsPrimitive.LineChart data={data} {...chartProps}>
                {showGrid && <RechartsPrimitive.CartesianGrid strokeDasharray="4 4" {...gridProps} />}
                {showXAxis && <RechartsPrimitive.XAxis dataKey={xKey} {...xAxisProps} />}
                {showYAxis && <RechartsPrimitive.YAxis {...yAxisProps} />}
                {showTooltip && <RechartsPrimitive.Tooltip content={tooltipContent ?? <ChartTooltipContent />} {...tooltipRest} />}
                {showLegend && <RechartsPrimitive.Legend content={legendContent ?? <ChartLegendContent />} {...legendRest} />}
                {lines.map((line) => {
                    const { dataKey, label, color, type, stroke, strokeWidth, name, ...lineProps } = line
                    const resolvedStroke = color ?? (typeof stroke === "string" ? stroke : undefined) ?? `var(--color-${dataKey}, currentColor)`

                    return (
                        <RechartsPrimitive.Line
                            key={dataKey}
                            dataKey={dataKey}
                            name={String(label) || name || dataKey}
                            stroke={resolvedStroke}
                            type={type ?? "monotone"}
                            strokeWidth={strokeWidth ?? 2}
                            {...lineProps}
                        />
                    )
                })}
            </RechartsPrimitive.LineChart>
        </ChartContainer>
    )
}
