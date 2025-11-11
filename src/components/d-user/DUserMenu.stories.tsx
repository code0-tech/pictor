import {Meta, StoryObj} from "@storybook/react"
import {ContextStoreProvider} from "../../utils/contextStore"
import React from "react"
import {useReactiveArrayService} from "../../utils/reactiveArrayService"
import {DUserReactiveService} from "./DUser.service"
import DUserMenu from "./DUserMenu"
import {
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
} from "@code0-tech/sagittarius-graphql-types";
import {DUserView} from "./DUser.view"
import {MenuGroup, MenuItem, MenuLabel, MenuSeparator} from "../menu/Menu"
import {setUserSession} from "./DUser.session.hook";

const meta: Meta = {
    title: "DUserMenu",
    component: DUserMenu
}

export default meta

type DUserMenuStory = StoryObj<typeof DUserMenu>;

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


export const DUserMenuExample: DUserMenuStory = {
    render: (props) => {

        const [userStore, userService] = useReactiveArrayService<DUserView, DUserReactiveServiceExtended>(DUserReactiveServiceExtended, [
            new DUserView({
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
            token: ""
        })

        return (
            <ContextStoreProvider
                services={[[userStore, userService]]}>
                {React.useMemo(() => {
                    return (
                        <DUserMenu userId={"gid://sagittarius/User/1"}>
                            <MenuGroup>
                                <MenuLabel>Label</MenuLabel>
                                <MenuItem>Profile</MenuItem>
                                <MenuItem>Settings</MenuItem>
                                <MenuItem>Information</MenuItem>
                            </MenuGroup>
                            <MenuSeparator/>
                            <MenuItem>Logout</MenuItem>
                        </DUserMenu>
                    )
                }, [])}
            </ContextStoreProvider>
        )
    }
}