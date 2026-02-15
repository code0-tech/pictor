import {CSSProperties} from "react";
import mergeProps from "merge-props";
import {Code0Component, Code0ComponentProps, Code0Sizes} from "./types";
import {md5} from "js-md5";

const createStyle = (styles: Code0Component<any>): CSSProperties => ({
    ...(styles.m ? {margin: `${styles.m}rem`} : {}),
    ...(styles.my ? {marginTop: `${styles.my}rem`, marginBottom: `${styles.my}rem`} : {}),
    ...(styles.mx ? {marginLeft: `${styles.mx}rem`, marginRight: `${styles.mx}rem`} : {}),
    ...(styles.mt ? {marginTop: `${styles.mt}rem`} : {}),
    ...(styles.mb ? {marginBottom: `${styles.mb}rem`} : {}),
    ...(styles.ml ? {marginLeft: `${styles.ml}rem`} : {}),
    ...(styles.mr ? {marginRight: `${styles.mr}rem`} : {}),
    ...(styles.p ? {padding: `${styles.p}rem`} : {}),
    ...(styles.py ? {paddingTop: `${styles.py}rem`, paddingBottom: `${styles.py}rem`} : {}),
    ...(styles.px ? {paddingLeft: `${styles.px}rem`, paddingRight: `${styles.px}rem`} : {}),
    ...(styles.pt ? {paddingTop: `${styles.pt}rem`} : {}),
    ...(styles.pb ? {paddingBottom: `${styles.pb}rem`} : {}),
    ...(styles.pl ? {paddingLeft: `${styles.pl}rem`} : {}),
    ...(styles.pr ? {paddingRight: `${styles.pr}rem`} : {}),
    ...(styles.bg ? {backgroundColor: styles.bg} : {}),
    ...(styles.c ? {color: styles.c} : {}),
    ...(styles.opacity ? {opacity: styles.opacity} : {}),
    ...(styles.ff ? {fontFamily: styles.ff} : {}),
    ...(styles.fz ? {fontSize: `${styles.fz}rem`} : {}),
    ...(styles.ta ? {textAlign: styles.ta} : {}),
    ...(styles.w ? {width: styles.w} : {}),
    ...(styles.miw ? {minWidth: styles.miw} : {}),
    ...(styles.maw ? {maxWidth: styles.maw} : {}),
    ...(styles.h ? {height: styles.h} : {}),
    ...(styles.mih ? {minHeight: styles.mih} : {}),
    ...(styles.mah ? {maxHeight: styles.mah} : {}),
    ...(styles.pos ? {position: styles.pos} : {}),
    ...(styles.top ? {top: styles.top} : {}),
    ...(styles.left ? {left: styles.left} : {}),
    ...(styles.bottom ? {bottom: styles.bottom} : {}),
    ...(styles.right ? {right: styles.right} : {}),
    ...(styles.display ? {display: styles.display} : {}),
    ...(styles.flex ? {flex: styles.flex} : {}),
    ...(styles.align ? {alignItems: styles.align} : {}),
    ...(styles.justify ? {justifyContent: styles.justify} : {}),
    ...(styles.tf ? {transform: styles.tf} : {}),

})

export const mergeCode0Props = (cn: string, rest: object) => {

    const style = createStyle(rest)
    const newProps: Code0ComponentProps = {...rest};
    const keys: (keyof Code0ComponentProps)[] = ["m", "my", "mx", "mt", "mb", "ml", "mr", "p", "py", "px", "pt", "pb", "pl", "pr", "bg", "c", "opacity", "ff", "fz", "fw", "lts", "ta", "lh", "fs", "tt", "td", "w", "miw", "maw", "h", "mih", "mah", "bgsz", "bgp", "bgr", "bga", "pos", "top", "left", "bottom", "right", "inset", "display", "flex", "align", "justify", "tf"]

    keys.forEach(key => {
        delete newProps[key]
    })

    return mergeProps(newProps, {
        className: cn,
        ...(Object.keys(style).length !== 0 ? {style: style} : {})
    })
}

export const getDOMSizeFromCodeZeroSize = (size: Code0Sizes | CSSProperties['x']): CSSProperties['x'] => {
    switch (size) {
        case "xxs":
            return "0.35rem"
        case "xs":
            return "0.7rem"
        case "sm":
            return "0.8rem"
        case "md":
            return "1rem"
        case "lg":
            return "1.2rem"
        case "xl":
            return "1.3rem"
        default:
            return size
    }
}

const GOLDEN_ANGLE = 137.50776405003785

const extractIdNumber = (s: string) => {
    const m = s.match(/\/(\d+)\s*$/)
    return m ? Number(m[1]) : null
}

export const hashToColor = (s: string, from: number = 25, to: number = 320): string => {
    const range = to - from;
    const n = extractIdNumber(s);
    if (n != null) {
        const hue = from + ((n * GOLDEN_ANGLE) % range);
        return `hsl(${hue}, 100%, 72%)`;
    }

    const h = md5(md5(s));
    const a = parseInt(h.slice(0, 8), 16);
    return `hsl(${from + (a % range)}, 100%, 72%)`;
}