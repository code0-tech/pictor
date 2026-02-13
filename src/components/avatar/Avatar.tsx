import React from "react";
import {Code0Component} from "../../utils/types";
import {md5} from 'js-md5';
import "./Avatar.style.scss"
import {mergeCode0Props} from "../../utils/utils";
import {hashToColor} from "../d-flow/DFlow.util";

interface AvatarImageProps {
    src: string
    size: number
}

interface AvatarIdenticonProps {
    identifier: string
    size: number
    color?: string
}

export interface AvatarProps extends Code0Component<HTMLDivElement> {
    identifier?: string
    src?: string
    size?: number
    color?: string
}

const AvatarImage: React.FC<AvatarImageProps> = ({src, size}) => {
    return <img src={src} width={size} height={size} alt="Avatar image"/>
}

const AvatarIdenticon: React.FC<AvatarIdenticonProps> = ({identifier, size, color}) => {
    const canvas = React.useRef<HTMLCanvasElement>(null);

    React.useEffect(() => {
        updateCanvas()
    })

    const updateCanvas = () => {
        const hash = md5(identifier)
        const block = Math.floor(size / 5)
        const hashColor = color ?? hashToColor(identifier)

        canvas.current!!.width = block * 5
        canvas.current!!.height = block * 5

        let arr = hash.split('').map((el: number | string) => {
            el = parseInt(el as string, 16);
            if (el < 8) {
                return 0;
            } else {
                return 1;
            }
        });

        let map = [];

        map[0] = map[4] = arr.slice(0, 5);
        map[1] = map[3] = arr.slice(5, 10);
        map[2] = arr.slice(10, 15);

        const ctx = canvas.current!!.getContext('2d');
        ctx!!.imageSmoothingEnabled = false;
        ctx!!.clearRect(0, 0, canvas.current!!.width, canvas.current!!.height);

        map.forEach((row, i) => {
            row.forEach((el, j) => {
                if (el) {
                    ctx!!.fillStyle = hashColor;
                    ctx!!.fillRect(
                        block * i,
                        block * j,
                        block,
                        block
                    );
                } else {
                    ctx!!.fillStyle = "transparent";
                    ctx!!.fillRect(
                        block * i,
                        block * j,
                        block,
                        block
                    );
                }
            });
        });
    };

    return <canvas ref={canvas}/>
}

export const Avatar: React.FC<AvatarProps> = (props: AvatarProps) => {

    const {identifier, color, src, size = 25, ...rest} = props

    return <div {...mergeCode0Props(`avatar ${!identifier && src ? "avatar--image" : ""}`, rest)}>
        {identifier ?
            <AvatarIdenticon color={color} identifier={identifier} size={size}/> :
            src ? <AvatarImage src={src} size={size + 13}/> : null
        }
    </div>
}