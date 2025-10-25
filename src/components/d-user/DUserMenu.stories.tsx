import {Meta, StoryObj} from "@storybook/react"
import {ContextStoreProvider} from "../../utils/contextStore"
import React from "react"
import {useReactiveArrayService} from "../../utils/reactiveArrayService"
import {DUserReactiveService} from "./DUser.service"
import DUserMenu from "./DUserMenu"
import {
    User,
    UsersEmailVerificationInput,
    UsersMfaBackupCodesRotateInput,
    UsersMfaTotpGenerateSecretInput,
    UsersMfaTotpValidateSecretInput,
    UsersRegisterInput,
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
    userMfaBackupCodesRotate(payload: UsersMfaBackupCodesRotateInput): void {
        throw new Error("Method not implemented.");
    }
    userMfaTotpGenerateSecret(payload: UsersMfaTotpGenerateSecretInput): void {
        throw new Error("Method not implemented.");
    }
    userMfaTotpValidateSecret(payload: UsersMfaTotpValidateSecretInput): void {
        throw new Error("Method not implemented.");
    }
    userRegister(payload: UsersRegisterInput): User | undefined {
        throw new Error("Method not implemented.");
    }
    userUpdate(payload: UsersUpdateInput): User | undefined {
        throw new Error("Method not implemented.");
    }
    userEmailVerification(payload: UsersEmailVerificationInput): User | undefined {
        throw new Error("Method not implemented.");
    }

}

export const DUserMenuExample: DUserMenuStory = {
    render: (props) => {

        const [userStore, userService] = useReactiveArrayService<DUserView, DUserReactiveServiceExtended>(DUserReactiveServiceExtended, [
        {
            id: "gid://sagittarius/User/1",
            username: "exampleuser",
            email: "",
            admin: undefined,
            avatarPath: undefined,
            firstname: undefined,
            lastname: undefined,
            namespace: undefined,
            namespaceMemberships: undefined,
            createdAt: new Date().toString(),
            updatedAt: new Date().toString(),
        }])

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