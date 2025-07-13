import React from "react";
import {Menu, MenuContent, MenuItem, MenuLabel, MenuPortal, MenuProps, MenuTrigger} from "../../menu/Menu";
import {DFlowSuggestion, DFlowSuggestionType} from "./DFlowSuggestion.view";
import NumberInput from "../../form/NumberInput";
import {IconAtom, IconCirclesRelation, IconCornerDownLeft, IconFileFunctionFilled} from "@tabler/icons-react";
import Text from "../../text/Text";
import {ScrollArea, ScrollAreaScrollbar, ScrollAreaThumb, ScrollAreaViewport} from "../../scroll-area/ScrollArea";

export interface DFlowSuggestionMenuProps extends MenuProps {
    suggestions?: DFlowSuggestion[]
}

export const DFlowSuggestionMenu: React.FC<DFlowSuggestionMenuProps> = (props) => {

    const {suggestions, ...rest} = props

    return <Menu {...rest}>
        <MenuTrigger asChild>
            <NumberInput title={"number"}
                         description={"Increase and decrease your number"}
                         placeholder={"code0.tech"}/>
        </MenuTrigger>
        <MenuPortal>
            <MenuContent sticky={"always"} align={"center"} pos={"relative"} sideOffset={8}>
                <ScrollArea h={"calc(var(--radix-popper-available-height) - 100px)"}>
                    <ScrollAreaViewport>
                        {suggestions?.map(suggestion => {
                            switch (suggestion.type) {
                                case DFlowSuggestionType.FUNCTION:
                                    return <MenuItem>
                                        <IconFileFunctionFilled color={"#70ffb2"} size={16}/>
                                        <div>
                                            <Text display={"flex"}
                                                  style={{gap: ".5rem"}}>{suggestion.displayText.map(text =>
                                                <span>{text}</span>)}</Text>
                                            <Text hierarchy={"tertiary"} size={"xs"}>FUNCTION</Text>
                                        </div>
                                    </MenuItem>
                                case DFlowSuggestionType.FUNCTION_COMBINATION:
                                    return <MenuItem>{JSON.stringify(suggestion.value)}</MenuItem>
                                case DFlowSuggestionType.REF_OBJECT:
                                    return <MenuItem>
                                        <IconCirclesRelation color={"#FFBE0B"} size={16}/>
                                        <div>
                                            <Text display={"flex"}
                                                  style={{gap: ".5rem"}}>{suggestion.displayText.map(text =>
                                                <span>{text}</span>)}</Text>
                                            <Text hierarchy={"tertiary"} size={"xs"}>VARIABLE</Text>
                                        </div>
                                    </MenuItem>
                                case DFlowSuggestionType.VALUE:
                                    return <MenuItem>
                                        <IconAtom color={"#D90429"} size={16}/>
                                        <div>
                                            <Text display={"flex"}
                                                  style={{gap: ".5rem"}}>{suggestion.displayText.map(text =>
                                                <span>{text}</span>)}</Text>
                                            <Text hierarchy={"tertiary"} size={"xs"}>VALUE</Text>
                                        </div>
                                    </MenuItem>
                                default:
                                    return <MenuItem>{JSON.stringify(suggestion.value)}</MenuItem>
                            }
                        })}
                    </ScrollAreaViewport>
                    <ScrollAreaScrollbar orientation={"vertical"}>
                        <ScrollAreaThumb/>
                    </ScrollAreaScrollbar>
                </ScrollArea>
                <MenuLabel>Press <IconCornerDownLeft size={12}/> to insert</MenuLabel>
            </MenuContent>
        </MenuPortal>
    </Menu>
}