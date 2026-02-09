import React from "react";
import {DataTableFilterInput} from "./DataTableFilterInput";
import {DataTableFilterSuggestionMenu} from "./DataTableFilterSuggestionMenu";
import {MenuItem} from "../menu/Menu";

export const Default = () => {
    return <DataTableFilterInput filterTokens={[
        {
            token: "name",
            operators: ["isOneOf", "isNotOneOf"],
            suggestion: (context, operator, applySuggestion) => {
                return <DataTableFilterSuggestionMenu context={context}>
                    <MenuItem onSelect={() => applySuggestion("value ")}>value</MenuItem>
                </DataTableFilterSuggestionMenu>
            }
        },
        {
            token: "member",
            operators: ["isOneOf", "isNotOneOf"],
            suggestion: (context, operator, applySuggestion) => {
                return <DataTableFilterSuggestionMenu context={context}>
                    <MenuItem onSelect={() => applySuggestion("@nsammito ")}>@nsammito</MenuItem>
                </DataTableFilterSuggestionMenu>
            }
        }
    ]}/>
}


export default {
    title: "DataTable",
    component: Default,
}
