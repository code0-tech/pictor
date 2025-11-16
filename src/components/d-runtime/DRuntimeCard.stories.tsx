import {Meta} from "@storybook/react-vite";
import {DRuntimeCard} from "./DRuntimeCard";
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

const meta: Meta = {
    title: "DRuntimeCard",
    component: DRuntimeCard,
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

export const DRuntimeCardExample = () => {

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
        })
    ])

    return <ContextStoreProvider services={[[runtimeStore, runtimeService]]}>
        <Container>
            <DRuntimeCard runtimeId={"gid://sagittarius/Runtime/1"}/>
        </Container>
    </ContextStoreProvider>
}