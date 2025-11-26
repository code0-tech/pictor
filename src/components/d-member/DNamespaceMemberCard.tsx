import {NamespaceMember} from "@code0-tech/sagittarius-graphql-types";
import {Card} from "../card/Card";
import React from "react";
import {DNamespaceMemberContent} from "./DNamespaceMemberContent";

export interface DNamespaceMemberCardProps {
    memberId: NamespaceMember["id"]
}

export const DNamespaceMemberCard: React.FC<DNamespaceMemberCardProps> = (props) => {
    const {
        memberId
    } = props

    return <Card>
        <DNamespaceMemberContent memberId={memberId}/>
    </Card>
}