import React from "react";
import {Namespace, NamespaceProject} from "@code0-tech/sagittarius-graphql-types";
import {Card} from "../card/Card";
import {DNamespaceProjectView} from "./DNamespaceProject.view";
import {useService, useStore} from "../../utils";
import {DNamespaceProjectReactiveService} from "./DNamespaceProject.service";
import CardSection from "../card/CardSection";
import {DNamespaceProjectContent} from "./DNamespaceProjectContent";

export interface DNamespaceProjectListProps extends Omit<Card, "children" | "onSelect"> {
    namespaceId: Namespace["id"]
    filter?: (project: DNamespaceProjectView, index: number) => boolean
    onSetting?: (projectId: NamespaceProject["id"]) => void
    onSelect?: (projectId: NamespaceProject["id"]) => void
}

export const DNamespaceProjectList: React.FC<DNamespaceProjectListProps> = (props) => {
    const {namespaceId, filter = () => true, onSetting, onSelect, ...rest} = props

    const projectService = useService(DNamespaceProjectReactiveService)
    const projectStore = useStore(DNamespaceProjectReactiveService)
    const projects = React.useMemo(() => projectService.values({namespaceId: namespaceId}), [projectStore, namespaceId])

    return <Card {...rest}>
        {projects.filter(filter).map((project) => project.id && (
            <CardSection border hover onClick={() => {
                if (onSelect) onSelect(project.id)
            }} key={project.id}>
                <DNamespaceProjectContent onSetting={onSetting} projectId={project?.id}/>
            </CardSection>
        ))}
    </Card>
}