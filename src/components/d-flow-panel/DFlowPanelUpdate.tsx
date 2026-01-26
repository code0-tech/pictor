import React from "react";
import {IconCloudCheck, IconCloudUpload} from "@tabler/icons-react";
import {Panel} from "@xyflow/react";
import {Tooltip, TooltipArrow, TooltipContent, TooltipPortal, TooltipTrigger} from "../tooltip/Tooltip";
import {Text} from "../text/Text";
import {Flow} from "@code0-tech/sagittarius-graphql-types";
import {useService, useStore} from "../../utils";
import {DFlowReactiveService} from "../d-flow";
import {Badge} from "../badge/Badge";
import {Button} from "../button/Button";

export interface DFlowPanelUpdateProps {
    flowId: Flow['id']
}

export const DFlowPanelUpdate: React.FC<DFlowPanelUpdateProps> = (props) => {

    const {flowId} = props

    const flowService = useService(DFlowReactiveService)
    const flowStore = useStore(DFlowReactiveService)
    const [loading, startTransition] = React.useTransition()

    const flow = React.useMemo(() => flowService.getById(flowId), [flowId, flowStore])

    const edited = React.useMemo(
        () => !!flow?.editedAt && new Date(flow?.updatedAt ?? Date.now()).getTime() != new Date(flow?.editedAt ?? Date.now()).getTime(),
        [flow, flowStore]
    )
    const lastSave = React.useMemo(
        () => {
            return formatTimeAgo(flow?.updatedAt ?? Date.now())
        },
        [flow, flowStore]
    )

    const flowUpdate = React.useCallback(() => {
        const flowInput = flowService.getPayloadById(flowId)
        if (!flowId) return


        startTransition(async () => {
            await flowService.flowUpdate({
                flowInput: flowInput!,
                flowId: flowId!
            })
        })

    }, [flowId, flowService])

    return <Panel position={"top-right"}>
        {edited ? (
            <Tooltip>
                <TooltipTrigger asChild>
                    <Button onClick={flowUpdate} disabled={loading} variant={"filled"} paddingSize={"xxs"}>
                        {loading ? ("Saving...") : (<IconCloudUpload size={13}/>)}
                    </Button>
                </TooltipTrigger>
                <TooltipPortal>
                    <TooltipContent side={"bottom"} maw={"200px"}>
                        <TooltipArrow/>
                        <Text>Changes are also saved automatically within 1 minute</Text>
                    </TooltipContent>
                </TooltipPortal>
            </Tooltip>
        ) : (
            <Tooltip>
                <TooltipTrigger asChild>
                    <IconCloudCheck size={16} color={"#70ffb2"}/>
                </TooltipTrigger>
                <TooltipPortal>
                    <TooltipContent side={"bottom"} maw={"200px"}>
                        <TooltipArrow/>
                        <Text>Last save <Badge border color={"secondary"}>{lastSave}</Badge>.<br/> Everything is synced.</Text>
                    </TooltipContent>
                </TooltipPortal>
            </Tooltip>
        )}
    </Panel>
}

const formatTimeAgo = (input: Date | number | string) => {
    const now = Date.now()

    let pastMs: number

    if (input instanceof Date) {
        pastMs = input.getTime()
    } else if (typeof input === "number") {
        pastMs = input < 1e12 ? input * 1000 : input // sec vs ms
    } else {
        // string: if numeric => unix, else ISO date string
        const n = Number(input)
        pastMs = Number.isFinite(n)
            ? (n < 1e12 ? n * 1000 : n)
            : new Date(input).getTime()
    }

    if (!Number.isFinite(pastMs)) return "just now"

    let diff = now - pastMs
    if (diff <= 0) return "just now"

    const MIN = 60_000
    const HOUR = 60 * MIN
    const DAY = 24 * HOUR
    const YEAR = 365 * DAY

    const years = Math.floor(diff / YEAR); diff %= YEAR
    const days = Math.floor(diff / DAY); diff %= DAY
    const hours = Math.floor(diff / HOUR); diff %= HOUR
    const minutes = Math.floor(diff / MIN)

    const parts = [
        years && `${years}y`,
        days && `${days}d`,
        hours && `${hours}h`,
        minutes && `${minutes}m`,
    ].filter(Boolean) as string[]

    return parts.length ? `${parts.join(" ")} ago` : "just now"
}