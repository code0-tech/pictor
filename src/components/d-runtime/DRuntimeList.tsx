import {Namespace, Runtime} from "@code0-tech/sagittarius-graphql-types";
import {DRuntimeView} from "./DRuntime.view";
import {Card} from "../card/Card";
import React from "react";
import {useService, useStore} from "../../utils";
import {DRuntimeReactiveService} from "./DRuntime.service";
import CardSection from "../card/CardSection";
import {DRuntimeContent} from "./DRuntimeContent";

export interface DRuntimeListProps extends Omit<Card, "children" | "onSelect"> {
    namespaceId: Namespace["id"]
    filter?: (runtime: DRuntimeView, index: number) => boolean
    onSelect?: (runtime: DRuntimeView) => void
    onSetting?: (runtime: DRuntimeView) => void
    minimized?: boolean
}

export const DRuntimeList: React.FC<DRuntimeListProps> = (props) => {

    const {namespaceId, minimized = false, filter = () => true, onSetting, onSelect, ...rest} = props

    const runtimeService = useService(DRuntimeReactiveService)
    const runtimeStore = useStore(DRuntimeReactiveService)
    const runtimes = React.useMemo(() => runtimeService.values({namespaceId: namespaceId}), [runtimeStore, namespaceId])

    return <Card {...rest} {...(minimized ? {paddingSize: "sm"} : {})}>
        {runtimes.filter(filter).map((runtime) => runtime.id && (
            <CardSection border hover onClick={() => {
                if (onSelect) onSelect(runtime)
            }} key={runtime.id}>
                <DRuntimeContent minimized={minimized} onSetting={onSetting} runtimeId={runtime?.id}/>
            </CardSection>
        ))}
    </Card>
}