import {Meta, StoryObj} from "@storybook/react"
import React from "react"
import DOrganizationCard from "./DOrganizationCard"
import {ContextStoreProvider, useReactiveArrayService} from "../../utils"
import {DOrganizationView} from "./DOrganization.view"
import {DOrganizationReactiveService} from "./DOrganization.service"
import {
    NamespacesLicensesCreateInput,
    NamespacesLicensesCreatePayload,
    NamespacesLicensesDeleteInput,
    NamespacesLicensesDeletePayload,
    NamespacesMembersAssignRolesInput,
    NamespacesMembersAssignRolesPayload,
    NamespacesMembersDeleteInput,
    NamespacesMembersDeletePayload,
    NamespacesMembersInviteInput,
    NamespacesMembersInvitePayload,
    NamespacesProjectsAssignRuntimesInput,
    NamespacesProjectsCreateInput,
    NamespacesProjectsDeleteInput,
    OrganizationsCreateInput,
    OrganizationsCreatePayload,
    OrganizationsDeleteInput,
    OrganizationsDeletePayload,
    OrganizationsUpdateInput,
    OrganizationsUpdatePayload,
    UsersEmailVerificationInput,
    UsersEmailVerificationPayload,
    UsersIdentityLinkInput,
    UsersIdentityLinkPayload,
    UsersIdentityLoginInput,
    UsersIdentityLoginPayload,
    UsersIdentityRegisterInput,
    UsersIdentityRegisterPayload,
    UsersIdentityUnlinkInput,
    UsersIdentityUnlinkPayload,
    UsersLoginInput,
    UsersLoginPayload,
    UsersLogoutInput,
    UsersLogoutPayload,
    UsersMfaBackupCodesRotateInput,
    UsersMfaBackupCodesRotatePayload,
    UsersMfaTotpGenerateSecretInput,
    UsersMfaTotpGenerateSecretPayload,
    UsersMfaTotpValidateSecretInput,
    UsersMfaTotpValidateSecretPayload,
    UsersPasswordResetInput,
    UsersPasswordResetPayload,
    UsersPasswordResetRequestInput,
    UsersPasswordResetRequestPayload,
    UsersRegisterInput,
    UsersRegisterPayload
} from "@code0-tech/sagittarius-graphql-types"
import {Container} from "../container/Container";
import {DOrganizationList} from "./DOrganizationList";
import {DUserReactiveService, DUserView, setUserSession} from "../d-user";
import {DNamespaceReactiveService, DNamespaceView} from "../d-namespace";
import {DNamespaceProjectView} from "../d-project";
import {DNamespaceLicenseReactiveService, DNamespaceLicenseView} from "../d-license";
import {DNamespaceMemberReactiveService, DNamespaceMemberView} from "../d-member";

const meta: Meta = {
    title: "DOrganizationList",
    component: DOrganizationList
}

export default meta

type DOrganizationCardStory = StoryObj<typeof DOrganizationCard>;

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

class DNamespaceReactiveServiceExtended extends DNamespaceReactiveService {
    projectAssignRuntimes(payload: NamespacesProjectsAssignRuntimesInput): DNamespaceProjectView | undefined {
        return undefined
    }

    projectsCreate(payload: NamespacesProjectsCreateInput): DNamespaceProjectView | undefined {
        return undefined
    }

    projectsDelete(payload: NamespacesProjectsDeleteInput): void {
    }
}

class DNamespaceLicenseReactiveServiceExtended extends DNamespaceLicenseReactiveService {
    licenseCreate(payload: NamespacesLicensesCreateInput): Promise<NamespacesLicensesCreatePayload | undefined> {
        return Promise.resolve(undefined);
    }

    licenseDelete(payload: NamespacesLicensesDeleteInput): Promise<NamespacesLicensesDeletePayload | undefined> {
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

class DNamespaceMemberReactiveServiceExtend extends DNamespaceMemberReactiveService {
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

export const DOrganizationCardExample: DOrganizationCardStory = {
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
            }),
            new DOrganizationView({
                id: "gid://sagittarius/Organization/2",
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

        const [namespaceStore, namespaceService] = useReactiveArrayService<DNamespaceView, DNamespaceReactiveServiceExtended>(DNamespaceReactiveServiceExtended, [
            new DNamespaceView({
                id: "gid://sagittarius/Namespace/1",
                members: {
                    count: 12
                },
                runtimes: {
                    count: 3
                },
                projects: {
                    count: 5
                },
                createdAt: new Date().toString(),
                updatedAt: new Date().toString(),
                namespaceLicenses: {
                    count: 1,
                    nodes: [{
                        id: "gid://sagittarius/NamespaceLicense/1",
                    }]
                },
                parent: undefined,
                roles: undefined
            })
        ])

        const [licenseStore, licenseService] = useReactiveArrayService<DNamespaceLicenseView, DNamespaceLicenseReactiveServiceExtended>(DNamespaceLicenseReactiveServiceExtended, [
            new DNamespaceLicenseView({
                id: "gid://sagittarius/NamespaceLicense/1",
                createdAt: undefined,
                endDate: undefined,
                licensee: undefined,
                namespace: undefined,
                startDate: undefined,
                updatedAt: undefined
            })
        ])

        const [memberStore, memberService] = useReactiveArrayService<DNamespaceMemberView, DNamespaceMemberReactiveService>(DNamespaceMemberReactiveServiceExtend, [
            new DNamespaceMemberView({
                id: "gid://sagittarius/NamespaceMember/1",
                user: {
                    id: "gid://sagittarius/User/1",
                },
                namespace: {
                    id: "gid://sagittarius/Namespace/1",
                },
                userAbilities: {
                    deleteMember: true
                }
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
                services={[[organizationStore, organizationService], [namespaceStore, namespaceService], [licenseStore, licenseService], [userStore, userService], [memberStore, memberService]]}>
                <Container>
                    <DOrganizationList/>
                </Container>
            </ContextStoreProvider>
        )
    }
}