import React from "react";
import {Flex} from "../flex/Flex";
import {DNamespaceRoleView} from "./DNamespaceRole.view";
import {NamespaceRole} from "@code0-tech/sagittarius-graphql-types";
import {useService, useStore} from "../../utils";
import {DNamespaceRoleReactiveService} from "./DNamespaceRole.service";
import {Text} from "../text/Text";
import {Button} from "../button/Button";
import {IconSettings} from "@tabler/icons-react";
import {DNamespaceRolePermissions} from "./DNamespaceRolePermissions";
import {DNamespaceMemberReactiveService} from "../d-member";

export interface DNamespaceRoleContentProps {
    roleId: NamespaceRole["id"]
    onSetting?: (role: DNamespaceRoleView) => void
}

export const DNamespaceRoleContent: React.FC<DNamespaceRoleContentProps> = (props) => {
    const {
        roleId,
        onSetting = () => {
        }
    } = props

    const roleService = useService(DNamespaceRoleReactiveService)
    const roleStore = useStore(DNamespaceRoleReactiveService)
    const memberService = useService(DNamespaceMemberReactiveService)
    const memberStore = useStore(DNamespaceMemberReactiveService)

    const role = React.useMemo(() => roleService.getById(roleId), [roleStore, roleId])
    const assignedMembers = React.useMemo(() => memberService
            .values({namespaceId: role?.namespace?.id})
            .filter(member => member.roles?.nodes?.map(role => role?.id).includes(role?.id)),
        [memberStore, roleId]
    )
    const canEditRole =
        role?.userAbilities?.deleteNamespaceRole ||
        role?.userAbilities?.updateNamespaceRole ||
        role?.userAbilities?.assignRoleAbilities ||
        role?.userAbilities?.assignRoleProjects

    return (
        <Flex align="center" style={{gap: "1.3rem"}} justify="space-between">
            <Flex align="center" style={{gap: "1.3rem"}}>
                <Text size="lg" hierarchy="primary" display="block">
                    {role?.name}
                </Text>
                <DNamespaceRolePermissions abilities={role?.abilities as string[] | undefined}/>
            </Flex>

            <Flex align="center" style={{gap: "1.3rem"}}>
                <Text style={{textAlign: "right"}} size={"sm"}>{assignedMembers.length} members assigned</Text>
                {canEditRole && (
                    <Button
                        color="secondary"
                        onClick={event => {
                            event.stopPropagation()
                            onSetting(role as DNamespaceRoleView)
                        }}
                    >
                        <IconSettings size={16}/>
                    </Button>
                )}
            </Flex>
        </Flex>
    )
}