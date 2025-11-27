import React from "react";
import {DNamespaceRoleView} from "./DNamespaceRole.view";
import {Card} from "../card/Card";
import {NamespaceRole} from "@code0-tech/sagittarius-graphql-types";
import {DNamespaceRoleContent} from "./DNamespaceRoleContent";

export interface DNamespaceRoleCardProps extends Omit<Card, "children" | "onSelect"> {
    roleId: NamespaceRole['id']
    onSetting?: (role: DNamespaceRoleView) => void
    onMembersViewMore?: (role: DNamespaceRoleView) => void
    onProjectsViewMore?: (role: DNamespaceRoleView) => void
}

export const DNamespaceRoleCard: React.FC<DNamespaceRoleCardProps> = (props) => {

    const {
        roleId, onSetting, onMembersViewMore, onProjectsViewMore
    } = props

    return <Card>
        <DNamespaceRoleContent onSetting={onSetting} onMembersViewMore={onMembersViewMore}
                               onProjectsViewMore={onProjectsViewMore} roleId={roleId}/>
    </Card>

}