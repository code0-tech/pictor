import "./Navigation.style.scss"
import {ReactNode} from "react";
import React from "react";
import "./Navigation.style.scss"

export interface NavigationItemType {
    children: ReactNode,
    url: string
}

const NavigationItem: React.FC<NavigationItemType> = (props) => {
    return (
        <a className={"navigation--item"} href={props.url}>
            {props.children}
        </a>
    )
}

export default NavigationItem;