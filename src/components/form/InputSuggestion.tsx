import {MenuContent, MenuContentProps, MenuItem, MenuLabel} from "../menu/Menu";
import React from "react";
import {ScrollArea, ScrollAreaScrollbar, ScrollAreaThumb, ScrollAreaViewport} from "../scroll-area/ScrollArea";
import {IconChevronDown, IconChevronUp} from "@tabler/icons-react";

export interface InputSuggestion {
    children: React.ReactNode
    value: any
    ref?: any
    groupLabel?: string
}

export type InputSuggestionMenuContentProps = MenuContentProps

export interface InputSuggestionMenuContentItemsProps {
    suggestions?: InputSuggestion[]
    onSuggestionSelect?: (suggestion: InputSuggestion) => void
}

export interface InputSuggestionMenuContentItemsHandle {
    focusFirstItem: () => void
    focusLastItem: () => void
}

export const InputSuggestionMenuContent: React.FC<InputSuggestionMenuContentProps> = React.forwardRef((props, ref) => {

    const {children, ...rest} = props
    const localRef = React.useRef<HTMLDivElement>(null)

    // @ts-ignore
    return <MenuContent ref={localRef}
                        onContextMenuCapture={(e) => e.stopPropagation()}
                        onInteractOutside={(event) => event.target instanceof HTMLInputElement && event.preventDefault()}
                        onCloseAutoFocus={(event) => event.preventDefault()}
                        align={"start"}
                        sideOffset={8}
                        {...rest} >
        {children}
    </MenuContent>

})


export const InputSuggestionMenuContentItems: React.FC<InputSuggestionMenuContentItemsProps> = React.forwardRef<InputSuggestionMenuContentItemsHandle, InputSuggestionMenuContentItemsProps>((props, ref) => {

    const {
        suggestions, onSuggestionSelect = () => {
        }, ...rest
    } = props
    const itemRefs = React.useRef<(HTMLDivElement | null)[]>([])
    const [collapsedGroups, setCollapsedGroups] = React.useState<Record<string, boolean>>({})

    React.useEffect(() => {
        if (!suggestions) {
            setCollapsedGroups({})
            return
        }

        setCollapsedGroups(prev => {
            const next: Record<string, boolean> = {}

            suggestions.forEach(suggestion => {
                if (!suggestion.groupLabel) return
                if (prev.hasOwnProperty(suggestion.groupLabel)) {
                    next[suggestion.groupLabel] = prev[suggestion.groupLabel]
                } else {
                    next[suggestion.groupLabel] = false
                }
            })

            return next
        })
    }, [suggestions])

    const {groupLabelCount, visibleSuggestionCount} = React.useMemo(() => {
        if (!suggestions) return {groupLabelCount: 0, visibleSuggestionCount: 0}

        let labels = 0
        let visible = 0

        suggestions.forEach((suggestion, index, array) => {
            const prevGroup = index > 0 ? array[index - 1]?.groupLabel : undefined
            if (suggestion.groupLabel && suggestion.groupLabel !== prevGroup) {
                labels += 1
            }

            const isCollapsed = suggestion.groupLabel ? collapsedGroups[suggestion.groupLabel] : false
            if (!isCollapsed) {
                visible += 1
            }
        })

        return {groupLabelCount: labels, visibleSuggestionCount: visible}
    }, [collapsedGroups, suggestions])

    const toggleGroup = (groupLabel: string) => {
        setCollapsedGroups(prev => ({
            ...prev,
            [groupLabel]: !prev[groupLabel],
        }))
    }

    React.useImperativeHandle(ref, () => ({
        focusFirstItem: () => itemRefs.current[0]?.focus(),
        focusLastItem: () => itemRefs.current.at(-1)?.focus(),
    }), [])

    // @ts-ignore
    itemRefs.current = []

    return <ScrollArea h={`${Math.max(visibleSuggestionCount + groupLabelCount, 1) * 27}px`}
                       mah={"calc(var(--radix-popper-available-height) - 3rem - 69px)"}
                       {...rest}>
        <ScrollAreaViewport>
            {suggestions?.map((suggestion, i, array) => {
                // @ts-ignore
                const prevGroup = i > 0 ? array[i - 1]?.groupLabel : undefined
                const showGroupLabel = suggestion.groupLabel && suggestion.groupLabel !== prevGroup
                const isCollapsed = suggestion.groupLabel ? collapsedGroups[suggestion.groupLabel] : false

                let visibleIndex = itemRefs.current.length

                return <React.Fragment key={i}>
                    {showGroupLabel && suggestion.groupLabel && <MenuLabel
                        onPointerDown={event => event.preventDefault()}
                        onClick={() => toggleGroup(suggestion.groupLabel!)}
                        style={{
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "space-between",
                            cursor: "pointer"
                        }}>
                        <span>{suggestion.groupLabel}</span>
                        {isCollapsed
                            ? <IconChevronDown size={16}/>
                            : <IconChevronUp size={16}/>}
                    </MenuLabel>}
                    {!isCollapsed && <MenuItem textValue={""}
                                               onSelect={() => setTimeout(() => onSuggestionSelect(suggestion), 0)}
                                                /**@ts-ignore */
                                               ref={el => itemRefs.current[visibleIndex] = el}>
                        {suggestion.children}
                    </MenuItem>}
                </React.Fragment>
            })}
        </ScrollAreaViewport>
        <ScrollAreaScrollbar orientation={"vertical"}>
            <ScrollAreaThumb/>
        </ScrollAreaScrollbar>
    </ScrollArea>

})