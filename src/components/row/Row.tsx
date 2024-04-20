import React, {HTMLProps, ReactNode} from "react";
import "./Row.style.scss"

export interface RowType extends HTMLProps<HTMLDivElement> {
    children: ReactNode | ReactNode[]
}

const Row: React.FC<RowType> = (props) => {

    const {children, ...args} = props

    return <div {...args} className={"row"}>
        {children}
    </div>
}

export default Row