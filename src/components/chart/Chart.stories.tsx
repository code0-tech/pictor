import {Meta} from "@storybook/react-vite"
import React from "react"
import {Card} from "../card/Card"
import {LineChart} from "./LineChart"

export default {
    title: "LineChart",
    component: LineChart
} as Meta

const sampleData = [
    {name: "Jan", revenue: 4200, users: 2400},
    {name: "Feb", revenue: 3800, users: 2210},
    {name: "Mar", revenue: 5100, users: 2290},
    {name: "Apr", revenue: 6100, users: 2000},
    {name: "May", revenue: 5700, users: 2780},
    {name: "Jun", revenue: 6900, users: 3200},
]

export const LineChartExample = () => {
    return <Card color={"secondary"} w={"640px"}>
        <LineChart
            data={sampleData}
            xKey={"name"}
            lines={[
                {dataKey: "revenue", label: "Revenue", color: "#70ffb2"},
                {dataKey: "users", label: "Active Users", color: "#FFBE0B"}
            ]}
            yAxisProps={{width: 40}}
            legendProps={{ verticalAlign: "top" }}
            showDots={false}
            curveType={"step"}
            showGrid={false}
        />
    </Card>
}
