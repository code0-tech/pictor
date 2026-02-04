import React from "react";
import {Dialog, DialogClose, DialogContent, DialogOverlay, DialogPortal, DialogTitle} from "../dialog/Dialog";
import {DLayout} from "../d-layout/DLayout";
import {Flex} from "../flex/Flex";
import {Text} from "../text/Text";
import {DResizableHandle, DResizablePanel, DResizablePanelGroup} from "../d-resizable/DResizable";
import {Editor, EditorTokenHighlights} from "../editor/Editor";
import {DataTypeIdentifier, LiteralValue} from "@code0-tech/sagittarius-graphql-types";
import {DFlowInputDataTypeRuleTree} from "./DFlowInputDataType";
import {useService, useStore} from "../../utils";
import {DFlowDataTypeReactiveService} from "../d-flow-data-type";
import {ScrollArea, ScrollAreaScrollbar, ScrollAreaThumb, ScrollAreaViewport} from "../scroll-area/ScrollArea";
import {Spacing} from "../spacing/Spacing";
import {Badge} from "../badge/Badge";
import {hashToColor} from "../d-flow/DFlow.util";
import {CompletionContext, CompletionResult} from "@codemirror/autocomplete";
import {syntaxTree} from "@codemirror/language";
import {Button} from "../button/Button";
import {IconX} from "@tabler/icons-react";

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

    const suggestions = (context: CompletionContext): CompletionResult | null => {

        const word = context.matchBefore(/\w*/)

        if (!word || (word.from === word.to && !context.explicit)) {
            return null;
        }

        const node = syntaxTree(context.state).resolveInner(context.pos, -1);
        const prevNode = syntaxTree(context.state).resolveInner(context.pos, 0);

        if (node.name === "Property" || prevNode.name === "Property") {
            return {
                from: word.from,
                options: [
                    {
                        label: "Text",
                        type: "type",
                        apply: `"Text"`,
                    },
                    {
                        label: "Boolean",
                        type: "type",
                        apply: `true`,
                    },
                    {
                        label: "Number",
                        type: "type",
                        apply: `1`,
                    },
                ]
            }
        }
        return null
    }

    const myRenderMap: EditorTokenHighlights = {
        bool: ({content}) => {
            return <Badge color={hashToColor("Boolean")} border>
                Boolean
            </Badge>
        },
        string: ({content}) => {
            return <Badge key={"Text"} color={hashToColor("Text")} border>
                Text
            </Badge>
        },
        number: ({content}) => {
            return <Badge key={"Number"} color={hashToColor("Number")} border>
                Number
            </Badge>
        }
    }

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
                             <DialogClose asChild>
                                 <Button variant={"filled"} color={"tertiary"} paddingSize={"xxs"}>
                                     <IconX size={13}/>
                                 </Button>
                             </DialogClose>
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
                            <Editor suggestions={suggestions} tokenHighlights={myRenderMap} language={"json"} initialValue={editorValue?.value} onChange={value => {
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