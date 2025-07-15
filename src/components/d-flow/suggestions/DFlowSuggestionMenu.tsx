"use client";

import React from "react";
import {MenuContent, MenuContentProps, MenuItem, MenuLabel} from "../../menu/Menu";
import {DFlowSuggestion, DFlowSuggestionType} from "./DFlowSuggestion.view";
import {
    IconArrowsShuffle,
    IconBulb,
    IconCirclesRelation,
    IconCornerDownLeft,
    IconFileFunctionFilled, IconCircleDot
} from "@tabler/icons-react";
import Text from "../../text/Text";
import {ScrollArea, ScrollAreaScrollbar, ScrollAreaThumb, ScrollAreaViewport} from "../../scroll-area/ScrollArea";
import Flex from "../../flex/Flex";
import {Tooltip, TooltipContent, TooltipPortal, TooltipTrigger} from "../../tooltip/Tooltip";

export interface DFlowSuggestionMenuProps extends MenuContentProps {
    suggestions?: DFlowSuggestion[]
    onSuggestionSelect?: (suggestion: DFlowSuggestion) => void
}

export interface DFlowSuggestionMenuRef {
    focusFirstItem: () => void
    focusLastItem: () => void
}

export const DFlowSuggestionMenu: React.FC<DFlowSuggestionMenuProps> = React.forwardRef<DFlowSuggestionMenuRef, DFlowSuggestionMenuProps>(
    ({suggestions, onSuggestionSelect = () => {}, ...rest}, ref) => {

        const itemRefs = React.useRef<(HTMLDivElement | null)[]>([])
        const localRef = React.useRef<HTMLDivElement>(null);

        React.useImperativeHandle(ref, () => {
            const element = localRef.current!;
            return Object.assign(element, {
                focusFirstItem: () => itemRefs.current[0]?.focus(),
                focusLastItem: () => itemRefs.current.at(-1)?.focus(),
            });
        }, []);

        // @ts-ignore
        return <MenuContent onOpenAutoFocus={(event) => event.preventDefault()} ref={localRef} onInteractOutside={(event) => {
            if (event.target instanceof HTMLInputElement) event.preventDefault()
        }} onCloseAutoFocus={(event) => {
            event.preventDefault()
        }} align={"start"} sideOffset={8} {...rest} >
            <ScrollArea h={`${(suggestions?.length ?? 1) * 28}px`} mah={"calc(var(--radix-popper-available-height) - 3rem)"}>
                <ScrollAreaViewport>
                    {suggestions?.map((suggestion, i) => {
                        switch (suggestion.type) {
                            case DFlowSuggestionType.FUNCTION:
                                // @ts-ignore
                                return <MenuItem onSelect={() => onSuggestionSelect(suggestion)} ref={el => itemRefs.current[i] = el}>
                                    <IconFileFunctionFilled color={"#70ffb2"} size={16}/>
                                    <div>
                                        <Text display={"flex"}
                                              style={{gap: ".5rem"}}>{suggestion.displayText.map(text =>
                                            <span>{text}</span>)}</Text>
                                    </div>
                                </MenuItem>
                            case DFlowSuggestionType.FUNCTION_COMBINATION:
                                // @ts-ignore
                                return <MenuItem onSelect={() => onSuggestionSelect(suggestion)} ref={el => itemRefs.current[i] = el}>
                                    {JSON.stringify(suggestion.value)}
                                </MenuItem>
                            case DFlowSuggestionType.REF_OBJECT:
                                // @ts-ignore
                                return <MenuItem onSelect={() => onSuggestionSelect(suggestion)} ref={el => itemRefs.current[i] = el}>
                                    <IconCirclesRelation color={"#FFBE0B"} size={16}/>
                                    <div>
                                        <Text display={"flex"}
                                              style={{gap: ".5rem"}}>{suggestion.displayText.map(text =>
                                            <span>{text}</span>)}</Text>
                                    </div>
                                </MenuItem>
                            case DFlowSuggestionType.VALUE:
                                // @ts-ignore
                                return <MenuItem onSelect={() => onSuggestionSelect(suggestion)} ref={el => itemRefs.current[i] = el}>
                                    <IconCircleDot color={"#D90429"} size={16}/>
                                    <div>
                                        <Text display={"flex"}
                                              style={{gap: ".5rem"}}>{suggestion.displayText.map(text =>
                                            <span>{text}</span>)}</Text>
                                    </div>
                                </MenuItem>
                            default:
                                return <MenuItem onSelect={() => onSuggestionSelect(suggestion)}>{JSON.stringify(suggestion.value)}</MenuItem>
                        }
                    })}
                </ScrollAreaViewport>
                <ScrollAreaScrollbar orientation={"vertical"}>
                    <ScrollAreaThumb/>
                </ScrollAreaScrollbar>
            </ScrollArea>
            <MenuLabel>
                <Flex align={"center"} style={{gap: ".35rem"}}>Press <IconCornerDownLeft size={12}/> to insert</Flex>
                <Flex ml={1} align={"center"} justify={"center"}>
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <IconBulb size={12}/>
                        </TooltipTrigger>
                        <TooltipPortal>
                            <TooltipContent align={"center"} side={"right"} sideOffset={8}>
                                <Flex pt={0.35} pb={0.35} style={{flexDirection: "column", gap: ".35rem"}}>
                                    <Flex align={"center"} style={{gap: ".35rem"}}>
                                        <IconFileFunctionFilled color={"#70ffb2"} size={16}/>
                                        <Text hierarchy={"tertiary"} size={"xs"}>FUNCTION</Text>
                                    </Flex>
                                    <Flex align={"center"} style={{gap: ".35rem"}}>
                                        <IconArrowsShuffle color={"#29BF12"} size={16}/>
                                        <Text hierarchy={"tertiary"} size={"xs"}>FUNCTION COMBINATION</Text>
                                    </Flex>
                                    <Flex align={"center"} style={{gap: ".35rem"}}>
                                        <IconCirclesRelation color={"#FFBE0B"} size={16}/>
                                        <Text hierarchy={"tertiary"} size={"xs"}>VARIABLE</Text>
                                    </Flex>
                                    <Flex align={"center"} style={{gap: ".35rem"}}>
                                        <IconCircleDot color={"#D90429"} size={16}/>
                                        <Text hierarchy={"tertiary"} size={"xs"}>VALUE</Text>
                                    </Flex>
                                </Flex>

                            </TooltipContent>
                        </TooltipPortal>
                    </Tooltip>
                </Flex></MenuLabel>
        </MenuContent>
    }
)