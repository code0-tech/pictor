"use client"

import React from "react"
import {Code0Component} from "../../utils"
import {NamespaceProject, Scalars} from "@code0-tech/sagittarius-graphql-types"
import {Card} from "../card/Card"
import {DNamespaceProjectContent} from "./DNamespaceProjectContent";
import {DNamespaceProjectView} from "./DNamespaceProject.view";

export interface DNamespaceProjectCardProps extends Code0Component<HTMLDivElement> {
    projectId: NamespaceProject['id']
    onSetting?: (project: DNamespaceProjectView) => void
}

export const DNamespaceProjectCard: React.FC<DNamespaceProjectCardProps> = props => {

    const {
        projectId, onSetting = (_) => {
        }
    } = props
    return (
        <Card>
            <DNamespaceProjectContent onSetting={onSetting} projectId={projectId}/>
        </Card>
    )
}