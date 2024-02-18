import React, {AnchorHTMLAttributes, DetailedHTMLProps, MouseEventHandler} from "react"
import "./Pill.style.scss"
import {getChild} from "../../utils/utils";
import {Button} from "../../index";
import {IconX} from "@tabler/icons-react";

export interface PillType extends DetailedHTMLProps<AnchorHTMLAttributes<HTMLAnchorElement>, HTMLAnchorElement> {
    children: string,
    removeButton?: boolean,
    //defaults to primary
    color?: "primary" | "secondary" | "info" | "success" | "warning" | "error",
    //Defaults to md
    size?: "xs" | "sm" | "md" | "lg" | "xl",
}

export interface PillContentType {
    children: string,
}

const Pill: React.FC<PillType> = (props) => {
    const {children, removeButton = false, onClick, color = "primary", size = "md"} = props;

    return <span
        className={`pill pill--${color} pill--${size}`}
        id={"pill-root"}>
            <span id={`pill__label`} className={`pill__label ${removeButton ? "pill__label--active" : ""}`}>{children}</span>
        {removeButton &&
            <Button variant={color} size={size} onClick={onClick}>
                <Button.Icon><IconX color={"#999999"}/></Button.Icon>
            </Button>
        }
        </span>

}


export default Object.assign(Pill)