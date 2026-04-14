import React from "react"
import {Command as CommandPrimitive} from "cmdk"
import {ComponentProps, mergeComponentProps} from "../../utils"
import {Dialog, DialogContent} from "../dialog/Dialog"
import "./Command.style.scss"
import {Badge} from "../badge/Badge"
import {TextInput, TextInputProps} from "../form"

export type CommandProps = ComponentProps & React.ComponentProps<typeof CommandPrimitive>
export type CommandDialogProps = {
    dialogProps?: ComponentProps & React.ComponentProps<typeof Dialog>
    contentProps?: ComponentProps & React.ComponentProps<typeof DialogContent>
    open?: boolean
    onOpenChange?: () => void
    children: React.ReactNode
}
export type CommandListProps = ComponentProps & React.ComponentProps<typeof CommandPrimitive.List>
export type CommandInputProps = ComponentProps & TextInputProps
export type CommandEmptyProps = ComponentProps & React.ComponentProps<typeof CommandPrimitive.Empty>
export type CommandGroupProps = ComponentProps & React.ComponentProps<typeof CommandPrimitive.Group>
export type CommandItemProps = ComponentProps & React.ComponentProps<typeof CommandPrimitive.Item>
export type CommandSeparatorProps = ComponentProps & React.ComponentProps<typeof CommandPrimitive.Separator>
export type CommandShortcutProps = ComponentProps & React.ComponentProps<typeof Badge>

export const Command: React.FC<CommandProps> = (props) => {
    return <CommandPrimitive {...mergeComponentProps("command", props) as CommandProps}/>
}

export const CommandDialog: React.FC<CommandDialogProps> = (props) => {
    return (
        <Dialog {...props.dialogProps} open={props.open} onOpenChange={props.onOpenChange}>
            <DialogContent {...mergeComponentProps("command__dialog", props.contentProps ?? {}) as ComponentProps & React.ComponentProps<typeof DialogContent>}>
                <Command {...props}>
                    {props.children}
                </Command>
            </DialogContent>
        </Dialog>
    )
}

export const CommandList: React.FC<CommandListProps> = (props) => {
    return <CommandPrimitive.List {...mergeComponentProps("command__list", props) as CommandListProps}/>
}

export const CommandInput: React.FC<CommandInputProps> = (props) => {
    return (
        <CommandPrimitive.Input
            value={props.value?.toString()}
            onValueChange={(value) => {
                if (props.onChange) {
                    const event = {
                        target: {value: value}
                    } as React.ChangeEvent<HTMLInputElement>

                    props.onChange(event)
                }
            }}
            asChild
        >
            <TextInput {...mergeComponentProps("command__input", props)} />
        </CommandPrimitive.Input>
    )
}

export const CommandEmpty: React.FC<CommandEmptyProps> = (props) => {
    return <CommandPrimitive.Empty {...mergeComponentProps("command__empty", props) as CommandEmptyProps}/>
}

export const CommandGroup: React.FC<CommandGroupProps> = (props) => {
    return <CommandPrimitive.Group {...mergeComponentProps("command__group", props) as CommandGroupProps}/>
}

export const CommandItem: React.FC<CommandItemProps> = (props) => {
    return <CommandPrimitive.Item {...mergeComponentProps("command__item", props) as CommandItemProps}/>
}

export const CommandSeparator: React.FC<CommandSeparatorProps> = (props) => {
    return <CommandPrimitive.Separator {...mergeComponentProps("command__separator", props) as CommandSeparatorProps}/>
}

export const CommandShortcut: React.FC<CommandShortcutProps> = (props) => {
    return <Badge {...mergeComponentProps("command__shortcut", props) as CommandShortcutProps}>{props.children}</Badge>
}

