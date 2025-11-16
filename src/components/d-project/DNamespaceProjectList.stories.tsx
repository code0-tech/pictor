import {Meta, StoryObj} from "@storybook/react";
import React from "react";
import DNamespaceProjectCard from "./DNamespaceProjectCard"
import {ContextStoreProvider, useReactiveArrayService} from "../../utils"
import {
    NamespacesProjectsAssignRuntimesInput,
    NamespacesProjectsAssignRuntimesPayload,
    NamespacesProjectsCreateInput,
    NamespacesProjectsCreatePayload,
    NamespacesProjectsDeleteInput,
    NamespacesProjectsDeletePayload,
    type OrganizationsCreateInput,
    type OrganizationsCreatePayload,
    type OrganizationsDeleteInput,
    type OrganizationsDeletePayload,
    type OrganizationsUpdateInput,
    type OrganizationsUpdatePayload,
    RuntimesCreateInput,
    RuntimesCreatePayload,
    RuntimesDeleteInput,
    RuntimesDeletePayload,
    RuntimesRotateTokenInput,
    RuntimesRotateTokenPayload,
    RuntimesUpdateInput,
    RuntimesUpdatePayload,
    type UsersEmailVerificationInput,
    type UsersEmailVerificationPayload,
    type UsersIdentityLinkInput,
    type UsersIdentityLinkPayload,
    type UsersIdentityLoginInput,
    type UsersIdentityLoginPayload,
    type UsersIdentityRegisterInput,
    type UsersIdentityRegisterPayload,
    type UsersIdentityUnlinkInput,
    type UsersIdentityUnlinkPayload,
    type UsersLoginInput,
    type UsersLoginPayload,
    type UsersLogoutInput,
    type UsersLogoutPayload,
    type UsersMfaBackupCodesRotateInput,
    type UsersMfaBackupCodesRotatePayload,
    type UsersMfaTotpGenerateSecretInput,
    type UsersMfaTotpGenerateSecretPayload,
    type UsersMfaTotpValidateSecretInput,
    type UsersMfaTotpValidateSecretPayload,
    type UsersPasswordResetInput,
    type UsersPasswordResetPayload,
    type UsersPasswordResetRequestInput,
    type UsersPasswordResetRequestPayload,
    type UsersRegisterInput,
    type UsersRegisterPayload
} from "@code0-tech/sagittarius-graphql-types"
import {DNamespaceReactiveService, DNamespaceView} from "../d-namespace"
import {DRuntimeReactiveService, DRuntimeView} from "../d-runtime"
import {DNamespaceProjectReactiveService} from "./DNamespaceProject.service";
import {DNamespaceProjectView} from "./DNamespaceProject.view";
import {DOrganizationReactiveService, DOrganizationView} from "../d-organization";
import {DUserReactiveService, DUserView, setUserSession} from "../d-user";
import {Container} from "../container/Container";
import {DNamespaceProjectList} from "./DNamespaceProjectList";

const meta: Meta = {
    title: "DNamespaceProjectList",
    component: DNamespaceProjectList,
}

export default meta

type DNamespaceProjectListStory = StoryObj<typeof DNamespaceProjectList>;

class DOrganizationReactiveServiceExtended extends DOrganizationReactiveService {
    organizationCreate(payload: OrganizationsCreateInput): Promise<OrganizationsCreatePayload | undefined> {
        return Promise.resolve(undefined);
    }

    organizationDelete(payload: OrganizationsDeleteInput): Promise<OrganizationsDeletePayload | undefined> {
        return Promise.resolve(undefined);
    }

    organizationUpdate(payload: OrganizationsUpdateInput): Promise<OrganizationsUpdatePayload | undefined> {
        return Promise.resolve(undefined);
    }
}

export class DNamespaceProjectReactiveServiceExtended extends DNamespaceProjectReactiveService {
    projectAssignRuntimes(payload: NamespacesProjectsAssignRuntimesInput): Promise<NamespacesProjectsAssignRuntimesPayload | undefined> {
        return Promise.resolve(undefined);
    }

    projectCreate(payload: NamespacesProjectsCreateInput): Promise<NamespacesProjectsCreatePayload | undefined> {
        return Promise.resolve(undefined);
    }

    projectDelete(payload: NamespacesProjectsDeleteInput): Promise<NamespacesProjectsDeletePayload | undefined> {
        return Promise.resolve(undefined);
    }
}

export class DNamespaceReactiveServiceExtended extends DNamespaceReactiveService {
}

export class DRuntimeReactiveServiceExtended extends DRuntimeReactiveService {
    runtimeCreate(payload: RuntimesCreateInput): Promise<RuntimesCreatePayload | undefined> {
        return Promise.resolve(undefined);
    }

    runtimeDelete(payload: RuntimesDeleteInput): Promise<RuntimesDeletePayload | undefined> {
        return Promise.resolve(undefined);
    }

    runtimeRotateToken(payload: RuntimesRotateTokenInput): Promise<RuntimesRotateTokenPayload | undefined> {
        return Promise.resolve(undefined);
    }

    runtimeUpdate(payload: RuntimesUpdateInput): Promise<RuntimesUpdatePayload | undefined> {
        return Promise.resolve(undefined);
    }
}

class DUserReactiveServiceExtended extends DUserReactiveService {
    usersEmailVerification(payload: UsersEmailVerificationInput): Promise<UsersEmailVerificationPayload | undefined> {
        return Promise.resolve(undefined);
    }

    usersIdentityLink(payload: UsersIdentityLinkInput): Promise<UsersIdentityLinkPayload | undefined> {
        return Promise.resolve(undefined);
    }

    usersIdentityLogin(payload: UsersIdentityLoginInput): Promise<UsersIdentityLoginPayload | undefined> {
        return Promise.resolve(undefined);
    }

    usersIdentityRegister(payload: UsersIdentityRegisterInput): Promise<UsersIdentityRegisterPayload | undefined> {
        return Promise.resolve(undefined);
    }

    usersIdentityUnlink(payload: UsersIdentityUnlinkInput): Promise<UsersIdentityUnlinkPayload | undefined> {
        return Promise.resolve(undefined);
    }

    usersLogin(payload: UsersLoginInput): Promise<UsersLoginPayload | undefined> {
        return Promise.resolve(undefined);
    }

    usersLogout(payload: UsersLogoutInput): Promise<UsersLogoutPayload | undefined> {
        return Promise.resolve(undefined);
    }

    usersMfaBackupCodesRotate(payload: UsersMfaBackupCodesRotateInput): Promise<UsersMfaBackupCodesRotatePayload | undefined> {
        return Promise.resolve(undefined);
    }

    usersMfaTotpGenerateSecret(payload: UsersMfaTotpGenerateSecretInput): Promise<UsersMfaTotpGenerateSecretPayload | undefined> {
        return Promise.resolve(undefined);
    }

    usersMfaTotpValidateSecret(payload: UsersMfaTotpValidateSecretInput): Promise<UsersMfaTotpValidateSecretPayload | undefined> {
        return Promise.resolve(undefined);
    }

    usersPasswordReset(payload: UsersPasswordResetInput): Promise<UsersPasswordResetPayload | undefined> {
        return Promise.resolve(undefined);
    }

    usersPasswordResetRequest(payload: UsersPasswordResetRequestInput): Promise<UsersPasswordResetRequestPayload | undefined> {
        return Promise.resolve(undefined);
    }

    usersRegister(payload: UsersRegisterInput): Promise<UsersRegisterPayload | undefined> {
        return Promise.resolve(undefined);
    }
}


export const DNamespaceProjectListExample: DNamespaceProjectListStory = {
    render: (props) => {

        const [organizationStore, organizationService] = useReactiveArrayService<DOrganizationView, DOrganizationReactiveServiceExtended>(DOrganizationReactiveServiceExtended, [
            new DOrganizationView({
                id: "gid://sagittarius/Organization/1",
                name: "Example Organization",
                namespace: {
                    id: "gid://sagittarius/Namespace/1",
                },
                createdAt: new Date().toString(),
                updatedAt: new Date().toString(),
                userAbilities: {
                    deleteOrganization: true
                }
            })
        ])

        const [projectStore, projectService] = useReactiveArrayService<DNamespaceProjectView, DNamespaceProjectReactiveServiceExtended>(DNamespaceProjectReactiveServiceExtended, [
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

        const [namespaceStore, namespaceService] = useReactiveArrayService<DNamespaceView, DNamespaceReactiveServiceExtended>(DNamespaceReactiveServiceExtended, [
            new DNamespaceView({
                id: "gid://sagittarius/Namespace/1",
                createdAt: new Date().toString(),
                updatedAt: new Date().toString(),
                projects: undefined,
                runtimes: {
                    count: 5
                },
                members: undefined,
                namespaceLicenses: undefined,
                parent: {
                    __typename: "Organization",
                    id: "gid://sagittarius/Organization/1"
                },
                roles: undefined
            })
        ])

        const [runtimeStore, runtimeService] = useReactiveArrayService<DRuntimeView, DRuntimeReactiveServiceExtended>(DRuntimeReactiveServiceExtended, [
            new DRuntimeView({
                id: "gid://sagittarius/Runtime/1",
                name: "Example Runtime",
                createdAt: new Date().toString(),
                updatedAt: new Date().toString(),
                token: "example-token",
                dataTypes: undefined,
                description: undefined,
                flowTypes: undefined,
                namespace: undefined,
                projects: undefined,
                status: undefined
            })
        ])

        const [userStore, userService] = useReactiveArrayService<DUserView, DUserReactiveServiceExtended>(DUserReactiveServiceExtended, [
            new DUserView({
                id: "gid://sagittarius/User/1",
                username: "exampleuser",
                email: "test@gmail.com",
                admin: true,
                avatarPath: "",
                firstname: undefined,
                lastname: undefined,
                namespace: undefined,
                namespaceMemberships: undefined,
                createdAt: new Date().toString(),
                updatedAt: new Date().toString(),
            })
        ])

        setUserSession({
            user: {
                id: "gid://sagittarius/User/1",
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
            },
            active: true,
            token: "test"
        })

        return (
            <ContextStoreProvider
                services={[[projectStore, projectService], [namespaceStore, namespaceService], [runtimeStore, runtimeService], [organizationStore, organizationService], [userStore, userService]]}>
                <Container>
                    {React.useMemo(() => {
                        return <DNamespaceProjectList/>
                    }, [])}
                </Container>
            </ContextStoreProvider>
        )
    }
}