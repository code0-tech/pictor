"use client"

import React from "react"
import {Code0Component} from "../../utils/types"
import {Scalars} from "@code0-tech/sagittarius-graphql-types"
import {Card} from "../../index"
import Text from "../text/Text"
import {useService, useStore} from "../../utils/contextStore"
import {DOrgaReactiveService} from "./DOrga.service"
import Row from "../row/Row"
import Badge from "../badge/Badge"
import {IconUsersGroup} from "@tabler/icons-react"
import Col from "../col/Col"
import {DNamespaceProjectReactiveServiceExtended} from "../d-namespace/project/DNamespaceProjectCard"

export interface DOrganizationCardProps extends Code0Component<HTMLDivElement> {
    organizationId: Scalars['OrganizationID']['output']
}

const DOrganizationCard: React.FC<DOrganizationCardProps> = props => {
    const organizationStore = useStore(DOrgaReactiveService)
    const organizationService = useService(DOrgaReactiveService)
    const projectService = useService(DNamespaceProjectReactiveServiceExtended)

    const organization = organizationService.findById(props.organizationId)
    //get projects count

    return React.useMemo(() => {
        return (
            <Card style={{ padding: "16px" }}>
                <Row style={{alignItems: "center"}}>
                    <IconUsersGroup size={52}/>
                    <Col>
                        <Text size={"lg"} hierarchy={"primary"} style={{display: "block", marginBottom: ".25rem"}}>
                            {organization?.name}
                        </Text>
                        <Badge color={"secondary"} style={{fontSize: "0.8rem", width: "100%", borderRadius: "8px"}}>
                            {"Projects: 0"}
                        </Badge>
                    </Col>
                </Row>

            </Card>
        )
    }, [organizationStore])
}

export default DOrganizationCard