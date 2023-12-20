import React, {DetailedHTMLProps, ImgHTMLAttributes} from "react";
import "./Card.style.scss"

export interface CardImgStyle extends DetailedHTMLProps<ImgHTMLAttributes<HTMLImageElement>, HTMLImageElement> {
  //empty
}

/**
 * Image component for cards. Image will be shown without padding to card
 * and with the desired high.
 *
 * @author Nico Sammito
 * @since 0.1.0
 */
export const CardImg: React.FC<CardImgStyle> = (props) => {

    const {...args} = props

    return <img {...args} className={"card__img"}/>
}