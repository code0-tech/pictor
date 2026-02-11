import React from "react";
import {Menu, MenuContent, MenuTrigger} from "../menu/Menu";
import {CompletionContext} from "@codemirror/autocomplete";

export interface DataTableFilterSuggestionMenuProps {
    children?: React.ReactNode
    context?: CompletionContext
}

export const DataTableFilterSuggestionMenu: React.FC<DataTableFilterSuggestionMenuProps> = (props) => {

    const {children, context} = props

    const [open, setOpen] = React.useState(true)

    const LocalMenuContent = MenuContent as any

    return <Menu open={open} onOpenChange={(open) => setOpen(open)} modal={false}>
        <MenuTrigger asChild>
            <div style={{position: 'absolute', top: 0, left: 0, width: 0, height: 0}}/>
        </MenuTrigger>
        <LocalMenuContent w={"200px"} onInteractOutside={(e: Event) => {
            const prevent = Array.from((e.currentTarget as HTMLDivElement).classList).map(className => className).some(className => className.startsWith("cm-"))
            if (prevent) e.preventDefault()
        }} onOpenAutoFocus={(e: Event) => {
            e.preventDefault();
            ((e.currentTarget as HTMLElement).querySelector('[role="menuitem"]') as HTMLElement)?.focus();
        }} onKeyDown={(event: any) => {
            if (!["Escape", "ArrowUp", "ArrowDown"].includes(event.key)) context?.view?.focus();
        }} style={{position: 'fixed', top: 0, left: 0, pointerEvents: 'auto'}}>
            {children}
        </LocalMenuContent>
    </Menu>

}