"use client"

import React from "react"
import {Menu, MenuContent, MenuItem, MenuPortal, MenuProps, MenuTrigger} from "../../menu/Menu"
import {DNamespaceProjectView} from "./DNamespaceProject.view"
import {DNamespaceProjectReactiveService} from "./DNamespaceProject.service"
import {useService} from "../../../utils/contextStore"
import {Scalars} from "@code0-tech/sagittarius-graphql-types"
import Button from "../../button/Button"

export interface DNamespaceProjectMenuProps extends MenuProps {
    projectId: Scalars['NamespaceProjectID']['output']
    onProjectSelect: (payload: DNamespaceProjectView) => void
}

const DNamespaceProjectMenu: React.FC<DNamespaceProjectMenuProps> = props => {
    const projectService = useService(DNamespaceProjectReactiveService)
    const projectStore = useService(DNamespaceProjectReactiveService)
    const currentProject = projectService.findById(props.projectId)

    return React.useMemo(() => {
        return (
            <Menu {...props}>
                <MenuTrigger asChild>
                    <Button variant={"none"} style={{background: "transparent"}}>
                        {currentProject?.name}
                    </Button>
                </MenuTrigger>
                <MenuPortal>
                    <MenuContent side={"bottom"} align={"start"} sideOffset={0}>
                    {projectService.values().map((project) => (
                        <MenuItem
                            key={project.id}
                            onSelect={() => props.onProjectSelect(project)}
                        >
                            {project.name}
                        </MenuItem>
                    ))}
                    </MenuContent>
                </MenuPortal>
            </Menu>
        )
    }, [projectStore])
}

export default DNamespaceProjectMenu