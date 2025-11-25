import {Runtime} from "@code0-tech/sagittarius-graphql-types";
import React from "react";
import {Text} from "../text/Text";
import {Flex} from "../flex/Flex";
import {IconServer, IconSettings} from "@tabler/icons-react";
import {Button} from "../button/Button";
import {useService, useStore} from "../../utils";
import {DRuntimeReactiveService} from "./DRuntime.service";
import {Badge} from "../badge/Badge";
import {DRuntimeView} from "./DRuntime.view";

export interface DRuntimeContentProps {
    runtimeId: Runtime['id']
    onSetting?: (runtime: DRuntimeView) => void
    minimized?: boolean
}

export const DRuntimeContent: React.FC<DRuntimeContentProps> = (props) => {

    const {
        runtimeId,
        minimized = false,
        onSetting = () => {
        }
    } = props

    const runtimeService = useService(DRuntimeReactiveService)
    const runtimeStore = useStore(DRuntimeReactiveService)
    const runtime = React.useMemo(() => runtimeService.getById(runtimeId), [runtimeStore, runtimeId])

    return <Flex justify={"space-between"} align={"center"} style={{gap: "1.3rem"}}>

        {minimized ? (
            <Flex align={"center"} style={{gap: "0.7rem"}}>
                <IconServer size={16}/>
                <Text size={"md"} hierarchy={"secondary"} display={"block"}>
                    {runtime?.name}
                </Text>
            </Flex>
            ) : (
            <Flex style={{flexDirection: "column", gap: "0.35rem"}}>
                <Text size={"lg"} hierarchy={"secondary"} display={"block"}>
                    {runtime?.name}
                </Text>
                <Text size={"sm"} hierarchy={"tertiary"} display={"block"}>
                    {runtime?.description}
                </Text>
            </Flex>
        )}
        <Flex align={"center"} style={{gap: "1.3rem"}}>
            <Flex align={"center"} style={{gap: "0.35rem", flexWrap: "wrap"}}>
                {runtime?.status === "CONNECTED" ? (
                    <Badge color={"success"}>CONNECTED</Badge>
                ) : (
                    <Badge color={"error"}>DISCONNECTED</Badge>
                )}
            </Flex>
            {!minimized && (runtime?.userAbilities?.deleteRuntime || runtime?.userAbilities?.updateRuntime || runtime?.userAbilities?.rotateRuntimeToken) ? (
                <Button color={"secondary"} onClick={(event) => {
                    event.stopPropagation()
                    onSetting(runtime)
                }}>
                    <IconSettings size={16}/>
                </Button>
            ) : null}
        </Flex>
    </Flex>
}