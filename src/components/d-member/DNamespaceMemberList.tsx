"use client"

import React from "react";
import {useService, useStore} from "../../utils";
import {DNamespaceMemberReactiveService} from "./DNamespaceMember.service";
import {Namespace} from "@code0-tech/sagittarius-graphql-types";
import {Card} from "../card/Card";
import CardSection from "../card/CardSection";
import {DNamespaceMemberView} from "./DNamespaceMember.view";
import {DNamespaceMemberContent} from "./DNamespaceMemberContent";

export interface DNamespaceMemberListProps extends Omit<Card, "children" | "onSelect"> {
    namespaceId: Namespace["id"]
    filter?: (runtime: DNamespaceMemberView, index: number) => boolean
    onRemove?: (member: DNamespaceMemberView) => void
    onAssignRole?: (member: DNamespaceMemberView) => void
}

export const DNamespaceMemberList: React.FC<DNamespaceMemberListProps> = (props) => {

    const {namespaceId, filter = () => true, onRemove, onAssignRole, ...rest} = props

    const memberService = useService(DNamespaceMemberReactiveService)
    const memberStore = useStore(DNamespaceMemberReactiveService)

    const members = React.useMemo(() => memberService.values({namespaceId: namespaceId}), [memberStore, namespaceId])

    return <Card {...rest}>
        {members.filter(filter).map((member) => member && member.id && (
            <CardSection border key={member.id}>
                <DNamespaceMemberContent onRemove={onRemove} onAssignRole={onAssignRole} memberId={member?.id}/>
            </CardSection>
        ))}
    </Card>

}