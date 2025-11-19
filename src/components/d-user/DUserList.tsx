import {User} from "@code0-tech/sagittarius-graphql-types";
import {DUserView} from "./DUser.view";
import React from "react";
import {useService, useStore} from "../../utils";
import {DUserReactiveService} from "./DUser.service";
import {Card} from "../card/Card";
import CardSection from "../card/CardSection";
import {DUserContent} from "./DUserContent";

export interface DUserListProps extends Omit<Card, "children" | "onSelect"> {
    filter?: (user: DUserView, index: number) => boolean
    onSelect?: (userId: User['id']) => void
    onRemove?: (userId: User['id']) => void
}

export const DUserList: React.FC<DUserListProps> = (props) => {

    const {filter = () => true, onRemove, onSelect, ...rest} = props
    const userService = useService(DUserReactiveService)
    const userStore = useStore(DUserReactiveService)
    const users = React.useMemo(() => userService.values(), [userStore])

    return <Card {...rest}>
        {users.filter(filter).map((user) => user && user.id && (
            <CardSection border hover onClick={() => {
                if (onSelect) onSelect(user.id)
            }} key={user.id}>
                <DUserContent onRemove={onRemove} userId={user?.id}/>
            </CardSection>
        ))}
    </Card>
}