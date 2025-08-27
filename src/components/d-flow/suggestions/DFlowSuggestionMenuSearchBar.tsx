import React from "react";
import {DFlowSuggestionSearchInput} from "./DFlowSuggestionSearchInput";
import {IconSearch} from "@tabler/icons-react";
import {Code0Component} from "../../../utils/types";

export interface DFlowSuggestionMenuSearchBarProps extends Code0Component<HTMLDivElement> {
    onType: (event: React.KeyboardEvent<HTMLInputElement>) => void
}

export const DFlowSuggestionMenuSearchBar: React.FC<DFlowSuggestionMenuSearchBarProps> = (props) => {
    return <DFlowSuggestionSearchInput placeholder={"Search..."}
                                       onKeyUp={(event) => props.onType(event)}
                                       clearable
                                       style={{background: "none", boxShadow: "none"}}
                                       autoFocus
                                       left={<IconSearch size={12}/>}
    />
}