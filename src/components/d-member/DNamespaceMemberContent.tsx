import React from "react"
import {Flex} from "../flex/Flex"
import {NamespaceMember} from "@code0-tech/sagittarius-graphql-types"
import {useService, useStore} from "../../utils"
import {DNamespaceMemberReactiveService} from "./DNamespaceMember.service"
import {DUserReactiveService} from "../d-user"
import {DNamespaceRoleReactiveService, DNamespaceRoleView} from "../d-role"
import {Avatar} from "../avatar/Avatar"
import {Text} from "../text/Text"
import {Badge} from "../badge/Badge"
import {IconDots, IconMailCheck, IconTrash, IconUserCog, IconUserOff} from "@tabler/icons-react"
import {Button} from "../button/Button"
import {Tooltip, TooltipArrow, TooltipContent, TooltipPortal, TooltipTrigger} from "../tooltip/Tooltip"
import {DNamespaceRolePermissions} from "../d-role/DNamespaceRolePermissions"
import {Menu, MenuContent, MenuItem, MenuLabel, MenuPortal, MenuSeparator, MenuTrigger} from "../menu/Menu"
import {DNamespaceMemberView} from "./DNamespaceMember.view"
import {Dialog, DialogClose, DialogContent, DialogPortal} from "../dialog/Dialog"
import {Card} from "../card/Card"
import CardSection from "../card/CardSection"

export interface DNamespaceMemberContentProps {
    memberId: NamespaceMember['id']
    onRemove?: (member: DNamespaceMemberView) => void
    onAssignRole?: (member: DNamespaceMemberView, roles: DNamespaceRoleView[]) => void
}

export const DNamespaceMemberContent: React.FC<DNamespaceMemberContentProps> = (props) => {

    const {memberId, onAssignRole = () => undefined, onRemove = () => undefined} = props

    const memberService = useService(DNamespaceMemberReactiveService)
    const memberStore = useStore(DNamespaceMemberReactiveService)
    const userService = useService(DUserReactiveService)
    const userStore = useStore(DUserReactiveService)
    const roleService = useService(DNamespaceRoleReactiveService)
    const roleStore = useStore(DNamespaceRoleReactiveService)

    const member = React.useMemo(() => memberService.getById(memberId), [memberStore, memberId])
    const user = React.useMemo(() => userService.getById(member?.user?.id), [userStore, member])
    const assignedRoles = React.useMemo(() => member?.roles?.nodes?.map(role => roleService.getById(role?.id, {namespaceId: member?.namespace?.id})) || [], [roleStore, member])
    const [localAssignedRoles, setLocalAssignedRoles] = React.useState(assignedRoles)
    const [openRemovedMemberDialog, setOpenRemovedMemberDialog] = React.useState(false)
    const [openAssignRolesDialog, setOpenAssignRolesDialog] = React.useState(false)
    const rolesToAssign = roleService
        .values({namespaceId: member?.namespace?.id})
        .filter(role => !localAssignedRoles.find(aRole => aRole?.id === role.id))

    return <Flex align={"center"} style={{gap: "1.3rem"}} justify={"space-between"}>
        <Dialog open={openRemovedMemberDialog} onOpenChange={open => setOpenRemovedMemberDialog(open)}>
            <DialogPortal>
                <DialogContent showCloseButton title={"Remove member"}>
                    <Text size={"md"} hierarchy={"secondary"}>
                        Are you sure you want to remove {" "}
                        <Badge color={"info"}>
                            <Text size={"md"} style={{color: "inherit"}}>@{user?.username}</Text>
                        </Badge> {" "}
                        from the namespace members?
                    </Text>
                    <Flex justify={"space-between"} align={"center"}>
                        <DialogClose asChild>
                            <Button color={"secondary"}>No, go back!</Button>
                        </DialogClose>
                        <DialogClose asChild>
                            <Button color={"error"} onClick={() => onRemove(member!!)}>Yes, remove!</Button>
                        </DialogClose>
                    </Flex>
                </DialogContent>
            </DialogPortal>
        </Dialog>
        <Dialog open={openAssignRolesDialog} onOpenChange={open => setOpenAssignRolesDialog(open)}>
            <DialogPortal>
                <DialogContent autoFocus showCloseButton title={"Assign roles"}>
                    <Text size={"md"} hierarchy={"tertiary"}>Assign, remove and manage the roles of a active
                        member</Text>
                    <Card paddingSize={"xs"} color={"secondary"}>
                        {localAssignedRoles.map(role => {
                            return <CardSection border key={role?.id}>
                                <Flex style={{gap: "0.7rem"}} align={"center"} justify={"space-between"}>
                                    <Flex align={"center"} style={{gap: "1.3rem"}}>
                                        <Text hierarchy={"primary"}>{role?.name}</Text>
                                        <DNamespaceRolePermissions abilities={role?.abilities!!}/>
                                    </Flex>
                                    <Button color={"error"} paddingSize={"xxs"} onClick={() => {
                                        setLocalAssignedRoles(prevState => prevState.filter(aRole => aRole?.id != role?.id))
                                    }}>
                                        <IconTrash size={16}/>
                                    </Button>
                                </Flex>

                            </CardSection>
                        })}
                        <Menu>
                            <MenuTrigger asChild>
                                <CardSection hover p={0.35} border display={"flex"} justify={"center"}>
                                    <Button paddingSize={"xxs"} variant={"none"}>Assign roles</Button>
                                </CardSection>
                            </MenuTrigger>
                            <MenuPortal>
                                <MenuContent side={"bottom"} sideOffset={8} align={"center"}>
                                    <MenuLabel>Roles to add</MenuLabel>
                                    {rolesToAssign.map((role, index) => {
                                        return <>
                                            <MenuItem onSelect={() => {
                                                setLocalAssignedRoles(prevState => [...prevState, role])
                                            }}>
                                                <Flex align={"center"} style={{gap: "1.3rem"}}>
                                                    <Text hierarchy={"primary"}>{role?.name}</Text>
                                                    <DNamespaceRolePermissions abilities={role?.abilities!!}/>
                                                </Flex>
                                            </MenuItem>
                                            {index < rolesToAssign.length - 1 && <MenuSeparator/>}
                                        </>
                                    })}
                                </MenuContent>
                            </MenuPortal>
                        </Menu>
                    </Card>
                    <Flex justify={"space-between"} align={"center"}>
                        <DialogClose asChild>
                            <Button color={"secondary"}>No, go back!</Button>
                        </DialogClose>

                        <DialogClose asChild>
                            <Button onClick={() => onAssignRole(member!!, localAssignedRoles as DNamespaceRoleView[])}
                                    color={"success"}>Yes, save!</Button>
                        </DialogClose>
                    </Flex>
                </DialogContent>
            </DialogPortal>
        </Dialog>
        <Flex style={{gap: "1.3rem"}} align={"center"}>
            <Flex align={"center"} style={{gap: ".7rem"}}>
                <Avatar identifier={user?.username!!} bg={"transparent"}/>
                <Flex style={{flexDirection: "column", gap: "0.35rem"}}>
                    <Text size={"md"} hierarchy={"primary"}>@{user?.username}</Text>
                    <Text size={"sm"} hierarchy={"tertiary"}>{user?.email}</Text>
                </Flex>
            </Flex>
            {assignedRoles.length > 0 ? (
                <Flex style={{flexDirection: "column", gap: "0.35rem"}}>
                    <Text size="xs" hierarchy="tertiary">
                        Assigned roles
                    </Text>
                    <Flex align={"center"} style={{gap: "0.35rem"}}>
                        {assignedRoles.map(role => {
                            return <Tooltip>
                                <TooltipTrigger asChild>
                                    <Badge color={"info"}>
                                        <Text style={{color: "inherit"}}
                                              hierarchy={"tertiary"}>{role?.name}</Text>
                                    </Badge>
                                </TooltipTrigger>
                                <TooltipPortal>
                                    <TooltipContent side={"bottom"}>
                                        <DNamespaceRolePermissions abilities={role?.abilities!!}/>
                                        <TooltipArrow/>
                                    </TooltipContent>
                                </TooltipPortal>
                            </Tooltip>
                        })}
                    </Flex>
                </Flex>
            ) : null}
        </Flex>
        <Flex align={"center"} style={{gap: "1.3rem"}}>
            <Flex style={{flexDirection: "column", gap: "0.35rem"}}>
                <Flex style={{gap: "0.35rem"}} align={"center"}>
                    {user?.admin ? <Badge border color={"primary"}>
                        <Text hierarchy={"tertiary"}>Owner</Text>
                    </Badge> : null}
                    {user?.emailVerifiedAt ? (
                        <Badge border color={"primary"}>
                            <IconMailCheck size={16}/>
                            <Text hierarchy={"tertiary"}>Email verified</Text>
                        </Badge>
                    ) : null}
                </Flex>
            </Flex>
            {member?.userAbilities?.deleteMember || member?.userAbilities?.assignMemberRoles ? (
                <Menu>
                    <MenuTrigger asChild>
                        <Button color="secondary">
                            <IconDots size={16}/>
                        </Button>
                    </MenuTrigger>
                    <MenuPortal>
                        <MenuContent align={"end"} side={"bottom"} sideOffset={8}>
                            <MenuLabel>Actions</MenuLabel>
                            {member?.userAbilities?.deleteMember && (
                                <MenuItem onSelect={() => setOpenRemovedMemberDialog(true)}>
                                    <IconUserOff size={16}/>
                                    <Text>Remove member</Text>
                                </MenuItem>
                            )}
                            {member?.userAbilities?.assignMemberRoles && (
                                <MenuItem onSelect={() => setOpenAssignRolesDialog(true)}>
                                    <IconUserCog size={16}/>
                                    <Text>Assign role</Text>
                                </MenuItem>
                            )}
                        </MenuContent>
                    </MenuPortal>
                </Menu>
            ) : null}
        </Flex>
    </Flex>
}