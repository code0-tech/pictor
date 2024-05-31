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
import {Code0ComponentProps} from "../../utils/types";
import React from "react";
import {mergeCode0Props} from "../../utils/utils";
import "./Dialog.style.scss"
import Button, {ButtonType} from "../button/Button";

type DialogProps = AKDialogProviderProps
type DialogDisclosureProps = ButtonType & AKDialogDisclosureProps
type DialogModalProps = Code0ComponentProps & AKDialogProps
type DialogDismissProps = ButtonType & AKDialogDismissProps

const Dialog: React.FC<DialogProps> = (props) => <AKDialogProvider {...props}/>
const DialogModal: React.FC<DialogModalProps> = (props) => <AKDialog {...mergeCode0Props("dialog", {
    ...props,
    ...(!props.render ? {
        render: (props: React.HTMLAttributes<HTMLDivElement>) => {
            console.log(props)
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

export default Object.assign(Dialog, {
    Modal: DialogModal,
    Disclosure: DialogDisclosure,
    Dismiss: DialogDismiss
})