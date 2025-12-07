import {Code0Component, useService} from "../../utils";
import {NamespaceProject} from "@code0-tech/sagittarius-graphql-types";
import React from "react";
import {Flex} from "../flex/Flex";
import {DNamespaceProjectReactiveService} from "./DNamespaceProject.service";
import {Avatar} from "../avatar/Avatar";
import {Text} from "../text/Text";
import {Badge} from "../badge/Badge";
import {IconEdit, IconGitFork, IconServer, IconServerSpark} from "@tabler/icons-react";
import {DRuntimeReactiveService} from "../d-runtime";
import {Button} from "../button/Button";
import {DNamespaceProjectView} from "./DNamespaceProject.view";

export interface DNamespaceProjectContentProps extends Code0Component<HTMLDivElement> {
    projectId: NamespaceProject["id"]
    onSetting?: (project: DNamespaceProjectView) => void
    minimized?: boolean
}

export const DNamespaceProjectContent: React.FC<DNamespaceProjectContentProps> = (props) => {

    const {
        projectId,
        onSetting = () => {
        },
        minimized = false
    } = props
    const projectService = useService(DNamespaceProjectReactiveService)
    const runtimeService = !minimized ? useService(DRuntimeReactiveService) : null

    const project = React.useMemo(() => projectService.getById(projectId), [projectService, projectId])
    const assignedRuntime = !minimized ? React.useMemo(() => project ? runtimeService!!.getById(project.primaryRuntime?.id) : null, [project]) : null

    return (
        <Flex align={"center"} style={{gap: "1.3rem"}} justify={"space-between"}>
            <Flex align={"center"} style={{gap: "0.7rem"}}>
                <Avatar bg={"transparent"}
                        identifier={project?.name ?? ""}/>
                <Flex style={{flexDirection: "column", gap: "0.35rem"}}>
                    <Text size={!minimized ? "md" : "xs"} hierarchy={"secondary"}
                          display={"block"}>
                        {project?.name}
                    </Text>
                    <Text size={!minimized ? "sm" : "xs"} hierarchy={"tertiary"} display={"block"}>
                        {project?.description}
                    </Text>
                </Flex>
            </Flex>
            {!minimized ? (
                <Flex align={"center"} style={{gap: "1.3rem"}}>
                    <Flex style={{flexDirection: "column", gap: "0.35rem"}}>
                        <Text size="xs" hierarchy="tertiary">
                            Usage
                        </Text>
                        <Flex align={"center"} style={{gap: "0.35rem", flexWrap: "wrap"}}>
                            {/* Flow count */}
                            <Badge border>
                                <IconGitFork size={16}/>
                                <Text size={"xs"}>
                                    {project?.flows?.count ?? 0}
                                </Text>
                            </Badge>
                            {/* Runtime Count */}
                            <Badge border>
                                <IconServer size={16}/>
                                <Text size={"xs"}>
                                    {project?.runtimes?.count ?? 0}
                                </Text>
                            </Badge>
                            {/* Assigned Runtime */}
                            {assignedRuntime && (
                                <Badge border>
                                    <IconServerSpark size={16}/>
                                    <Text size={"xs"}>{assignedRuntime.name}</Text>
                                </Badge>
                            )}
                        </Flex>
                    </Flex>
                    {project?.userAbilities?.deleteNamespaceProject || project?.userAbilities?.updateNamespaceProject ? (
                        <Button color={"secondary"} variant={"filled"} onClick={(event) => {
                            event.stopPropagation()
                            onSetting(project)
                        }}>
                            <IconEdit size={16}/>
                        </Button>
                    ) : null}
                </Flex>
            ) : null}
        </Flex>
    )
}