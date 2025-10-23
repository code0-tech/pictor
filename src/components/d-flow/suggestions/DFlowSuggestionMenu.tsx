import {Menu, MenuSeparator, MenuTrigger} from "../../menu/Menu";
import React from "react";
import {DFlowSuggestion} from "./DFlowSuggestion.view";
import {DFlowSuggestionMenuFooter} from "./DFlowSuggestionMenuFooter";
import {
    InputSuggestionMenuContent,
    InputSuggestionMenuContentItems,
    InputSuggestionMenuContentItemsHandle
} from "../../form/InputSuggestion";
import {toInputSuggestions} from "./DFlowSuggestionMenu.util";
import {DFlowSuggestionMenuSearchBar} from "./DFlowSuggestionMenuSearchBar";

export interface DFlowSuggestionMenuProps {
    triggerContent: React.ReactNode
    suggestions?: DFlowSuggestion[]
    onSuggestionSelect?: (suggestion: DFlowSuggestion) => void
}

export const DFlowSuggestionMenu: React.FC<DFlowSuggestionMenuProps> = (props) => {

    const {
        suggestions = [], triggerContent, onSuggestionSelect = () => {
        }
    } = props

    const menuRef = React.useRef<InputSuggestionMenuContentItemsHandle | null>(null); // Ref to suggestion list
    const [stateSuggestions, setStateSuggestions] = React.useState(suggestions)

    return <Menu>
        <MenuTrigger asChild>
            {triggerContent}
        </MenuTrigger>
        <InputSuggestionMenuContent>
            <DFlowSuggestionMenuSearchBar onType={event => {

                if (event.key === "ArrowDown") {
                    event.preventDefault();
                    menuRef.current?.focusFirstItem(); // Navigate down
                } else if (event.key === "ArrowUp") {
                    event.preventDefault();
                    menuRef.current?.focusLastItem(); // Navigate up
                }

                // @ts-ignore
                const searchTerm = event.target.value
                setStateSuggestions(suggestions.filter(suggestion => {
                    return suggestion.displayText.some(text => {
                        return text.includes(searchTerm)
                    })
                }))
                event.preventDefault()
                return false
            }}/>
            <MenuSeparator/>
            <InputSuggestionMenuContentItems
                /* @ts-ignore */
                ref={menuRef}
                suggestions={toInputSuggestions(stateSuggestions)}
                onSuggestionSelect={(suggestion) => {
                    onSuggestionSelect(suggestion.ref as DFlowSuggestion)
                }}
            />
            <MenuSeparator/>
            <DFlowSuggestionMenuFooter/>
        </InputSuggestionMenuContent>
    </Menu>

}