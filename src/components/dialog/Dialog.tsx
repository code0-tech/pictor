import  * as DialogPrimitive from "@radix-ui/react-dialog"
import {Code0Component, Code0ComponentProps} from "../../utils/types";
import React, {useEffect} from "react";
import {mergeCode0Props} from "../../utils/utils";
import {IconX} from "@tabler/icons-react"
import "./Dialog.style.scss"

export type DialogProps = Code0ComponentProps & React.ComponentProps<typeof DialogPrimitive.Root>
export type DialogTriggerProps = Code0ComponentProps & React.ComponentProps<typeof DialogPrimitive.Trigger>
export type DialogPortalProps = Code0ComponentProps & React.ComponentProps<typeof DialogPrimitive.Portal>
export type DialogCloseProps = Code0ComponentProps & React.ComponentProps<typeof DialogPrimitive.Close>
export type DialogOverlayProps = Code0ComponentProps & React.ComponentProps<typeof DialogPrimitive.Overlay>
export type DialogTitleProps = Code0ComponentProps & React.ComponentProps<typeof DialogPrimitive.Title>
export type DialogDescriptionProps = Code0ComponentProps & React.ComponentProps<typeof DialogPrimitive.Description>
export type DialogHeaderProps = Code0ComponentProps & React.ComponentProps<"div">
export type DialogFooterProps = Code0ComponentProps & React.ComponentProps<"div">
export type DialogContentProps = Code0ComponentProps & React.ComponentProps<typeof DialogPrimitive.Content> & {
    showCloseButton?: boolean
}

export type DialogStickyContentProps = Code0Component<HTMLDivElement> & {
    children: React.ReactNode | React.ReactNode[]
}

export const Dialog: React.FC<DialogProps> = (props) => {
    return <DialogPrimitive.Root {...mergeCode0Props("dialog", props) as DialogProps}/>
}

export const DialogTrigger: React.FC<DialogTriggerProps> = (props) => {
    return <DialogPrimitive.Trigger {...mergeCode0Props("dialog__trigger", props) as DialogTriggerProps}/>
}

export const DialogPortal: React.FC<DialogPortalProps> = (props) => {
    return <DialogPrimitive.Portal {...mergeCode0Props("dialog__portal", props) as DialogPortalProps}/>
}

export const DialogClose: React.FC<DialogCloseProps> = (props) => {
    return <DialogPrimitive.Close {...mergeCode0Props("dialog__close", props) as DialogCloseProps}/>
}

export const DialogOverlay: React.FC<DialogOverlayProps> = (props) => {
    return <DialogPrimitive.Overlay {...mergeCode0Props("dialog__overlay", props) as DialogOverlayProps}/>
}

export const DialogContent: React.FC<DialogContentProps> = (props) => {
    return (
        <DialogPrimitive.Portal>
            <DialogOverlay/>
            <DialogPrimitive.Content {...mergeCode0Props("dialog__content", props) as DialogContentProps}>
                {props.showCloseButton && (
                    <DialogClose>
                        <IconX size={16}/>
                    </DialogClose>
                )}
                {props.children}
            </DialogPrimitive.Content>
        </DialogPrimitive.Portal>
    )
}

export const DialogTitle: React.FC<DialogTitleProps> = (props) => {
    return <DialogPrimitive.Title {...mergeCode0Props("dialog__title", props) as DialogTitleProps}/>
}

export const DialogDescription: React.FC<DialogDescriptionProps> = (props) => {
    return <DialogPrimitive.Description {...mergeCode0Props("dialog__description", props) as DialogDescriptionProps}/>
}

export const DialogHeader: React.FC<DialogHeaderProps> = (props) => {
    return <div {...mergeCode0Props("dialog__header", props) as DialogHeaderProps}/>
}

export const DialogFooter: React.FC<DialogFooterProps> = (props) => {
    return <div {...mergeCode0Props("dialog__footer", props) as DialogFooterProps}/>
}