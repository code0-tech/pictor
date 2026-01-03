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

type SuggestionMenuItemProps = {
    suggestion: InputSuggestion
    visibleIndex: number | null
    isActive: boolean
    inputRef?: RefObject<HTMLInputElement>
    onSelect: (suggestion: InputSuggestion) => void
    onActivate: (index: number) => void
    itemRef?: (el: HTMLDivElement | null) => void
}

const SuggestionMenuItem: React.FC<SuggestionMenuItemProps> = React.memo(
    ({suggestion, visibleIndex, isActive, inputRef, onSelect, onActivate, itemRef}) => {
        if (visibleIndex === null) return null

        const focusAndActivate = () => {
            onActivate(visibleIndex)
            inputRef?.current?.focus({preventScroll: true})
        }

        const handlePointerDown = (event: React.PointerEvent) => {
            event.preventDefault()
            focusAndActivate()
        }

        const handlePointerMove = (event: React.PointerEvent) => {
            event.preventDefault()
            event.stopPropagation()
            onActivate(visibleIndex)
        }

        return (
            <MenuItem
                textValue={""}
                onPointerDown={handlePointerDown}
                onPointerMove={handlePointerMove}
                onSelect={() => setTimeout(() => onSelect(suggestion), 0)}
                data-focus={isActive}
                /**@ts-ignore */
                ref={itemRef}
            >
                {suggestion.children}
            </MenuItem>
        )
    },
    (prev, next) =>
        prev.suggestion === next.suggestion &&
        prev.visibleIndex === next.visibleIndex &&
        prev.isActive === next.isActive &&
        prev.inputRef === next.inputRef &&
        prev.onSelect === next.onSelect &&
        prev.onActivate === next.onActivate &&
        prev.itemRef === next.itemRef,
)

SuggestionMenuItem.displayName = "SuggestionMenuItem"

const InputSuggestionMenuContentComponent: React.FC<InputSuggestionMenuContentProps> = React.forwardRef((props, ref) => {
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

InputSuggestionMenuContentComponent.displayName = "InputSuggestionMenuContent"

export const InputSuggestionMenuContent = React.memo(InputSuggestionMenuContentComponent)


const InputSuggestionMenuContentItemsComponent: React.FC<InputSuggestionMenuContentItemsProps> = React.forwardRef<InputSuggestionMenuContentItemsHandle, InputSuggestionMenuContentItemsProps>((props, ref) => {

    const {
        suggestions,
        onSuggestionSelect = () => {
        },
        inputRef,
        ...rest
    } = props
    const itemRefs = React.useRef<(HTMLDivElement | null)[]>([])
    const itemRefCache = React.useRef<Map<number, (el: HTMLDivElement | null) => void>>(new Map())
    const [collapsedGroups, setCollapsedGroups] = React.useState<Record<string, boolean>>({})
    const activeIndexRef = React.useRef<number | null>(null)

    const setActiveIndex = React.useCallback(
        (nextIndex: number | null, options?: {scrollIntoView?: boolean; force?: boolean}) => {
            const current = activeIndexRef.current
            if (!options?.force && current === nextIndex) return

            if (current !== null) {
                itemRefs.current[current]?.removeAttribute("data-focus")
            }

            activeIndexRef.current = nextIndex

            if (nextIndex !== null) {
                const nextEl = itemRefs.current[nextIndex]
                if (nextEl) {
                    nextEl.setAttribute("data-focus", "true")
                    if (options?.scrollIntoView) nextEl.scrollIntoView({block: "nearest"})
                }
            }
        },
        [],
    )

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

    React.useEffect(() => {
        const current = activeIndexRef.current
        if (current === null) return
        if (current > visibleSuggestions.length - 1) {
            setActiveIndex(visibleSuggestions.length ? visibleSuggestions.length - 1 : null, {force: true})
            return
        }
        setActiveIndex(current, {force: true})
    }, [setActiveIndex, visibleSuggestions])

    React.useImperativeHandle(ref, () => ({
        focusFirstItem: () => {
            if (!visibleSuggestions.length) return undefined
            setActiveIndex(0, {scrollIntoView: true})
            return visibleSuggestions[0]
        },
        focusLastItem: () => {
            if (!visibleSuggestions.length) return undefined
            const lastIndex = visibleSuggestions.length - 1
            setActiveIndex(lastIndex, {scrollIntoView: true})
            return visibleSuggestions[lastIndex]
        },
        highlightNextItem: () => {
            if (!visibleSuggestions.length) return undefined
            const current = activeIndexRef.current
            const nextIndex = current === null ? 0 : Math.min(current + 1, visibleSuggestions.length - 1)
            setActiveIndex(nextIndex, {scrollIntoView: true})
            return visibleSuggestions[nextIndex]
        },
        highlightPreviousItem: () => {
            if (!visibleSuggestions.length) return undefined
            const current = activeIndexRef.current
            const nextIndex = current === null ? visibleSuggestions.length - 1 : Math.max(current - 1, 0)
            setActiveIndex(nextIndex, {scrollIntoView: true})
            return visibleSuggestions[nextIndex]
        },
        selectActiveItem: () => {
            const idx = activeIndexRef.current
            if (idx === null || !visibleSuggestions[idx]) return undefined
            const selected = visibleSuggestions[idx]
            setTimeout(() => onSuggestionSelect(selected), 0)
            return selected
        },
        clearActiveItem: () => setActiveIndex(null)
    }), [onSuggestionSelect, setActiveIndex, visibleSuggestions])

    const toggleGroup = (groupLabel: string) => {
        setCollapsedGroups(prev => ({
            ...prev,
            [groupLabel]: !prev[groupLabel],
        }))
    }

    const getItemRef = React.useCallback((index: number) => {
        let cached = itemRefCache.current.get(index)
        if (!cached) {
            cached = (el: HTMLDivElement | null) => {
                itemRefs.current[index] = el
            }
            itemRefCache.current.set(index, cached)
        }
        return cached
    }, [])

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
                const isActive = visibleIndex !== null && activeIndexRef.current === visibleIndex

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
                    {!isCollapsed && (
                        <SuggestionMenuItem
                            suggestion={suggestion}
                            visibleIndex={visibleIndex}
                            isActive={isActive}
                            inputRef={inputRef}
                            onSelect={onSuggestionSelect}
                            onActivate={setActiveIndex}
                            /**@ts-ignore */
                            itemRef={visibleIndex !== null ? getItemRef(visibleIndex) : undefined}
                        />
                    )}
                </React.Fragment>
            })}
        </ScrollAreaViewport>
        <ScrollAreaScrollbar orientation={"vertical"}>
            <ScrollAreaThumb/>
        </ScrollAreaScrollbar>
    </ScrollArea>

})

InputSuggestionMenuContentItemsComponent.displayName = "InputSuggestionMenuContentItems"

export const InputSuggestionMenuContentItems = React.memo(InputSuggestionMenuContentItemsComponent)
