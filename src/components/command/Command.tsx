import React from "react"
import {Command as CommandPrimitive} from "cmdk"
import {mergeCode0Props} from "../../utils/utils"
import {Code0Component, Code0ComponentProps} from "../../utils/types"
import {Dialog, DialogContent} from "../dialog/Dialog"
import "./Command.style.scss"

export type CommandProps = Code0ComponentProps & React.ComponentProps<typeof CommandPrimitive>
export type CommandDialogProps = Code0ComponentProps & React.ComponentProps<typeof Dialog>
export type CommandListProps = Code0ComponentProps & React.ComponentProps<typeof CommandPrimitive.List>
export type CommandInputProps = Code0ComponentProps & React.ComponentProps<typeof CommandPrimitive.Input>
export type CommandEmptyProps = Code0ComponentProps & React.ComponentProps<typeof CommandPrimitive.Empty>
export type CommandGroupProps = Code0ComponentProps & React.ComponentProps<typeof CommandPrimitive.Group>
export type CommandItemProps = Code0ComponentProps & React.ComponentProps<typeof CommandPrimitive.Item>
export type CommandSeparatorProps = Code0ComponentProps & React.ComponentProps<typeof CommandPrimitive.Separator>
export type CommandShortcutProps = Code0Component<HTMLSpanElement>

export const Command: React.FC<CommandProps> = (props) => {
    return <CommandPrimitive {...mergeCode0Props("command", props) as CommandProps}/>
}

export const CommandDialog: React.FC<CommandProps> = (props) => {
    return (
        <Dialog>
            <DialogContent>
                <Command>
                    {props.children}
                </Command>
            </DialogContent>
        </Dialog>
    )
}

export const CommandList: React.FC<CommandListProps> = (props) => {
    return <CommandPrimitive.List {...mergeCode0Props("command__list", props) as CommandListProps}/>
}

export const CommandInput: React.FC<CommandInputProps> = (props) => {
    return <CommandPrimitive.Input {...mergeCode0Props("command__input", props) as CommandInputProps}/>
}

export const CommandEmpty: React.FC<CommandEmptyProps> = (props) => {
    return <CommandPrimitive.Empty {...mergeCode0Props("command__empty", props) as CommandEmptyProps}/>
}

export const CommandGroup: React.FC<CommandGroupProps> = (props) => {
    return <CommandPrimitive.Group {...mergeCode0Props("command__group", props) as CommandGroupProps}/>
}

export const CommandItem: React.FC<CommandItemProps> = (props) => {
    return <CommandPrimitive.Item {...mergeCode0Props("command__item", props) as CommandItemProps}/>
}

export const CommandSeparator: React.FC<CommandSeparatorProps> = (props) => {
    return <CommandPrimitive.Separator {...mergeCode0Props("command__separator", props) as CommandSeparatorProps}/>
}

export const CommandShortcut: React.FC<CommandShortcutProps> = (props) => {
    return <span {...mergeCode0Props("command__shortcut", props) as CommandShortcutProps}>{props.children}</span>
}

