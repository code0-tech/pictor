import React from "react";
import {ValidationProps} from "../../../form/useForm";
import {
    DataType,
    DataTypeRule,
    DataTypeRuleConnection,
    DataTypeRulesConfig,
    DataTypeRulesParentTypeConfig,
    DataTypeRulesVariant,
    GenericMapper,
    GenericType
} from "@code0-tech/sagittarius-graphql-types";
import InputMessage from "../../../form/InputMessage";
import "./DFlowViewportDataTypeInput.style.scss";
import TextInput from "../../../form/TextInput";
import Button from "../../../button/Button";
import {IconGripVertical, IconSettings, IconTrash} from "@tabler/icons-react";
import Text from "../../../text/Text";
import Flex from "../../../flex/Flex";
import Badge from "../../../badge/Badge";
import InputLabel from "../../../form/InputLabel";
import {useSuggestions} from "../../suggestions/DFlowSuggestion.hook";
import {DFlowSuggestionMenuFooter} from "../../suggestions/DFlowSuggestionMenuFooter";
import {toInputSuggestions} from "../../suggestions/DFlowSuggestionMenu.util";
import {DFlowSuggestionType} from "../../suggestions/DFlowSuggestion.view";
import {Menu, MenuPortal, MenuTrigger} from "../../../menu/Menu";
import {
    InputSuggestion,
    InputSuggestionMenuContent,
    InputSuggestionMenuContentItems
} from "../../../form/InputSuggestion";

const NON_TYPE_RULE_VARIANTS = new Set<DataTypeRulesVariant>([
    DataTypeRulesVariant.ItemOfCollection,
    DataTypeRulesVariant.Regex,
    DataTypeRulesVariant.NumberRange
])

export interface DFlowViewportDataTypeInputProps extends ValidationProps<DataType | GenericType> {
    onChange?: (value: DataType | GenericType) => void
    blockingDataType?: DataType | GenericType
}

export const DFlowViewportDataTypeInput: React.FC<DFlowViewportDataTypeInputProps> = (props) => {

    const {
        formValidation,
        initialValue,
        onChange = (_) => {
        },
        blockingDataType
    } = props

    const [currentValue, setCurrentValue] = React.useState<DataType | GenericType | undefined>(() =>
        mergeWithBlocking(initialValue, blockingDataType)
    )

    // Tracks whether the latest state update originated from a prop change so we can suppress
    // duplicate onChange notifications that would otherwise create an update loop upstream.
    const isSyncingFromProps = React.useRef(true)

    React.useEffect(() => {
        const merged = mergeWithBlocking(initialValue, blockingDataType)
        setCurrentValue(prev => {
            if (areValuesEqual(prev, merged)) {
                return prev
            }

            isSyncingFromProps.current = true
            return merged
        })
    }, [initialValue, blockingDataType])

    React.useEffect(() => {
        if (!currentValue) return
        if (isSyncingFromProps.current) {
            isSyncingFromProps.current = false
            return
        }

        onChange(currentValue)
    }, [currentValue, onChange])

    const dataType = React.useMemo(() => getDataTypeFromValue(currentValue), [currentValue])
    const blockingData = React.useMemo(() => getDataTypeFromValue(blockingDataType), [blockingDataType])

    const genericMap = React.useMemo(() => new Map<string, GenericMapper>((isGenericType(currentValue) ? currentValue.genericMappers ?? [] : []).map((generic: GenericMapper) => [generic.target ?? "", generic])), [currentValue])
    const blockingRules = React.useMemo(() => blockingData?.rules?.nodes?.filter(Boolean) as DataTypeRule[] | undefined, [blockingData])

    const updateValue = React.useCallback((updater: (next: DataType | GenericType) => void) => {
        setCurrentValue(prev => {
            if (!prev) return prev

            const draft = deepClone(prev)
            updater(draft)

            if (areValuesEqual(prev, draft)) {
                return prev
            }

            return draft
        })
    }, [])

    const updateRuleAtIndex = React.useCallback((index: number, updater: (rule: DataTypeRule) => DataTypeRule | undefined) => {
        updateValue(nextValue => {
            const nextDataType = getDataTypeFromValue(nextValue)
            if (!nextDataType) return
            const ruleNodes = ensureRuleNodes(nextDataType)
            const existingRule = ruleNodes[index]
            if (!existingRule) return
            if (isRuleBlocked(existingRule, blockingData)) return
            const updatedRule = updater(deepClone(existingRule))
            if (updatedRule === undefined) return
            ruleNodes[index] = updatedRule
        })
    }, [blockingData, updateValue])

    const removeRuleAtIndex = React.useCallback((index: number) => {
        updateValue(nextValue => {
            const nextDataType = getDataTypeFromValue(nextValue)
            if (!nextDataType) return
            const ruleNodes = ensureRuleNodes(nextDataType)
            const targetRule = ruleNodes[index]
            if (!targetRule) return
            if (isRuleBlocked(targetRule, blockingData)) return
            ruleNodes.splice(index, 1)
        })
    }, [blockingData, updateValue])

    const handleNestedChange = React.useCallback((index: number, value: DataType | GenericType) => {
        updateRuleAtIndex(index, (rule) => {
            if (!rule?.config?.dataTypeIdentifier) return rule
            if (isDataType(value)) {
                rule.config.dataTypeIdentifier.dataType = value
                delete rule.config.dataTypeIdentifier.genericType
            } else if (isGenericType(value)) {
                rule.config.dataTypeIdentifier.genericType = value
                delete rule.config.dataTypeIdentifier.dataType
            }
            return rule
        })
    }, [updateRuleAtIndex])

    const handleGenericMapperChange = React.useCallback((targetKey: string, sourceIndex: number, value: DataType | GenericType) => {
        updateValue(nextValue => {
            if (!isGenericType(nextValue)) return
            const mappers = nextValue.genericMappers ?? []
            const mapperIndex = mappers.findIndex(mapper => mapper.target === targetKey)
            if (mapperIndex === -1) return

            const mapper = mappers[mapperIndex]
            const sources = mapper?.sourceDataTypeIdentifiers ?? []
            if (!sources[sourceIndex]) return

            if (isDataType(value)) {
                sources[sourceIndex].dataType = value
                delete sources[sourceIndex].genericType
            } else if (isGenericType(value)) {
                sources[sourceIndex].genericType = value
                delete sources[sourceIndex].dataType
            }

            mapper.sourceDataTypeIdentifiers = sources
            nextValue.genericMappers = [...mappers]
            nextValue.genericMappers[mapperIndex] = mapper
        })
    }, [updateValue])


    return <div>

        <div className={"d-flow-viewport-data-type-input"}>

            {dataType?.rules?.nodes?.map((rule, index) => {
                if (!rule) return null
                const blockingRule = blockingRules?.find(candidate => isRuleEqual(candidate, rule))
                const isParentType = rule?.variant === "PARENT_TYPE";
                const ptConfig = rule?.config as DataTypeRulesParentTypeConfig | undefined;

                const parentHasRules =
                    ((ptConfig?.dataTypeIdentifier?.dataType?.rules?.nodes?.length ?? 0) > 0) ||
                    ((ptConfig?.dataTypeIdentifier?.genericType?.dataType?.rules?.nodes?.length ?? 0) > 0);

                const shouldRender = !isParentType || parentHasRules;

                return shouldRender ? (
                    <RuleItem
                        key={`${rule.variant}-${index}`}
                        rule={rule}
                        blockingRule={blockingRule}
                        genericMap={genericMap}
                        onRemove={() => removeRuleAtIndex(index)}
                        onConfigChange={(config) => updateRuleAtIndex(index, (currentRule) => {
                            currentRule.config = config
                            return currentRule
                        })}
                        onHeaderKeyChange={(value) => updateRuleAtIndex(index, (currentRule) => {
                            if (!currentRule.config) return currentRule
                            if ("key" in currentRule.config) {
                                // @ts-ignore - GraphQL union typing
                                currentRule.config.key = value || null
                            }
                            return currentRule
                        })}
                        onHeaderDataTypeChange={(value) => updateRuleAtIndex(index, (currentRule) => {
                            if (!currentRule.config) return currentRule
                            if (!currentRule.config.dataTypeIdentifier) {
                                currentRule.config.dataTypeIdentifier = {}
                            }

                            const identifier = currentRule.config.dataTypeIdentifier

                            if (!value) {
                                delete identifier?.dataType
                                delete identifier?.genericType
                                return currentRule
                            }

                            if (isDataType(value)) {
                                identifier.dataType = value
                                delete identifier.genericType
                            } else if (isGenericType(value)) {
                                identifier.genericType = value
                                delete identifier.dataType
                            }

                            return currentRule
                        })}
                        onNestedChange={(value) => handleNestedChange(index, value)}
                        onGenericMapperChange={handleGenericMapperChange}
                    />
                ) : null;
            })}
            <Menu>
                <MenuTrigger asChild>
                    <Button color={"primary"}><IconSettings size={16}/> Add new rule</Button>
                </MenuTrigger>
                <MenuPortal>
                    <InputSuggestionMenuContent>
                        <InputSuggestionMenuContentItems onSuggestionSelect={(suggestion) => {
                            updateValue(nextValue => {
                                console.log(nextValue)

                                if ("rules" in nextValue) {
                                    nextValue?.rules?.nodes?.push(suggestion.value)
                                } else if ("dataType" in nextValue.genericType) {
                                    nextValue.genericType.dataType?.rules?.nodes?.push(suggestion.value)
                                }
                            })

                        }} suggestions={Object.entries(DataTypeRulesVariant).map(variant => ({
                            children: variant[1],
                            value: {
                                variant: variant[1],
                            }
                        }))}/>
                        <DFlowSuggestionMenuFooter/>
                    </InputSuggestionMenuContent>
                </MenuPortal>
            </Menu>

        </div>

        {!formValidation?.valid && formValidation?.notValidMessage && (
            <InputMessage>{formValidation.notValidMessage}</InputMessage> // Show validation error
        )}
    </div>

}

const RuleItem: React.FC<{
    rule: DataTypeRule,
    blockingRule?: DataTypeRule,
    genericMap: Map<string, GenericMapper>,
    onRemove: () => void,
    onConfigChange: (config: DataTypeRulesConfig) => void,
    onHeaderKeyChange: (value: string) => void,
    onHeaderDataTypeChange: (value?: DataType | GenericType) => void,
    onNestedChange: (value: DataType | GenericType) => void,
    onGenericMapperChange: (targetKey: string, sourceIndex: number, value: DataType | GenericType) => void,
}> = ({
    rule,
    blockingRule,
    genericMap,
    onRemove,
    onConfigChange,
    onHeaderKeyChange,
    onHeaderDataTypeChange,
    onNestedChange,
    onGenericMapperChange
}) => {

    const identifier = rule?.config?.dataTypeIdentifier ?? undefined
    const hasGenericKey = Boolean(identifier?.genericKey)
    const hasNestedValue = Boolean(getRuleIdentifierValue(rule))
    const [isOpen, setIsOpen] = React.useState<boolean>(() => hasNestedValue || hasGenericKey)
    const isBlocked = Boolean(blockingRule)
    const variant = rule.variant as DataTypeRulesVariant | undefined
    const isTypeRule = variant ? !NON_TYPE_RULE_VARIANTS.has(variant) : false

    const [configValue, setConfigValue] = React.useState<string>(() => getConfigValue(rule?.config as DataTypeRulesConfig))

    React.useEffect(() => {
        setIsOpen(hasNestedValue || hasGenericKey)
    }, [hasGenericKey, hasNestedValue])

    React.useEffect(() => {
        setConfigValue(getConfigValue(rule?.config as DataTypeRulesConfig))
    }, [rule])

    const dataTypeLabel = React.useMemo(() => {
        if (!isTypeRule) return undefined
        if (!identifier) return undefined

        if (identifier.genericKey) {
            const mapper = genericMap.get(identifier.genericKey)
            const source = mapper?.sourceDataTypeIdentifiers?.[0]
            return (
                source?.dataType?.name?.nodes?.[0]?.content ??
                source?.genericType?.dataType?.name?.nodes?.[0]?.content
            )
        }

        return (
            identifier.dataType?.name?.nodes?.[0]?.content ??
            identifier.genericType?.dataType?.name?.nodes?.[0]?.content
        )
    }, [genericMap, identifier, isTypeRule])

    const handleConfigChange = React.useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
        const value = event.target.value
        setConfigValue(value)
    }, [])

    const handleConfigCommit = React.useCallback(() => {
        if (isBlocked) return

        const updatedConfig = buildConfigFromValue(configValue, rule.config)
        if (updatedConfig) {
            onConfigChange(updatedConfig)
        }
    }, [configValue, isBlocked, onConfigChange, rule.config])

    const nestedInitialValue = getRuleIdentifierValue(rule)
    const nestedBlockingValue = getRuleIdentifierValue(blockingRule)

    const renderNestedEditor = () => {
        if (!nestedInitialValue && !hasGenericKey) {
            return null
        }

        const header = (
            <RuleHeader
                rule={rule}
                isBlocked={isBlocked}
                dataTypeLabel={dataTypeLabel}
                onClick={() => setIsOpen(prevState => !prevState)}
                onRemove={!isBlocked ? onRemove : undefined}
                onKeyChange={!isBlocked ? onHeaderKeyChange : undefined}
                onDataTypeChange={!isBlocked ? onHeaderDataTypeChange : undefined}
            />
        )

        if (nestedInitialValue) {
            return (
                <>
                    {header}
                    {isOpen ? (
                        <DFlowViewportDataTypeInput
                            initialValue={nestedInitialValue}
                            blockingDataType={nestedBlockingValue}
                            onChange={onNestedChange}
                        />
                    ) : null}
                </>
            )
        }

        if (identifier?.genericKey) {
            const mapper = genericMap.get(identifier.genericKey)
            return (
                <>
                    {header}
                    {isOpen ? mapper?.sourceDataTypeIdentifiers?.map((type, index) => {
                        const nestedValue = type?.dataType ?? type?.genericType
                        if (!nestedValue) return null

                        const nestedBlocking = isBlocked ? nestedValue : undefined
                        const targetKey = identifier.genericKey
                        if (!targetKey) return null
                        return (
                            <DFlowViewportDataTypeInput
                                key={`${targetKey}-${index}`}
                                initialValue={nestedValue}
                                blockingDataType={nestedBlocking}
                                onChange={(value) => onGenericMapperChange(targetKey, index, value)}
                            />
                        )
                    }) : null}
                </>
            )
        }

        return null
    }

    if (isTypeRule && (nestedInitialValue || hasGenericKey)) {
        return <div className="d-flow-viewport-data-type-input__rule">{renderNestedEditor()}</div>
    }

    return (
        <div className="d-flow-viewport-data-type-input__rule">
            <Flex align={"center"}>
                <Button disabled variant={"none"}>
                    <IconGripVertical size={16}/>
                </Button>
                <div style={{flex: 1}}>
                    <RuleHeader
                        rule={rule}
                        isBlocked={isBlocked}
                        dataTypeLabel={dataTypeLabel}
                        onRemove={!isBlocked ? onRemove : undefined}
                        onKeyChange={!isBlocked ? onHeaderKeyChange : undefined}
                        onDataTypeChange={!isBlocked ? onHeaderDataTypeChange : undefined}
                    />
                    <TextInput
                        clearable
                        value={configValue}
                        onChange={handleConfigChange}
                        onBlur={handleConfigCommit}
                        w={"100%"}
                        disabled={isBlocked}
                    />
                </div>
            </Flex>
        </div>
    )
}

const RuleHeader: React.FC<{
    rule: DataTypeRule,
    dataTypeLabel?: string,
    onClick?: () => void,
    onRemove?: () => void,
    isBlocked?: boolean,
    onKeyChange?: (value: string) => void,
    onDataTypeChange?: (value?: DataType | GenericType) => void,
}> = ({rule, dataTypeLabel, onClick, onRemove, isBlocked, onKeyChange, onDataTypeChange}) => {

    const variant = rule.variant as DataTypeRulesVariant | undefined
    const isTypeRule = variant ? !NON_TYPE_RULE_VARIANTS.has(variant) : false
    const suggestions = isTypeRule ? useSuggestions({
        dataType: {
            id: "gid://sagittarius/DataType/878634678"
        }
    }, [], "", 0, [0], 1, [DFlowSuggestionType.DATA_TYPE]) : []
    const rulesCount = rule?.config?.dataTypeIdentifier?.dataType?.rules?.nodes?.length ?? rule?.config?.dataTypeIdentifier?.genericType?.dataType?.rules?.nodes?.length ?? 0

    const [keyValue, setKeyValue] = React.useState<string>(() => ("key" in (rule?.config ?? {}) ? (rule?.config as any)?.key ?? "" : ""))
    const [dataTypeValue, setDataTypeValue] = React.useState<string>(() => dataTypeLabel ?? "")

    React.useEffect(() => {
        setKeyValue("key" in (rule?.config ?? {}) ? (rule?.config as any)?.key ?? "" : "")
    }, [rule])

    React.useEffect(() => {
        setDataTypeValue(dataTypeLabel ?? "")
    }, [dataTypeLabel])

    const handleKeyBlur = React.useCallback(() => {
        if (!onKeyChange || isBlocked) return
        onKeyChange(keyValue)
    }, [isBlocked, keyValue, onKeyChange])

    const handleDataTypeBlur = React.useCallback(() => {
        if (!onDataTypeChange || isBlocked) return
        if (dataTypeValue.trim() === "") {
            onDataTypeChange(undefined)
        }
    }, [dataTypeValue, isBlocked, onDataTypeChange])

    const handleSuggestionSelect = React.useCallback((suggestion: InputSuggestion) => {
        if (!onDataTypeChange || isBlocked) return
        const nextValue = suggestion.value
        if (!nextValue) return
        onDataTypeChange(nextValue)
        const label = suggestion?.ref?.displayText?.join(" ") ?? dataTypeLabel ?? ""
        setDataTypeValue(label)
    }, [dataTypeLabel, isBlocked, onDataTypeChange])

    return <div>
        <Flex justify={"space-between"}>
            <Badge color={"info"}>
                {rule?.variant}
            </Badge>
            {onRemove ? <Button color={"error"} onClick={onRemove}>
                <IconTrash size={16}/>
            </Button> : null}
        </Flex>
        <Flex mt={0.7} style={{flexDirection: "column", gap: ".7rem"}}>
            {isTypeRule ? (
                <Flex align={"center"} style={{gap: ".7rem"}}>
                    {rule.variant === "CONTAINS_KEY" ? <TextInput left={<Text size={"sm"}>Key</Text>} leftType={"icon"}
                                                                  disabled={isBlocked}
                                                                  defaultValue={keyValue}
                                                                  onChange={(event) => setKeyValue(event.target.value)}
                                                                  onBlur={handleKeyBlur}/> : null}
                    <TextInput left={<Text size={"sm"}>DataType</Text>} leftType={"icon"}
                               disabled={isBlocked}
                               suggestionsFooter={<DFlowSuggestionMenuFooter/>}
                               suggestions={toInputSuggestions(suggestions)}
                               value={dataTypeValue}
                               onChange={(event) => setDataTypeValue(event.target.value)}
                               onBlur={handleDataTypeBlur}
                               onSuggestionSelect={handleSuggestionSelect}/>
                </Flex>
            ) : null}
            {rulesCount > 0 ? (
                <InputLabel>
                    <Flex align={"center"} style={{gap: ".7rem"}}>
                        +{rulesCount} rules
                        included
                        <Button color={"primary"} onClick={onClick}>Show/Hide Rules</Button>
                    </Flex>
                </InputLabel>
            ) : null}
        </Flex>

    </div>

}

const getConfigValue = (payload: DataTypeRulesConfig): string => {

    if (!payload) return ""

    if ("pattern" in payload || payload?.__typename === "DataTypeRulesRegexConfig") {
        return payload?.pattern ?? ""
    }

    return JSON.stringify(payload)

}

const buildConfigFromValue = (value: string, fallback?: DataTypeRulesConfig | null): DataTypeRulesConfig | undefined => {
    if (!fallback) {
        try {
            return JSON.parse(value)
        } catch (e) {
            return undefined
        }
    }

    if ("pattern" in fallback || fallback?.__typename === "DataTypeRulesRegexConfig") {
        return {...fallback, pattern: value}
    }

    try {
        return JSON.parse(value)
    } catch (e) {
        return fallback
    }
}

const deepClone = <T, >(value: T): T => {
    if (value === undefined || value === null) {
        return value
    }
    return JSON.parse(JSON.stringify(value))
}

const getRuleIdentifierValue = (rule?: DataTypeRule | null): DataType | GenericType | undefined => {
    if (!rule?.config?.dataTypeIdentifier) return undefined

    return (
        rule.config.dataTypeIdentifier.dataType ??
        rule.config.dataTypeIdentifier.genericType ??
        undefined
    )
}

const areValuesEqual = (valueA?: DataType | GenericType, valueB?: DataType | GenericType): boolean => {
    if (!valueA && !valueB) return true
    if (!valueA || !valueB) return false

    return JSON.stringify(valueA) === JSON.stringify(valueB)
}

const isRuleEqual = (ruleA?: DataTypeRule | null, ruleB?: DataTypeRule | null): boolean => {
    if (!ruleA || !ruleB) return false
    return JSON.stringify({variant: ruleA.variant, config: ruleA.config}) === JSON.stringify({
        variant: ruleB.variant,
        config: ruleB.config
    })
}

const isRuleBlocked = (rule?: DataTypeRule | null, blockingDataType?: DataType): boolean => {
    if (!rule || !blockingDataType?.rules?.nodes) return false
    const blockingRules = blockingDataType.rules.nodes as (DataTypeRule | null | undefined)[]
    return blockingRules?.filter(Boolean).some(candidate => isRuleEqual(candidate as DataTypeRule, rule)) ?? false
}

const isDataType = (value: DataType | GenericType): value is DataType => {
    return value != null && (value as DataType).rules !== undefined
}

const isGenericType = (value: any): value is GenericType => {
    return value != null && typeof value === "object" && "genericMappers" in value
}

const getDataTypeFromValue = (value?: DataType | GenericType): DataType | undefined => {
    if (!value) return undefined
    if (isDataType(value)) return value
    return value.dataType ?? undefined
}

const ensureRuleNodes = (dataType: DataType): DataTypeRule[] => {
    if (!dataType.rules) {
        dataType.rules = {nodes: []} as DataTypeRuleConnection
    } else if (!dataType.rules.nodes) {
        dataType.rules.nodes = []
    }

    return dataType.rules.nodes as DataTypeRule[]
}

const mergeWithBlocking = (value?: DataType | GenericType, blocking?: DataType | GenericType): DataType | GenericType | undefined => {
    if (!value && !blocking) return undefined
    if (!value) return deepClone(blocking)

    const result = deepClone(value)
    const resultDataType = getDataTypeFromValue(result)
    const blockingDataType = getDataTypeFromValue(blocking)

    if (!resultDataType || !blockingDataType) {
        return result
    }

    const resultRules = ensureRuleNodes(resultDataType)
    const blockingRules = blockingDataType.rules?.nodes?.filter(Boolean) as DataTypeRule[] | undefined

    // Ensure every blocking rule exists in the editable value and recursively merge nested rules so
    // that locked sections stay in sync with the template.
    blockingRules?.forEach(blockRule => {
        if (!blockRule) return
        const existingRuleIndex = resultRules.findIndex(rule => isRuleEqual(rule, blockRule))
        if (existingRuleIndex === -1) {
            resultRules.push(deepClone(blockRule))
        } else {
            const existingRule = resultRules[existingRuleIndex]
            mergeNestedRules(existingRule, blockRule)
        }
    })

    return result
}

const mergeNestedRules = (target: DataTypeRule, blocking: DataTypeRule) => {
    const targetIdentifier = target?.config?.dataTypeIdentifier
    const blockingIdentifier = blocking?.config?.dataTypeIdentifier

    if (!targetIdentifier || !blockingIdentifier) return

    const targetValue = targetIdentifier.dataType ?? targetIdentifier.genericType
    const blockingValue = blockingIdentifier.dataType ?? blockingIdentifier.genericType

    if (!targetValue || !blockingValue) return

    const merged = mergeWithBlocking(targetValue, blockingValue)
    if (!merged) return

    if (isDataType(merged)) {
        targetIdentifier.dataType = merged
    } else {
        targetIdentifier.genericType = merged
    }
}
