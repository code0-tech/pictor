import {Component, mergeComponentProps} from "../../utils";
import React, {useCallback, useEffect, useRef, useState} from "react";
import {create} from 'zustand'
import {motion} from "motion/react"
import "./Island.style.scss"
import {Flex} from "../flex/Flex";

export interface IslandProps extends Component<HTMLDivElement> {
    children?: React.ReactNode
}

export interface IslandToast {
    id?: number
    icon: React.ReactNode
    message: React.ReactNode
    largeContent?: React.ReactNode
}

export const Island: React.FC<IslandProps> = (props) => {
    const {children, ...rest} = props

    const firstIsland = useIsland(useCallback(state => state.toasts[0], []));
    const removeToast = useIsland(useCallback(state => state.removeToast, []));

    const [isHovered, setIsHovered] = useState(false);
    const hasLargeContent = !!firstIsland?.largeContent;
    const isExpanded = isHovered && hasLargeContent;


    const timeoutIdRef = useRef<NodeJS.Timeout | null>(null);
    const startTimeRef = useRef<number>(0);
    const remainingTimeRef = useRef<number>(4000);

    const currentIdRef = useRef<number | undefined>(undefined);
    currentIdRef.current = firstIsland?.id;

    const stopTimer = useCallback(() => {
        if (timeoutIdRef.current) {
            clearTimeout(timeoutIdRef.current);
            timeoutIdRef.current = null;
        }
    }, []);

    const startTimer = useCallback(() => {
        const toastId = currentIdRef.current;
        if (!toastId) return;

        stopTimer();
        startTimeRef.current = Date.now();

        timeoutIdRef.current = setTimeout(() => {
            removeToast(toastId);
        }, remainingTimeRef.current);
    }, [removeToast, stopTimer]);

    // Triggert den Timer UND die Icon-Zeichenanimation bei neuem Toast
    useEffect(() => {
        if (firstIsland?.id) {
            remainingTimeRef.current = 4000;
            startTimer();
        } else {
            stopTimer();
            setIsHovered(false);
        }
        return () => stopTimer();
    }, [firstIsland?.id, startTimer, stopTimer]);

    const handleMouseEnter = () => {
        if (!firstIsland?.id) return;

        stopTimer();
        const elapsedTime = Date.now() - startTimeRef.current;
        remainingTimeRef.current = Math.max(0, remainingTimeRef.current - elapsedTime);

        if (hasLargeContent) {
            setIsHovered(true);
        }
    };

    const handleMouseLeave = () => {
        setIsHovered(false);
        if (!firstIsland?.id) return;

        if (remainingTimeRef.current > 0) {
            startTimer();
        }
    };

    return (
        <motion.div
            layout
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            transition={{
                type: "spring",
                stiffness: 300,
                damping: 17.5,
                mass: 0.7
            }}
            {...mergeComponentProps(`island`, {
                ...rest,
                style: {
                    overflow: "hidden",
                    // Hier verankern wir die Mindestmaße der Box, wie gewünscht
                    minWidth: "max-content",
                    minHeight: "max-content",
                    ...rest.style
                }
            })}
        >

            <div>
                {/* --- STANDARD CONTENT --- */}

                <Flex align={"center"} style={{gap: "0.35rem"}} key={firstIsland?.id}>
                    {firstIsland && (
                        <motion.div
                            key={firstIsland?.id}
                            layout
                            initial={{ y: 0, opacity: 1, strokeDashoffset: "300%" }}
                            animate={{ y: 0, opacity: 1, strokeDashoffset: "0%" }}
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

                {/* --- LARGE CONTENT --- */}
                {isExpanded && <motion.div
                    initial={{y: 50, opacity: 0}}
                    animate={{
                        y: isExpanded ? 0 : 50,
                        opacity: isExpanded ? 1 : 0
                    }}
                    transition={{duration: 0.25, ease: "easeInOut"}}
                    className={"island__content"}
                    style={{
                        position: "relative",
                        width: "100%",
                        height: "100%",
                        pointerEvents: isExpanded ? "auto" : "none"
                    }}
                >
                    {firstIsland?.largeContent}
                </motion.div>}
            </div>


        </motion.div>
    );
};

export const useIsland = create<{
    toasts: IslandToast[],
    addToast: (toast: IslandToast) => void,
    removeToast: (id: number) => void
}>((set) => ({
    toasts: [],
    addToast: (toast: IslandToast) => {
        const id = Date.now();
        set(state => ({toasts: [...state.toasts, {id, ...toast}]}));
    },
    removeToast: (id: number) => {
        set(state => ({toasts: state.toasts.filter(t => t.id !== id)}));
    }
}));