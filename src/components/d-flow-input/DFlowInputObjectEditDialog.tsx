import React from "react"
import {Dialog, DialogClose, DialogContent, DialogOverlay, DialogPortal} from "../dialog/Dialog"
import {DLayout} from "../d-layout/DLayout"
import {Flex} from "../flex/Flex"
import {Text} from "../text/Text"
import {DResizableHandle, DResizablePanel, DResizablePanelGroup} from "../d-resizable/DResizable"
import {ScrollArea, ScrollAreaScrollbar, ScrollAreaThumb, ScrollAreaViewport} from "../scroll-area/ScrollArea"
import {Spacing} from "../spacing/Spacing"
import {Button} from "../button/Button"
import {IconX} from "@tabler/icons-react"
import {Editor} from "../editor/Editor"
import {DFlowInputObjectTree} from "./DFlowInputObjectTree";
import {LiteralValue} from "@code0-tech/sagittarius-graphql-types";

export interface EditableObjectEntry {
    key: string
    value: LiteralValue | null
    path: string[]
}

export interface DFlowInputObjectEditDialogProps {
    open: boolean
    entry: EditableObjectEntry | null
    value: LiteralValue | null
    onOpenChange?: (open: boolean) => void
    onObjectChange?: (object: LiteralValue | null) => void
}

function getValueAtPath(obj: LiteralValue | null, path: string[]): unknown {
    if (!obj || !Array.isArray(path) || path.length === 0) return obj?.value
    // Traverse .value recursively if nested
    let current: any = obj.value
    for (const key of path) {
        if (current && typeof current === 'object' && key in current) {
            current = current[key]
        } else {
            return undefined
        }
    }
    return current
}

function setValueAtPath(obj: LiteralValue | null, path: string[], value: unknown): LiteralValue | null {
    if (!obj) return null
    if (path.length === 0) return { ...obj, value }
    const [key, ...rest] = path
    if (Array.isArray(obj.value)) {
        const idx = Number(key)
        const newArr = [...obj.value]
        if (rest.length > 0 && typeof newArr[idx] === 'object' && newArr[idx] !== null) {
            newArr[idx] = setValueAtPath({ ...obj, value: newArr[idx] }, rest, value)?.value
        } else {
            newArr[idx] = value
        }
        return { ...obj, value: newArr }
    } else if (typeof obj.value === 'object' && obj.value !== null) {
        const newObj = { ...obj.value }
        if (rest.length > 0 && typeof newObj[key] === 'object' && newObj[key] !== null) {
            newObj[key] = setValueAtPath({ ...obj, value: newObj[key] }, rest, value)?.value
        } else {
            newObj[key] = value
        }
        return { ...obj, value: newObj }
    } else {
        // Not an object/array, just replace
        return { ...obj, value }
    }
}

const DFlowInputObjectEditDialog: React.FC<DFlowInputObjectEditDialogProps> = (props) => {
    const {
        open,
        entry,
        value,
        onObjectChange,
        onOpenChange
    } = props

    const [editOpen, setEditOpen] = React.useState(open)
    const [collapsedState, setCollapsedStateRaw] = React.useState<Record<string, boolean>>({})
    const [activePath, setActivePath] = React.useState(entry?.path ?? [])
    const [editedObject, setEditedObject] = React.useState<LiteralValue | null>(value)
    const [editorValue, setEditorValue] = React.useState(getValueAtPath(value, entry?.path ?? []))
    const clickTimeout = React.useRef<NodeJS.Timeout | null>(null)

    React.useEffect(() => {
        setEditorValue(getValueAtPath(editedObject, activePath))
    }, [activePath])

    React.useEffect(() => {
        setActivePath(entry?.path ?? [])
        setEditedObject(value)
    }, [entry])

    React.useEffect(() => {
        setEditOpen(open)
    }, [open])

    const setCollapsedState = (path: string[], collapsed: boolean) => {
        setCollapsedStateRaw(prev => ({...prev, [path.join(".")]: collapsed}))
    }

    const handleEntryClick = (clickedEntry: EditableObjectEntry) => {
        if (clickTimeout.current) clearTimeout(clickTimeout.current)
        clickTimeout.current = setTimeout(() => {
            setActivePath(clickedEntry.path ?? [])
        }, 200)
    }

    const handleRuleDoubleClick = (currentPath: string[], isCollapsed: boolean) => {
        if (clickTimeout.current) clearTimeout(clickTimeout.current)
        setCollapsedState(currentPath, !isCollapsed)
    }

    const handleEditorChange = (val: unknown) => {
        const updated = setValueAtPath(editedObject, activePath, val)
        setEditedObject(updated)
        onObjectChange?.(updated)
    }

    const suggestions = () => null
    const tokenHighlights = {}

    return (
        <Dialog open={editOpen} onOpenChange={(open) => onOpenChange?.(open)}>
            <DialogPortal>
                <DialogOverlay/>
                <DialogContent aria-describedby="DFlowInputObjectEditDialog" onPointerDownOutside={e => {
                    const target = e.target as HTMLElement
                    if (target.closest("[data-slot=resizable-handle]") || target.closest("[data-slot=resizable-panel]")) {
                        e.preventDefault()
                    }
                }} w={"75%"} h={"75%"} style={{padding: "2px"}}>
                    <DLayout layoutGap={0} showLayoutSplitter={false}
                             topContent={
                                 <Flex style={{gap: ".7rem"}} p={0.7} justify={"space-between"} align={"center"}>
                                     <Text>{entry?.key ?? "Edit Object"}</Text>
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
                                        <DFlowInputObjectTree
                                            object={editedObject!}
                                            onEntryClick={handleEntryClick}
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
                                    onChange={handleEditorChange}
                                />
                            </DResizablePanel>
                        </DResizablePanelGroup>
                    </DLayout>
                </DialogContent>
            </DialogPortal>
        </Dialog>
    )
}

export default DFlowInputObjectEditDialog

