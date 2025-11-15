import {
    NamespaceLicense,
    NamespacesLicensesCreateInput, NamespacesLicensesCreatePayload,
    NamespacesLicensesDeleteInput, NamespacesLicensesDeletePayload,
    Scalars
} from "@code0-tech/sagittarius-graphql-types";
import {DNamespaceLicenseView} from "./DNamespaceLicense.view";
import {ReactiveArrayService, ReactiveArrayStore} from "../../utils/reactiveArrayService";

export abstract class DNamespaceLicenseReactiveService extends ReactiveArrayService<DNamespaceLicenseView> {

    //TODO: inject UI error handler for toasts
    //inject: namespaceId because the runtimes query needs it

    getById(id: NamespaceLicense['id']): DNamespaceLicenseView | undefined {
        return this.values().find(license => license.id === id);
    }

    abstract licenseCreate(payload: NamespacesLicensesCreateInput): Promise<NamespacesLicensesCreatePayload | undefined>

    abstract licenseDelete(payload: NamespacesLicensesDeleteInput): Promise<NamespacesLicensesDeletePayload | undefined>

}