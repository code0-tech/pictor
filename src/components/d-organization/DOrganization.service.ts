import {ReactiveArrayService, ReactiveArrayStore} from "../../utils/reactiveArrayService";
import {DOrganizationView} from "./DOrganization.view";
import {
    OrganizationsCreateInput, OrganizationsCreatePayload,
    OrganizationsDeleteInput, OrganizationsDeletePayload,
    OrganizationsUpdateInput, OrganizationsUpdatePayload,
    Scalars
} from "@code0-tech/sagittarius-graphql-types";

export abstract class DOrganizationReactiveService extends ReactiveArrayService<DOrganizationView> {

    //TODO: inject UI error handler for toasts
    //no id's need to be injected here because the root query has a organizations field

    getById(id: Scalars["OrganizationID"]["input"]): DOrganizationView | undefined {
        return this.values().find(organization => organization.id === id)
    }

    abstract organizationCreate(payload: OrganizationsCreateInput): Promise<OrganizationsCreatePayload | undefined>

    abstract organizationDelete(payload: OrganizationsDeleteInput): Promise<OrganizationsDeletePayload | undefined>

}