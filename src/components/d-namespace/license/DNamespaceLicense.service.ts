import {
    NamespacesLicensesCreateInput,
    NamespacesLicensesDeleteInput,
    Scalars
} from "@code0-tech/sagittarius-graphql-types";
import {DNamespaceLicenseView} from "./DNamespaceLicense.view";
import {ReactiveArrayService, ReactiveArrayStore} from "../../../utils/reactiveArrayService";

export interface DNamespaceLicenseService {
    licenseCreate(payload: NamespacesLicensesCreateInput): DNamespaceLicenseView | undefined
    licenseDelete(payload: NamespacesLicensesDeleteInput): void
    findById(id: Scalars['NamespaceLicenseID']['output']): DNamespaceLicenseView | undefined
}

export class DNamespaceLicenseReactiveService extends ReactiveArrayService<DNamespaceLicenseView> implements DNamespaceLicenseService{

    constructor(payload: ReactiveArrayStore<DNamespaceLicenseView>) {
        super(payload);
    }

    findById(id: Scalars["NamespaceLicenseID"]["output"]): DNamespaceLicenseView | undefined {
        return this.values().find(license => license.id === id);
    }

    licenseCreate(payload: NamespacesLicensesCreateInput): DNamespaceLicenseView | undefined {
        return undefined;
    }

    licenseDelete(payload: NamespacesLicensesDeleteInput): void {
        if (this.findById(payload.namespaceLicenseId)) {
            const index = this.values().findIndex(license => license.id === payload.namespaceLicenseId);
            this.delete(index);
            this.update()
        }
    }

}