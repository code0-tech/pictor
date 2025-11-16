"use client"

import React from "react"
import {Code0Component} from "../../utils"
import {Scalars} from "@code0-tech/sagittarius-graphql-types"
import {Card} from "../card/Card"
import {DNamespaceProjectContent} from "./DNamespaceProjectContent";

export interface DNamespaceProjectCardProps extends Code0Component<HTMLDivElement> {
    projectId: Scalars['NamespaceProjectID']['output']
    onSettingsClick?: (projectId: Scalars['NamespaceProjectID']['output']) => void
}

const DNamespaceProjectCard: React.FC<DNamespaceProjectCardProps> = props => {

    const {
        projectId, onSettingsClick = (_) => {
        }
    } = props
    return (
        <Card>
            <DNamespaceProjectContent projectId={projectId}/>
        </Card>
    )
}

export default DNamespaceProjectCard