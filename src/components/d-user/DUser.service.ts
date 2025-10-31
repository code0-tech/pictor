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

export abstract class DUserService extends ReactiveArrayService<DUserView> {

    constructor(store: ReactiveArrayStore<DUserView>) {
        super(store);
    }

    abstract userEmailVerification(payload: UsersEmailVerificationInput): User | undefined

    abstract userLogin(payload: UsersLoginInput): User | undefined

    abstract userLogout(payload: UsersLogoutInput): void

    abstract userMfaBackupCodesRotate(payload: UsersMfaBackupCodesRotateInput): void

    abstract userMfaTotpGenerateSecret(payload: UsersMfaTotpGenerateSecretInput): void

    abstract userMfaTotpValidateSecret(payload: UsersMfaTotpValidateSecretInput): void

    abstract userRegister(payload: UsersRegisterInput): User | undefined

    abstract userUpdate(payload: UsersUpdateInput): User | undefined

    abstract createUserSession(payload: UserSession): void

    abstract getUserSession(): UserSession | undefined
}

export abstract class DUserReactiveService extends DUserService {

    override userLogin(payload: UsersLoginInput): User | undefined {
        //check if a session already exists
        if (this.getUserSession()) {
            return this.values().find(user => user.id === this.getUserSession()?.user?.id);
        }

        return undefined;
    }

    override userLogout(payload: UsersLogoutInput): void {
        if (!this.getUserSession()) return

        const user = this.values().find(user => user.id === this.getUserSession()?.user?.id);
        window.localStorage.removeItem("ide_code-zero_session");
        const index = this.values().findIndex(lUser => lUser.id === user?.id)
        this.delete(index)
        this.update()

    }

    override createUserSession(payload: UserSession): void {
        window.localStorage.setItem("ide_code-zero_session", JSON.stringify(payload));
    }

    override getUserSession(): UserSession | undefined {
        return JSON.parse(<string>window.localStorage.getItem("ide_code-zero_session")) as UserSession
    }

    abstract override userMfaBackupCodesRotate(payload: UsersMfaBackupCodesRotateInput): void

    abstract override userMfaTotpGenerateSecret(payload: UsersMfaTotpGenerateSecretInput): void

    abstract override userMfaTotpValidateSecret(payload: UsersMfaTotpValidateSecretInput): void

    abstract override userRegister(payload: UsersRegisterInput): User | undefined

    abstract override userUpdate(payload: UsersUpdateInput): User | undefined

    abstract override userEmailVerification(payload: UsersEmailVerificationInput): User | undefined


}