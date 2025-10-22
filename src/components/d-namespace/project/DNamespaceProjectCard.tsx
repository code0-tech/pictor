"use client"

import React from "react"
import {Code0Component} from "../../../utils/types"
import {
    NamespacesProjectsAssignRuntimesInput,
    NamespacesProjectsCreateInput, NamespacesProjectsDeleteInput,
    Scalars
} from "@code0-tech/sagittarius-graphql-types"
import {Card} from "../../../index"
import Text from "../../text/Text"
import {IconBox} from "@tabler/icons-react"
import Row from "../../row/Row"
import Col from "../../col/Col"
import {format} from "date-fns"
import {useService, useStore} from "../../../utils/contextStore"
import {DNamespaceProjectReactiveService} from "./DNamespaceProject.service"
import {DNamespaceProjectView} from "./DNamespaceProject.view"

export interface DNamespaceProjectCardProps extends Code0Component<HTMLDivElement> {
    projectId: Scalars['NamespaceProjectID']['output']
}

export class DNamespaceProjectReactiveServiceExtended extends DNamespaceProjectReactiveService {
    projectAssignRuntimes(payload: NamespacesProjectsAssignRuntimesInput): DNamespaceProjectView | undefined {
        return undefined
    }

    projectsCreate(payload: NamespacesProjectsCreateInput): DNamespaceProjectView | undefined {
        return undefined
    }

    projectsDelete(payload: NamespacesProjectsDeleteInput): void {}
}

const DNamespaceProjectCard: React.FC<DNamespaceProjectCardProps> = props => {
    const projectStore = useStore(DNamespaceProjectReactiveServiceExtended)
    const projectService = useService(DNamespaceProjectReactiveServiceExtended)

    const project = projectService.findById(props.projectId)

    return React.useMemo(() => {
        return (
            <Card style={{ padding: "16px" }}>
                <Row style={{ alignItems: "center"}}>
                    <IconBox size={52}/>
                    <Col>
                        <Text size={"lg"} hierarchy={"primary"} style={{display: "block", marginBottom: ".25rem"}}>
                            {project?.name}
                        </Text>
                        <Text size={"md"} hierarchy={"secondary"} style={{display: "block", marginBottom: ".25rem"}}>
                            {project?.description}
                        </Text>
                    </Col>
                </Row>
                <Text size={"sm"} hierarchy={"tertiary"} style={{display: "block", textAlign: "right", marginTop: ".5rem"}}>
                    {format(new Date(project?.updatedAt ?? ""), "dd/MM/yyyy HH:mm")}
                </Text>
            </Card>
        )
    }, [projectStore])
}

export default DNamespaceProjectCard