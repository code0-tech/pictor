import React from "react";
import {Dialog, DialogClose, DialogContent, DialogOverlay, DialogPortal} from "../dialog/Dialog";
import {DLayout} from "../d-layout/DLayout";
import {Flex} from "../flex/Flex";
import {Text} from "../text/Text";
import {DResizableHandle, DResizablePanel, DResizablePanelGroup} from "../d-resizable/DResizable";
import {ScrollArea, ScrollAreaScrollbar, ScrollAreaThumb, ScrollAreaViewport} from "../scroll-area/ScrollArea";
import {Spacing} from "../spacing/Spacing";
import {Button} from "../button/Button";
import {IconX} from "@tabler/icons-react";
import {Editor} from "../editor/Editor";
import {DFlowInputObjectRuleTree} from "./DFlowInputObject";

export interface DFlowInputObjectEditDialogProps {
    open: boolean;
    rule: any;
    originalObject: any;
    onClose: () => void;
    onObjectChange?: (object: any) => void;
}

const DFlowInputObjectEditDialog: React.FC<DFlowInputObjectEditDialogProps> = ({
                                                                                   open,
                                                                                   rule,
                                                                                   originalObject,
                                                                                   onClose,
                                                                                   onObjectChange
                                                                               }) => {
    const [editOpen, setEditOpen] = React.useState(open);
    const [collapsedState, setCollapsedStateRaw] = React.useState<Record<string, boolean>>({});
    const [editorValue, setEditorValue] = React.useState(rule?.value);

    // State für die aktuell selektierte Rule im Dialog
    const [activeRule, setActiveRule] = React.useState(rule);
    const [activePath, setActivePath] = React.useState(rule?.path ?? []);

    const clickTimeout = React.useRef<NodeJS.Timeout | null>(null);

    React.useEffect(() => {
        setEditOpen(open);
    }, [open]);

    React.useEffect(() => {
        setEditorValue(rule?.value);
        setActiveRule(rule);
        setActivePath(rule?.path ?? []);
        setEditOpen(true);
    }, [rule]);

    const setCollapsedState = (path: string[], collapsed: boolean) => {
        setCollapsedStateRaw(prev => ({...prev, [path.join(".")]: collapsed}));
    };

    const handleRuleClick = (clickedRule: any) => {
        if (clickTimeout.current) clearTimeout(clickTimeout.current);
        clickTimeout.current = setTimeout(() => {
            setActiveRule(clickedRule);
            setActivePath(clickedRule.path ?? []);
            setEditorValue(clickedRule.value);
        }, 200);
    };

    const handleRuleDoubleClick = (currentPath: string[], isCollapsed: boolean) => {
        if (clickTimeout.current) clearTimeout(clickTimeout.current);
        setCollapsedState(currentPath, !isCollapsed);
    };

    // Editor suggestions and highlights can be customized for JSON
    const suggestions = () => null;
    const tokenHighlights = {};

    if (!editOpen || !rule) return null;

    return (
        <Dialog open={editOpen} onOpenChange={setEditOpen}>
            <DialogPortal>
                <DialogOverlay/>
                <DialogContent aria-describedby="DFlowInputObjectEditDialog" onPointerDownOutside={(e) => {
                    const target = e.target as HTMLElement;

                    if (target.closest("[data-slot=resizable-handle]") || target.closest("[data-slot=resizable-panel]")) {
                        e.preventDefault();
                    }
                }} w={"75%"} h={"75%"} style={{
                    padding: "2px",
                }}>
                    <DLayout layoutGap={0} showLayoutSplitter={false}
                             topContent={
                                 <Flex style={{gap: ".7rem"}} p={0.7} justify={"space-between"} align={"center"}>
                                     <Text>
                                         {rule.key ?? "Edit Object"}
                                     </Text>
                                     <DialogClose asChild>
                                         <Button variant={"filled"} color={"tertiary"} paddingSize={"xxs"}>
                                             <IconX size={13}/>
                                         </Button>
                                     </DialogClose>
                                 </Flex>
                             }>
                        <DResizablePanelGroup style={{borderRadius: "1rem"}}>
                            <DResizablePanel color="primary">
                                <ScrollArea h="100%" w="100%" type="scroll">
                                    <ScrollAreaViewport px={1}>
                                        <Spacing spacing="md"/>
                                        <DFlowInputObjectRuleTree
                                            object={originalObject}
                                            onRuleClick={handleRuleClick}
                                            collapsedState={collapsedState}
                                            setCollapsedState={setCollapsedState}
                                            activePath={activePath}
                                            onDoubleClick={handleRuleDoubleClick}
                                        />
                                        <Spacing spacing="md"/>
                                    </ScrollAreaViewport>
                                    <ScrollAreaScrollbar orientation="vertical">
                                        <ScrollAreaThumb/>
                                    </ScrollAreaScrollbar>
                                    <ScrollAreaScrollbar orientation="horizontal">
                                        <ScrollAreaThumb/>
                                    </ScrollAreaScrollbar>
                                </ScrollArea>
                            </DResizablePanel>
                            <DResizableHandle/>
                            <DResizablePanel color="primary">
                                <Editor
                                    suggestions={suggestions}
                                    tokenHighlights={tokenHighlights}
                                    language="json"
                                    initialValue={editorValue}
                                    onChange={(value: string) => {
                                        try {
                                            const parsed = JSON.parse(value);
                                            onObjectChange?.(parsed);
                                        } catch {
                                        }
                                    }}
                                />
                            </DResizablePanel>
                        </DResizablePanelGroup>
                    </DLayout>
                </DialogContent>
            </DialogPortal>
        </Dialog>
    );
};

export default DFlowInputObjectEditDialog;

