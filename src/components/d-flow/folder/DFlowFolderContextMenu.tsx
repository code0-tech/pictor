import {DFlowFolderProps} from "./DFlowFolder";
import React from "react";
import {
    ContextMenu,
    ContextMenuContent,
    ContextMenuItem,
    ContextMenuPortal,
    ContextMenuSeparator,
    ContextMenuSub,
    ContextMenuSubContent,
    ContextMenuSubTrigger,
    ContextMenuTrigger
} from "../../context-menu/ContextMenu";
import {Flex} from "../../flex/Flex";
import {Text} from "../../text/Text";
import {IconChevronRight, IconClipboard, IconCopy, IconEdit, IconTrash} from "@tabler/icons-react";
import {Dialog, DialogClose, DialogContent, DialogPortal} from "../../dialog/Dialog";
import {Badge} from "../../badge/Badge";
import {Button} from "../../button/Button";
import {FlowView} from "../DFlow.view";
import {TextInput} from "../../form";
import {useService, useStore} from "../../../utils";
import {DFlowTypeReactiveService} from "../type";
import {DFlowFolderItemPathInput} from "./DFlowFolderItemPathInput";

export interface DFlowFolderContextMenuGroupData {
    name: string
    flows: FlowView[]
    type: "group"
}

export interface DFlowFolderContextMenuItemData {
    name: string
    flow: FlowView
    type: "item"
}

export interface DFlowFolderContextMenuProps extends DFlowFolderProps {
    children: React.ReactNode
    contextData: DFlowFolderContextMenuGroupData | DFlowFolderContextMenuItemData
}

export const DFlowFolderContextMenu: React.FC<DFlowFolderContextMenuProps> = (props) => {

    const {children} = props

    const flowTypeService = useService(DFlowTypeReactiveService)
    const flowTypeStore = useStore(DFlowTypeReactiveService)

    const flowTypes = React.useMemo(() => flowTypeService.values(), [flowTypeStore])
    const [deleteDialogOpen, setDeleteDialogOpen] = React.useState(false)
    const [renameDialogOpen, setRenameDialogOpen] = React.useState(false)

    return <>
        <Dialog open={deleteDialogOpen} onOpenChange={(open) => setDeleteDialogOpen(open)}>
            <DialogPortal>
                <DialogContent autoFocus showCloseButton title={props.contextData.type == "item" ? "Remove flow" : "Remove folder"}>
                    <Text size={"md"} hierarchy={"secondary"}>
                        {props.contextData.type == "item" ? "Are you sure you want to remove flow" : "Are you sure you want to remove folder"} {" "}
                        <Badge color={"info"}>
                            <Text size={"md"} style={{color: "inherit"}}>{props.contextData.name}</Text>
                        </Badge> {" "}
                        {props.contextData.type == "group" ? ", all flows and sub-folders inside " : ""}from the this project?
                    </Text>
                    <Flex justify={"space-between"} align={"center"}>
                        <DialogClose asChild>
                            <Button color={"secondary"}>No, go back!</Button>
                        </DialogClose>
                        <DialogClose asChild>
                            <Button color={"error"} onClick={() => {
                                if (props.contextData.type === "item") {
                                    props.onDelete?.(props.contextData.flow)
                                } else if (props.contextData.type === "group") {
                                    props.contextData.flows.forEach(flow => {
                                        props.onDelete?.(flow)
                                    })
                                }
                            }}>Yes, remove!</Button>
                        </DialogClose>
                    </Flex>
                </DialogContent>
            </DialogPortal>
        </Dialog>

        <Dialog open={renameDialogOpen} onOpenChange={(open) => setRenameDialogOpen(open)}>
            <DialogPortal>
                <DialogContent autoFocus showCloseButton title={props.contextData.type == "item" ? "Rename flow" : "Rename folder"}>
                    <div>
                        <DFlowFolderItemPathInput description={"You can choose a new name here and only use alphanumeric names."}
                                   title={props.contextData.type == "item" ? "Name of the flow" : "Name of the folder"}
                                   defaultValue={props.contextData.name}/>
                    </div>
                    <Flex justify={"space-between"} align={"center"}>
                        <DialogClose asChild>
                            <Button color={"secondary"}>No, go back!</Button>
                        </DialogClose>
                        <DialogClose asChild>
                            <Button color={"success"} onClick={() => {
                                if (props.contextData.type === "item") {
                                    props.onDelete?.(props.contextData.flow)
                                } else if (props.contextData.type === "group") {
                                    props.contextData.flows.forEach(flow => {
                                        props.onDelete?.(flow)
                                    })
                                }
                            }}>Yes, save!</Button>
                        </DialogClose>
                    </Flex>
                </DialogContent>
            </DialogPortal>
        </Dialog>

        <ContextMenu>
            <ContextMenuTrigger asChild>
                {children}
            </ContextMenuTrigger>
            <ContextMenuPortal>
                <ContextMenuContent>
                    <ContextMenuSub>
                        <ContextMenuSubTrigger>
                            <Flex align={"center"} justify={"space-between"} w={"100%"}>
                                <Text>New flow</Text>
                                <IconChevronRight size={12}/>
                            </Flex>
                        </ContextMenuSubTrigger>
                        <ContextMenuSubContent>
                            {flowTypes.map(flowType => {
                                return <ContextMenuItem key={flowType.id}>
                                    {flowType.names?.nodes!![0]?.content ?? flowType.id}
                                </ContextMenuItem>
                            })}
                        </ContextMenuSubContent>
                        <ContextMenuSeparator/>
                        <ContextMenuItem onSelect={() => setRenameDialogOpen(true)}>
                            <IconEdit size={12} color={"purple"}/>
                            <Text>Rename</Text>
                        </ContextMenuItem>
                        <ContextMenuItem onSelect={() => setDeleteDialogOpen(true)}>
                            <IconTrash size={12} color={"red"}/>
                            <Text>Delete</Text>
                        </ContextMenuItem>
                    </ContextMenuSub>
                </ContextMenuContent>
            </ContextMenuPortal>
        </ContextMenu>
    </>
}