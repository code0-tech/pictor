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

export type DialogContentProps = Code0ComponentProps & React.ComponentProps<typeof DialogPrimitive.Content> & {
    showCloseButton?: boolean
}

export interface DialogStickyContentProps extends Code0Component<HTMLDivElement> {
    children: React.ReactNode | React.ReactNode[]
}

const Dialog: React.FC<DialogProps> = (props) => {
    return <DialogPrimitive.Root {...mergeCode0Props("dialog", props) as DialogProps}/>
}

const DialogTrigger: React.FC<DialogTriggerProps> = (props) => {
    return <DialogPrimitive.Trigger {...mergeCode0Props("dialog__trigger", props) as DialogTriggerProps}/>
}

const DialogPortal: React.FC<DialogPortalProps> = (props) => {
    return <DialogPrimitive.Portal {...mergeCode0Props("dialog__portal", props) as DialogPortalProps}/>
}

const DialogClose: React.FC<DialogCloseProps> = (props) => {
    return <DialogPrimitive.Close {...mergeCode0Props("dialog__close", props) as DialogCloseProps}/>
}

const DialogOverlay: React.FC<DialogOverlayProps> = (props) => {
    return <DialogPrimitive.Overlay {...mergeCode0Props("dialog__overlay", props) as DialogOverlayProps}/>
}

const DialogContent: React.FC<DialogContentProps> = (props) => {
    return (
        <DialogPrimitive.Portal>
            <DialogOverlay/>
            <DialogPrimitive.Content {...mergeCode0Props("dialog__content", props) as DialogContentProps}>
                {props.children}
                {props.showCloseButton && (
                    <DialogPrimitive.Close>
                        <IconX size={16}/>
                    </DialogPrimitive.Close>
                )}
            </DialogPrimitive.Content>
        </DialogPrimitive.Portal>
    )
}

const DialogTitle: React.FC<DialogTitleProps> = (props) => {
    return <DialogPrimitive.Title {...mergeCode0Props("dialog__title", props) as DialogTitleProps}/>
}

const DialogDescription: React.FC<DialogDescriptionProps> = (props) => {
    return <DialogPrimitive.Description {...mergeCode0Props("dialog__description", props) as DialogDescriptionProps}/>
}

const DialogStickyContent = (contentType: 'header' | 'footer'): React.FC<DialogStickyContentProps> => (props) => {

    const stickyRef = React.useRef<HTMLDivElement>(null)
    const stickyPseudoRef = React.useRef<HTMLDivElement>(null)

    useEffect(() => {
        if (!stickyRef.current || !stickyPseudoRef.current) return

        const wrapper = document.querySelector(".dialog__wrapper")
        const yPos = contentType == 'header' ? stickyRef.current.getBoundingClientRect().top : stickyRef.current.getBoundingClientRect().bottom
        const height = stickyRef.current.getBoundingClientRect().bottom - stickyRef.current.getBoundingClientRect().top
        const scroll = () => {
            if (!stickyRef.current || !stickyPseudoRef.current) return

            if (contentType == 'header' ? (wrapper?.scrollTop ?? 0) > yPos : ((wrapper?.scrollTop ?? 0) + window.innerHeight) < yPos) {
                stickyRef.current.style.position = "fixed"
                stickyRef.current.style[contentType == 'header' ? 'top' : 'bottom'] = '.5rem'
                stickyPseudoRef.current.style.display = "block"
            } else {
                stickyRef.current.style.position = "relative"
                stickyRef.current.style[contentType == 'header' ? 'top' : 'bottom'] = '0'
                stickyPseudoRef.current.style.display = "none"
            }
        }
        const resize = () => {
            if (!stickyRef.current || !stickyPseudoRef.current) return
            stickyRef.current.style.width = `${(wrapper?.querySelector(".dialog")?.clientWidth ?? 0) - 16}px`
            stickyPseudoRef.current.style.height = `${height}px`
        }

        stickyRef.current.style.width = `${(wrapper?.querySelector(".dialog")?.clientWidth ?? 0) - 16}px`
        stickyPseudoRef.current.style.height = `${height}px`
        resize()
        scroll()

        wrapper?.addEventListener("scroll", scroll)
        window.addEventListener("resize", resize)
    }, [stickyRef, stickyPseudoRef]);

    return <>
        <div style={{display: "none"}} ref={stickyPseudoRef}/>
        <div ref={stickyRef} className={`dialog__${contentType}`}>
            {props.children}
        </div>
    </>

}

export default Object.assign(Dialog, {
    Trigger: DialogTrigger,
    Portal: DialogPortal,
    Close: DialogClose,
    Overlay: DialogOverlay,
    Content: DialogContent,
    Title: DialogTitle,
    Description: DialogDescription,
    Header: DialogStickyContent("header"),
    Footer: DialogStickyContent("footer")
})