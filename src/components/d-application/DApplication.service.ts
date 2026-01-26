import {ReactiveArrayService} from "../../utils";
import type {
    Application,
    ApplicationSettingsUpdateInput,
    ApplicationSettingsUpdatePayload
} from "@code0-tech/sagittarius-graphql-types";
import {Payload} from "../../utils/view";

interface App extends Payload, Application{

}

export abstract class DApplicationService extends ReactiveArrayService<App> {

    abstract settingsUpdate(payload: ApplicationSettingsUpdateInput): Promise<ApplicationSettingsUpdatePayload | undefined>;

}