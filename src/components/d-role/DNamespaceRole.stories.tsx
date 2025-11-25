import {Meta} from "@storybook/react-vite";
import {ContextStoreProvider, useReactiveArrayService} from "../../utils";
import {DNamespaceRoleView} from "./DNamespaceRole.view";
import {DNamespaceRoleReactiveService} from "./DNamespaceRole.service";
import {
    NamespaceRoleAbility,
    NamespacesMembersAssignRolesInput,
    NamespacesMembersAssignRolesPayload,
    NamespacesMembersDeleteInput,
    NamespacesMembersDeletePayload,
    NamespacesMembersInviteInput,
    NamespacesMembersInvitePayload,
    NamespacesRolesAssignAbilitiesInput,
    NamespacesRolesAssignAbilitiesPayload,
    NamespacesRolesAssignProjectsInput,
    NamespacesRolesAssignProjectsPayload,
    NamespacesRolesCreateInput,
    NamespacesRolesCreatePayload,
    NamespacesRolesDeleteInput,
    NamespacesRolesDeletePayload
} from "@code0-tech/sagittarius-graphql-types";
import {Container} from "../container/Container";
import React from "react";
import {DNamespaceProjectView} from "../d-project";
import {DNamespaceRoleList} from "./DNamespaceRoleList";
import {DNamespaceProjectReactiveServiceExtended} from "../d-project/DNamespaceProjectList.stories";
import {DNamespaceMemberReactiveService, DNamespaceMemberView} from "../d-member";

const meta: Meta = {
    title: "DNamespaceRole",
    component: undefined,
}

export default meta

export class DNamespaceRoleReactiveServiceExtended extends DNamespaceRoleReactiveService {
    roleAssignAbilities(payload: NamespacesRolesAssignAbilitiesInput): Promise<NamespacesRolesAssignAbilitiesPayload | undefined> {
        return Promise.resolve(undefined);
    }

    roleAssignProject(payload: NamespacesRolesAssignProjectsInput): Promise<NamespacesRolesAssignProjectsPayload | undefined> {
        return Promise.resolve(undefined);
    }

    roleCreate(payload: NamespacesRolesCreateInput): Promise<NamespacesRolesCreatePayload | undefined> {
        return Promise.resolve(undefined);
    }

    roleDelete(payload: NamespacesRolesDeleteInput): Promise<NamespacesRolesDeletePayload | undefined> {
        return Promise.resolve(undefined);
    }
}

export class DNamespaceMemberReactiveServiceExtended extends DNamespaceMemberReactiveService {
    memberAssignRoles(payload: NamespacesMembersAssignRolesInput): Promise<NamespacesMembersAssignRolesPayload | undefined> {
        return Promise.resolve(undefined);
    }

    memberDelete(payload: NamespacesMembersDeleteInput): Promise<NamespacesMembersDeletePayload | undefined> {
        return Promise.resolve(undefined);
    }

    memberInvite(payload: NamespacesMembersInviteInput): Promise<NamespacesMembersInvitePayload | undefined> {
        return Promise.resolve(undefined);
    }

}

export const DNamespaceRoleCard = () => {

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

    const project = useReactiveArrayService<DNamespaceProjectView, DNamespaceProjectReactiveServiceExtended>(DNamespaceProjectReactiveServiceExtended, [
        new DNamespaceProjectView({
            id: "gid://sagittarius/NamespaceProject/1",
            name: "Example Project",
            description: "This is an example project description.",
            createdAt: new Date().toString(),
            updatedAt: new Date().toString(),
            namespace: {
                id: "gid://sagittarius/Namespace/1"
            },
            flow: undefined,
            flows: {
                count: 10
            },
            primaryRuntime: {
                id: "gid://sagittarius/Runtime/1"
            },
            runtimes: {
                count: 2
            },
            userAbilities: {
                updateNamespaceProject: true
            }
        }),
        new DNamespaceProjectView({
            id: "gid://sagittarius/NamespaceProject/2",
            name: "Example Project",
            description: "This is an example project description.",
            createdAt: new Date().toString(),
            updatedAt: new Date().toString(),
            namespace: {
                id: "gid://sagittarius/Namespace/1"
            },
            flow: undefined,
            flows: {
                count: 10
            },
            primaryRuntime: {
                id: "gid://sagittarius/Runtime/1"
            },
            runtimes: {
                count: 2
            }
        })
    ])

    const members = useReactiveArrayService<DNamespaceMemberView, DNamespaceMemberReactiveServiceExtended>(DNamespaceMemberReactiveServiceExtended, [
        new DNamespaceMemberView({
            id: "gid://sagittarius/NamespaceMember/1",
            roles: {
                nodes: [{
                    id: "gid://sagittarius/NamespaceRole/1"
                }]
            }
        })
    ])

    return (
        <ContextStoreProvider
            services={[role, project, members]}>
            <Container>
                {React.useMemo(() => {
                    return <DNamespaceRoleList namespaceId={"gid://sagittarius/Namespace/1"}/>
                }, [])}
            </Container>
        </ContextStoreProvider>
    )

}