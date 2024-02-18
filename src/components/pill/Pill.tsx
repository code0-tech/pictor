import React, {AnchorHTMLAttributes, DetailedHTMLProps, HTMLProps, MouseEventHandler} from "react"
import "./Pill.style.scss"
import {getChild} from "../../utils/utils";
import {Button} from "../../index";
import {IconX} from "@tabler/icons-react";

export interface PillType extends Omit<HTMLProps<HTMLAnchorElement>, "size"> {
    children: string
    removeButton?: boolean
    //defaults to primary
    color?: "primary" | "secondary" | "info" | "success" | "warning" | "error"
    //Defaults to md
    size?: "xs" | "sm" | "md" | "lg" | "xl"
    onClose?: MouseEventHandler
}


const Pill: React.FC<PillType> = (props) => {
    const {
        children, removeButton = false,
        color = "primary",
        size = "md",
        onClose
    } = props;

    return <span
        className={`pill pill--${color} pill--${size}`} {...props}>
            <span className={`pill__label ${removeButton ? "pill__label--active" : ""}`}>{children}</span>
        {removeButton &&
            <Button color={color} size={size} onClick={onClose}>
                <Button.Icon><IconX color={"#999999"}/></Button.Icon>
            </Button>
        }
        </span>
}


export default Object.assign(Pill)