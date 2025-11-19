import {Runtime} from "@code0-tech/sagittarius-graphql-types";
import {DRuntimeView} from "./DRuntime.view";
import {Card} from "../card/Card";
import React from "react";
import {useService, useStore} from "../../utils";
import {DRuntimeReactiveService} from "./DRuntime.service";
import CardSection from "../card/CardSection";
import {DRuntimeContent} from "./DRuntimeContent";

export interface DRuntimeListProps extends Omit<Card, "children" | "onSelect"> {
    filter?: (runtime: DRuntimeView, index: number) => boolean
    onSelect?: (userId: Runtime['id']) => void
    onSetting?: (runtimeId: Runtime['id']) => void
}

export const DRuntimeList: React.FC<DRuntimeListProps> = (props) => {

    const {filter = () => true, onSetting, onSelect, ...rest} = props

    const runtimeService = useService(DRuntimeReactiveService)
    const runtimeStore = useStore(DRuntimeReactiveService)
    const runtimes = React.useMemo(() => runtimeService.values(), [runtimeStore])

    return <Card {...rest}>
        {runtimes.filter(filter).map((runtime) => runtime.id && (
            <CardSection border hover onClick={() => {
                if (onSelect) onSelect(runtime.id)
            }} key={runtime.id}>
                <DRuntimeContent onSetting={onSetting} runtimeId={runtime?.id}/>
            </CardSection>
        ))}
    </Card>
}