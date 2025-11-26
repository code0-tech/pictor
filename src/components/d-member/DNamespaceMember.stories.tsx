import {Meta} from "@storybook/react-vite";
import {ContextStoreProvider, useReactiveArrayService} from "../../utils";
import {DNamespaceMemberView} from "./DNamespaceMember.view";
import {DUserView} from "../d-user";
import {DUserReactiveServiceExtended} from "../d-user/DUserList.stories";
import {
    DNamespaceMemberReactiveServiceExtended,
    DNamespaceRoleReactiveServiceExtended
} from "../d-role/DNamespaceRole.stories";
import {DNamespaceRoleList, DNamespaceRoleView} from "../d-role";
import {NamespaceRoleAbility} from "@code0-tech/sagittarius-graphql-types";
import {Container} from "../container/Container";
import React from "react";
import {DNamespaceMemberList} from "./DNamespaceMemberList";

const meta: Meta = {
    title: "DNamespaceMember",
}

export default meta

export const MemberListExample = () => {

    const members = useReactiveArrayService<DNamespaceMemberView, DNamespaceMemberReactiveServiceExtended>(DNamespaceMemberReactiveServiceExtended, [
        new DNamespaceMemberView({
            id: "gid://sagittarius/NamespaceMember/1",
            user: {
                id: "gid://sagittarius/User/1",
            },
            roles: {
                nodes: [{
                    id: "gid://sagittarius/NamespaceRole/1"
                }, {
                    id: "gid://sagittarius/NamespaceRole/2"
                }]
            },
            userAbilities: {
                deleteMember: true,
                assignMemberRoles: true
            }
        }),
        new DNamespaceMemberView({
            id: "gid://sagittarius/NamespaceMember/2",
            user: {
                id: "gid://sagittarius/User/2",
            },
            roles: {
                nodes: [{
                    id: "gid://sagittarius/NamespaceRole/1"
                }]
            },
            userAbilities: {
                deleteMember: true
            }
        })
    ])

    const user = useReactiveArrayService<DUserView, DUserReactiveServiceExtended>(DUserReactiveServiceExtended, [
        new DUserView({
            id: "gid://sagittarius/User/1",
            username: "nsammito",
            email: "nsammito@code0.tech",
            admin: true,
            avatarPath: "",
            firstname: undefined,
            lastname: undefined,
            namespace: undefined,
            namespaceMemberships: undefined,
            createdAt: new Date().toString(),
            updatedAt: new Date().toString(),
            emailVerifiedAt: "sd"
        }),
        new DUserView({
            id: "gid://sagittarius/User/2",
            username: "exampleuser",
            email: "test@gmail.com",
            admin: undefined,
            avatarPath: "",
            firstname: undefined,
            lastname: undefined,
            namespace: undefined,
            namespaceMemberships: undefined,
            createdAt: new Date().toString(),
            updatedAt: new Date().toString(),
            emailVerifiedAt: "sd"
        })
    ])

    const role = useReactiveArrayService<DNamespaceRoleView, DNamespaceRoleReactiveServiceExtended>(DNamespaceRoleReactiveServiceExtended, [
        new DNamespaceRoleView({
            id: "gid://sagittarius/NamespaceRole/1",
            name: "Admin",
            abilities: [NamespaceRoleAbility.NamespaceAdministrator],
            namespace: {
                id: "gid://sagittarius/Namespace/1"
            },
            userAbilities: {
                deleteNamespaceRole: true
            },
            assignedProjects: {
                nodes: [{
                    id: "gid://sagittarius/NamespaceProject/1"
                }, {
                    id: "gid://sagittarius/NamespaceProject/2"
                }]
            }
        }),
        new DNamespaceRoleView({
            id: "gid://sagittarius/NamespaceRole/2",
            name: "Editor",
            abilities: [NamespaceRoleAbility.UpdateFlow, NamespaceRoleAbility.DeleteFlow, NamespaceRoleAbility.AssignProjectRuntimes, NamespaceRoleAbility.DeleteNamespaceProject],
            namespace: {
                id: "gid://sagittarius/Namespace/1"
            },
            userAbilities: {
                deleteNamespaceRole: true
            }
        })
    ])

    return (
        <ContextStoreProvider
            services={[role, members, user]}>
            <Container>
                {React.useMemo(() => {
                    return <DNamespaceMemberList namespaceId={"gid://sagittarius/Namespace/1"}/>
                }, [])}
            </Container>
        </ContextStoreProvider>
    )

}