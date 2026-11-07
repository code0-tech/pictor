import React from "react";
import * as TablerIcons from "@tabler/icons-react";
import * as SimpleIcons from "@icons-pack/react-simple-icons";
import * as TheSvgIcons from "@thesvg/react";
import * as CodeZeroIcons from "./codezero";
import {Component, mergeComponentProps} from "../../utils";
import "./Icon.style.scss"

/**
 * The common shape every resolved icon component is rendered with. All four
 * sources (Tabler, Simple Icons, CodeZero, theSVG) accept `size`/`color`;
 * `stroke` is only honoured by Tabler icons and ignored by the others.
 */
export type IconComponent = React.FC<{
    size?: number | string
    color?: string
    stroke?: number | string
    className?: string
    style?: React.CSSProperties
} & Record<string, unknown>>

/**
 * A string reference to an icon, optionally prefixed with its source:
 *  - `tabler:<name>` (default when no prefix is given) e.g. `tabler:arrow-left`
 *  - `simple:<name>` e.g. `simple:github`
 *  - `codezero:<name>` e.g. `codezero:code0`
 *  - `thesvg:<name>` e.g. `thesvg:github`, optionally with a variant suffix
 *    e.g. `thesvg:github/mono`
 *
 * Names are normalized, so `tabler:arrow-left`, `arrow-left`, `ArrowLeft` and
 * `IconArrowLeft` all resolve to the same icon.
 */
export type IconString =
    | `tabler:${string}`
    | `simple:${string}`
    | `codezero:${string}`
    | `thesvg:${string}`
    | (string & {})

/**
 * theSVG icons are plain `SVGProps` components: they size themselves via
 * `width`/`height` and carry their own brand colors, and many of them ship
 * additional `variant`s (`mono`, `wordmark`, ...). This adapts one to the
 * common {@link IconComponent} shape, where `size` sets both dimensions and
 * `stroke` is ignored.
 *
 * `color` sets the root `fill`, which - as everywhere in SVG - only reaches
 * the parts of the mark that do not paint their own color. Brand marks mostly
 * do, so they keep their brand colors by design; to render one in a single
 * color of your own, pick its `mono` variant (`thesvg:github/mono`). Forcing
 * the color onto every path instead is not an option: it would flatten a
 * multi-colored mark into an unreadable silhouette.
 *
 * Adapted components are cached per name/variant so repeated renders keep the
 * same component identity instead of remounting the icon.
 */
const theSvgIconCache = new Map<string, IconComponent>()

const theSvgIcon = (name: string, variant?: string): IconComponent => {
    const cacheKey = variant ? `${name}/${variant}` : name
    const cached = theSvgIconCache.get(cacheKey)

    if (cached) return cached

    // Variants are typed as a per-icon union upstream; widened to `string` here
    // because the icon is only known by name at runtime.
    const Svg = TheSvgIcons[name as keyof typeof TheSvgIcons] as unknown as
        React.FC<React.SVGProps<SVGSVGElement> & { variant?: string }>

    const adapted: IconComponent = function TheSvgIcon({size = 24, color, stroke: _stroke, ...rest}) {
        return <Svg
            width={size}
            height={size}
            {...(variant ? {variant} : {})}
            {...(color ? {fill: color} : {})}
            {...rest}
        />
    }

    theSvgIconCache.set(cacheKey, adapted)

    return adapted
}

/**
 * Resolves an {@link IconString} to its matching icon component from one of the
 * registered sources. Falls back to Tabler's `IconNote` when no icon matches.
 */
export const resolveIcon = (icon?: IconString): IconComponent => {
    const fallbackIcon = TablerIcons.IconNote

    if (icon?.startsWith("codezero:")) {
        const name = icon.replace("codezero:", "").trim().toLowerCase()

        // CodeZero icons are registered with free-form PascalCase names
        // (e.g. `CodeZero`, `GLS`), so match case-insensitively on the export key.
        const resolvedKey = (Object.keys(CodeZeroIcons) as (keyof typeof CodeZeroIcons)[])
            .find((key) => key.toLowerCase() === name)

        const resolvedIcon = resolvedKey ? CodeZeroIcons[resolvedKey] : fallbackIcon

        return resolvedIcon as unknown as IconComponent
    }

    if (icon?.startsWith("thesvg:")) {
        // `thesvg:<slug>` or `thesvg:<slug>/<variant>`, e.g. `thesvg:github/mono`.
        const [name, variant] = icon.replace("thesvg:", "").trim().split("/")

        // theSVG exports one PascalCase component per slug (`visual-studio-code`
        // -> `VisualStudioCode`), prefixed with `I` when the slug starts with a
        // digit (`1password` -> `I1password`).
        const pascalCaseName = name
            .split(/[\s_-]+/)
            .filter(Boolean)
            .map((segment) => segment.charAt(0).toUpperCase() + segment.slice(1))
            .join("")
        const normalizedName = /^[0-9]/.test(pascalCaseName) ? `I${pascalCaseName}` : pascalCaseName

        return normalizedName in TheSvgIcons
            ? theSvgIcon(normalizedName, variant)
            : fallbackIcon as unknown as IconComponent
    }

    if (icon?.startsWith("simple:")) {
        const name = icon.replace("simple:", "").trim()
        const normalizedName = `Si${name.charAt(0).toUpperCase() + name.slice(1)}`

        const resolvedIcon = normalizedName in SimpleIcons
            ? SimpleIcons[normalizedName as keyof typeof SimpleIcons]
            : fallbackIcon

        return resolvedIcon as unknown as IconComponent
    }

    const normalizedIconName = `Icon${(icon?.replace("tabler:", "") ?? "Note")
        .trim()
        .replace(/^icon/i, "")
        .split(/[\s_-]+/)
        .filter(Boolean)
        .map((segment) => segment.charAt(0).toUpperCase() + segment.slice(1))
        .join("")}`

    const resolvedIcon = normalizedIconName in TablerIcons
        ? TablerIcons[normalizedIconName as keyof typeof TablerIcons]
        : fallbackIcon

    return resolvedIcon as unknown as IconComponent
}

export interface IconProps extends Omit<Component<SVGSVGElement>, "size"> {
    icon: IconString
    size?: number | string
    color?: string
    stroke?: number | string
}

export const Icon: React.FC<IconProps> = (props) => {

    // `color` is intentionally left undefined when unset: every source defaults
    // it to `currentColor` on its own, and theSVG's brand marks need to tell an
    // explicitly requested color apart from no color at all.
    const {icon, size = 24, color, stroke, ...rest} = props

    const IconComponent = resolveIcon(icon)

    return <IconComponent
        size={size}
        color={color}
        stroke={stroke}
        {...mergeComponentProps("icon", rest)}
    />
}
