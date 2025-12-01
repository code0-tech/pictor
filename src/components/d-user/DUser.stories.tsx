import {Meta} from "@storybook/react-vite";
import {DUserReactiveService} from "./DUser.service";
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
import {ContextStoreProvider, useReactiveArrayService} from "../../utils";
import {DUserView} from "./DUser.view";
import React from "react";
import {DUserInput} from "./DUserInput";
import {Text} from "../text/Text";
import {Badge} from "../badge/Badge";
import {IconArrowDown, IconArrowUp, IconCornerDownLeft} from "@tabler/icons-react";
import {Spacing} from "../spacing/Spacing";
import {Flex} from "../flex/Flex";

const meta: Meta = {
    title: "DUser",
    component: DUserInput
}

export default meta

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


export const Input = () => {

    const user = useReactiveArrayService<DUserView, DUserReactiveServiceExtended>(DUserReactiveServiceExtended, [
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
        }),
        new DUserView({
            id: "gid://sagittarius/User/1",
            username: "nsammito",
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

    return <ContextStoreProvider services={[user]}>
        <DUserInput title={"Users to invite"} description={"Invite users to your workspace or organization"}/>
        <Spacing spacing={"xs"}/>
        <Text>
            <Flex align={"center"} style={{gap: "0.7rem"}}>
                <div>
                    <Badge border>
                        <IconArrowUp size={16}/>
                    </Badge>
                    {" "}
                    <Badge border>
                        <IconArrowDown size={16}/>
                    </Badge>
                    {" "}
                    to navigate
                </div>
                <div>
                    <Badge border>
                        <IconCornerDownLeft size={16}/>
                    </Badge>
                    {" "}
                    to select
                </div>
            </Flex>
        </Text>
    </ContextStoreProvider>

}