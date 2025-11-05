"use client"

import React from "react"
import {Code0Component} from "../../../utils/types"
import {Scalars} from "@code0-tech/sagittarius-graphql-types"
import {Card} from "../../../index"
import Text from "../../text/Text"
import {IconGitFork, IconServer, IconServer2, IconSettings} from "@tabler/icons-react"
import {useService, useStore} from "../../../utils/contextStore"
import {DNamespaceProjectReactiveService} from "./DNamespaceProject.service"
import Flex from "../../flex/Flex"
import Button from "../../button/Button"
import CardSection from "../../card/CardSection"
import Badge from "../../badge/Badge"
import {DNamespaceReactiveService} from "../DNamespace.service"
import {DRuntimeReactiveService} from "../../d-runtime/DRuntime.service"

export interface DNamespaceProjectCardProps extends Code0Component<HTMLDivElement> {
    projectId: Scalars['NamespaceProjectID']['output']
    onSettingsClick?: (projectId: Scalars['NamespaceProjectID']['output']) => void
}

const DNamespaceProjectCard: React.FC<DNamespaceProjectCardProps> = props => {
    const projectStore = useStore(DNamespaceProjectReactiveService)
    const projectService = useService(DNamespaceProjectReactiveService)

    const namespaceStore = useStore(DNamespaceReactiveService)
    const namespaceService = useService(DNamespaceReactiveService)

    const runtimeStore = useStore(DRuntimeReactiveService)
    const runtimeService = useService(DRuntimeReactiveService)

    const project = projectService.getById(props.projectId)
    if (!project?.namespace?.id || !project?.primaryRuntime?.id) return

    const namespace = namespaceService.getById(project?.namespace?.id)
    const assignedRuntime = runtimeService.getById(project?.primaryRuntime?.id)

    const flowCount = project?.flows?.count
    const runtimeCount = namespace?.runtimes?.count
    const assignedRuntimeName = assignedRuntime?.name

    return React.useMemo(() => {
        return (
            <Card maw={"400px"}>
                <Flex align={"center"} style={{gap: "0.7rem"}} justify={"space-between"}>
                    <Text size={"lg"} hierarchy={"primary"} display={"block"}>
                        {project?.name}
                    </Text>
                    <Flex align={"center"} style={{gap: "0.35rem"}}>
                        <Button color={"secondary"} onClick={props.onSettingsClick}><IconSettings size={16}/>Settings</Button>
                    </Flex>
                </Flex>
                <Text size={"sm"} hierarchy={"tertiary"} display={"block"}>
                    {project?.description}
                </Text>
                <CardSection border>
                    <Flex align={"center"} style={{gap: "0.35rem", flexWrap: "wrap"}}>
                        {/* Flow count */}
                        <Badge color={"info"}>
                            <IconGitFork size={18}/>
                            <Text size={"xs"}>{`${flowCount ?? 0} flow${(flowCount ?? 0) !== 1 ? "s" : ""}`}</Text>
                        </Badge>
                        {/* Runtime Count */}
                        <Badge color={"info"}>
                            <IconServer size={18}/>
                            <Text size={"xs"}>{`${runtimeCount ?? 0} runtime${(runtimeCount ?? 0) !== 1 ? "s" : ""}`}</Text>
                        </Badge>
                        {/* Assigned Runtime */}
                        {assignedRuntimeName && (
                            <Badge color={"info"}>
                                <IconServer2 size={18}/>
                                <Text size={"xs"} hierarchy={"tertiary"}>Assigned:</Text>
                                <Text size={"xs"}>{assignedRuntimeName}</Text>
                            </Badge>
                        )}
                    </Flex>
                </CardSection>
            </Card>
        )
    }, [projectStore, namespaceStore, runtimeStore])
}

export default DNamespaceProjectCard