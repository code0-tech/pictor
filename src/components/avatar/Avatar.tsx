import React from "react";
import {Code0Component} from "../../utils/types";
import "./Avatar.style.scss"
import {mergeCode0Props} from "../../utils/utils";
import Identicon from "avvvatars-react"
import {hashToColor} from "../d-flow/DFlow.util";

interface AvatarImageProps {
    src: string
    size: number
}

interface AvatarIdenticonProps {
    identifier: string
    size: number
    color?: string
    type?: 'character' | 'shape'
}

export interface AvatarProps extends Code0Component<HTMLDivElement> {
    identifier?: string
    src?: string
    size?: number
    color?: string
    type?: 'character' | 'shape'
}

const AvatarImage: React.FC<AvatarImageProps> = ({src, size}) => {
    return <img src={src} width={size} height={size} alt="Avatar image"/>
}

const AvatarIdenticon: React.FC<AvatarIdenticonProps> = ({identifier, size, color, type}) => {

    return <div style={{"--color": color ?? hashToColor(identifier)} as React.CSSProperties}>
        <Identicon style={type ?? "shape"} value={identifier} size={size}/>
    </div>

}

export const Avatar: React.FC<AvatarProps> = (props: AvatarProps) => {

    const {identifier, color, src, size = 32, type, ...rest} = props

    return <div {...mergeCode0Props(`avatar ${!identifier && src ? "avatar--image" : "avatar--identicon"}`, rest)}>
        {identifier ?
            <AvatarIdenticon type={type} color={color} identifier={identifier} size={size}/> :
            src ? <AvatarImage src={src} size={size}/> : null
        }
    </div>
}