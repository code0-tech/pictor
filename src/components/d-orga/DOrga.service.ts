import {ReactiveArrayService, ReactiveArrayStore} from "../../utils/reactiveArrayService";
import {DOrgaView} from "./DOrga.view";
import {
    OrganizationsCreateInput,
    OrganizationsDeleteInput,
    OrganizationsUpdateInput, Scalars
} from "@code0-tech/sagittarius-graphql-types";

export interface DOrgaService {
    organizationCreate(payload: OrganizationsCreateInput): DOrgaView | undefined
    organizationDelete(payload: OrganizationsDeleteInput): void
    organizationUpdate(payload: OrganizationsUpdateInput): DOrgaView | undefined
    findById(id: Scalars['OrganizationID']['input']): DOrgaView | undefined
}

export class DOrgaReactiveService extends ReactiveArrayService<DOrgaView> implements DOrgaService {

    constructor(payload: ReactiveArrayStore<DOrgaView>) {
        super(payload);
    }

    organizationCreate(payload: OrganizationsCreateInput): DOrgaView | undefined {
        return undefined;
    }

    organizationDelete(payload: OrganizationsDeleteInput): void {
        const organization = this.findById(payload.organizationId);
        if (!organization) return

        const index = this.values().findIndex(organization => organization.id === payload.organizationId);
        this.delete(index);
        this.update()
    }

    organizationUpdate(payload: OrganizationsUpdateInput): DOrgaView | undefined {
        const organization = this.findById(payload.organizationId);
        if (!organization) return

        organization.name = payload.name
        this.update()

        return organization;
    }

    findById(id: Scalars["OrganizationID"]["input"]): DOrgaView | undefined {
        return this.values().find(organization => organization.id === id)
    }

}