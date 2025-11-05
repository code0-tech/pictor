import {Meta, StoryObj} from "@storybook/react"
import {ContextStoreProvider} from "../../utils/contextStore"
import React from "react"
import {useReactiveArrayService} from "../../utils/reactiveArrayService"
import {DUserReactiveService} from "./DUser.service"
import DUserMenu from "./DUserMenu"
import {
    User,
    UsersEmailVerificationInput,
    UsersEmailVerificationPayload,
    UsersLoginInput,
    UsersLoginPayload,
    UsersLogoutInput,
    UsersLogoutPayload,
    UsersMfaBackupCodesRotateInput, UsersMfaBackupCodesRotatePayload,
    UsersMfaTotpGenerateSecretInput, UsersMfaTotpGenerateSecretPayload,
    UsersMfaTotpValidateSecretInput, UsersMfaTotpValidateSecretPayload,
    UsersRegisterInput, UsersRegisterPayload,
    UsersUpdateInput
} from "@code0-tech/sagittarius-graphql-types";
import {DUserView} from "./DUser.view"
import {MenuGroup, MenuItem, MenuLabel, MenuSeparator} from "../menu/Menu"

const meta: Meta = {
    title: "DUserMenu",
    component: DUserMenu
}

export default meta

type DUserMenuStory = StoryObj<typeof DUserMenu>;

class DUserReactiveServiceExtended extends DUserReactiveService {
    userEmailVerification(payload: UsersEmailVerificationInput): Promise<UsersEmailVerificationPayload | undefined> {
        return Promise.resolve(undefined);
    }

    userLogin(payload: UsersLoginInput): Promise<UsersLoginPayload | undefined> {
        return Promise.resolve(undefined);
    }

    userLogout(payload: UsersLogoutInput): Promise<UsersLogoutPayload | undefined> {
        return Promise.resolve(undefined);
    }

    userMfaBackupCodesRotate(payload: UsersMfaBackupCodesRotateInput): Promise<UsersMfaBackupCodesRotatePayload | undefined> {
        return Promise.resolve(undefined);
    }

    userMfaTotpGenerateSecret(payload: UsersMfaTotpGenerateSecretInput): Promise<UsersMfaTotpGenerateSecretPayload | undefined> {
        return Promise.resolve(undefined);
    }

    userMfaTotpValidateSecret(payload: UsersMfaTotpValidateSecretInput): Promise<UsersMfaTotpValidateSecretPayload | undefined> {
        return Promise.resolve(undefined);
    }

    userRegister(payload: UsersRegisterInput): Promise<UsersRegisterPayload | undefined> {
        return Promise.resolve(undefined);
    }

}


export const DUserMenuExample: DUserMenuStory = {
    render: (props) => {

        const [userStore, userService] = useReactiveArrayService<DUserView, DUserReactiveServiceExtended>(DUserReactiveServiceExtended, [
        {
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
        }])

        userService.createUserSession({
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
                            <MenuSeparator />
                            <MenuItem>Logout</MenuItem>
                        </DUserMenu>
                    )
                }, [])}
            </ContextStoreProvider>
        )
    }
}