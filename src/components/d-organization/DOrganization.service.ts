import {ReactiveArrayService, ReactiveArrayStore} from "../../utils/reactiveArrayService";
import {DOrganizationView} from "./DOrganization.view";
import {
    Organization,
    OrganizationsCreateInput, OrganizationsCreatePayload,
    OrganizationsDeleteInput, OrganizationsDeletePayload,
    OrganizationsUpdateInput, OrganizationsUpdatePayload,
    Scalars
} from "@code0-tech/sagittarius-graphql-types";

export abstract class DOrganizationReactiveService extends ReactiveArrayService<DOrganizationView> {

    getById(id: Organization["id"]): DOrganizationView | undefined {
        return this.values().find(organization => organization.id === id)
    }

    abstract organizationCreate(payload: OrganizationsCreateInput): Promise<OrganizationsCreatePayload | undefined>

    abstract organizationDelete(payload: OrganizationsDeleteInput): Promise<OrganizationsDeletePayload | undefined>

}