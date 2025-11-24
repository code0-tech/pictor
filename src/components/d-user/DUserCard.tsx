import {User} from "@code0-tech/sagittarius-graphql-types";
import React from "react";
import {Card} from "../card/Card";
import {DUserContent} from "./DUserContent";
import {DUserView} from "./DUser.view";

export interface DUserCardProps {
    userId: User['id']
    onRemove?: (user: DUserView) => void
}

export const DUserCard: React.FC<DUserCardProps> = (props) => {

    const {userId, onRemove} = props

    return <Card>
        <DUserContent userId={userId} onRemove={onRemove}/>
    </Card>

}