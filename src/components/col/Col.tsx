import React, {HTMLProps, ReactNode} from "react";
import "./Col.style.scss"

export interface ColType extends HTMLProps<HTMLDivElement> {
    children: ReactNode | ReactNode[]
}

const Col: React.FC<ColType> = (props) => {

    const {children, ...args} = props

    return <div {...args} className={"col"}>
        {children}
    </div>
}

export default Col