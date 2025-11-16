import {User} from "@code0-tech/sagittarius-graphql-types";
import React from "react";
import {Card} from "../card/Card";
import {DUserContent} from "./DUserContent";

export interface DUserCardProps {
    userId: User['id']
    onRemove?: (userId: User['id']) => void
}

export const DUserCard: React.FC<DUserCardProps> = (props) => {

    const {userId, onRemove} = props

    return <Card>
        <DUserContent userId={userId} onRemove={onRemove}/>
    </Card>

}