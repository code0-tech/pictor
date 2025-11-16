import React from "react";
import {NamespaceProject} from "@code0-tech/sagittarius-graphql-types";
import {Card} from "../card/Card";
import {DNamespaceProjectView} from "./DNamespaceProject.view";
import {useService, useStore} from "../../utils";
import {DNamespaceProjectReactiveService} from "./DNamespaceProject.service";
import CardSection from "../card/CardSection";
import {DNamespaceProjectContent} from "./DNamespaceProjectContent";

export interface DNamespaceProjectListProps extends Omit<Card, "children"> {
    filter?: (project: DNamespaceProjectView, index: number) => boolean
    onSetting?: (projectId: NamespaceProject["id"]) => void
}

export const DNamespaceProjectList: React.FC<DNamespaceProjectListProps> = (props) => {
    const {filter = () => true, onSetting, ...rest} = props

    const projectService = useService(DNamespaceProjectReactiveService)
    const projectStore = useStore(DNamespaceProjectReactiveService)
    const projects = React.useMemo(() => projectService.values(), [projectStore])

    return <Card {...rest}>
        {projects.filter(filter).map((project) => project.id && (
            <CardSection border key={project.id}>
                <DNamespaceProjectContent onSetting={onSetting} projectId={project?.id}/>
            </CardSection>
        ))}
    </Card>
}