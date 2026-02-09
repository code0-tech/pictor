import React from "react";
import {Menu, MenuContent, MenuTrigger} from "../menu/Menu";
import {CompletionContext} from "@codemirror/autocomplete";

export interface DataTableFilterSuggestionMenuProps {
    children?: React.ReactNode
    context?: CompletionContext
}

export const DataTableFilterSuggestionMenu: React.FC<DataTableFilterSuggestionMenuProps> = (props) => {

    const {children, context} = props

    const LocalMenuContent = MenuContent as any

    return <Menu open={true} modal={false}>
        <MenuTrigger asChild>
            <div style={{position: 'absolute', top: 0, left: 0, width: 0, height: 0}}/>
        </MenuTrigger>
        <LocalMenuContent w={"200px"} onOpenAutoFocus={(e: Event) => {
            e.preventDefault();
            ((e.currentTarget as HTMLElement).querySelector('[role="menuitem"]') as HTMLElement)?.focus();
        }} onKeyDown={(event: any) => {
            if (!["Escape", "ArrowUp", "ArrowDown"].includes(event.key)) context?.view?.focus();
        }} style={{position: 'fixed', top: 0, left: 0, pointerEvents: 'auto'}}>
            {children}
        </LocalMenuContent>
    </Menu>

}