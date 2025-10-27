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

export interface DNamespaceProjectCardProps extends Code0Component<HTMLDivElement> {
    projectId: Scalars['NamespaceProjectID']['output']
}

const DNamespaceProjectCard: React.FC<DNamespaceProjectCardProps> = props => {
    const projectStore = useStore(DNamespaceProjectReactiveService)
    const projectService = useService(DNamespaceProjectReactiveService)

    const project = projectService.findById(props.projectId)

    return React.useMemo(() => {
        return (
            <Card style={{ padding: "16px"}} width={"100%"}>
                <Row style={{ alignItems: "center" }}>
                    <IconBox size={52}/>
                    <Col style={{minWidth: 0, flex: 1}}>
                        <Text size={"lg"} hierarchy={"primary"} style={{overflow: "hidden", display: "block", marginBottom: ".25rem", textOverflow: "ellipsis", whiteSpace: "nowrap"}}>
                            {project?.name}
                        </Text>
                        <Text size={"md"} hierarchy={"secondary"} style={{overflow: "hidden", display: "block", marginBottom: ".25rem", textOverflow: "ellipsis", whiteSpace: "nowrap"}}>
                            {project?.description}
                        </Text>
                        <Text size={"sm"} hierarchy={"tertiary"} style={{display: "block", marginTop: ".75rem"}}>
                            {format(new Date(project?.updatedAt ?? ""), "dd/MM/yyyy HH:mm")}
                        </Text>
                    </Col>
                </Row>
            </Card>
        )
    }, [projectStore])
}

export default DNamespaceProjectCard