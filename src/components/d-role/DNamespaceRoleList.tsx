import {DNamespaceRoleContent} from "./DNamespaceRoleContent";
import {Namespace} from "@code0-tech/sagittarius-graphql-types";
import React from "react";
import {Card} from "../card/Card";
import {useService, useStore} from "../../utils";
import {DNamespaceRoleReactiveService} from "./DNamespaceRole.service";
import CardSection from "../card/CardSection";
import {DNamespaceRoleView} from "./DNamespaceRole.view";

export interface DNamespaceRoleListProps extends Omit<Card, "children" | "onSelect"> {
    namespaceId: Namespace["id"]
    filter?: (role: DNamespaceRoleView, index: number) => boolean
    onSetting?: (role: DNamespaceRoleView) => void
}

export const DNamespaceRoleList: React.FC<DNamespaceRoleListProps> = (props) => {
    const {namespaceId, filter = () => true, onSetting, ...rest} = props

    const roleService = useService(DNamespaceRoleReactiveService)
    const roleStore = useStore(DNamespaceRoleReactiveService)

    const roles = React.useMemo(() => roleService.values({namespaceId: namespaceId}), [roleStore, namespaceId])

    return <Card {...rest}>
        {roles.filter(filter).map((role) => role.id && (
            <CardSection border key={role.id}>
                <DNamespaceRoleContent onSetting={onSetting} roleId={role?.id}/>
            </CardSection>
        ))}
    </Card>

}