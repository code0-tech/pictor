import React from "react"
import {Command as CommandPrimitive} from "cmdk"
import {mergeCode0Props} from "../../utils/utils"
import {Code0ComponentProps} from "../../utils/types"
import {Dialog, DialogContent} from "../dialog/Dialog"
import "./Command.style.scss"
import {Badge} from "../badge/Badge"
import {TextInputProps, TextInput} from "../form/TextInput"

export type CommandProps = Code0ComponentProps & React.ComponentProps<typeof CommandPrimitive>
export type CommandDialogProps = {
    dialogProps?: Code0ComponentProps & React.ComponentProps<typeof Dialog>
    contentProps?: Code0ComponentProps & React.ComponentProps<typeof DialogContent>
    open?: boolean
    onOpenChange?: () => void
    children: React.ReactNode
}
export type CommandListProps = Code0ComponentProps & React.ComponentProps<typeof CommandPrimitive.List>
export type CommandInputProps = Code0ComponentProps & TextInputProps
export type CommandEmptyProps = Code0ComponentProps & React.ComponentProps<typeof CommandPrimitive.Empty>
export type CommandGroupProps = Code0ComponentProps & React.ComponentProps<typeof CommandPrimitive.Group>
export type CommandItemProps = Code0ComponentProps & React.ComponentProps<typeof CommandPrimitive.Item>
export type CommandSeparatorProps = Code0ComponentProps & React.ComponentProps<typeof CommandPrimitive.Separator>
export type CommandShortcutProps = Code0ComponentProps & React.ComponentProps<typeof Badge>

export const Command: React.FC<CommandProps> = (props) => {
    return <CommandPrimitive {...mergeCode0Props("command", props) as CommandProps}/>
}

export const CommandDialog: React.FC<CommandDialogProps> = (props) => {
    return (
        <Dialog {...props.dialogProps} open={props.open} onOpenChange={props.onOpenChange}>
            <DialogContent {...mergeCode0Props("command__dialog", props.contentProps ?? {}) as Code0ComponentProps & React.ComponentProps<typeof DialogContent>}>
                <Command {...props}>
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
    return (
        <CommandPrimitive.Input
            value={props.value?.toString()}
            onValueChange={(value) => {
                if (props.onChange) {
                    const event = {
                        target: { value: value }
                    } as React.ChangeEvent<HTMLInputElement>

                    props.onChange(event)
                }
            }}
            asChild
        >
            <TextInput {...mergeCode0Props("command__input", props)} />
        </CommandPrimitive.Input>
    )
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
    return <Badge {...mergeCode0Props("command__shortcut", props) as CommandShortcutProps}>{props.children}</Badge>
}

