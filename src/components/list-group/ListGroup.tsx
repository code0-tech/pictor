import React, {ReactElement, ReactNode} from "react";
import "./ListGroup.style.scss"

export interface ListGroupType {
    children: ReactElement<ListGroupItemType> | ReactElement<ListGroupItemType>[]
}

export interface ListGroupItemType {
    children: ReactNode
}

const ListGroup: React.FC<ListGroupType> = (props) => {

    const {children, ...args} = props

    return <div className={"list-group"}>
        {children}
    </div>
}

const ListGroupItem: React.FC<ListGroupItemType> = (props) => {

    const {children, ...args} = props

    return <div {...args} className={"list-group__item"}>
        {children}
    </div>
}

export default Object.assign(ListGroup, {
    Item: ListGroupItem
})

