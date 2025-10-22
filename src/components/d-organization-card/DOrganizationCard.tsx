import React from "react"
import {Code0Component} from "../../utils/types"
import {Namespace} from "@code0-tech/sagittarius-graphql-types"
import "./DOrganizationCard.style.scss"
import {Card} from "../../index"
import CardSection from "../card/CardSection"

export interface DOrganizationCardProps extends Code0Component<HTMLDivElement> {
    __typename?: 'Organization'
    id?: string
    name?: string
    namespace?: Namespace
    createdAt?: Date
    updatedAt?: Date
}

const DOrganizationCard: React.FC<DOrganizationCardProps> = props => {

    return (
        <Card>
            <CardSection>
                {props.children}
            </CardSection>
        </Card>
    )
}