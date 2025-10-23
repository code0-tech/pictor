"use client"

import React from "react"
import {Code0Component} from "../../utils/types"
import {
    OrganizationsCreateInput,
    OrganizationsDeleteInput,
    OrganizationsUpdateInput,
    Scalars
} from "@code0-tech/sagittarius-graphql-types"
import {Card} from "../../index"
import Text from "../text/Text"
import {useService, useStore} from "../../utils/contextStore"
import {DOrganizationReactiveService} from "./DOrganizationService"
import Row from "../row/Row"
import Badge from "../badge/Badge"
import {IconUsersGroup} from "@tabler/icons-react"
import Col from "../col/Col"
import {DOrganizationView} from "./DOrganizationView"

export class DOrganizationReactiveServiceExtended extends DOrganizationReactiveService {
    organizationCreate(payload: OrganizationsCreateInput): DOrganizationView | undefined {
        return undefined
    }

    organizationDelete(payload: OrganizationsDeleteInput): void {
    }

    organizationUpdate(payload: OrganizationsUpdateInput): DOrganizationView | undefined {
        return undefined
    }
}

export interface DOrganizationCardProps extends Code0Component<HTMLDivElement> {
    organizationId: Scalars['OrganizationID']['output']
}

const DOrganizationCard: React.FC<DOrganizationCardProps> = props => {
    const organizationStore = useStore(DOrganizationReactiveServiceExtended)
    const organizationService = useService(DOrganizationReactiveServiceExtended)

    const organization = organizationService.findById(props.organizationId)
    const projectCount = organization?.namespace?.projects?.count

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
                            {"Projects: " + (projectCount ?? 0)}
                        </Badge>
                    </Col>
                </Row>

            </Card>
        )
    }, [organizationStore])
}

export default DOrganizationCard