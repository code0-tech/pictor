import React from "react"
import IconCodeZeroSVG from "./codezero.svg?react"
import IconGLSSVG from "./gls.svg?react"

export type CustomIconProps = {
    size?: number | string
    color?: string
} & Omit<React.SVGProps<SVGSVGElement>, "color">

/**
 * Wraps a raw SVG (loaded via `@svgr` directly from its `.svg` file in this
 * folder) into a component that accepts the same `size` and `color` props as
 * the Tabler/Simple icons. The `fill` is applied on the root `<svg>` and
 * inherited by the paths.
 *
 * Register a new CodeZero icon by dropping its `.svg` into this folder and
 * adding a `customIcon(...)` export below. The export name (PascalCase) is the
 * name used in an {@link IconString}, e.g. `Code0` -> `codezero:code0`.
 */
const customIcon = (Svg: React.FC<React.SVGProps<SVGSVGElement>>): React.FC<CustomIconProps> =>
    function CustomIcon({size = 24, color = "currentColor", ...rest}) {
        return <Svg width={size} height={size} fill={color} {...rest}/>
    }

export const CodeZero = customIcon(IconCodeZeroSVG)
export const Gls = customIcon(IconGLSSVG)
