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

export interface DialogHeaderProps extends Code0Component<HTMLDivElement> {
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

const DialogHeader: React.FC<DialogHeaderProps> = (props) => {

    const headerRef = React.useRef<HTMLDivElement>(null)
    const headerPseudoRef = React.useRef<HTMLDivElement>(null)

    useEffect(() => {
        if (!headerRef.current || !headerPseudoRef.current) return
        const wrapper = document.querySelector(".dialog__wrapper")
        const yPos = headerRef.current.getBoundingClientRect().top
        const height = headerRef.current.getBoundingClientRect().bottom - headerRef.current.getBoundingClientRect().top - 24
        wrapper?.addEventListener("scroll", () => {
            if (!headerRef.current || !headerPseudoRef.current) return
            headerPseudoRef.current.style.height = `${height}px`
            if (wrapper.scrollTop > yPos) {
                headerRef.current.style.position = "fixed"
                headerPseudoRef.current.style.display = "block"
            } else {
                headerRef.current.style.position = "relative"
                headerPseudoRef.current.style.display = "none"
            }
        })
    }, [headerRef, headerPseudoRef]);

    return <>
        <div ref={headerPseudoRef}/>
        <div ref={headerRef} className={"dialog__header"}>
            {props.children}
        </div>
    </>

}

const DialogFooter: React.FC<DialogHeaderProps> = (props) => {

    const footerRef = React.useRef<HTMLDivElement>(null)
    const footerPseudoRef = React.useRef<HTMLDivElement>(null)

    useEffect(() => {
        if (!footerRef.current || !footerPseudoRef.current) return
        const wrapper = document.querySelector(".dialog__wrapper")
        const yPos = footerRef.current.getBoundingClientRect().bottom
        const height = footerRef.current.getBoundingClientRect().bottom - footerRef.current.getBoundingClientRect().top
        wrapper?.addEventListener("scroll", () => {
            console.log(height)
            if (!footerRef.current || !footerPseudoRef.current) return
            footerPseudoRef.current.style.height = `${height}px`
            if (wrapper.scrollTop+ window.innerHeight < yPos) {
                footerRef.current.style.position = "fixed"
                footerPseudoRef.current.style.display = "block"
            } else {
                footerRef.current.style.position = "relative"
                footerPseudoRef.current.style.display = "none"
            }
        })
    }, [footerRef, footerPseudoRef]);

    return <>
        <div ref={footerPseudoRef}/>
        <div ref={footerRef} className={"dialog__footer"}>
            {props.children}
        </div>
    </>

}

export default Object.assign(Dialog, {
    Modal: DialogModal,
    Disclosure: DialogDisclosure,
    Dismiss: DialogDismiss,
    Header: DialogHeader,
    Footer: DialogFooter
})