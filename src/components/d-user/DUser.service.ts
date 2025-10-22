import {ReactiveArrayService, ReactiveArrayStore} from "../../utils/reactiveArrayService";
import {
    User,
    UsersEmailVerificationInput,
    UserSession,
    UsersLoginInput,
    UsersLogoutInput,
    UsersMfaBackupCodesRotateInput,
    UsersMfaTotpGenerateSecretInput,
    UsersMfaTotpValidateSecretInput,
    UsersRegisterInput,
    UsersUpdateInput
} from "@code0-tech/sagittarius-graphql-types";
import {DUserView} from "./DUser.view";

export interface DUserService {
    userEmailVerification(payload: UsersEmailVerificationInput): User | undefined

    userLogin(payload: UsersLoginInput): User | undefined

    userLogout(payload: UsersLogoutInput): void

    userMfaBackupCodesRotate(payload: UsersMfaBackupCodesRotateInput): void

    userMfaTotpGenerateSecret(payload: UsersMfaTotpGenerateSecretInput): void

    userMfaTotpValidateSecret(payload: UsersMfaTotpValidateSecretInput): void

    userRegister(payload: UsersRegisterInput): User | undefined

    userUpdate(payload: UsersUpdateInput): User | undefined

    createUserSession(payload: UserSession): void

    getUserSession(): UserSession | undefined
}

export class DUserReactiveService extends ReactiveArrayService<DUserView> implements DUserService {

    constructor(store: ReactiveArrayStore<DUserView>) {
        super(store);
    }

    userEmailVerification(payload: UsersEmailVerificationInput): User | undefined {
        //
        return undefined;
    }

    userLogin(payload: UsersLoginInput): User | undefined {
        //check if a session already exists
        if (this.getUserSession()) {
            return this.values().find(user => user.id === this.getUserSession()?.user?.id);
        }

        return undefined;
    }

    userLogout(payload: UsersLogoutInput): void {
        if (!this.getUserSession()) return

        const user = this.values().find(user => user.id === this.getUserSession()?.user?.id);
        window.localStorage.removeItem("ide_code-zero_session");
        const index = this.values().findIndex(lUser => lUser.id === user?.id)
        this.delete(index)
        this.update()

    }

    userMfaBackupCodesRotate(payload: UsersMfaBackupCodesRotateInput): void {
    }

    userMfaTotpGenerateSecret(payload: UsersMfaTotpGenerateSecretInput): void {
    }

    userMfaTotpValidateSecret(payload: UsersMfaTotpValidateSecretInput): void {
    }

    userRegister(payload: UsersRegisterInput): User | undefined {
        return undefined;
    }

    userUpdate(payload: UsersUpdateInput): User | undefined {
        return undefined;
    }

    createUserSession(payload: UserSession): void {
        window.localStorage.setItem("ide_code-zero_session", JSON.stringify(payload));
    }

    getUserSession(): UserSession | undefined {
        return window.localStorage.getItem("ide_code-zero_session") as UserSession
    }


}