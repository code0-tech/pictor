import React from "react";
import {DNamespaceRoleView} from "./DNamespaceRole.view";
import {Card} from "../card/Card";
import {NamespaceRole} from "@code0-tech/sagittarius-graphql-types";
import {DNamespaceRoleContent} from "./DNamespaceRoleContent";

export interface DNamespaceRoleCardProps extends Omit<Card, "children" | "onSelect"> {
    roleId: NamespaceRole['id']
    onSetting?: (role: DNamespaceRoleView) => void
}

export const DNamespaceRoleCard: React.FC<DNamespaceRoleCardProps> = (props) => {

    const {
        roleId, onSetting = (_) => {
        }
    } = props

    return <Card>
        <DNamespaceRoleContent onSetting={onSetting} roleId={roleId}/>
    </Card>

}