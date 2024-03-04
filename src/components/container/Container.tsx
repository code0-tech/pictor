import React, {HTMLProps, ReactNode} from "react";
import "./Container.style.scss"

export interface ContainerType extends HTMLProps<HTMLDivElement> {
    children: ReactNode | ReactNode[]
}

const Container: React.FC<ContainerType> = (props) => {

    const {children, ...args} = props

    return <div {...args} className={"container"}>
        {children}
    </div>
}

export default Container