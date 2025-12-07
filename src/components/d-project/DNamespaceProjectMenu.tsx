"use client"

import React from "react"
import {Menu, MenuContent, MenuItem, MenuLabel, MenuPortal, MenuProps, MenuSeparator, MenuTrigger} from "../menu/Menu"
import {DNamespaceProjectReactiveService} from "./DNamespaceProject.service"
import {useService} from "../../utils/contextStore"
import {Namespace, Scalars} from "@code0-tech/sagittarius-graphql-types"
import {Button} from "../button/Button"
import {DNamespaceProjectView} from "./DNamespaceProject.view";
import {DNamespaceProjectContent} from "./DNamespaceProjectContent";
import {Card} from "../card/Card";
import {Flex} from "../flex/Flex";
import {Badge} from "../badge/Badge";
import {IconArrowDown, IconArrowUp, IconCornerDownLeft} from "@tabler/icons-react";
import {Spacing} from "../spacing/Spacing";

export interface DNamespaceProjectMenuProps extends MenuProps {
    onProjectSelect: (project: DNamespaceProjectView) => void
    namespaceId: Namespace["id"]
    filter?: (project: DNamespaceProjectView, index: number) => boolean
    projectId?: Scalars['NamespaceProjectID']['output']
    children?: React.ReactNode
}

const DNamespaceProjectMenu: React.FC<DNamespaceProjectMenuProps> = props => {

    const {onProjectSelect, namespaceId, filter = () => true, projectId, children} = props

    const projectService = useService(DNamespaceProjectReactiveService)
    const projectStore = useService(DNamespaceProjectReactiveService)
    const currentProject = projectService.getById(projectId)
    const projects = React.useMemo(() => projectService.values({namespaceId: namespaceId}).filter(filter), [projectStore, namespaceId])

    return React.useMemo(() => {
        return (
            <Menu {...props}>
                <MenuTrigger asChild>
                    {children ? children : (
                        <Button variant={"none"} paddingSize={"xxs"}>
                            {currentProject?.name}
                        </Button>
                    )}
                </MenuTrigger>
                <MenuPortal>
                    <MenuContent side={"bottom"} align={"center"} sideOffset={8} maw={"210px"} color={"secondary"}>
                        <Card paddingSize={"xxs"} mt={-0.35} mx={-0.35} style={{borderWidth: "2px"}}>
                            {projects.map((project, index) => (
                                <>
                                    <MenuItem
                                        key={project.id}
                                        onSelect={() => onProjectSelect(project)}
                                    >
                                        <DNamespaceProjectContent minimized projectId={project.id}/>
                                    </MenuItem>
                                    {index < projects.length - 1 && <MenuSeparator/>}
                                </>
                            ))}
                        </Card>
                        <MenuLabel>
                            <Flex style={{gap: ".35rem"}}>
                                <Flex align={"center"} style={{gap: "0.35rem"}}>
                                    <Flex>
                                        <Badge border><IconArrowUp size={12}/></Badge>
                                        <Badge border><IconArrowDown size={12}/></Badge>
                                    </Flex>
                                    move
                                </Flex>
                                <Spacing spacing={"xxs"}/>
                                <Flex align={"center"} style={{gap: ".35rem"}}>
                                    <Badge border><IconCornerDownLeft size={12}/></Badge>
                                    add
                                </Flex>
                            </Flex>
                        </MenuLabel>
                    </MenuContent>
                </MenuPortal>
            </Menu>
        )
    }, [projectStore])
}

export default DNamespaceProjectMenu