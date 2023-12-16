import React, {ReactNode} from "react";

export const getChild = (children: ReactNode | ReactNode[], child: React.FC<any>): ReactNode | null => {
    return React.Children.toArray(children).find((childT) => {
        if (!React.isValidElement(childT)) return false;
        return childT.type == child;
    })
}

export const getContent = (children: ReactNode | ReactNode[], ...child: React.FC<any>[]): ReactNode[] | null => {

    const array = React.Children.toArray(children).filter((childT) => {
        if (!React.isValidElement(childT)) return true;
        return !child.find(value => value == childT.type);
    })

    return array.length == 0 ? null : array
}