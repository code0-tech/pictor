import React from "react";
import * as TablerIcons from "@tabler/icons-react";
import * as SimpleIcons from "@icons-pack/react-simple-icons";
import * as CodeZeroIcons from "./codezero";
import {Component, mergeComponentProps} from "../../utils";
import "./Icon.style.scss"

/**
 * The common shape every resolved icon component is rendered with. All three
 * sources (Tabler, Simple Icons, CodeZero) accept `size`/`color`; `stroke` is
 * only honoured by Tabler icons and ignored by the others.
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
 *
 * Names are normalized, so `tabler:arrow-left`, `arrow-left`, `ArrowLeft` and
 * `IconArrowLeft` all resolve to the same icon.
 */
export type IconString =
    | `tabler:${string}`
    | `simple:${string}`
    | `codezero:${string}`
    | (string & {})

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

    const {icon, size = 24, color = "currentColor", stroke, ...rest} = props

    const IconComponent = resolveIcon(icon)

    return <IconComponent
        size={size}
        color={color}
        stroke={stroke}
        {...mergeComponentProps("icon", rest)}
    />
}
