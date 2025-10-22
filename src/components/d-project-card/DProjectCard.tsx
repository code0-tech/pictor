import React from "react"
import {Code0Component} from "../../utils/types"
import {Flow, FlowConnection, Namespace, Runtime, RuntimeConnection} from "@code0-tech/sagittarius-graphql-types"
import "./DProjectCard.style.scss"
import {Card} from "../../index"
import CardSection from "../card/CardSection"

export interface DProjectCardProps extends Code0Component<HTMLDivElement> {
    __typename?: 'NamespaceProject'
    id?: string
    name?: string
    description?: string
    namespace?: Namespace
    flow?: Flow
    flows?: FlowConnection
    primaryRuntime?: Runtime
    runtimes?: RuntimeConnection
    createdAt?: Date
    updatedAt?: Date
}

const DProjectCard: React.FC<DProjectCardProps> = props => {

    return (
        <Card>
            <CardSection>
                {props.children}
            </CardSection>
        </Card>
    )
}