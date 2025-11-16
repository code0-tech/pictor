import {User} from "@code0-tech/sagittarius-graphql-types";
import {DUserView} from "./DUser.view";
import React from "react";
import {useService, useStore} from "../../utils";
import {DUserReactiveService} from "./DUser.service";
import {Card} from "../card/Card";
import CardSection from "../card/CardSection";
import {DUserContent} from "./DUserContent";

export interface DUserListProps extends Omit<Card, "children"> {
    filter?: (user: DUserView, index: number) => boolean
    onRemove?: (userId: User['id']) => void
}

export const DUserList: React.FC<DUserListProps> = (props) => {

    const {filter = () => true, onRemove, ...rest} = props
    const userService = useService(DUserReactiveService)
    const userStore = useStore(DUserReactiveService)
    const users = React.useMemo(() => userService.values(), [userStore])


    return <Card {...rest}>
        {users.filter(filter).map((user) => user.id && (
            <CardSection border key={user.id}>
                <DUserContent onRemove={onRemove} userId={user?.id}/>
            </CardSection>
        ))}
    </Card>
}