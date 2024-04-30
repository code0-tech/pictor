import React, {HTMLProps} from "react";

export type Color = "primary" | "secondary" | "info" | "success" | "warning" | "error";

export const Colors: Color[] = ["primary", "secondary", "info", "success", "warning", "error"]

export type Code0Sizes = "xs" | "sm" | "md" | "lg" | "xl";

export type Code0FontSizes = "0.75" | "0.8" | "1" | "1.2" | "1.25"

export type StyleProp<Value> = Value;

export interface Code0ComponentProps {
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
    bg?: React.CSSProperties['backgroundColor'];
    c?: React.CSSProperties['color'];
    opacity?: React.CSSProperties['opacity'];
    ff?: StyleProp<'mono' | 'text' | 'heading' | (string & {})>;
    fz?: StyleProp<Code0FontSizes | number | `${number}`>;
    fw?: StyleProp<React.CSSProperties['fontWeight']>;
    lts?: StyleProp<React.CSSProperties['letterSpacing']>;
    ta?: StyleProp<React.CSSProperties['textAlign']>;
    lh?: StyleProp<number | (string & {})>;
    fs?: StyleProp<React.CSSProperties['fontStyle']>;
    tt?: StyleProp<React.CSSProperties['textTransform']>;
    td?: StyleProp<React.CSSProperties['textDecoration']>;
    w?: StyleProp<React.CSSProperties['width']>;
    miw?: StyleProp<React.CSSProperties['minWidth']>;
    maw?: StyleProp<React.CSSProperties['maxWidth']>;
    h?: StyleProp<React.CSSProperties['height']>;
    mih?: StyleProp<React.CSSProperties['minHeight']>;
    mah?: StyleProp<React.CSSProperties['maxHeight']>;
    bgsz?: StyleProp<React.CSSProperties['backgroundSize']>;
    bgp?: StyleProp<React.CSSProperties['backgroundPosition']>;
    bgr?: StyleProp<React.CSSProperties['backgroundRepeat']>;
    bga?: StyleProp<React.CSSProperties['backgroundAttachment']>;
    pos?: StyleProp<React.CSSProperties['position']>;
    top?: StyleProp<React.CSSProperties['top']>;
    left?: StyleProp<React.CSSProperties['left']>;
    bottom?: StyleProp<React.CSSProperties['bottom']>;
    right?: StyleProp<React.CSSProperties['right']>;
    inset?: StyleProp<React.CSSProperties['inset']>;
    display?: StyleProp<React.CSSProperties['display']>;
    flex?: StyleProp<React.CSSProperties['flex']>;
}

export interface Code0Component<T> extends Code0ComponentProps, HTMLProps<T> {
}
