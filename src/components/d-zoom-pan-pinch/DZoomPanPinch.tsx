"use client"

import React from "react";
import {TransformComponent, TransformWrapper} from "react-zoom-pan-pinch";
import ButtonGroup from "../button-group/ButtonGroup";
import Button from "../button/Button";
import {IconFocusCentered, IconMinus, IconPlus} from "@tabler/icons-react";
import "./DZoomPanPinch.style.scss"
import Flex from "../flex/Flex";
import Badge from "../badge/Badge";

export interface DZoomPanPinchProps {

    children: React.ReactNode

}


const DZoomPanPinch: React.FC<DZoomPanPinchProps> = (props) => {

    const {children} = props
    const [scale, setScale] = React.useState<number>(100)

    const memorizedChildren = React.useMemo(() => children, [])
    const memorizedScale = React.useMemo(() => {
        return <>{scale}%</>
    }, [scale])

    return <TransformWrapper minScale={0.5} maxScale={4} initialScale={1} onTransformed={(ref, state) => {
        setScale(() => Math.trunc(state.scale * 100))
    }}>
        {({zoomIn, zoomOut, resetTransform}) => (
            <>
                <div style={{position: "absolute", zIndex: 1, bottom: ".7rem", left: ".7rem"}}>
                    <Flex align="stretch" style={{gap: ".35rem"}}>
                        <ButtonGroup>
                            <Button color={"secondary"} onClick={() => zoomIn(1)}><IconPlus size={15}/></Button>
                            <Button color={"secondary"} onClick={() => zoomOut(1)}><IconMinus size={15}/></Button>
                            <Button color={"secondary"} onClick={() => resetTransform()}><IconFocusCentered size={15}/></Button>
                        </ButtonGroup>
                        <Badge color={"secondary"}>{memorizedScale}</Badge>
                    </Flex>
                </div>
                <TransformComponent wrapperClass={"d-zoom-pan-pinch"}>
                    {memorizedChildren}
                </TransformComponent>
            </>
        )}
    </TransformWrapper>
}

export default DZoomPanPinch