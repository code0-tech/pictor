import {Runtime} from "@code0-tech/sagittarius-graphql-types";
import React from "react";
import {Card} from "../card/Card";
import {DRuntimeContent} from "./DRuntimeContent";

export interface DRuntimeCardProps {
    runtimeId: Runtime['id']
    onSetting?: (runtimeId: Runtime['id']) => void
}

export const DRuntimeCard: React.FC<DRuntimeCardProps> = (props) => {
    const {
        runtimeId,
        onSetting = () => {
        }
    } = props

    return <Card>
        <DRuntimeContent runtimeId={runtimeId} onSetting={onSetting}/>
    </Card>
}