import React from "react";
import {ReactNode} from "react";
import "./Navigation.style.scss"
export interface NavigationType {
    children: ReactNode | ReactNode[],
}

const Navigation: React.FC<NavigationType> = (props) => {
    return (
        <a className={"navigation"}>
            {props.children}
        </a>
    )
}

export default Navigation;