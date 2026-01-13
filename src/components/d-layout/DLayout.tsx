import React, {CSSProperties} from "react";
import {Code0Component, Code0Sizes} from "../../utils/types";
import {getDOMSizeFromCodeZeroSize, mergeCode0Props} from "../../utils/utils";
import {Flex} from "../flex/Flex";
import "./DLayout.style.scss"

export interface DLayoutProps extends Code0Component<HTMLDivElement> {
    children: React.ReactElement
    topContent?: React.ReactElement
    bottomContent?: React.ReactElement
    leftContent?: React.ReactElement
    rightContent?: React.ReactElement
    layoutGap?: Code0Sizes | CSSProperties['gap']
    showLayoutSplitter?: boolean
}

export const DLayout: React.FC<DLayoutProps> = (props) => {
    const {children, topContent, bottomContent, leftContent, rightContent, showLayoutSplitter = true, layoutGap = "xl", ...rest} = props

    return (
        <div {...mergeCode0Props("d-layout", rest)}>
            <Flex className="d-layout__inner" style={{ flexDirection: "column", gap: getDOMSizeFromCodeZeroSize(layoutGap)}}>
                {topContent && (
                    <div className="d-layout__top">
                        {topContent}
                    </div>
                )}

                {topContent && showLayoutSplitter && (
                    <div className="d-layout__splitter" aria-orientation={"horizontal"}/>
                )}

                <Flex className="d-layout__middle" style={{gap: getDOMSizeFromCodeZeroSize(layoutGap)}}>
                    {leftContent && (
                        <div className="d-layout__left">
                            {leftContent}
                        </div>
                    )}

                    {leftContent && showLayoutSplitter && (
                        <div className="d-layout__splitter" aria-orientation={"vertical"}/>
                    )}

                    <div className="d-layout__content">
                        {children}
                    </div>


                    {rightContent && showLayoutSplitter && (
                        <div className="d-layout__splitter" aria-orientation={"vertical"}/>
                    )}

                    {rightContent && (
                        <div className="d-layout__right">
                            {rightContent}
                        </div>
                    )}
                </Flex>

                {bottomContent && showLayoutSplitter && (
                    <div className="d-layout__splitter" aria-orientation={"horizontal"}/>
                )}

                {bottomContent && (
                    <div className="d-layout__bottom">
                        {bottomContent}
                    </div>
                )}
            </Flex>
        </div>
    )
}