import React from "react";
import {Menu, MenuContent, MenuItem, MenuPortal, MenuProps, MenuTrigger} from "../../menu/Menu";
import {DFlowSuggestion} from "./DFlowSuggestion.view";

export interface DFlowSuggestionMenuProps extends MenuProps {
    suggestions?: DFlowSuggestion[]
}

export const DFlowSuggestionMenu: React.FC<DFlowSuggestionMenuProps> = (props) => {

    const {suggestions, ...rest} = props

    return <Menu {...rest}>
        <MenuTrigger>Test</MenuTrigger>
        <MenuPortal>
            <MenuContent>
                {suggestions?.map(suggestion => {
                    return <MenuItem>{JSON.stringify(suggestion.value)}</MenuItem>
                })}
            </MenuContent>
        </MenuPortal>
    </Menu>
}