import {
    DialogProviderProps as AKDialogProviderProps,
    DialogDisclosureProps as AKDialogDisclosureProps,
    DialogProps as AKDialogProps,
    DialogDismissProps as AKDialogDismissProps,
    DialogProvider as AKDialogProvider,
    Dialog as AKDialog,
    DialogDisclosure as AKDialogDisclosure,
    DialogDismiss as AKDialogDismiss
} from "@ariakit/react"
import {Code0Component, Code0ComponentProps} from "../../utils/types";
import React, {useEffect} from "react";
import {mergeCode0Props} from "../../utils/utils";
import Button, {ButtonType} from "../button/Button";
import "./Dialog.style.scss"

export type DialogProps = AKDialogProviderProps
export type DialogDisclosureProps = ButtonType & AKDialogDisclosureProps
export type DialogModalProps = Code0ComponentProps & AKDialogProps
export type DialogDismissProps = ButtonType & AKDialogDismissProps

export interface DialogStickyContentProps extends Code0Component<HTMLDivElement> {
    children: React.ReactNode | React.ReactNode[]
}

const Dialog: React.FC<DialogProps> = (props) => <AKDialogProvider {...props}/>
const DialogModal: React.FC<DialogModalProps> = (props) => <AKDialog {...mergeCode0Props("dialog", {
    ...props,
    ...(!props.render ? {
        render: (props: React.HTMLAttributes<HTMLDivElement>) => {
            return <div className={"dialog__wrapper"} hidden={props.hidden}>
                <div {...props}/>
            </div>
        }
    } : {render: props.render})
})}/>
const DialogDisclosure: React.FC<DialogDisclosureProps> = (props) =>
    <AKDialogDisclosure {...mergeCode0Props("", {
        ...props,
        ...(!props.render ? {
            render: (props: React.JSX.IntrinsicAttributes & ButtonType) => <Button {...props}/>
        } : {render: props.render})
    })}/>
const DialogDismiss: React.FC<DialogDismissProps> = (props) =>
    <AKDialogDismiss {...mergeCode0Props("", {
        ...props,
        ...(!props.render ? {
            render: (props: React.JSX.IntrinsicAttributes & ButtonType) => <Button {...props}/>
        } : {render: props.render})
    })}/>

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
    Modal: DialogModal,
    Disclosure: DialogDisclosure,
    Dismiss: DialogDismiss,
    Header: DialogStickyContent("header"),
    Footer: DialogStickyContent("footer")
})