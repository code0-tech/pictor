import React from "react";
import {InputDescription, InputLabel, InputMessage, useForm} from "../form";
import {Dialog, DialogClose, DialogContent, DialogOverlay, DialogPortal} from "../dialog/Dialog";
import {Flex} from "../flex/Flex";
import {Button} from "../button/Button";
import {FlowType} from "@code0-tech/sagittarius-graphql-types";
import {DFlowFolderItemPathInput} from "./DFlowFolderItemPathInput";
import {useService, useStore} from "../../utils";
import {DFlowTypeReactiveService} from "../d-flow-type";
import {Menu, MenuContent, MenuItem, MenuLabel, MenuPortal, MenuTrigger} from "../menu/Menu";
import {Spacing} from "../spacing/Spacing";
import {Badge} from "../badge/Badge";
import {IconArrowDown, IconArrowUp, IconCornerDownLeft, IconFile} from "@tabler/icons-react";
import {Card} from "../card/Card";
import {hashToColor} from "../d-flow/DFlow.util";

export interface DFlowFolderCreateDialogProps {
    open?: boolean
    onOpenChange?: (open: boolean) => void
    flowTypeId?: FlowType['id']
    onCreate?: (name: string, type: FlowType['id']) => void
}

export const DFlowFolderCreateDialog: React.FC<DFlowFolderCreateDialogProps> = (props) => {

    const {open} = props

    const flowTypeService = useService(DFlowTypeReactiveService)
    const flowTypeStore = useStore(DFlowTypeReactiveService)

    const [createDialogOpen, setCreateDialogOpen] = React.useState(open)
    const [selectedFlowTypeId, setSelectedFlowTypeId] = React.useState<FlowType['id'] | undefined>(props.flowTypeId)
    const selectedFlowType = React.useMemo(() => {
        return flowTypeService.getById(selectedFlowTypeId)
    }, [selectedFlowTypeId, flowTypeStore])

    const initialValues = React.useMemo(
        () => ({name: "", flowTypeId: props.flowTypeId ?? null}),
        []
    )

    const flowTypes = React.useMemo(
        () => flowTypeService.values(),
        [flowTypeStore]
    )

    React.useEffect(() => {
        setCreateDialogOpen(open)
    }, [open])

    const [inputs, validate] = useForm({
        initialValues: initialValues,
        validate: {
            name: (value) => {
                if (!value) return "Name is required"
                return null
            },
            flowTypeId: (value) => {
                if (!value) return "Flow type is required"
                return null
            }
        },
        onSubmit: (values) => {
            props.onCreate?.(values.name, values.flowTypeId)
            props.onOpenChange?.(false)
        }
    })

    return <Dialog open={createDialogOpen} onOpenChange={(open) => {
        props.onOpenChange?.(open)
    }}>
        <DialogPortal>
            <DialogOverlay/>
            <DialogContent autoFocus showCloseButton
                           title={"Create new flow"}>
                <InputLabel>Type of flow</InputLabel>
                <InputDescription>You can choose a flow type here</InputDescription>
                <Menu>
                    <MenuTrigger asChild>
                        <Button w={"100%"}
                                color={inputs.getInputProps("flowTypeId").formValidation?.valid ? "secondary" : "error"}
                                style={{justifyContent: "start"}}>
                            {selectedFlowTypeId ?
                                <IconFile size={13} color={hashToColor(selectedFlowTypeId)}/> : null}
                            {selectedFlowType ? selectedFlowType?.names?.[0].content : "Select flow type"}
                        </Button>
                    </MenuTrigger>
                    <MenuPortal>
                        <MenuContent align={"start"}
                                     color={"secondary"}
                                     sideOffset={8}>
                            <Card paddingSize={"xxs"} mt={-0.35} mx={-0.35} style={{borderWidth: "2px"}}>
                                {flowTypes.map((flowType) => (
                                    <MenuItem key={flowType.id} onSelect={() => {
                                        inputs.getInputProps("flowTypeId").formValidation?.setValue(flowType.id)
                                        setSelectedFlowTypeId(flowType.id)
                                    }}>
                                        {flowType.names?.[0].content}
                                    </MenuItem>
                                ))}
                            </Card>
                            <MenuLabel>
                                <Flex style={{gap: ".35rem"}}>
                                    <Flex align={"center"} style={{gap: "0.35rem"}}>
                                        <Flex>
                                            <Badge border><IconArrowUp size={12}/></Badge>
                                            <Badge border><IconArrowDown size={12}/></Badge>
                                        </Flex>
                                        move
                                    </Flex>
                                    <Spacing spacing={"xxs"}/>
                                    <Flex align={"center"} style={{gap: ".35rem"}}>
                                        <Badge border><IconCornerDownLeft size={12}/></Badge>
                                        select
                                    </Flex>
                                </Flex>
                            </MenuLabel>
                        </MenuContent>
                    </MenuPortal>
                </Menu>
                {!inputs.getInputProps("flowTypeId").formValidation?.valid ?
                    <InputMessage>{inputs.getInputProps("flowTypeId").formValidation?.notValidMessage!}</InputMessage> : null}
                <Spacing spacing={"md"}/>
                <DFlowFolderItemPathInput
                    description={"You can choose a name here and only use alphanumeric names."}
                    title={"Name of the flow"}
                    {...inputs.getInputProps("name")}/>
                <Spacing spacing={"md"}/>
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