import {Meta} from "@storybook/react-vite";
import {DRuntimeReactiveService} from "./DRuntime.service";
import {
    RuntimesCreateInput,
    RuntimesCreatePayload,
    RuntimesDeleteInput,
    RuntimesDeletePayload,
    RuntimesRotateTokenInput,
    RuntimesRotateTokenPayload,
    RuntimeStatusType
} from "@code0-tech/sagittarius-graphql-types";
import {ContextStoreProvider, useReactiveArrayService} from "../../utils";
import {DRuntimeView} from "./DRuntime.view";
import {Container} from "../container/Container";
import React from "react";
import {DRuntimeList} from "./DRuntimeList";

const meta: Meta = {
    title: "DRuntimeList",
    component: DRuntimeList,
}

export default meta

class DRuntimeReactiveServiceExtended extends DRuntimeReactiveService {
    runtimeCreate(payload: RuntimesCreateInput): Promise<RuntimesCreatePayload | undefined> {
        return Promise.resolve(undefined);
    }

    runtimeDelete(payload: RuntimesDeleteInput): Promise<RuntimesDeletePayload | undefined> {
        return Promise.resolve(undefined);
    }

    runtimeRotateToken(payload: RuntimesRotateTokenInput): Promise<RuntimesRotateTokenPayload | undefined> {
        return Promise.resolve(undefined);
    }
}

export const DRuntimeListExample = () => {

    const [runtimeStore, runtimeService] = useReactiveArrayService<DRuntimeView, DRuntimeReactiveServiceExtended>(DRuntimeReactiveServiceExtended, [
        new DRuntimeView({
            id: "gid://sagittarius/Runtime/1",
            name: "Example Runtime",
            createdAt: new Date().toString(),
            updatedAt: new Date().toString(),
            token: "example-token",
            dataTypes: undefined,
            description: "Example Runtime",
            flowTypes: undefined,
            namespace: undefined,
            projects: undefined,
            status: RuntimeStatusType.Connected,
            userAbilities: {
                updateRuntime: true
            }
        }),
        new DRuntimeView({
            id: "gid://sagittarius/Runtime/2",
            name: "Example Runtime",
            createdAt: new Date().toString(),
            updatedAt: new Date().toString(),
            token: "example-token",
            dataTypes: undefined,
            description: "Example Runtime",
            flowTypes: undefined,
            namespace: undefined,
            projects: undefined,
            status: RuntimeStatusType.Disconnected,
        })
    ])

    return <ContextStoreProvider services={[[runtimeStore, runtimeService]]}>
        <Container>
            <DRuntimeList/>
        </Container>
    </ContextStoreProvider>
}