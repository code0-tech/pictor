import React, {CSSProperties, HTMLProps} from "react";
import {FontSizes} from "./size";
import mergeProps from "merge-props";

type StyleProp<Value> = Value;

export interface ComponentProps {
    m?: StyleProp<number | `${number}`>
    my?: StyleProp<number | `${number}`>
    mx?: StyleProp<number | `${number}`>
    mt?: StyleProp<number | `${number}`>
    mb?: StyleProp<number | `${number}`>
    ml?: StyleProp<number | `${number}`>
    mr?: StyleProp<number | `${number}`>
    p?: StyleProp<number | `${number}`>
    py?: StyleProp<number | `${number}`>
    px?: StyleProp<number | `${number}`>
    pt?: StyleProp<number | `${number}`>
    pb?: StyleProp<number | `${number}`>
    pl?: StyleProp<number | `${number}`>
    pr?: StyleProp<number | `${number}`>
    bg?: React.CSSProperties['backgroundColor']
    c?: React.CSSProperties['color']
    opacity?: React.CSSProperties['opacity']
    ff?: StyleProp<'mono' | 'text' | 'heading' | (string & {})>
    fz?: StyleProp<FontSizes | number | `${number}`>
    fw?: StyleProp<React.CSSProperties['fontWeight']>
    lts?: StyleProp<React.CSSProperties['letterSpacing']>
    ta?: StyleProp<React.CSSProperties['textAlign']>
    lh?: StyleProp<number | (string & {})>
    fs?: StyleProp<React.CSSProperties['fontStyle']>
    tt?: StyleProp<React.CSSProperties['textTransform']>
    td?: StyleProp<React.CSSProperties['textDecoration']>
    w?: StyleProp<React.CSSProperties['width']>
    miw?: StyleProp<React.CSSProperties['minWidth']>
    maw?: StyleProp<React.CSSProperties['maxWidth']>
    h?: StyleProp<React.CSSProperties['height']>
    mih?: StyleProp<React.CSSProperties['minHeight']>
    mah?: StyleProp<React.CSSProperties['maxHeight']>
    bgsz?: StyleProp<React.CSSProperties['backgroundSize']>
    bgp?: StyleProp<React.CSSProperties['backgroundPosition']>
    bgr?: StyleProp<React.CSSProperties['backgroundRepeat']>
    bga?: StyleProp<React.CSSProperties['backgroundAttachment']>
    pos?: StyleProp<React.CSSProperties['position']>
    top?: StyleProp<React.CSSProperties['top']>
    left?: StyleProp<React.CSSProperties['left']>
    bottom?: StyleProp<React.CSSProperties['bottom']>
    right?: StyleProp<React.CSSProperties['right']>
    inset?: StyleProp<React.CSSProperties['inset']>
    display?: StyleProp<React.CSSProperties['display']>
    flex?: StyleProp<React.CSSProperties['flex']>
    align?: StyleProp<React.CSSProperties['alignItems']>
    justify?: StyleProp<React.CSSProperties['justifyContent']>
    tf?: StyleProp<React.CSSProperties['transform']>
}

export type Component<T> = ComponentProps & HTMLProps<T>

const createStyle = (styles: Component<any>): CSSProperties => ({
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

export const mergeComponentProps = (cn: string, rest: object) => {

    const style = createStyle(rest)
    const newProps: ComponentProps = {...rest};
    const keys: (keyof ComponentProps)[] = ["m", "my", "mx", "mt", "mb", "ml", "mr", "p", "py", "px", "pt", "pb", "pl", "pr", "bg", "c", "opacity", "ff", "fz", "fw", "lts", "ta", "lh", "fs", "tt", "td", "w", "miw", "maw", "h", "mih", "mah", "bgsz", "bgp", "bgr", "bga", "pos", "top", "left", "bottom", "right", "inset", "display", "flex", "align", "justify", "tf"]

    keys.forEach(key => {
        delete newProps[key]
    })

    return mergeProps(newProps, {
        className: cn,
        ...(Object.keys(style).length !== 0 ? {style: style} : {})
    })
}
