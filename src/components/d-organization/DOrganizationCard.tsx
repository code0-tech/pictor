"use client"

import React from "react"
import {Code0Component} from "../../utils/types"
import {Scalars} from "@code0-tech/sagittarius-graphql-types"
import {Card} from "../../index"
import Text from "../text/Text"
import {useService, useStore} from "../../utils/contextStore"
import {DOrganizationReactiveService} from "./DOrganizationService"
import {IconFolder} from "@tabler/icons-react"
import Col from "../col/Col"
import Row from "../row/Row"

export interface DOrganizationCardProps extends Code0Component<HTMLDivElement> {
    organizationId: Scalars['OrganizationID']['output']
}

const DOrganizationCard: React.FC<DOrganizationCardProps> = props => {
    const organizationStore = useStore(DOrganizationReactiveService)
    const organizationService = useService(DOrganizationReactiveService)

    const organization = organizationService.findById(props.organizationId)
    const projectCount = organization?.namespace?.projects?.count

    return React.useMemo(() => {
        return (
            <Card style={{ padding: "16px 16px 8px 16px" }} width={"100%"}>
                <Col style={{minWidth: 0, flex: 1}}>
                    <Text size={"lg"} hierarchy={"primary"} style={{overflow: "hidden", display: "block", marginBottom: ".25rem", textOverflow: "ellipsis", whiteSpace: "nowrap"}}>
                        {organization?.name}
                    </Text>
                    <Row align={"center"}>
                        <IconFolder size={32}/>
                        {`${projectCount ?? 0} project${(projectCount ?? 0) !== 1 ? "s" : ""}`}
                    </Row>
                </Col>
            </Card>
        )
    }, [organizationStore])
}

export default DOrganizationCard