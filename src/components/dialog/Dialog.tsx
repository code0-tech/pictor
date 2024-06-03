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
import React from "react";
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

    return <div className={"dialog__header"}>
        {props.children}
    </div>

}

export default Object.assign(Dialog, {
    Modal: DialogModal,
    Disclosure: DialogDisclosure,
    Dismiss: DialogDismiss,
    Header: DialogHeader,
})