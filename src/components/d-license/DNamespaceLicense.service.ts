import {
    Namespace,
    NamespaceLicense,
    NamespacesLicensesCreateInput,
    NamespacesLicensesCreatePayload,
    NamespacesLicensesDeleteInput,
    NamespacesLicensesDeletePayload
} from "@code0-tech/sagittarius-graphql-types";
import {DNamespaceLicenseView} from "./DNamespaceLicense.view";
import {ReactiveArrayService} from "../../utils";

export type DLicenseDependencies = {
    namespaceId: Namespace['id']
}

export abstract class DNamespaceLicenseReactiveService extends ReactiveArrayService<DNamespaceLicenseView, DLicenseDependencies> {

    getById(id: NamespaceLicense['id'], dependencies?: DLicenseDependencies): DNamespaceLicenseView | undefined {
        return this.values(dependencies).find(license => license.id === id);
    }

    abstract licenseCreate(payload: NamespacesLicensesCreateInput): Promise<NamespacesLicensesCreatePayload | undefined>

    abstract licenseDelete(payload: NamespacesLicensesDeleteInput): Promise<NamespacesLicensesDeletePayload | undefined>

}