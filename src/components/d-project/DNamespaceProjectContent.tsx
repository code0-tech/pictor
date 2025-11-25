import {Code0Component, useService} from "../../utils";
import {NamespaceProject, Organization, User} from "@code0-tech/sagittarius-graphql-types";
import React from "react";
import {Flex} from "../flex/Flex";
import {DNamespaceReactiveService} from "../d-namespace";
import {DOrganizationReactiveService, DOrganizationView} from "../d-organization";
import {DUserReactiveService, DUserView} from "../d-user";
import {DNamespaceProjectReactiveService} from "./DNamespaceProject.service";
import {Avatar} from "../avatar/Avatar";
import {Text} from "../text/Text";
import {Badge} from "../badge/Badge";
import {IconGitFork, IconServer, IconServerSpark, IconSettings} from "@tabler/icons-react";
import {DRuntimeReactiveService} from "../d-runtime";
import {Button} from "../button/Button";
import {DNamespaceProjectView} from "./DNamespaceProject.view";

export interface DNamespaceProjectContentProps extends Code0Component<HTMLDivElement> {
    projectId: NamespaceProject["id"]
    onSetting?: (project: DNamespaceProjectView) => void
}

export const DNamespaceProjectContent: React.FC<DNamespaceProjectContentProps> = (props) => {

    const {
        projectId,
        onSetting = () => {
        }
    } = props
    const projectService = useService(DNamespaceProjectReactiveService)
    const runtimeService = useService(DRuntimeReactiveService)

    const project = React.useMemo(() => projectService.getById(projectId), [projectService, projectId])
    const assignedRuntime = React.useMemo(() => project ? runtimeService.getById(project.primaryRuntime?.id) : null, [project])

    return (
        <Flex align={"center"} style={{gap: "1.3rem"}} justify={"space-between"}>
            <Flex align={"center"} style={{gap: "1.3rem"}}>
                <Avatar bg={"transparent"}
                        identifier={project?.name ?? ""}/>
                <Flex style={{flexDirection: "column", gap: "0.35rem"}}>
                    <Text size={"lg"} hierarchy={"primary"} display={"block"}>
                        {project?.name}
                    </Text>
                    <Text size={"sm"} hierarchy={"tertiary"} display={"block"}>
                        {project?.description}
                    </Text>
                </Flex>
            </Flex>
            <Flex align={"center"} style={{gap: "1.3rem"}}>
                <Flex align={"center"} style={{gap: "0.35rem", flexWrap: "wrap"}}>
                    {/* Flow count */}
                    <Badge color={"secondary"}>
                        <IconGitFork size={16}/>
                        <Text size={"xs"}>
                            {project?.flows?.count ?? 0}
                        </Text>
                    </Badge>
                    {/* Runtime Count */}
                    <Badge color={"secondary"}>
                        <IconServer size={16}/>
                        <Text size={"xs"}>
                            {project?.runtimes?.count ?? 0}
                        </Text>
                    </Badge>
                    {/* Assigned Runtime */}
                    {assignedRuntime && (
                        <Badge color={"secondary"}>
                            <IconServerSpark size={16}/>
                            <Text size={"xs"}>{assignedRuntime.name}</Text>
                        </Badge>
                    )}
                </Flex>
                {project?.userAbilities?.deleteNamespaceProject || project?.userAbilities?.updateNamespaceProject ? (
                    <Button color={"secondary"} onClick={(event) => {
                        event.stopPropagation()
                        onSetting(project)
                    }}>
                        <IconSettings size={16}/>
                    </Button>
                ) : null}
            </Flex>
        </Flex>
    )
}