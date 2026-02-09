import React, {isValidElement} from "react"
import {createPortal} from "react-dom"
import {Code0Component, mergeCode0Props} from "../../utils"
import {ValidationProps} from "../form"
import CodeMirror, {
    Decoration,
    EditorView,
    Extension,
    keymap,
    Prec,
    RangeSetBuilder,
    ViewPlugin,
    WidgetType
} from "@uiw/react-codemirror"
import {json, jsonParseLinter} from "@codemirror/lang-json"
import {StreamLanguage, syntaxTree} from "@codemirror/language"
import {Diagnostic, linter} from "@codemirror/lint"
import prettier from "prettier/standalone"
import parserBabel from "prettier/plugins/babel"
import parserEstree from "prettier/plugins/estree"
import {createTheme} from "@uiw/codemirror-themes"
import {getStyleTags, tags as t} from "@lezer/highlight"
import {hashToColor} from "../d-flow/DFlow.util"
import "./Editor.styles.scss"
import {Badge} from "../badge/Badge";
import {
    IconAlertSquareRounded,
    IconAlertTriangle,
    IconArrowBarToRight,
    IconCornerDownLeft,
    IconExclamationCircle,
    IconInfoCircle,
    IconSpace
} from "@tabler/icons-react";
import {Text} from "../text/Text";
import {Flex} from "../flex/Flex";
import {Tooltip, TooltipArrow, TooltipContent, TooltipPortal, TooltipTrigger} from "../tooltip/Tooltip";
import {ScrollArea, ScrollAreaScrollbar, ScrollAreaThumb, ScrollAreaViewport} from "../scroll-area/ScrollArea";
import {
    acceptCompletion,
    autocompletion,
    CompletionContext,
    CompletionResult,
    startCompletion
} from "@codemirror/autocomplete";
import type {BasicSetupOptions} from "@uiw/codemirror-extensions-basic-setup";

export type EditorTokenizer = (content: string) => string | null

export interface EditorRendererProps {
    content: string
}

export interface EditorTokenHighlights {
    [tokenName: string]: (props: EditorRendererProps) => React.ReactNode
}

export interface EditorInputProps extends Omit<Code0Component<HTMLDivElement>, 'onChange' | 'defaultValue' | 'value'>, ValidationProps<any> {
    language?: 'json' | StreamLanguage<unknown>
    tokenizer?: EditorTokenizer
    tokenHighlights?: EditorTokenHighlights
    suggestions?: (context: CompletionContext) => CompletionResult | React.ReactNode | null
    customSuggestionComponent?: boolean
    onChange?: (value: any) => void
    extensions?: Extension[]
    disabled?: boolean
    readonly?: boolean
    showTooltips?: boolean
    showValidation?: boolean,
    basicSetup?: BasicSetupOptions
}

class ReactAnchorWidget extends WidgetType {
    constructor(public type: string, public rawValue: string) {
        super()
    }

    toDOM() {
        const span = document.createElement("span")
        span.className = "cm-react-anchor"
        span.dataset.type = this.type
        span.dataset.value = this.rawValue
        span.contentEditable = "false"

        span.style.pointerEvents = "none"

        span.style.verticalAlign = "middle"
        span.style.display = "inline-block"
        return span
    }

    ignoreEvent() {
        return true
    }

    eq(other: ReactAnchorWidget) {
        return other.type === this.type && other.rawValue === this.rawValue
    }
}

const myTheme = createTheme({
    theme: 'light',
    settings: {
        background: 'transparent',
        backgroundImage: '',
        foreground: 'rgba(255,255,255, 0.75)',
        caret: 'gray',
        selection: 'rgba(112,179,255,0.25)',
        selectionMatch: 'rgba(112,179,255,0.1)',
        fontSize: "0.8rem",
        gutterBackground: 'transparent',
        gutterForeground: 'rgba(255,255,255, 0.5)',
        gutterBorder: 'transparent',
        gutterActiveForeground: 'rgba(255,255,255, 1)',
        lineHighlight: 'rgba(255,255,255, 0.1)',
    },
    styles: [
        {tag: t.squareBracket, color: hashToColor("squareBracket")},
        {tag: t.bracket, color: hashToColor("bracket")},
        {tag: t.string, color: hashToColor("Text")},
        {tag: t.bool, color: hashToColor("Boolean")},
        {tag: t.number, color: hashToColor("Number")},
    ]
})


// Helper function to check if value is a ReactNode
const isReactNode = (value: any): value is React.ReactNode => {
    return isValidElement(value) || typeof value === 'string' || typeof value === 'number' || Array.isArray(value);
}

export const Editor: React.FC<EditorInputProps> = (props) => {
    const {
        language,
        tokenizer,
        tokenHighlights,
        suggestions,
        onChange,
        extensions = [],
        initialValue,
        formValidation,
        disabled,
        showTooltips = true,
        showValidation = true,
        readonly,
        basicSetup,
        customSuggestionComponent = false,
        ...rest
    } = props

    const [formatted, setFormatted] = React.useState("")
    const ref = React.useRef<HTMLDivElement>(null)
    const [anchors, setAnchors] = React.useState<Map<HTMLElement, { type: string, value: string }>>(new Map())
    const [diagnostics, setDiagnostics] = React.useState<readonly Diagnostic[]>([])
    const [customSuggestion, setCustomSuggestion] = React.useState<{
        component: React.ReactNode;
        position: { top: number; left: number };
    } | null>(null)
    const containerRef = React.useRef<HTMLDivElement>(null)

    language === "json" && React.useEffect(() => {
        (async () => {
            try {
                const pretty = await prettier.format(JSON.stringify(initialValue) ?? "", {
                    parser: language,
                    plugins: [parserBabel, parserEstree],
                    printWidth: 1
                })
                setFormatted(pretty)
            } catch (e) {
                setFormatted(JSON.stringify(initialValue) ?? "")
            }
        })()
    }, [initialValue])

    const internalExtensions = React.useMemo(() => {
        const internExtensions: Extension[] = [...extensions]

        if (suggestions) {
            // Wrapper function to handle both CompletionResult and ReactNode
            const suggestionWrapper = (context: CompletionContext): CompletionResult | null => {
                const result = suggestions(context)

                // Check if result is a ReactNode
                if (result && isReactNode(result)) {
                    // Get cursor coordinates
                    const coords = context.view?.coordsAtPos(context.pos)

                    if (coords) {
                        setCustomSuggestion({
                            component: result,
                            position: {
                                top: coords.bottom,
                                left: coords.left
                            }
                        })
                    }

                    // Return null to prevent standard autocomplete
                    return null
                }

                // Clear custom suggestion if CompletionResult is returned
                setCustomSuggestion(null)

                // Return CompletionResult or null
                return result as CompletionResult | null
            }

            internExtensions.push(autocompletion({...(customSuggestionComponent ? {override: [suggestionWrapper]} : {override: [suggestions as any]})}))
            internExtensions.push(Prec.highest(keymap.of([{key: "Tab", run: acceptCompletion}])))

            // Add ArrowUp/ArrowDown handlers for custom suggestion component
            if (customSuggestionComponent) {
                internExtensions.push(Prec.highest(keymap.of([
                    {
                        key: "ArrowUp",
                        run: (view) => {
                            if (!customSuggestion) {
                                startCompletion(view)
                                return true
                            }
                            return true
                        }
                    },
                    {
                        key: "ArrowDown",
                        run: (view) => {
                            if (!customSuggestion) {
                                startCompletion(view)
                                return true
                            }
                            ref?.current?.querySelector<HTMLElement>('[tabindex]')?.focus()
                            return true
                        }
                    }
                ])))
            }
        }

        if (language === "json") {
            internExtensions.push(json())
            internExtensions.push(linter(jsonParseLinter(), {
                markerFilter: (diagnosticsArray) => {
                    setDiagnostics(diagnosticsArray)
                    return []
                }
            }))
        } else if (language) {
            internExtensions.push(language)
        }

        const badgePlugin = ViewPlugin.fromClass(class {
            decorations: any

            constructor(view: any) {
                this.decorations = this.build(view)
            }

            update(update: any) {
                if (update.docChanged || update.viewportChanged) {
                    this.decorations = this.build(update.view)
                }
            }

            build(view: any) {
                const builder = new RangeSetBuilder<Decoration>()
                const renderKeys = Object.keys(tokenHighlights || {})

                syntaxTree(view.state).iterate({
                    enter: (node) => {

                        const rawText = view.state.doc.sliceString(node.from, node.to)

                        if (rawText.includes('\n')) return

                        const userTag = tokenizer?.(rawText)
                        const tags = getStyleTags(node)?.tags.map(tag => "name" in tag ? tag.name : undefined)

                        const foundKey = renderKeys.find(key => {
                            return tags?.includes(key)
                        })

                        if (foundKey && !userTag) {
                            builder.add(node.from, node.to, Decoration.replace({
                                widget: new ReactAnchorWidget(foundKey, rawText),
                                point: true
                            }))
                        } else if (userTag) {
                            builder.add(node.from, node.to, Decoration.replace({
                                widget: new ReactAnchorWidget(userTag, rawText),
                                point: true
                            }))
                        }
                    }
                })
                return builder.finish()
            }
        }, {decorations: v => v.decorations})

        internExtensions.push(badgePlugin)

        internExtensions.push(EditorView.atomicRanges.of(view => {
            return view.plugin(badgePlugin)?.decorations || Decoration.none
        }))

        return internExtensions
    }, [language, tokenizer, tokenHighlights, extensions, suggestions, ref.current])

    const handleUpdate = React.useCallback((viewUpdate: any) => {
        if (viewUpdate.docChanged || viewUpdate.viewportChanged || viewUpdate.selectionSet) {

            if (viewUpdate.view) {
                const {from, to} = viewUpdate.state?.selection?.main ?? {from: 0, to: 0}

                let nodeCount = 0;
                syntaxTree(viewUpdate.state).iterate({
                    from: from,
                    to: to,
                    enter: (node) => {
                        if (node.from >= from && node.to <= to) {
                            nodeCount++;
                        }
                    }
                })

                if (viewUpdate.selectionSet && nodeCount < 2) {
                    setCustomSuggestion(null)
                    startCompletion(viewUpdate.view)
                } else if (viewUpdate.selectionSet && nodeCount >= 2) {
                    setCustomSuggestion(null)
                }
            } else if (viewUpdate.selectionSet) {
                setCustomSuggestion(null)
                startCompletion(viewUpdate.view)
            }


            window.requestAnimationFrame(() => {
                const foundNodes = containerRef.current?.querySelectorAll('.cm-react-anchor')
                const newAnchors = new Map()

                foundNodes?.forEach((node: any) => {
                    newAnchors.set(node, {
                        type: node.dataset.type,
                        value: node.dataset.value
                    })
                })

                setAnchors(newAnchors)
            })
        }
    }, [])

    React.useEffect(() => {
        if (containerRef.current) {
            const timer = window.setTimeout(() => {
                const event = new CustomEvent('scroll');
                containerRef.current?.dispatchEvent(event);
                handleUpdate({docChanged: true, viewportChanged: true, selectionSet: false});
            }, 50);
            return () => clearTimeout(timer);
        }
        return () => {
        }
    }, [handleUpdate]);

    return (
        <ScrollArea h={"100%"} type={"scroll"}>
            {showValidation && (
                <div className={"editor__diagnostics"}>
                    <Flex style={{gap: "0.35rem", textWrap: "nowrap"}} align={"center"}>
                        {diagnostics.filter(d => d.severity == "error").length > 0 ? (
                            <Tooltip>
                                <TooltipTrigger asChild>
                                    <Badge color={"red"}>
                                        <IconExclamationCircle size={13}/>
                                        <Text>{diagnostics.filter(d => d.severity == "error").length}</Text>
                                    </Badge>
                                </TooltipTrigger>
                                <TooltipPortal>
                                    <TooltipContent side={"bottom"}>
                                        <TooltipArrow/>
                                        {diagnostics.filter(d => d.severity == "error").map(d => {
                                            return <Text size={"xs"} key={d.message}>{d.message}</Text>
                                        })}
                                    </TooltipContent>
                                </TooltipPortal>
                            </Tooltip>
                        ) : null}
                        {diagnostics.filter(d => d.severity == "warning").length > 0 ? (
                            <Tooltip>
                                <TooltipTrigger asChild>
                                    <Badge color={"orange"}>
                                        <IconAlertTriangle size={13}/>
                                        <Text>{diagnostics.filter(d => d.severity == "warning").length}</Text>
                                    </Badge>
                                </TooltipTrigger>
                                <TooltipPortal>
                                    <TooltipContent side={"bottom"}>
                                        <TooltipArrow/>
                                        {diagnostics.filter(d => d.severity == "warning").map(d => {
                                            return <Text size={"xs"} key={d.message}>{d.message}</Text>
                                        })}
                                    </TooltipContent>
                                </TooltipPortal>
                            </Tooltip>
                        ) : null}
                        {diagnostics.filter(d => d.severity == "info").length > 0 ? (
                            <Tooltip>
                                <TooltipTrigger asChild>
                                    <Badge color={"#9ca3af"}>
                                        <IconAlertSquareRounded size={13}/>
                                        <Text>{diagnostics.filter(d => d.severity == "info").length}</Text>
                                    </Badge>
                                </TooltipTrigger>
                                <TooltipPortal>
                                    <TooltipContent side={"bottom"}>
                                        <TooltipArrow/>
                                        {diagnostics.filter(d => d.severity == "info").map(d => {
                                            return <Text size={"xs"} key={d.message}>{d.message}</Text>
                                        })}
                                    </TooltipContent>
                                </TooltipPortal>
                            </Tooltip>
                        ) : null}
                        {diagnostics.filter(d => d.severity == "hint").length > 0 ? (
                            <Tooltip>
                                <TooltipTrigger asChild>
                                    <Badge color={"#3b82f6"}>
                                        <IconInfoCircle size={13}/>
                                        <Text>{diagnostics.filter(d => d.severity == "hint").length}</Text>
                                    </Badge>
                                </TooltipTrigger>
                                <TooltipPortal>
                                    <TooltipContent side={"bottom"}>
                                        <TooltipArrow/>
                                        {diagnostics.filter(d => d.severity == "hint").map(d => {
                                            return <Text size={"xs"} key={d.message}>{d.message}</Text>
                                        })}
                                    </TooltipContent>
                                </TooltipPortal>
                            </Tooltip>
                        ) : null}
                    </Flex>
                </div>
            )}
            {showTooltips && (
                <div className={"editor__tools"}>
                    <Flex style={{gap: "0.35rem", textWrap: "nowrap"}} align={"center"}>
                        <Flex style={{gap: "0.35rem"}} align={"center"}>
                            <Badge color={"secondary"} border>
                                <Text>{navigator !== undefined && /Mac/.test(navigator.userAgent) ? "⌃" : "strg"}</Text>
                                <Text>+</Text>
                                <IconSpace size={13}/>
                            </Badge>
                            <Text>to show</Text>
                        </Flex>
                        <Text>and</Text>
                        <Flex style={{gap: "0.35rem"}} align={"center"}>
                            <Badge color={"secondary"} border>
                                <IconArrowBarToRight size={13}/>
                                <Text>or</Text>
                                <IconCornerDownLeft size={13}/>
                            </Badge>
                            <Text>to select</Text>
                        </Flex>
                        <Text>suggestions</Text>
                    </Flex>
                </div>
            )}
            <ScrollAreaViewport asChild>
                <div ref={containerRef} {...mergeCode0Props(`editor`, rest)}>
                    <CodeMirror
                        width="100%"
                        height="100%"
                        value={language === "json" ? formatted : initialValue}
                        theme={myTheme}
                        readOnly={disabled || readonly}
                        editable={!disabled}
                        extensions={internalExtensions}
                        aria-disabled={disabled}
                        className={"editor__control"}
                        onChange={(val) => {
                            setFormatted(val)
                            if (language === "json") {
                                try {
                                    const json = JSON.parse(val)
                                    onChange?.(json)
                                    formValidation?.setValue(json)
                                } catch (e) {
                                }
                            } else {
                                onChange?.(val)
                            }
                        }}
                        onUpdate={handleUpdate}
                        basicSetup={basicSetup}
                    />


                    {tokenHighlights && Array.from(anchors.entries()).map(([anchor, data]) => {
                        const renderFn = tokenHighlights[data.type]
                        if (!renderFn) return null

                        return createPortal(
                            <div key={anchor.outerHTML + data.value} style={{display: 'contents'}}>
                                {renderFn({content: data.value})}
                            </div>,
                            anchor
                        )
                    })}

                    {customSuggestion && createPortal(
                        <div ref={ref} style={{
                            position: 'fixed',
                            top: customSuggestion.position.top,
                            left: customSuggestion.position.left,
                            zIndex: 9999,
                        }}
                        >
                            {customSuggestion.component}
                        </div>,
                        document.body
                    )}

                </div>
            </ScrollAreaViewport>
            <ScrollAreaScrollbar orientation={"vertical"}>
                <ScrollAreaThumb/>
            </ScrollAreaScrollbar>
            <ScrollAreaScrollbar orientation={"horizontal"}>
                <ScrollAreaThumb/>
            </ScrollAreaScrollbar>
        </ScrollArea>
    )
}