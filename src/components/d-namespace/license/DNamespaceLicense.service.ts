import {
    NamespacesLicensesCreateInput,
    NamespacesLicensesDeleteInput,
    Scalars
} from "@code0-tech/sagittarius-graphql-types";
import {DNamespaceLicenseView} from "./DNamespaceLicense.view";
import {ReactiveArrayService, ReactiveArrayStore} from "../../../utils/reactiveArrayService";

export abstract class DNamespaceLicenseService extends ReactiveArrayService<DNamespaceLicenseView> {

    constructor(payload: ReactiveArrayStore<DNamespaceLicenseView>) {
        super(payload);
    }

    abstract licenseCreate(payload: NamespacesLicensesCreateInput): DNamespaceLicenseView | undefined

    abstract licenseDelete(payload: NamespacesLicensesDeleteInput): void

    abstract findById(id: Scalars['NamespaceLicenseID']['output']): DNamespaceLicenseView | undefined
}

export abstract class DNamespaceLicenseReactiveService extends DNamespaceLicenseService {

    findById(id: Scalars["NamespaceLicenseID"]["output"]): DNamespaceLicenseView | undefined {
        return this.values().find(license => license.id === id);
    }

    abstract override licenseCreate(payload: NamespacesLicensesCreateInput): DNamespaceLicenseView | undefined

    abstract override licenseDelete(payload: NamespacesLicensesDeleteInput): void

}