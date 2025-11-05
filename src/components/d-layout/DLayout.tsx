import React from "react";
import {Code0Component} from "../../utils/types";
import {mergeCode0Props} from "../../utils/utils";
import {Flex} from "../flex/Flex";
import "./DLayout.style.scss"

export interface DLayoutProps extends Code0Component<HTMLDivElement> {
    children: React.ReactElement
    topContent?: React.ReactElement
    bottomContent?: React.ReactElement
    leftContent?: React.ReactElement
    rightContent?: React.ReactElement
}

export const DLayout: React.FC<DLayoutProps> = (props) => {

    const {children, topContent, bottomContent, leftContent, rightContent, ...rest} = props

    return <div {...mergeCode0Props("d-layout", rest)}>
        <Flex style={{flexDirection: "column"}}>
            {topContent ? (
                <div className={"d-layout__top"}>
                    {topContent}
                </div>
            ) : null}
            <Flex>
                {leftContent ? (
                    <div className={"d-layout__left"}>
                        {leftContent}
                    </div>
                ) : null}
                <div className={"d-layout__content"}>
                    {children}
                </div>
                {rightContent ? (
                    <div className={"d-layout__right"}>
                        {rightContent}
                    </div>
                ) : null}
            </Flex>
            {bottomContent ? (
                <div className={"d-layout__bottom"}>
                    {bottomContent}
                </div>
            ) : null}
        </Flex>
    </div>

}