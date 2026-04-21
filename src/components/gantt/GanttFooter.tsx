import React from "react"
import {Text} from "../text/Text"

export const GanttFooter: React.FC = (props) => {

    return <div style={{
        gridColumn: "1 / -1",
        height: `fit-content`,
        position: "sticky",
        display: "flex",
        top: 0,
        backgroundColor: "#070514",
        borderBottom: "1px solid rgba(255, 255, 255, 0.25)",
        zIndex: 10
    }}>
        <div style={{
            position: "sticky",
            left: 0,
            width: "fit-content",
            height: "100%",
            padding: "8px",
            display: "flex",
            alignItems: "center",
            justifyContent: "start",
            boxSizing: "border-box",
            background: "#070514",
            zIndex: 2
        }}>
            <Text style={{textWrap: "nowrap", display: "flex", alignItems: "center"}}>
                Available Groups
            </Text>
        </div>
    </div>

}