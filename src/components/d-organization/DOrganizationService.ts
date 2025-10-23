import {ReactiveArrayService, ReactiveArrayStore} from "../../utils/reactiveArrayService";
import {DOrganizationView} from "./DOrganizationView";
import {
    OrganizationsCreateInput,
    OrganizationsDeleteInput,
    OrganizationsUpdateInput,
    Scalars
} from "@code0-tech/sagittarius-graphql-types";

export abstract class DOrganizationService extends ReactiveArrayService<DOrganizationView> {

    constructor(payload: ReactiveArrayStore<DOrganizationView>) {
        super(payload);
    }

    abstract organizationCreate(payload: OrganizationsCreateInput): DOrganizationView | undefined

    abstract organizationDelete(payload: OrganizationsDeleteInput): void

    abstract organizationUpdate(payload: OrganizationsUpdateInput): DOrganizationView | undefined

    abstract findById(id: Scalars['OrganizationID']['input']): DOrganizationView | undefined
}

export abstract class DOrganizationReactiveService extends DOrganizationService {


    findById(id: Scalars["OrganizationID"]["input"]): DOrganizationView | undefined {
        return this.values().find(organization => organization.id === id)
    }

    abstract override organizationCreate(payload: OrganizationsCreateInput): DOrganizationView | undefined

    abstract override organizationDelete(payload: OrganizationsDeleteInput): void

    abstract override organizationUpdate(payload: OrganizationsUpdateInput): DOrganizationView | undefined

}