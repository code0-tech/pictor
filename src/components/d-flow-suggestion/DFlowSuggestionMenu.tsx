import {Menu, MenuPortal, MenuSeparator, MenuTrigger} from "../menu/Menu";
import React from "react";
import {DFlowSuggestion} from "./DFlowSuggestion.view";
import {DFlowSuggestionMenuFooter} from "./DFlowSuggestionMenuFooter";
import {
    InputSuggestionMenuContent,
    InputSuggestionMenuContentItems,
    InputSuggestionMenuContentItemsHandle
} from "../form";
import {toInputSuggestions} from "./DFlowSuggestionMenu.util";
import {DFlowSuggestionMenuSearchBar} from "./DFlowSuggestionMenuSearchBar";
import {useStoreApi} from "@xyflow/react";

export interface DFlowSuggestionMenuProps {
    triggerContent: React.ReactNode
    suggestions?: DFlowSuggestion[]
    onSuggestionSelect?: (suggestion: DFlowSuggestion) => void
}

export const DFlowSuggestionMenu: React.FC<DFlowSuggestionMenuProps> = (props) => {

    const {suggestions = [], triggerContent, onSuggestionSelect = () => {}} = props

    const flowStoreApi = useStoreApi()
    const menuRef = React.useRef<InputSuggestionMenuContentItemsHandle | null>(null); // Ref to suggestion list
    const [stateSuggestions, setStateSuggestions] = React.useState(suggestions)

    React.useEffect(() => {
        setStateSuggestions(suggestions)
    }, [suggestions])

    return <Menu onOpenChange={event => {
        setTimeout(() => {
            flowStoreApi.setState({
                nodesDraggable: !event,
                nodesConnectable: !event,
                elementsSelectable: !event,
            });
        }, 250) // Timeout to ensure the menu is fully opened before changing the state
    }}>
        <MenuTrigger asChild>
            {triggerContent}
        </MenuTrigger>
        <MenuPortal>
            <InputSuggestionMenuContent align={"center"}>
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
                        onSuggestionSelect(suggestion.valueData as DFlowSuggestion)
                    }}
                />
                <MenuSeparator/>
                <DFlowSuggestionMenuFooter/>
            </InputSuggestionMenuContent>
        </MenuPortal>
    </Menu>

}