import {DFlowFolderProps} from "./DFlowFolder";
import React from "react";
import {TextInput, useForm} from "../form";
import {Dialog, DialogClose, DialogContent, DialogPortal} from "../dialog/Dialog";
import {Flex} from "../flex/Flex";
import {Button} from "../button/Button";
import {FlowType} from "@code0-tech/sagittarius-graphql-types";
import {DFlowFolderItemPathInput} from "./DFlowFolderItemPathInput";

export interface DFlowFolderCreateDialogProps extends DFlowFolderProps {
    open?: boolean
    onOpenChange?: (open: boolean) => void
    flowTypeId: FlowType['id']
}

export const DFlowFolderCreateDialog: React.FC<DFlowFolderCreateDialogProps> = (props) => {
    const {open} = props

    const [createDialogOpen, setCreateDialogOpen] = React.useState(open)
    const initialValues = React.useMemo(() => ({
        name: ""
    }), [])

    React.useEffect(() => {
        setCreateDialogOpen(open)
    }, [open])

    const [inputs, validate] = useForm({
        initialValues: initialValues,
        validate: {
            name: (value) => {
                if (!value) return "Name is required"
                return null
            }
        },
        onSubmit: (values) => {
            props.onCreate?.(values.name, props.flowTypeId)
            props.onOpenChange?.(false)
        }
    })

    return <Dialog open={createDialogOpen} onOpenChange={(open) => {
        props.onOpenChange?.(open)
    }}>
        <DialogPortal>
            <DialogContent autoFocus showCloseButton
                           title={"Create new flow"}>
                <div>
                    <DFlowFolderItemPathInput
                        description={"You can choose a name here and only use alphanumeric names."}
                        title={"Name of the flow"}
                        {...inputs.getInputProps("name")}/>
                </div>
                <Flex justify={"space-between"} align={"center"}>
                    <DialogClose asChild>
                        <Button color={"secondary"}>No, go back!</Button>
                    </DialogClose>
                    <Button color={"success"} onClick={validate}>Yes, create!</Button>
                </Flex>
            </DialogContent>
        </DialogPortal>
    </Dialog>
}