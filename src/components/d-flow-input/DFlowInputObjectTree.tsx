import {EditableObjectEntry} from "./DFlowInputObject"
import React from "react"
import {IconChevronDown, IconChevronUp} from "@tabler/icons-react"
import {Flex} from "../flex/Flex"
import {Text} from "../text/Text"
import {hashToColor} from "../../utils"
import {Badge} from "../badge/Badge"
import {LiteralValue} from "@code0-tech/sagittarius-graphql-types"

export interface DFlowInputObjectTreeProps {
    object: LiteralValue
    parentKey?: string
    isRoot?: boolean
    onEntryClick: (entry: EditableObjectEntry) => void
    collapsedState: Record<string, boolean>
    setCollapsedState: (path: string[], collapsed: boolean) => void
    path?: string[]
    activePath?: string[] | null
    onDoubleClick?: (path: string[], isCollapsed: boolean) => void
    parentColor?: string
}

export const DFlowInputObjectTree: React.FC<DFlowInputObjectTreeProps> = (props) => {
    const {
        object,
        parentKey,
        isRoot = !parentKey,
        onEntryClick,
        collapsedState,
        setCollapsedState,
        path = [],
        activePath = null,
        onDoubleClick,
        parentColor,
    } = props

    const value = isRoot ? object?.value : object
    if (typeof value !== "object" || value === null) return null

    const clickTimeout = React.useRef<NodeJS.Timeout | null>(null)
    const CLICK_DELAY = 250 // ms

    const handleClick = (entry: EditableObjectEntry) => {
        if (clickTimeout.current) clearTimeout(clickTimeout.current)
        clickTimeout.current = setTimeout(() => {
            onEntryClick(entry)
            clickTimeout.current = null
        }, CLICK_DELAY)
    }

    const handleDoubleClick = (currentPath: string[], isCollapsed: boolean) => {
        if (clickTimeout.current) {
            clearTimeout(clickTimeout.current)
            clickTimeout.current = null
        }
        if (onDoubleClick) {
            onDoubleClick(currentPath, isCollapsed)
        } else {
            setCollapsedState(currentPath, !isCollapsed)
        }
    }

    React.useEffect(() => {
        const currentPath = path ?? []
        const pathKey = (isRoot ? ["root"] : currentPath).join(".")
        if (currentPath.length > 1 && collapsedState[pathKey] === undefined) {
            setCollapsedState(currentPath.length === 0 ? ["root"] : currentPath, true)
        }
    }, [path, isRoot, collapsedState, setCollapsedState])

    const renderRoot = () => {
        const currentPath = [...path]
        const pathKey = "root"
        const isCollapsed = collapsedState[pathKey] || false
        const isCollapsable = typeof value === "object" && value !== null && (Array.isArray(value) ? value.length > 0 : Object.keys(value).length > 0)
        const isActive = Array.isArray(activePath) && activePath.length === 0 && parentKey === undefined
        const icon = isCollapsable ? (isCollapsed ? <IconChevronUp size={13}/> : <IconChevronDown size={13}/>) : null
        return (
            <div
                onClick={e => {
                    e.stopPropagation()
                    handleClick({key: pathKey, value: object, path: currentPath})
                }}
                onDoubleClick={e => {
                    e.stopPropagation()
                    handleDoubleClick(currentPath, isCollapsed)
                }}
                aria-selected={isActive || undefined}
            >
                <Flex align="center" style={{gap: ".35rem", textWrap: "nowrap"}} aria-selected={isActive || undefined}
                      className="rule">
                    {icon}
                    <Text hierarchy="tertiary">{Array.isArray(value) ? "is a list of" : "is a nested object"}</Text>
                </Flex>
                {!isCollapsed && <ul>{renderNodes}</ul>}
            </div>
        )
    }

    const renderNodes = Array.isArray(value) || (value && typeof value === 'object')
        ? Object.entries(value as Record<string, unknown>).map(([key, val]) => {
            const currentPath = [...path, key]
            const pathKey = currentPath.join(".")
            const isCollapsed = collapsedState[pathKey] || false
            const isActive = activePath && activePath.length > 0 && currentPath.join(".") === activePath.join(".")
            const parentColorValue = parentColor ?? hashToColor("root")
            const isCollapsable = typeof (val as any) === "object" && (val as any) !== null && (Array.isArray((val as any)) ? (val as any).length > 0 : Object.keys((val as any) ?? {}).length > 0)
            const collapsableColor = isCollapsable ? hashToColor(pathKey) : parentColorValue
            const icon = isCollapsable ? (isCollapsed ? <IconChevronUp size={13}/> : <IconChevronDown size={13}/>) : null
            const label = isCollapsable ? (
                <Flex align="center" style={{gap: ".35rem", textWrap: "nowrap"}} className="rule"
                      aria-selected={isActive || undefined}>
                    {icon}
                    <Badge border color={collapsableColor} style={{verticalAlign: "middle"}}>
                        <Text size="xs" style={{color: "inherit"}}>{key}</Text>
                    </Badge>
                    <Text hierarchy="tertiary">{Array.isArray((val as any)) ? "is a list of" : "is a nested object"}</Text>
                </Flex>
            ) : (
                <Flex align="center" style={{gap: ".35rem", textWrap: "nowrap"}} className="rule"
                      aria-selected={isActive || undefined}>
                    <Badge border color={parentColorValue} style={{verticalAlign: "middle"}}>
                        <Text size="xs" style={{color: "inherit"}}>{key}</Text>
                    </Badge>
                    <Text hierarchy="tertiary">has value</Text>
                    <Badge border color={"tertiary"} style={{verticalAlign: "middle"}}>
                        <Text size="xs" style={{color: "inherit"}}>{String((val as any))}</Text>
                    </Badge>
                </Flex>
            )
            const childTree = isCollapsable && !isCollapsed ? (
                <DFlowInputObjectTree
                    object={val as LiteralValue}
                    parentKey={key}
                    isRoot={false}
                    onEntryClick={onEntryClick}
                    collapsedState={collapsedState}
                    setCollapsedState={setCollapsedState}
                    path={currentPath}
                    activePath={activePath}
                    parentColor={collapsableColor}
                />
            ) : null
            return (
                <li key={pathKey}>
                    <div
                        onClick={e => {
                            e.stopPropagation()
                            handleClick({key, value: val as LiteralValue, path: currentPath})
                        }}
                        onDoubleClick={e => {
                            e.stopPropagation()
                            handleDoubleClick(currentPath, isCollapsed)
                        }}
                    >
                        {label}
                        {childTree}
                    </div>
                </li>
            )
        })
        : null

    const rootNode = renderRoot()
    const nodes = rootNode && isRoot ? [rootNode] : renderNodes
    const validNodes = (nodes ?? []).filter(Boolean)
    if (validNodes.length === 0) return null
    return <ul>{validNodes}</ul>
}