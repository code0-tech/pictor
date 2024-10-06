import React from "react";
import {mergeCode0Props} from "../../utils/utils";
import Button, {ButtonProps} from "../button/Button";

export type DScreenButtonProps = ButtonProps

const DScreenButton: React.FC<DScreenButtonProps> = (props) => {
    const {children, active, color = "secondary", ...rest} = props

    return <Button color={color} {...mergeCode0Props(`d-screen__button ${active ? "d-screen__button-active" : ""}`, rest)}>
        {children}
    </Button>
}

export default DScreenButton as React.FC<DScreenButtonProps>