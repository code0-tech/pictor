"use client"

import React from "react"
import {Menu, MenuContent, MenuItem, MenuPortal, MenuProps, MenuSeparator, MenuTrigger} from "../menu/Menu"
import {DNamespaceProjectReactiveService} from "./DNamespaceProject.service"
import {useService} from "../../utils/contextStore"
import {Namespace, Scalars} from "@code0-tech/sagittarius-graphql-types"
import {Button} from "../button/Button"
import {DNamespaceProjectView} from "./DNamespaceProject.view";
import {DNamespaceProjectContent} from "./DNamespaceProjectContent";

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
                    <MenuContent side={"bottom"} align={"center"} sideOffset={8} maw={"200px"}>
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
                    </MenuContent>
                </MenuPortal>
            </Menu>
        )
    }, [projectStore])
}

export default DNamespaceProjectMenu