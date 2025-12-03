"use client"

import React from "react"
import {Panel} from "@xyflow/react"
import {Flow} from "@code0-tech/sagittarius-graphql-types"
import {useService, useStore} from "../../../utils"
import {DFlowReactiveService} from "../DFlow.service"
import {Button} from "../../button/Button"

export interface DFlowExportProps {
    flowId: Flow['id']
}

export const DFlowExport: React.FC<DFlowExportProps> = (props) => {

    const {flowId} = props

    const flowService = useService(DFlowReactiveService)
    const flowStore = useStore(DFlowReactiveService)
    const flow = React.useMemo(() => flowService.getById(flowId), [flowStore, flowId])

    const handleExport = React.useCallback(() => {
        if (!flow) return

        // Hole JSON-Daten
        const data = flow.jsonInput?.()
        if (!data) return

        const json =
            typeof data === "string" ? data : JSON.stringify(data, null, 2)

        // Blob + Download-Link
        const blob = new Blob([json], { type: "application/json" })
        const url = URL.createObjectURL(blob)

        const a = document.createElement("a")
        a.href = url
        a.download = `flow-${flow.name}.json`
        document.body.appendChild(a)
        a.click()
        a.remove()

        URL.revokeObjectURL(url)
    }, [flow])

    return <Panel position="top-right">
        <Button paddingSize={"xxs"} onClick={handleExport}>
            Export flow
        </Button>
    </Panel>
}