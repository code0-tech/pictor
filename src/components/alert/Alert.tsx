import React, {ReactNode} from "react";
import {IconAlertCircle, IconCircleCheck, IconCircleX, IconInfoCircle, IconX} from "@tabler/icons-react";
import "./Alert.style.scss"
import {Code0Component, Color} from "../../utils/types";
import {mergeCode0Props} from "../../utils/utils";

export interface AlertType extends Omit<Code0Component<HTMLDivElement>, "title"> {

    children?: ReactNode | ReactNode[]
    title: ReactNode
    //defaults to primary
    color?: Color
    //defaults to true
    icon?: boolean
    //defaults to false
    dismissible?: boolean
    onClose?: (event: React.MouseEvent<HTMLSpanElement, MouseEvent>) => void
}

const IconColors = {
    "info": <IconInfoCircle/>,
    "primary": <IconInfoCircle/>,
    "secondary": <IconInfoCircle/>,
    "success": <IconCircleCheck/>,
    "warning": <IconAlertCircle/>,
    "error": <IconCircleX/>

}

const Alert: React.FC<AlertType> = (props) => {

    const {color = "primary", dismissible = false, icon = true, title, onClose = (event) => {}, children, ...rest} = props

    return <div {...mergeCode0Props(`alert alert--${color}`, rest)}>
        <div className={"alert__header"}>
            <div className={"alert__header-wrapper"}>
                {icon ? <AlertIcon color={color}/> : null}
                <span className={"alert__heading"}>{title}</span>
            </div>
            {dismissible ? <span className={"alert__dismissible"} onClick={onClose}><IconX/></span> : null}
        </div>

        {children ? <div className={"alert__content"}>
            {children}
        </div> : null}
    </div>

}

export interface AlertIconType {
    color: Color
}

const AlertIcon: React.FC<AlertIconType> = ({color}) => {
    return <span className={"alert__icon"}>
        {IconColors[color]}
    </span>
}


export default Alert