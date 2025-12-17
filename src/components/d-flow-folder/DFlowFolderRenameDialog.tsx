import React from "react";
import {Dialog, DialogClose, DialogContent, DialogPortal} from "../dialog/Dialog";
import {DFlowFolderItemPathInput} from "./DFlowFolderItemPathInput";
import {Flex} from "../flex/Flex";
import {Button} from "../button/Button";
import {DFlowFolderContextMenuGroupData, DFlowFolderContextMenuItemData} from "./DFlowFolderContextMenu";
import {useForm} from "../form";
import {Flow} from "@code0-tech/sagittarius-graphql-types";

export interface DFlowFolderRenameDialogProps {
    contextData: DFlowFolderContextMenuGroupData | DFlowFolderContextMenuItemData
    open?: boolean
    onOpenChange?: (open: boolean) => void
    onRename?: (flow: Flow, newName: string) => void
}

export const DFlowFolderRenameDialog: React.FC<DFlowFolderRenameDialogProps> = (props) => {
    const {open} = props

    const [renameDialogOpen, setRenameDialogOpen] = React.useState(open)
    const initialValues = React.useMemo(() => ({
        path: props.contextData.name
    }), [])

    React.useEffect(() => {
        setRenameDialogOpen(open)
    }, [open])

    const [inputs, validate] = useForm({
        initialValues: initialValues,
        validate: {
            path: (value) => {
                return null
            }
        },
        onSubmit: (values) => {
            if (props.contextData.type === "item") {
                props.onRename?.(props.contextData.flow, values.path)
            } else if (props.contextData.type === "folder") {
                props.contextData.flow.forEach(flow => {
                    const newName = flow.name?.replace(props.contextData.name, values.path) ?? flow.name
                    props.onRename?.(flow, newName!)
                })
            }
        }
    })

    return <Dialog open={renameDialogOpen} onOpenChange={(open) => {
        props.onOpenChange?.(open)
    }}>
        <DialogPortal>
            <DialogContent autoFocus showCloseButton
                           title={props.contextData.type == "item" ? "Rename flow" : "Rename folder"}>
                <div>
                    <DFlowFolderItemPathInput
                        description={"You can choose a new name here and only use alphanumeric names."}
                        title={props.contextData.type == "item" ? "Name of the flow" : "Name of the folder"}
                        {...inputs.getInputProps("path")}/>
                </div>
                <Flex justify={"space-between"} align={"center"}>
                    <DialogClose asChild>
                        <Button color={"secondary"}>No, go back!</Button>
                    </DialogClose>
                    <DialogClose asChild>
                        <Button color={"success"} onClick={validate}>Yes, save!</Button>
                    </DialogClose>
                </Flex>
            </DialogContent>
        </DialogPortal>
    </Dialog>
}