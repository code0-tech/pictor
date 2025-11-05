import {ReactiveArrayService, ReactiveArrayStore} from "../../utils/reactiveArrayService";
import {
    Maybe,
    User,
    UsersEmailVerificationInput,
    UsersEmailVerificationPayload,
    UserSession,
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
    UsersPasswordResetPayload, UsersPasswordResetRequestInput,
    UsersPasswordResetRequestPayload,
    UsersRegisterInput,
    UsersRegisterPayload,
    UsersUpdateInput
} from "@code0-tech/sagittarius-graphql-types";
import {DUserView} from "./DUser.view";

export abstract class DUserReactiveService extends ReactiveArrayService<DUserView> {

    //TODO: inject UI error handler for toasts
    //no id's need to be injected here because the root query has a users field

    createUserSession(payload: UserSession): void {
        window.localStorage.setItem("ide_code-zero_session", JSON.stringify(payload));
    }

    getUserSession(): UserSession | undefined {
        return JSON.parse(window.localStorage.getItem("ide_code-zero_session")!!) as UserSession
    }

    getById(id: User['id']): DUserView | undefined {
        return this.values().find(user => user.id === id);
    }

    abstract usersEmailVerification(payload: UsersEmailVerificationInput): Promise<UsersEmailVerificationPayload | undefined>;

    abstract usersIdentityLink(payload: UsersIdentityLinkInput): Promise<UsersIdentityLinkPayload | undefined>;

    abstract usersIdentityLogin(payload: UsersIdentityLoginInput): Promise<UsersIdentityLoginPayload | undefined>;

    abstract usersIdentityRegister(payload: UsersIdentityRegisterInput): Promise<UsersIdentityRegisterPayload | undefined>;

    abstract usersIdentityUnlink(payload: UsersIdentityUnlinkInput): Promise<UsersIdentityUnlinkPayload | undefined>;

    abstract usersLogin(payload: UsersLoginInput): Promise<UsersLoginPayload | undefined>;

    abstract usersLogout(payload: UsersLogoutInput): Promise<UsersLogoutPayload | undefined>;

    abstract usersMfaBackupCodesRotate(payload: UsersMfaBackupCodesRotateInput): Promise<UsersMfaBackupCodesRotatePayload | undefined>;

    abstract usersMfaTotpGenerateSecret(payload: UsersMfaTotpGenerateSecretInput): Promise<UsersMfaTotpGenerateSecretPayload | undefined>;

    abstract usersMfaTotpValidateSecret(payload: UsersMfaTotpValidateSecretInput): Promise<UsersMfaTotpValidateSecretPayload | undefined>;

    abstract usersPasswordReset(payload: UsersPasswordResetInput): Promise<UsersPasswordResetPayload | undefined>;

    abstract usersPasswordResetRequest(payload: UsersPasswordResetRequestInput): Promise<UsersPasswordResetRequestPayload | undefined>;

    abstract usersRegister(payload: UsersRegisterInput): Promise<UsersRegisterPayload | undefined>;
}