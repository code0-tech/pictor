import {MenuContent, MenuContentProps, MenuItem, MenuLabel} from "../menu/Menu";
import React, {RefObject} from "react";
import {ScrollArea, ScrollAreaScrollbar, ScrollAreaThumb, ScrollAreaViewport} from "../scroll-area/ScrollArea";
import {IconChevronDown, IconChevronUp} from "@tabler/icons-react";

export interface InputSuggestion {
    children: React.ReactNode
    value: any
    valueData?: any
    groupBy?: string
    insertMode?: "replace" | "append" | "prepend" | "insert"
}

export type InputSuggestionMenuContentProps = MenuContentProps & {inputRef?: RefObject<HTMLInputElement>}

export interface InputSuggestionMenuContentItemsProps {
    suggestions?: InputSuggestion[]
    onSuggestionSelect?: (suggestion: InputSuggestion) => void
    inputRef?: RefObject<HTMLInputElement>
}

export interface InputSuggestionMenuContentItemsHandle {
    focusFirstItem: () => InputSuggestion | undefined
    focusLastItem: () => InputSuggestion | undefined
    highlightNextItem: () => InputSuggestion | undefined
    highlightPreviousItem: () => InputSuggestion | undefined
    selectActiveItem: () => InputSuggestion | undefined
    clearActiveItem: () => void
}

export const InputSuggestionMenuContent: React.FC<InputSuggestionMenuContentProps> = React.forwardRef((props, ref) => {

    const {children, inputRef, ...rest} = props
    const localRef = React.useRef<HTMLDivElement>(null)

    // @ts-ignore
    return <MenuContent ref={localRef}
                        onContextMenuCapture={(e) => e.stopPropagation()}
                        onInteractOutside={(event) => event.target instanceof HTMLInputElement && event.preventDefault()}
                        onCloseAutoFocus={(event) => event.preventDefault()}
                        onOpenAutoFocus={(event: any) => {
                            event.preventDefault()
                            inputRef?.current?.focus({preventScroll: true})
                        }}
                        onFocusCapture={() => inputRef?.current?.focus({preventScroll: true})}
                        align={"start"}
                        sideOffset={8}
                        {...rest} >
        {children}
    </MenuContent>

})


export const InputSuggestionMenuContentItems: React.FC<InputSuggestionMenuContentItemsProps> = React.forwardRef<InputSuggestionMenuContentItemsHandle, InputSuggestionMenuContentItemsProps>((props, ref) => {

    const {
        suggestions,
        onSuggestionSelect = () => {
        },
        inputRef,
        ...rest
    } = props
    const itemRefs = React.useRef<(HTMLDivElement | null)[]>([])
    const [collapsedGroups, setCollapsedGroups] = React.useState<Record<string, boolean>>({})
    const [activeIndex, setActiveIndex] = React.useState<number | null>(null)

    React.useEffect(() => {
        if (!suggestions) {
            setCollapsedGroups({})
            return
        }

        setCollapsedGroups(prev => {
            const next: Record<string, boolean> = {}

            suggestions.forEach(suggestion => {
                if (!suggestion.groupBy) return
                if (prev.hasOwnProperty(suggestion.groupBy)) {
                    next[suggestion.groupBy] = prev[suggestion.groupBy]
                } else {
                    next[suggestion.groupBy] = false
                }
            })

            return next
        })
    }, [suggestions])

    const {groupLabelCount, visibleSuggestionCount, visibleSuggestions} = React.useMemo(() => {
        if (!suggestions) return {groupLabelCount: 0, visibleSuggestionCount: 0, visibleSuggestions: [] as InputSuggestion[]}

        let labels = 0
        let visible = 0
        const flatVisible: InputSuggestion[] = []

        suggestions.forEach((suggestion, index, array) => {
            const prevGroup = index > 0 ? array[index - 1]?.groupBy : undefined
            if (suggestion.groupBy && suggestion.groupBy !== prevGroup) {
                labels += 1
            }

            const isCollapsed = suggestion.groupBy ? collapsedGroups[suggestion.groupBy] : false
            if (!isCollapsed) {
                visible += 1
                flatVisible.push(suggestion)
            }
        })

        return {groupLabelCount: labels, visibleSuggestionCount: visible, visibleSuggestions: flatVisible}
    }, [collapsedGroups, suggestions])

    const toggleGroup = (groupLabel: string) => {
        setCollapsedGroups(prev => ({
            ...prev,
            [groupLabel]: !prev[groupLabel],
        }))
    }

    React.useEffect(() => {
        setActiveIndex(prev => {
            if (prev === null) return prev
            if (prev > visibleSuggestions.length - 1) return visibleSuggestions.length ? visibleSuggestions.length - 1 : null
            return prev
        })
    }, [visibleSuggestions])

    React.useEffect(() => {
        if (activeIndex === null) return
        itemRefs.current[activeIndex]?.scrollIntoView({block: "nearest"})
    }, [activeIndex])

    React.useImperativeHandle(ref, () => ({
        focusFirstItem: () => {
            if (!visibleSuggestions.length) return undefined
            setActiveIndex(0)
            return visibleSuggestions[0]
        },
        focusLastItem: () => {
            if (!visibleSuggestions.length) return undefined
            const lastIndex = visibleSuggestions.length - 1
            setActiveIndex(lastIndex)
            return visibleSuggestions[lastIndex]
        },
        highlightNextItem: () => {
            if (!visibleSuggestions.length) return undefined
            setActiveIndex(prev => {
                if (prev === null) return 0
                return Math.min(prev + 1, visibleSuggestions.length - 1)
            })
            const nextIndex = activeIndex === null ? 0 : Math.min(activeIndex + 1, visibleSuggestions.length - 1)
            return visibleSuggestions[nextIndex]
        },
        highlightPreviousItem: () => {
            if (!visibleSuggestions.length) return undefined
            setActiveIndex(prev => {
                if (prev === null) return visibleSuggestions.length - 1
                return Math.max(prev - 1, 0)
            })
            const nextIndex = activeIndex === null ? visibleSuggestions.length - 1 : Math.max(activeIndex - 1, 0)
            return visibleSuggestions[nextIndex]
        },
        selectActiveItem: () => {
            if (activeIndex === null || !visibleSuggestions[activeIndex]) return undefined
            const selected = visibleSuggestions[activeIndex]
            setTimeout(() => onSuggestionSelect(selected), 0)
            return selected
        },
        clearActiveItem: () => setActiveIndex(null)
    }), [activeIndex, onSuggestionSelect, visibleSuggestions])

    // @ts-ignore
    itemRefs.current = []

    let visibleItemCounter = -1

    return <ScrollArea h={`${Math.max(visibleSuggestionCount + groupLabelCount, 1) * 27}px`}
                       mah={"calc(var(--radix-popper-available-height) - 3rem - 69px)"}
                       {...rest}>
        <ScrollAreaViewport>
            {suggestions?.map((suggestion, i, array) => {
                // @ts-ignore
                const prevGroup = i > 0 ? array[i - 1]?.groupBy : undefined
                const showGroupLabel = suggestion.groupBy && suggestion.groupBy !== prevGroup
                const isCollapsed = suggestion.groupBy ? collapsedGroups[suggestion.groupBy] : false

                const visibleIndex = isCollapsed ? null : ++visibleItemCounter
                const isActive = visibleIndex !== null && activeIndex === visibleIndex

                return <React.Fragment key={i}>
                    {showGroupLabel && suggestion.groupBy && <MenuLabel
                        onPointerDown={event => event.preventDefault()}
                        onClick={() => toggleGroup(suggestion.groupBy!)}
                        style={{
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "space-between",
                            cursor: "pointer"
                        }}>
                        <span>{suggestion.groupBy}</span>
                        {isCollapsed
                            ? <IconChevronDown size={16}/>
                            : <IconChevronUp size={16}/>}
                    </MenuLabel>}
                    {!isCollapsed && <MenuItem textValue={""}
                                               onPointerDown={(event) => {
                                                   event.preventDefault()
                                                   inputRef?.current?.focus({preventScroll: true})
                                                   visibleIndex !== null && setActiveIndex(visibleIndex)
                                               }}
                                               onPointerMove={() => visibleIndex !== null && setActiveIndex(visibleIndex)}
                                               onSelect={() => setTimeout(() => onSuggestionSelect(suggestion), 0)}
                                               data-focus={isActive}
                                                /**@ts-ignore */
                                               ref={el => visibleIndex !== null && (itemRefs.current[visibleIndex] = el)}>
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