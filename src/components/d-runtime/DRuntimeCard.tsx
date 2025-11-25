import {Runtime} from "@code0-tech/sagittarius-graphql-types";
import React from "react";
import {Card} from "../card/Card";
import {DRuntimeContent} from "./DRuntimeContent";
import {DRuntimeView} from "./DRuntime.view";

export interface DRuntimeCardProps {
    runtimeId: Runtime['id']
    onSetting?: (runtime: DRuntimeView) => void
    minimized?: boolean
}

export const DRuntimeCard: React.FC<DRuntimeCardProps> = (props) => {
    const {
        runtimeId,
        minimized = false,
        onSetting = () => {
        }
    } = props

    return <Card>
        <DRuntimeContent minimized={minimized} runtimeId={runtimeId} onSetting={onSetting}/>
    </Card>
}