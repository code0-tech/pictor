import React from "react";
import {Dialog, DialogContent, DialogOverlay, DialogPortal, DialogTitle} from "../dialog/Dialog";
import {DLayout} from "../d-layout/DLayout";
import {Flex} from "../flex/Flex";
import {Text} from "../text/Text";
import {DResizableHandle, DResizablePanel, DResizablePanelGroup} from "../d-resizable/DResizable";
import {Editor} from "../editor/Editor";
import {DataTypeIdentifier, LiteralValue} from "@code0-tech/sagittarius-graphql-types";
import {DFlowInputDataTypeRuleTree} from "./DFlowInputDataType";
import {useService, useStore} from "../../utils";
import {DFlowDataTypeReactiveService} from "../d-flow-data-type";
import {ScrollArea, ScrollAreaScrollbar, ScrollAreaThumb, ScrollAreaViewport} from "../scroll-area/ScrollArea";
import {Spacing} from "../spacing/Spacing";

export interface DFlowInputDataTypeEditDialogProps {
    dataTypeIdentifier: DataTypeIdentifier
    open?: boolean
    onOpenChange?: (open: boolean) => void
    onDataTypeChange?: (dataTypeIdentifier: DataTypeIdentifier) => void
}

export const DFlowInputDataTypeEditDialog: React.FC<DFlowInputDataTypeEditDialogProps> = (props) => {

    const {open, onOpenChange, onDataTypeChange} = props

    const dataTypeService = useService(DFlowDataTypeReactiveService)
    const dataTypeStore = useStore(DFlowDataTypeReactiveService)

    const [editOpen, setEditOpen] = React.useState(open)
    const [dataTypeIdentifier, setDataTypeIdentifier] = React.useState<DataTypeIdentifier>(props.dataTypeIdentifier)

    React.useEffect(() => {
        setEditOpen(open)
        setDataTypeIdentifier(props.dataTypeIdentifier)
    }, [open])

    const editorValue = React.useMemo(() => {
        return dataTypeService.getValueFromType(dataTypeIdentifier) as LiteralValue
    }, [dataTypeStore])

    const initialDataType = React.useMemo(() => {
        return dataTypeService.getDataType(dataTypeIdentifier!)
    }, [dataTypeStore, dataTypeIdentifier])

    return <Dialog open={editOpen} onOpenChange={(open) => onOpenChange?.(open)}>
        <DialogPortal>
            <DialogOverlay/>
            <DialogContent aria-describedby={"DFlowInputDataTypeEditDialog"} onPointerDownOutside={(e) => {
                const target = e.target as HTMLElement;

                if (target.closest("[data-slot=resizable-handle]") || target.closest("[data-slot=resizable-panel]")) {
                    e.preventDefault();
                }
            }} w={"75%"} h={"75%"} style={{
                padding: "2px",
            }}>
                <DialogTitle/>
                <DLayout layoutGap={0} showLayoutSplitter={false}
                         topContent={<Flex style={{gap: ".7rem"}} p={0.7} justify={"space-between"}
                                           align={"center"}>
                             <Text>
                                 {initialDataType?.name?.[0].content ?? "Unnamed Data Type"}
                             </Text>
                         </Flex>}>
                    <DResizablePanelGroup style={{borderRadius: "1rem"}}>
                        <DResizablePanel>
                            <ScrollArea h={"100%"} w={"100%"} type={"scroll"}>
                                <ScrollAreaViewport px={1}>
                                    <Spacing spacing={"md"}/>
                                    <DFlowInputDataTypeRuleTree dataTypeIdentifier={dataTypeIdentifier}/>
                                    <Spacing spacing={"md"}/>
                                </ScrollAreaViewport>
                                <ScrollAreaScrollbar orientation={"vertical"}>
                                    <ScrollAreaThumb/>
                                </ScrollAreaScrollbar>
                                <ScrollAreaScrollbar orientation={"horizontal"}>
                                    <ScrollAreaThumb/>
                                </ScrollAreaScrollbar>
                            </ScrollArea>
                        </DResizablePanel>
                        <DResizableHandle/>
                        <DResizablePanel>
                            <Editor language={"json"} initialValue={editorValue?.value} onChange={value => {
                                const dataTypeIdentifier = dataTypeService.getTypeFromValue({
                                    __typename: "LiteralValue",
                                    value: value
                                })
                                onDataTypeChange?.(dataTypeIdentifier!)
                                setDataTypeIdentifier(dataTypeIdentifier!)
                            }}/>
                        </DResizablePanel>
                    </DResizablePanelGroup>
                </DLayout>
            </DialogContent>
        </DialogPortal>
    </Dialog>
}