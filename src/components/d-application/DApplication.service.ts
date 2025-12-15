import {ReactiveArrayService} from "../../utils";
import type {
    Application,
    ApplicationSettingsUpdateInput,
    ApplicationSettingsUpdatePayload
} from "@code0-tech/sagittarius-graphql-types";

export abstract class DApplicationService extends ReactiveArrayService<Application> {

    abstract settingsUpdate(payload: ApplicationSettingsUpdateInput): Promise<ApplicationSettingsUpdatePayload | undefined>;

}