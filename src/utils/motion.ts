import React from "react";
import {TargetAndTransition, Transition, useReducedMotion} from "motion/react";

/**
 * Apple describes springs with two designer facing parameters instead of the
 * physics triplet: damping (how much it overshoots, 1 = no bounce) and response
 * (how quickly the value reaches its target, in seconds). Motion's spring takes
 * bounce + duration, which maps onto those directly.
 */
export const spring = (damping: number, response: number): Transition => ({
    type: "spring",
    bounce: Math.max(0, 1 - damping),
    duration: response
})

export const springs = {
    //critically damped - the default for anything that just appears on screen
    ui: spring(1, 0.3),
    //larger surfaces carry more visual weight, so they settle a little slower
    surface: spring(1, 0.4),
    //only for motion a gesture handed off to (flick, throw, drag release)
    momentum: spring(0.8, 0.4),
    //drawers and sheets
    sheet: spring(0.8, 0.3)
} satisfies Record<string, Transition>

/**
 * Reduced motion does not mean no feedback - it means a short, non vestibular
 * cross fade instead of a spring.
 */
export const crossFade: Transition = {duration: 0.15, ease: "easeOut"}

export const useReducedMotionSafe = (): boolean => useReducedMotion() ?? false

export interface PresenceMotion {
    initial: TargetAndTransition
    animate: TargetAndTransition
    exit: TargetAndTransition
    transition: Transition
}

/**
 * Enter and exit share one path (a surface leaves the way it arrived) and the
 * surface materialises - blur and scale animate together - so it reads as a
 * real material arriving instead of a plain opacity fade.
 */
const materialize = (scale: number, blur: number, transition: Transition): PresenceMotion => ({
    initial: {opacity: 0, scale, filter: `blur(${blur}px)`},
    animate: {opacity: 1, scale: 1, filter: "blur(0px)"},
    exit: {opacity: 0, scale, filter: `blur(${blur}px)`},
    transition
})

const fade: PresenceMotion = {
    initial: {opacity: 0},
    animate: {opacity: 1},
    exit: {opacity: 0},
    transition: crossFade
}

/**
 * Motion for popper surfaces (menus, tooltips, selects). Pair it with
 * {@link popperTransformOrigin} so the surface grows out of its trigger rather
 * than out of its own centre.
 */
export const usePopperMotion = (): PresenceMotion => {
    const reduced = useReducedMotionSafe()
    return reduced ? fade : materialize(0.96, 4, springs.ui)
}

/** Motion for modal surfaces, which are bigger and therefore settle slower. */
export const useSurfaceMotion = (): PresenceMotion => {
    const reduced = useReducedMotionSafe()
    return reduced ? fade : materialize(0.97, 6, springs.surface)
}

/** Motion for the scrim behind a modal surface: dim and blur to focus. */
export const useScrimMotion = (blur = 6): PresenceMotion => {
    const reduced = useReducedMotionSafe()

    if (reduced) return fade

    return {
        initial: {opacity: 0, backdropFilter: "blur(0px)"},
        animate: {opacity: 1, backdropFilter: `blur(${blur}px)`},
        exit: {opacity: 0, backdropFilter: "blur(0px)"},
        transition: springs.surface
    }
}

/**
 * Radix exposes the anchor it computed as a custom property on the popper
 * wrapper. Custom properties inherit, so the content element can use it to
 * scale out of the element that opened it.
 */
export const popperTransformOrigin = (name: string): React.CSSProperties => ({
    transformOrigin: `var(--radix-${name}-content-transform-origin, center)`
})

/**
 * Keeps track of an overlay's open state without taking control of it away
 * from the consumer: a passed `open` prop always wins, an uncontrolled overlay
 * is observed through `onOpenChange`.
 */
export const useObservedOpen = (
    open: boolean | undefined,
    defaultOpen: boolean | undefined,
    onOpenChange: ((open: boolean) => void) | undefined
): [boolean, (open: boolean) => void] => {

    const [observed, setObserved] = React.useState(open ?? defaultOpen ?? false)

    const handleOpenChange = React.useCallback((next: boolean) => {
        setObserved(next)
        onOpenChange?.(next)
    }, [onOpenChange])

    return [open ?? observed, handleOpenChange]
}

/**
 * The same idea as {@link useObservedOpen} for the single selected value of a
 * tab list or a segmented control, which a sliding indicator has to know about
 * one level above the items.
 */
export const useObservedValue = (
    value: string | undefined,
    defaultValue: string | undefined,
    onValueChange: ((value: string) => void) | undefined
): [string | undefined, (value: string) => void] => {

    const [observed, setObserved] = React.useState(value ?? defaultValue)

    const handleValueChange = React.useCallback((next: string) => {
        setObserved(next)
        onValueChange?.(next)
    }, [onValueChange])

    return [value ?? observed, handleValueChange]
}
