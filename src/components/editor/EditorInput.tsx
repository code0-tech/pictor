import React from "react"
import {createPortal} from "react-dom"
import {Code0Component} from "../../utils"
import {ValidationProps} from "../form"
import CodeMirror, {
    Decoration,
    EditorView,
    Extension,
    RangeSetBuilder,
    ViewPlugin,
    WidgetType
} from "@uiw/react-codemirror"
import {json} from "@codemirror/lang-json"
import {syntaxTree} from "@codemirror/language"
import prettier from "prettier/standalone"
import parserBabel from "prettier/plugins/babel"
import parserEstree from "prettier/plugins/estree"
import {createTheme} from "@uiw/codemirror-themes"
import {getStyleTags, tags as t} from "@lezer/highlight"
import {hashToColor} from "../d-flow/DFlow.util"

export interface EditorStream {
    match: (pattern: RegExp | string, consume?: boolean, caseInsensitive?: boolean) => boolean
    next: () => string | null
    eatWhile: (match: string | RegExp) => boolean
    peek: () => string | null
    skipTo: (char: string) => boolean
    eol: () => boolean
    sol: () => boolean
    current: () => string
}

export type UserTokenRule = (stream: string) => string | null

export interface CustomRenderProps {
    rawValue: string
}

export interface RenderMap {
    [tokenName: string]: (props: CustomRenderProps) => React.ReactNode
}

export interface EditorInputProps extends Omit<Code0Component<HTMLDivElement>, 'onChange'>, ValidationProps<string> {
    language?: 'json'
    userRule?: UserTokenRule
    renderMap: RenderMap
    onChange?: (value: string) => void
    extensions?: Extension[]
}

class ReactAnchorWidget extends WidgetType {
    constructor(public type: string, public rawValue: string) {
        super()
    }

    toDOM() {
        const span = document.createElement("span")
        span.className = "cm-react-anchor inline-block"
        span.dataset.type = this.type
        span.dataset.value = this.rawValue
        span.contentEditable = "false"

        span.style.pointerEvents = "none"

        span.style.verticalAlign = "middle"
        span.style.display = "inline-flex"
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

export const EditorInput: React.FC<EditorInputProps> = (props) => {
    const {language, userRule, renderMap, onChange, extensions = [], initialValue} = props

    const [formatted, setFormatted] = React.useState("")
    const [anchors, setAnchors] = React.useState<Map<HTMLElement, { type: string, value: string }>>(new Map())
    const containerRef = React.useRef<HTMLDivElement>(null)

    React.useEffect(() => {
        (async () => {
            try {
                const pretty = await prettier.format(initialValue ?? "", {
                    parser: language === 'json' ? 'json' : 'babel',
                    plugins: [parserBabel, parserEstree],
                    printWidth: 1
                })
                setFormatted(pretty)
            } catch (e) {
                setFormatted(initialValue ?? "")
            }
        })()
    }, [initialValue])

    const internalExtensions = React.useMemo(() => {
        const exts: Extension[] = [...extensions]

        if (language === "json") exts.push(json())

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
                const renderKeys = Object.keys(renderMap || {})

                syntaxTree(view.state).iterate({
                    enter: (node) => {

                        const rawText = view.state.doc.sliceString(node.from, node.to)

                        if (rawText.includes('\n')) return

                        const userTag = userRule?.(rawText)
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

        exts.push(badgePlugin)

        exts.push(EditorView.atomicRanges.of(view => {
            return view.plugin(badgePlugin)?.decorations || Decoration.none
        }))

        return exts
    }, [language, userRule, renderMap, extensions])

    const handleUpdate = React.useCallback((viewUpdate: any) => {
        if (viewUpdate.docChanged || viewUpdate.viewportChanged || viewUpdate.selectionSet) {
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

    return (
        <div ref={containerRef} style={{width: "100%", height: "100%", position: 'relative'}}>
            <CodeMirror
                width="100%"
                height="100%"
                value={formatted}
                theme={myTheme}
                extensions={internalExtensions}
                onChange={(val) => {
                    setFormatted(val)
                    onChange?.(val)
                }}
                onUpdate={handleUpdate}
            />

            {renderMap && Array.from(anchors.entries()).map(([anchor, data]) => {
                const renderFn = renderMap[data.type]
                if (!renderFn) return null

                return createPortal(
                    <div key={anchor.outerHTML + data.value} style={{display: 'contents'}}>
                        {renderFn({rawValue: data.value})}
                    </div>,
                    anchor
                )
            })}
        </div>
    )
}