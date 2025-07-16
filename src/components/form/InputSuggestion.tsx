import {MenuContent, MenuContentProps, MenuItem} from "../menu/Menu";
import React from "react";
import {ScrollArea, ScrollAreaScrollbar, ScrollAreaThumb, ScrollAreaViewport} from "../scroll-area/ScrollArea";

export interface InputSuggestion {
    children: React.ReactNode
    value: any
    ref?: any
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

    React.useImperativeHandle(ref, () => ({
        focusFirstItem: () => itemRefs.current[0]?.focus(),
        focusLastItem: () => itemRefs.current.at(-1)?.focus(),
    }), [])

    // @ts-ignore
    return <ScrollArea h={`${(suggestions?.length ?? 1) * 28}px`}
                       mah={"calc(var(--radix-popper-available-height) - 3rem)"}>
        <ScrollAreaViewport>
            {suggestions?.map((suggestion, i) => {
                // @ts-ignore
                return <MenuItem onSelect={() => onSuggestionSelect(suggestion)} ref={el => itemRefs.current[i] = el}>
                    {suggestion.children}
                </MenuItem>
            })}
        </ScrollAreaViewport>
        <ScrollAreaScrollbar orientation={"vertical"}>
            <ScrollAreaThumb/>
        </ScrollAreaScrollbar>
    </ScrollArea>

})