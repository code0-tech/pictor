import React, {ReactElement, ReactNode} from "react";
import {IconAlertCircle, IconCircleCheck, IconCircleX, IconInfoCircle, IconX} from "@tabler/icons-react";
import "./Alert.style.scss"
import {Variant} from "../../utils/utils";

export interface AlertType {

    children?: ReactNode | ReactNode[]
    title: ReactNode
    //defaults to primary
    variant?: Variant
    //defaults to true
    icon?: boolean
    //defaults to false
    dismissible?: boolean
    onClose?: (event: React.MouseEvent<HTMLSpanElement, MouseEvent>) => void
}

const IconVariants = {
    "info": <IconInfoCircle/>,
    "primary": <IconInfoCircle/>,
    "secondary": <IconInfoCircle/>,
    "success": <IconCircleCheck/>,
    "warning": <IconAlertCircle/>,
    "error": <IconCircleX/>

}

const Alert: React.FC<AlertType> = (props) => {

    const {variant = "primary", dismissible = false, icon = true, title, onClose = (event) => {}, children} = props

    return <div className={`alert alert--${variant}`}>
        <div className={"alert__header"}>
            <div className={"alert__header-wrapper"}>
                {icon ? <AlertIcon variant={variant}/> : null}
                <span className={"alert__heading"}>{title}</span>
            </div>
            {dismissible ? <span className={"alert__dismissible"} onClick={onClose}><IconX/></span> : null}
        </div>

        {children ? <div className={"alert__content"}>
            {children}
        </div> : null}
    </div>

}

export interface AlertHeadingType {
    children: ReactNode
}

export interface AlertIconType {
    variant: Variant
}

const AlertIcon: React.FC<AlertIconType> = ({variant}) => {
    return <span className={"alert__icon"}>
        {IconVariants[variant]}
    </span>
}



export default Alert