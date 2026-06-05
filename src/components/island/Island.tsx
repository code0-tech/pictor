import {Component, mergeComponentProps} from "../../utils"
import React, {useCallback, useEffect, useRef, useState} from "react"
import {motion} from "motion/react"
import "./Island.style.scss"
import {Flex} from "../flex/Flex"
import {useIsland} from "./Island.hook";

export interface IslandProps extends Component<HTMLDivElement> {
    children?: React.ReactNode
}

export const Island: React.FC<IslandProps> = (props) => {

    const {children, ...rest} = props

    const toasts = useIsland(state => state.toasts)
    const removeToast = useIsland(state => state.removeToast)

    const timeoutIdRef = useRef<NodeJS.Timeout | null>(null)
    const startTimeRef = useRef<number>(0)
    const remainingTimeRef = useRef<number>(4000)
    const [isHovered, setIsHovered] = useState(false)
    const containerRef = useRef<HTMLDivElement | null>(null)

    const firstIsland = toasts.length > 0
        ? toasts.reduce((highest, current) =>
            ((current.index ?? 0) > (highest.index ?? 0)) ? current : highest
        )
        : undefined

    const stopTimer = useCallback(() => {
        if (timeoutIdRef.current) {
            clearTimeout(timeoutIdRef.current)
            timeoutIdRef.current = null
        }
    }, [])

    const startTimer = useCallback(() => {
        const toastId = firstIsland?.id
        if (!toastId) return

        stopTimer()
        startTimeRef.current = Date.now()

        if (isFinite(remainingTimeRef.current)) {
            timeoutIdRef.current = setTimeout(() => {
                removeToast(toastId)
            }, remainingTimeRef.current)
        }
    }, [firstIsland?.id, removeToast, stopTimer])

    useEffect(() => {
        if (firstIsland?.id) {
            remainingTimeRef.current = firstIsland?.duration ?? 4000
            startTimer()
        } else {
            stopTimer()
            setIsHovered(false)
        }
        return () => stopTimer()
    }, [firstIsland?.id, firstIsland?.duration, startTimer, stopTimer])

    const handleMouseEnter = () => {
        if (!firstIsland?.id) return

        stopTimer()
        const elapsedTime = Date.now() - startTimeRef.current
        remainingTimeRef.current = Math.max(0, remainingTimeRef.current - elapsedTime)

        if (!!firstIsland?.content) {
            setIsHovered(true)
        }
    }

    const handleMouseLeave = () => {
        setIsHovered(false)
        if (!firstIsland?.id) return

        if (remainingTimeRef.current > 0) {
            startTimer()
        }
    }

    return (
        <motion.div
            layout
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            transition={{
                type: "spring",
                stiffness: 300,
                damping: 20,
                mass: 0.8
            }}
            {...mergeComponentProps(`island`, rest)}
        >

            <Flex align={"center"} style={{gap: "0.35rem"}} ref={containerRef} key={firstIsland?.id}>
                {firstIsland && (
                    <motion.div
                        key={firstIsland?.id}
                        layout
                        initial={{y: 0, opacity: 1, strokeDashoffset: "300%"}}
                        animate={{y: 0, opacity: 1, strokeDashoffset: "0%"}}
                        transition={{duration: 0.75, ease: "easeInOut"}}
                        className={"island__icon"}
                    >
                        {firstIsland.icon}
                    </motion.div>
                )}
                <motion.div layout>
                    {children}
                </motion.div>

                {firstIsland?.message && <motion.div layout className={"island__message"}>
                    {firstIsland?.message}
                </motion.div>}
            </Flex>

            <div style={{
                maxWidth: `${containerRef.current?.offsetWidth}px`,
            }}>

                {isHovered && !!firstIsland?.content && <motion.div
                    initial={{y: 10, opacity: 0}}
                    animate={{
                        y: isHovered && !!firstIsland?.content ? 0 : 100,
                        opacity: isHovered && !!firstIsland?.content ? 1 : 0
                    }}
                    transition={{duration: 0.25, ease: "easeInOut"}}
                    className={"island__content"}
                >
                    {firstIsland?.content}
                </motion.div>}
            </div>

        </motion.div>
    )
}