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

    //id's for queries and mutations and an error handler will be injected

    abstract userEmailVerification(payload: UsersEmailVerificationInput): Promise<UsersEmailVerificationPayload>

    abstract userLogin(payload: UsersLoginInput): Promise<UsersLoginPayload>

    abstract userLogout(payload: UsersLogoutInput): Promise<UsersLogoutPayload>

    abstract userMfaBackupCodesRotate(payload: UsersMfaBackupCodesRotateInput): Promise<UsersMfaBackupCodesRotatePayload>

    abstract userMfaTotpGenerateSecret(payload: UsersMfaTotpGenerateSecretInput): Promise<UsersMfaTotpGenerateSecretPayload>

    abstract userMfaTotpValidateSecret(payload: UsersMfaTotpValidateSecretInput): Promise<UsersMfaTotpValidateSecretPayload>

    abstract userRegister(payload: UsersRegisterInput): Promise<UsersRegisterPayload>

    createUserSession(payload: UserSession): void {
        window.localStorage.setItem("ide_code-zero_session", JSON.stringify(payload));
    }

    getUserSession(): UserSession | undefined {
        return JSON.parse(window.localStorage.getItem("ide_code-zero_session")!!) as UserSession
    }
}