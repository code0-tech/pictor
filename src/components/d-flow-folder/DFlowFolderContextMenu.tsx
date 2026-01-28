import {DFlowFolderProps} from "./DFlowFolder";
import React from "react";
import {
    ContextMenu,
    ContextMenuContent,
    ContextMenuItem,
    ContextMenuLabel,
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
import {useService, useStore} from "../../utils";
import {DFlowTypeReactiveService} from "../d-flow-type";
import {Flow} from "@code0-tech/sagittarius-graphql-types";

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
    contextData?: DFlowFolderContextMenuGroupData | DFlowFolderContextMenuItemData
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
                            <Flex align={"center"} justify={"space-between"} style={{gap: "0.7rem"}} w={"100%"}>
                                <Text>Create new flow</Text>
                                <IconChevronRight size={12}/>
                            </Flex>
                        </ContextMenuSubTrigger>
                        <ContextMenuSubContent>
                            <ContextMenuLabel>Flow types</ContextMenuLabel>
                            {flowTypes.map(flowType => {
                                return <ContextMenuItem key={flowType.id} onSelect={() => {
                                    props.onCreate?.(flowType.id)
                                }}>
                                    {flowType.names!![0]?.content ?? flowType.id}
                                </ContextMenuItem>
                            })}
                        </ContextMenuSubContent>
                        {props.contextData ? (
                            <>
                                <ContextMenuSeparator/>
                                <ContextMenuItem disabled onSelect={() => props.onRename?.(props.contextData!)}>
                                    <IconEdit size={13}/>
                                    <Text>Rename</Text>
                                </ContextMenuItem>
                                <ContextMenuItem onSelect={() => props.onDelete?.(props.contextData!)}>
                                    <IconTrash size={13}/>
                                    <Text>Delete</Text>
                                </ContextMenuItem>
                            </>
                        ) : null}
                    </ContextMenuSub>
                </ContextMenuContent>
            </ContextMenuPortal>
        </ContextMenu>
    </>
}