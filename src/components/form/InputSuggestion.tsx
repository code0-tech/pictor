import {MenuContent, MenuContentProps, MenuItem, MenuLabel} from "../menu/Menu";
import React from "react";
import {ScrollArea, ScrollAreaScrollbar, ScrollAreaThumb, ScrollAreaViewport} from "../scroll-area/ScrollArea";

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

    const {suggestions, onSuggestionSelect = () => {}, ...rest} = props
    const itemRefs = React.useRef<(HTMLDivElement | null)[]>([])

    const groupLabelCount = React.useMemo(() => {
        if (!suggestions) return 0
        return suggestions.reduce((count, suggestion, index, array) => {
            if (!suggestion?.groupLabel) return count
            const prevGroup = index > 0 ? array[index - 1]?.groupLabel : undefined
            return count + (suggestion.groupLabel !== prevGroup ? 1 : 0)
        }, 0)
    }, [suggestions])

    React.useImperativeHandle(ref, () => ({
        focusFirstItem: () => itemRefs.current[0]?.focus(),
        focusLastItem: () => itemRefs.current.at(-1)?.focus(),
    }), [])

    // @ts-ignore
    return <ScrollArea h={`${Math.max((suggestions?.length ?? 0) + groupLabelCount, 1) * 27}px`}
                       mah={"calc(var(--radix-popper-available-height) - 3rem - 69px)"}
                       {...rest}>
        <ScrollAreaViewport>
            {suggestions?.map((suggestion, i, array) => {
                // @ts-ignore
                const prevGroup = i > 0 ? array[i - 1]?.groupLabel : undefined
                const showGroupLabel = suggestion.groupLabel && suggestion.groupLabel !== prevGroup

                return <React.Fragment key={i}>
                    {showGroupLabel && <MenuLabel>{suggestion.groupLabel}</MenuLabel>}
                    <MenuItem textValue={""}
                              onSelect={() => setTimeout(() => onSuggestionSelect(suggestion), 0)}
                              ref={el => itemRefs.current[i] = el}>
                        {suggestion.children}
                    </MenuItem>
                </React.Fragment>
            })}
        </ScrollAreaViewport>
        <ScrollAreaScrollbar orientation={"vertical"}>
            <ScrollAreaThumb/>
        </ScrollAreaScrollbar>
    </ScrollArea>

})