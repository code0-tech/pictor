import React from "react";
import ReactJsonView, {JsonViewProps as ReactJsonViewProps} from "@uiw/react-json-view";
import {IconCheck, IconChevronRight, IconCopy} from "@tabler/icons-react";
import {AnimatePresence, motion} from "motion/react";
import {Component, hashToColor, mergeComponentProps} from "../../utils";
import "./JsonView.style.scss";

export interface JsonViewProps<T extends object = object> extends Omit<Component<HTMLDivElement>, 'value'> {
    value?: T
    keyName?: string | number
    collapsed?: boolean | number
    displayObjectSize?: boolean
    displayDataTypes?: boolean
    enableClipboard?: boolean
    indentWidth?: number
    shortenTextAfterLength?: number
    highlightUpdates?: boolean
    objectSortKeys?: ReactJsonViewProps<T>['objectSortKeys']
    shouldExpandNodeInitially?: ReactJsonViewProps<T>['shouldExpandNodeInitially']
    onCopied?: ReactJsonViewProps<T>['onCopied']
    onExpand?: ReactJsonViewProps<T>['onExpand']
}

const JSON_VIEW_THEME = {
    '--w-rjv-font-family': '"Inter", sans-serif',
    '--w-rjv-font-size': '0.8rem',
    '--w-rjv-color': 'rgba(255, 255, 255, 0.75)',
    '--w-rjv-key-string': 'rgba(255, 255, 255, 0.75)',
    '--w-rjv-background-color': 'transparent',
    '--w-rjv-line-color': 'rgba(191, 191, 191, 0.1)',
    '--w-rjv-arrow-color': 'rgba(255, 255, 255, 0.5)',
    '--w-rjv-edit-color': 'rgba(255, 255, 255, 0.75)',
    '--w-rjv-info-color': 'rgba(255, 255, 255, 0.5)',
    '--w-rjv-update-color': '#ebcb8b',
    '--w-rjv-copied-color': 'rgba(255, 255, 255, 0.75)',
    '--w-rjv-copied-success-color': '#29BF12',
    '--w-rjv-curlybraces-color': hashToColor("bracket"),
    '--w-rjv-brackets-color': hashToColor("squareBracket"),
    '--w-rjv-quotes-color': 'rgba(255, 255, 255, 0.75)',
    '--w-rjv-quotes-string-color': hashToColor("Text"),
    '--w-rjv-type-string-color': hashToColor("Text"),
    '--w-rjv-type-int-color': hashToColor("Number"),
    '--w-rjv-type-float-color': hashToColor("Number"),
    '--w-rjv-type-bigint-color': hashToColor("Number"),
    '--w-rjv-type-boolean-color': hashToColor("Boolean"),
    '--w-rjv-type-date-color': hashToColor("Text"),
    '--w-rjv-type-url-color': hashToColor("Text"),
    '--w-rjv-type-null-color': hashToColor("Null"),
    '--w-rjv-type-nan-color': hashToColor("Number"),
    '--w-rjv-type-undefined-color': hashToColor("Null"),
} as React.CSSProperties

export const JsonView = <T extends object = object>(props: JsonViewProps<T>) => {

    const {
        displayObjectSize = false,
        displayDataTypes = false,
        enableClipboard = true,
        indentWidth = 12.8,
        value,
        ...rest
    } = props

    const merged = mergeComponentProps("json-view", rest)

    const safeValue = (value === null || value === undefined || typeof value !== 'object')
        ? [value] as unknown as T
        : value

    return (
        <ReactJsonView
            displayObjectSize={displayObjectSize}
            displayDataTypes={displayDataTypes}
            enableClipboard={enableClipboard}
            indentWidth={indentWidth}
            {...merged}
            value={safeValue}
            style={{...JSON_VIEW_THEME, ...(merged.style ?? {})}}
        >
                <ReactJsonView.Arrow
                    render={({'data-expanded': isExpanded, ...props}: any) => (
                        <span
                            {...props}
                            className={"json-view__arrow"}
                            data-expanded={isExpanded}
                        >
                            <IconChevronRight size={13}/>
                        </span>
                    )}
                />
                <ReactJsonView.Copied
                    render={({'data-copied': copied, onClick, ...props}: any) => (
                        <span
                            {...props}
                            onClick={onClick}
                            className={"json-view__copy"}
                            data-copied={copied}
                        >
                            <AnimatePresence mode={"wait"} initial={false}>
                                <motion.span
                                    key={copied ? "check" : "copy"}
                                    initial={{opacity: 0, scale: 0.5, filter: "blur(0.35rem)"}}
                                    animate={{opacity: 1, scale: 1, filter: "blur(0px)"}}
                                    exit={{opacity: 0, scale: 0.5, filter: "blur(0.35rem)"}}
                                    transition={{duration: 0.05, ease: "easeIn"}}
                                    style={{display: "inline-flex"}}
                                >
                                    {copied ? <IconCheck size={13}/> : <IconCopy size={13}/>}
                                </motion.span>
                            </AnimatePresence>
                        </span>
                    )}
                />
        </ReactJsonView>
    )
}
