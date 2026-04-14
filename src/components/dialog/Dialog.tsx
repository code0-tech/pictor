import * as DialogPrimitive from "@radix-ui/react-dialog"
import {Component, ComponentProps, mergeComponentProps} from "../../utils";
import React from "react";
import {IconX} from "@tabler/icons-react"
import "./Dialog.style.scss"
import {Button} from "../button/Button";
import {Flex} from "../flex/Flex";
import {Text} from "../text/Text";

export type DialogProps = ComponentProps & React.ComponentProps<typeof DialogPrimitive.Root>
export type DialogTriggerProps = ComponentProps & React.ComponentProps<typeof DialogPrimitive.Trigger>
export type DialogPortalProps = ComponentProps & React.ComponentProps<typeof DialogPrimitive.Portal>
export type DialogCloseProps = ComponentProps & React.ComponentProps<typeof DialogPrimitive.Close>
export type DialogOverlayProps = ComponentProps & React.ComponentProps<typeof DialogPrimitive.Overlay>
export type DialogTitleProps = ComponentProps & React.ComponentProps<typeof DialogPrimitive.Title>
export type DialogDescriptionProps = ComponentProps & React.ComponentProps<typeof DialogPrimitive.Description>
export type DialogHeaderProps = ComponentProps & React.ComponentProps<"div">
export type DialogFooterProps = ComponentProps & React.ComponentProps<"div">
export type DialogContentProps = ComponentProps & React.ComponentProps<typeof DialogPrimitive.Content> & {
    showCloseButton?: boolean
    title?: string
}

export type DialogStickyContentProps = Component<HTMLDivElement> & {
    children: React.ReactNode | React.ReactNode[]
}

export const Dialog: React.FC<DialogProps> = (props) => {
    return <DialogPrimitive.Root {...mergeComponentProps("dialog", props) as DialogProps}/>
}

export const DialogTrigger: React.FC<DialogTriggerProps> = (props) => {
    return <DialogPrimitive.Trigger {...mergeComponentProps("dialog__trigger", props) as DialogTriggerProps}/>
}

export const DialogPortal: React.FC<DialogPortalProps> = (props) => {
    return <DialogPrimitive.Portal {...mergeComponentProps("dialog__portal", props) as DialogPortalProps}/>
}

export const DialogClose: React.FC<DialogCloseProps> = (props) => {
    return <DialogPrimitive.Close {...mergeComponentProps("dialog__close", props) as DialogCloseProps}/>
}

export const DialogOverlay: React.FC<DialogOverlayProps> = (props) => {
    return <DialogPrimitive.Overlay {...mergeComponentProps("dialog__overlay", props) as DialogOverlayProps}/>
}

export const DialogContent: React.FC<DialogContentProps> = (props) => {
    return (
        <DialogPrimitive.Content {...mergeComponentProps("dialog__content", props) as DialogContentProps}>
            {props.showCloseButton && (
                <Flex align={"center"} justify={"space-between"}>
                    <Text hierarchy={"primary"} size={"xl"}>{props.title}</Text>
                    <DialogClose asChild>
                        <Button>
                            <IconX size={16}/>
                        </Button>
                    </DialogClose>
                </Flex>
            )}
            {props.children}
        </DialogPrimitive.Content>
    )
}

export const DialogTitle: React.FC<DialogTitleProps> = (props) => {
    return <DialogPrimitive.Title {...mergeComponentProps("dialog__title", props) as DialogTitleProps}/>
}

export const DialogDescription: React.FC<DialogDescriptionProps> = (props) => {
    return <DialogPrimitive.Description {...mergeComponentProps("dialog__description", props) as DialogDescriptionProps}/>
}

export const DialogHeader: React.FC<DialogHeaderProps> = (props) => {
    return <div {...mergeComponentProps("dialog__header", props) as DialogHeaderProps}/>
}

export const DialogFooter: React.FC<DialogFooterProps> = (props) => {
    return <div {...mergeComponentProps("dialog__footer", props) as DialogFooterProps}/>
}