import React from "react";
import {User} from "@code0-tech/sagittarius-graphql-types";
import {Flex} from "../flex/Flex";
import {Avatar} from "../avatar/Avatar";
import {useUserSession} from "./DUser.session.hook";
import {useService, useStore} from "../../utils";
import {DUserReactiveService} from "./DUser.service";
import {Text} from "../text/Text";
import {Badge} from "../badge/Badge";
import {IconMailCheck} from "@tabler/icons-react";
import {Button} from "../button/Button";
import {DUserView} from "./DUser.view";

export interface DUserContentProps {
    userId: User['id']
    onRemove?: (user: DUserView) => void
}

export const DUserContent: React.FC<DUserContentProps> = (props) => {
    const {
        userId,
        onRemove = () => {
        },
        ...rest
    } = props

    const userService = useService(DUserReactiveService)
    const userStore = useStore(DUserReactiveService)
    const currentSession = useUserSession()
    const [remove, setRemove] = React.useState(false)
    const user = React.useMemo(() => userService.getById(userId), [userStore, userId])
    const isCurrentUser = React.useMemo(() => currentSession?.user?.id === user?.id, [currentSession, user])

    return <Flex justify={"space-between"} align={"center"}>
        <Flex style={{gap: ".7rem"}} align={"center"}>
            <Avatar identifier={user?.username!!} bg={"transparent"}/>
            <Flex style={{gap: ".35rem", flexDirection: "column"}}>
                <Flex align={"center"} style={{gap: "0.35rem"}}>
                    <Text size={"md"} hierarchy={"primary"}>{user?.username}</Text>
                    {user?.admin ? <Badge color={"secondary"}>Owner</Badge> : null}
                </Flex>
                <Text size={"sm"} hierarchy={"tertiary"}>{user?.email}</Text>
            </Flex>
        </Flex>
        <Flex style={{gap: "1.3rem"}} align={"center"}>
            {user?.emailVerifiedAt ? (
                <Badge border>
                    <IconMailCheck size={16}/>
                    <Text size={"xs"} hierarchy={"tertiary"}>Email verified</Text>
                </Badge>
            ) : null}
            {/*TODO: need to wait until the delete mutation is available*/}
            {!isCurrentUser && false ? (
                <Flex style={{gap: "0.7rem"}} align={"center"}>
                    {
                        remove ? (
                            <Flex align={"center"} style={{gap: "0.35rem"}}>
                                <Button variant={"filled"} color={"error"} onClick={(event) => {
                                    event.stopPropagation()
                                    user && onRemove(user)
                                }}>
                                    Confirm remove
                                </Button>
                                <Button variant={"filled"} onClick={(event) => {
                                    event.stopPropagation()
                                    setRemove(false)
                                }} color={"success"}>
                                    Cancel
                                </Button>
                            </Flex>
                        ) : (
                            <Button variant={"filled"} onClick={() => setRemove(true)}>
                                Remove
                            </Button>)
                    }
                </Flex>
            ) : null}
        </Flex>
    </Flex>
}