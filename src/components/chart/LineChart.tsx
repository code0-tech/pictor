"use client"

import * as React from "react"
import * as RechartsPrimitive from "recharts"
import { ChartContainer, ChartConfig, ChartLegendContent, ChartTooltipContent } from "./Chart"
import { Component } from "utils"

export type ChartLines = Omit<React.ComponentProps<typeof RechartsPrimitive.Line>, "dataKey" | "name"> & {
    dataKey: string
    label?: React.ReactNode
    color?: string
    name?: string
}

export type LineChartProps<TData extends Record<string, unknown>> = Omit<React.ComponentProps<typeof RechartsPrimitive.LineChart>, "data"> &
    Omit<Component<HTMLDivElement>, "height"> & {
        data: TData[]
        lines: ChartLines[]
        xKey: string
        config?: ChartConfig
        showDots?: boolean
        curveType?: React.ComponentProps<typeof RechartsPrimitive.Line>["type"]
        containerProps?: Omit<React.ComponentProps<typeof ChartContainer>, "children" | "config">
        grid?: React.ComponentProps<typeof RechartsPrimitive.CartesianGrid> | false
        xAxis?: Omit<React.ComponentProps<typeof RechartsPrimitive.XAxis>, "dataKey">
        yAxis?: React.ComponentProps<typeof RechartsPrimitive.YAxis>
        tooltip?: React.ComponentProps<typeof RechartsPrimitive.Tooltip> | false
        legend?: React.ComponentProps<typeof RechartsPrimitive.Legend> | false
    }

type LineChartComponent = <TData extends Record<string, unknown>>(props: LineChartProps<TData>) => React.ReactElement

export const LineChart: LineChartComponent = (props) => {
    const { data, lines, xKey, config, showDots, curveType, containerProps, grid, xAxis, yAxis, tooltip, legend, ...rest } = props
    const resolvedConfig = React.useMemo<ChartConfig>(() => {
        if (config) return config
        return lines.reduce((acc, line) => {
            const lineColor = line.color ?? (typeof line.stroke === "string" ? line.stroke : undefined)
            acc[line.dataKey] = {
                label: line.label ?? line.name ?? line.dataKey,
                color: lineColor,
            }
            return acc
        }, {} as ChartConfig)
    }, [config, lines])

    const tooltipProps = tooltip === false ? undefined : tooltip
    const legendProps = legend === false ? undefined : legend

    const { content: tooltipContent, ...tooltipRest } = tooltipProps ?? {}
    const { content: legendContent, ...legendRest } = legendProps ?? {}

    return (
        <ChartContainer config={resolvedConfig} {...containerProps}>
            <RechartsPrimitive.LineChart data={data} {...rest}>
                <RechartsPrimitive.XAxis dataKey={xKey} {...xAxis} />
                <RechartsPrimitive.YAxis {...yAxis} />
                {grid !== false && <RechartsPrimitive.CartesianGrid strokeDasharray="4 4" {...grid} />}
                {tooltip !== false && <RechartsPrimitive.Tooltip content={tooltipContent ?? <ChartTooltipContent />} {...tooltipRest} />}
                {legend !== false && <RechartsPrimitive.Legend content={legendContent ?? <ChartLegendContent />} {...legendRest} />}
                {lines.map((line) => {
                    const { dataKey, label, color, type, stroke, strokeWidth, name, dot, ...lineProps } = line
                    const resolvedStroke = color ?? (typeof stroke === "string" ? stroke : undefined) ?? `var(--color-${dataKey}, currentColor)`
                    const resolvedName = typeof label === "string" || typeof label === "number" ? String(label) : (name ?? dataKey)

                    return (
                        <RechartsPrimitive.Line
                            key={dataKey}
                            dataKey={dataKey}
                            name={resolvedName}
                            stroke={resolvedStroke}
                            type={type ?? curveType ?? "monotone"}
                            strokeWidth={strokeWidth ?? 2}
                            dot={dot ?? showDots}
                            {...lineProps}
                        />
                    )
                })}
            </RechartsPrimitive.LineChart>
        </ChartContainer>
    )
}
