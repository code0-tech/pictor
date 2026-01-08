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
} from "../context-menu/ContextMenu";
import {Flex} from "../flex/Flex";
import {Text} from "../text/Text";
import {IconChevronRight, IconEdit, IconTrash} from "@tabler/icons-react";
import {Dialog, DialogClose, DialogContent, DialogPortal} from "../dialog/Dialog";
import {Badge} from "../badge/Badge";
import {Button} from "../button/Button";
import {useService, useStore} from "../../utils";
import {DFlowTypeReactiveService} from "../d-flow-type";
import {DFlowFolderItemPathInput} from "./DFlowFolderItemPathInput";
import {Flow, FlowType} from "@code0-tech/sagittarius-graphql-types";
import {DFlowFolderRenameDialog} from "./DFlowFolderRenameDialog";
import {DFlowFolderCreateDialog} from "./DFlowFolderCreateDialog";

export interface DFlowFolderContextMenuGroupData {
    name: string
    flow: Flow[]
    type: "folder"
}

export interface DFlowFolderContextMenuItemData {
    name: string
    flow: Flow
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

    return <>
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
                                return <ContextMenuItem key={flowType.id} onSelect={() => {
                                    props.onCreate?.(flowType.id)
                                }}>
                                    {flowType.names!![0]?.content ?? flowType.id}
                                </ContextMenuItem>
                            })}
                        </ContextMenuSubContent>
                        <ContextMenuSeparator/>
                        <ContextMenuItem onSelect={() => props.onRename?.(props.contextData)}>
                            <IconEdit size={12} color={"purple"}/>
                            <Text>Rename</Text>
                        </ContextMenuItem>
                        <ContextMenuItem onSelect={() => props.onDelete?.(props.contextData)}>
                            <IconTrash size={12} color={"red"}/>
                            <Text>Delete</Text>
                        </ContextMenuItem>
                    </ContextMenuSub>
                </ContextMenuContent>
            </ContextMenuPortal>
        </ContextMenu>
    </>
}