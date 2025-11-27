import {NamespaceMember} from "@code0-tech/sagittarius-graphql-types";
import {Card} from "../card/Card";
import React from "react";
import {DNamespaceMemberContent} from "./DNamespaceMemberContent";
import {DNamespaceMemberView} from "./DNamespaceMember.view";

export interface DNamespaceMemberCardProps {
    memberId: NamespaceMember["id"]
    onRemove?: (member: DNamespaceMemberView) => void
    onAssignRole?: (member: DNamespaceMemberView) => void
}

export const DNamespaceMemberCard: React.FC<DNamespaceMemberCardProps> = (props) => {
    const {memberId, onRemove, onAssignRole} = props

    return <Card>
        <DNamespaceMemberContent onRemove={onRemove} onAssignRole={onAssignRole} memberId={memberId}/>
    </Card>
}