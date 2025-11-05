import {ReactiveArrayService, ReactiveArrayStore} from "../../utils/reactiveArrayService";
import {
    User,
    UsersEmailVerificationInput, UsersEmailVerificationPayload,
    UserSession,
    UsersLoginInput, UsersLoginPayload,
    UsersLogoutInput, UsersLogoutPayload,
    UsersMfaBackupCodesRotateInput, UsersMfaBackupCodesRotatePayload,
    UsersMfaTotpGenerateSecretInput, UsersMfaTotpGenerateSecretPayload,
    UsersMfaTotpValidateSecretInput, UsersMfaTotpValidateSecretPayload,
    UsersRegisterInput, UsersRegisterPayload,
    UsersUpdateInput
} from "@code0-tech/sagittarius-graphql-types";
import {DUserView} from "./DUser.view";

export abstract class DUserReactiveService extends ReactiveArrayService<DUserView> {

    //TODO: inject UI error handler for toasts
    //no id's need to be injected here because the root query has a users field

    abstract userEmailVerification(payload: UsersEmailVerificationInput): Promise<UsersEmailVerificationPayload | undefined>

    abstract userLogin(payload: UsersLoginInput): Promise<UsersLoginPayload | undefined>

    abstract userLogout(payload: UsersLogoutInput): Promise<UsersLogoutPayload | undefined>

    abstract userMfaBackupCodesRotate(payload: UsersMfaBackupCodesRotateInput): Promise<UsersMfaBackupCodesRotatePayload | undefined>

    abstract userMfaTotpGenerateSecret(payload: UsersMfaTotpGenerateSecretInput): Promise<UsersMfaTotpGenerateSecretPayload | undefined>

    abstract userMfaTotpValidateSecret(payload: UsersMfaTotpValidateSecretInput): Promise<UsersMfaTotpValidateSecretPayload | undefined>

    abstract userRegister(payload: UsersRegisterInput): Promise<UsersRegisterPayload | undefined>

    createUserSession(payload: UserSession): void {
        window.localStorage.setItem("ide_code-zero_session", JSON.stringify(payload));
    }

    getUserSession(): UserSession | undefined {
        return JSON.parse(window.localStorage.getItem("ide_code-zero_session")!!) as UserSession
    }
}