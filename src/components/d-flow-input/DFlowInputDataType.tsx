import {InputDescription, InputLabel, ValidationProps} from "../form";
import {
    DataTypeIdentifier,
    DataTypeRule,
    DataTypeRulesContainsKeyConfig,
    Maybe
} from "@code0-tech/sagittarius-graphql-types";
import React from "react";
import {Card} from "../card/Card";
import {Flex} from "../flex/Flex";
import {Text} from "../text/Text";
import {Badge} from "../badge/Badge";
import {Button} from "../button/Button";
import {IconEdit} from "@tabler/icons-react";
import CardSection from "../card/CardSection";
import "./DFlowInputDataType.style.scss"
import {hashToColor} from "../d-flow/DFlow.util";
import {useService, useStore} from "../../utils";
import {DFlowDataTypeReactiveService} from "../d-flow-data-type";
import {DFlowInputDataTypeEditDialog} from "./DFlowInputDataTypeEditDialog";

export interface DFlowInputDataTypeProps extends ValidationProps<DataTypeIdentifier> {
    onChange?: (value: DataTypeIdentifier | null) => void
    description?: string
    label?: string
}

export interface DFlowInputDataTypeRuleTreeProps {
    dataTypeIdentifier: DataTypeIdentifier
    parentRule?: Maybe<DataTypeRule>
    isRoot?: boolean
}

export const DFlowInputDataType: React.FC<DFlowInputDataTypeProps> = (props) => {

    const {initialValue, defaultValue, value, label, description} = props
    const initValue = value ?? initialValue ?? defaultValue ?? null

    const dataTypeService = useService(DFlowDataTypeReactiveService)
    const dataTypeStore = useStore(DFlowDataTypeReactiveService)

    const [editOpen, setEditOpen] = React.useState(false)

    const initialDataType = React.useMemo(() => {
        return dataTypeService.getDataType(initValue!)
    }, [dataTypeStore, initValue])

    return <div>
        <DFlowInputDataTypeEditDialog dataTypeIdentifier={initValue!}
                                      open={editOpen}
                                      onDataTypeChange={props.onChange}
                                      onOpenChange={open => setEditOpen(open)}/>
        <InputLabel>{label}</InputLabel>
        <InputDescription>{description}</InputDescription>
        <Card color={"secondary"} paddingSize={"xs"}>
            <Flex style={{gap: ".7rem"}} align={"center"} justify={"space-between"}>
                <Flex style={{gap: ".35rem"}} align={"center"}>
                    <Text hierarchy={"tertiary"}>
                        {(initialDataType?.name?.[0].content) ?? "Unnamed Data Type"}
                    </Text>
                </Flex>
                <Flex style={{gap: ".35rem"}} align={"center"}>
                    <Button paddingSize={"xxs"} variant={"filled"} color={"tertiary"} onClick={() => setEditOpen(true)}>
                        <IconEdit size={13}/>
                    </Button>
                </Flex>
            </Flex>
            <Card paddingSize={"xs"} mt={0.7} mb={-0.7} mx={-0.7} style={{borderWidth: "2px"}}>
                <DFlowInputDataTypeRuleTree dataTypeIdentifier={initValue!}/>
            </Card>
        </Card>
    </div>
}

export const DFlowInputDataTypeRuleTree: React.FC<DFlowInputDataTypeRuleTreeProps> = (props) => {
    const {dataTypeIdentifier, parentRule, isRoot = !parentRule} = props

    const dataTypeService = useService(DFlowDataTypeReactiveService)
    const dataTypeStore = useStore(DFlowDataTypeReactiveService)

    const genericMap = React.useMemo(() => {
        const rules = dataTypeIdentifier.genericType?.genericMappers ?? [];
        return new Map(rules.map(g => [g.target!!, g] as const))
    }, [dataTypeIdentifier])

    const currentDataTypes = React.useMemo(() => {
        if (dataTypeIdentifier.genericKey) {
            const genericEntry = genericMap.get(dataTypeIdentifier.genericKey)
            return genericEntry?.sourceDataTypeIdentifiers?.map(id => dataTypeService.getDataType(id)) ?? []
        }
        return [dataTypeService.getDataType(dataTypeIdentifier)]
    }, [dataTypeStore, dataTypeIdentifier, genericMap])

    const resolveChildIdentifier = React.useCallback((childRawIdentifier: DataTypeIdentifier): DataTypeIdentifier | null => {
        if (!childRawIdentifier) return null
        if (childRawIdentifier.genericKey) {
            return genericMap.get(childRawIdentifier.genericKey)?.sourceDataTypeIdentifiers?.[0] ?? null
        }
        return childRawIdentifier
    }, [genericMap])

    const nodes = React.useMemo(() => {
        return currentDataTypes.flatMap((dataType, typeIndex) => {
            const rules = dataType?.rules?.nodes ?? []
            if (!rules.length) return []

            return rules.map((rule, ruleIndex) => {
                const key = `${typeIndex}-${ruleIndex}`
                const rawChildId = (rule?.config as any)?.dataTypeIdentifier as DataTypeIdentifier
                const childId = resolveChildIdentifier(rawChildId)

                if (rule?.variant === "PARENT_TYPE" && childId) {
                    return <DFlowInputDataTypeRuleTree
                        key={key}
                        dataTypeIdentifier={childId}
                        parentRule={rule}
                        isRoot={isRoot}
                    />
                }

                if (!childId) return null

                const childType = dataTypeService.getDataType(childId)
                const isChildPrimitive = childType?.variant === "PRIMITIVE"
                const typeName = childType?.name?.[0]?.content

                let label: React.ReactNode = null
                if (rule?.variant === "CONTAINS_KEY") {
                    const keyConfig = rule?.config as DataTypeRulesContainsKeyConfig
                    label = (
                        <Flex align={"center"} style={{gap: ".35rem", textWrap: "nowrap"}} className={"rule"}>
                            <Badge border color={"secondary"} style={{verticalAlign: "middle"}}>
                                <Text size={"xs"} style={{color: "inherit"}}>{keyConfig?.key}</Text>
                            </Badge>
                            <Text>
                                {parentRule?.variant === "CONTAINS_KEY" ? "is a field inside" : "is a field"}
                                {isChildPrimitive ? " of type" : ""}
                            </Text>
                            {isChildPrimitive && (
                                <Badge border color={hashToColor(typeName ?? "")} style={{verticalAlign: "middle"}}>
                                    <Text size={"xs"} style={{color: "inherit"}}>{typeName}</Text>
                                </Badge>
                            )}
                        </Flex>
                    )
                } else if (rule?.variant === "CONTAINS_TYPE") {
                    const prevKey = (parentRule?.config as DataTypeRulesContainsKeyConfig)?.key
                    label = (
                        <Flex align={"center"} style={{gap: ".35rem", textWrap: "nowrap"}} className={"rule"}>
                            <Text>Inside</Text>
                            {prevKey && (
                                <Badge border color={"secondary"} style={{verticalAlign: "middle"}}>
                                    <Text size={"xs"} style={{color: "inherit"}}>{prevKey}</Text>
                                </Badge>
                            )}
                            <Text ml={-0.35}>, each entity has</Text>
                        </Flex>
                    )
                }

                const childTree = <DFlowInputDataTypeRuleTree dataTypeIdentifier={childId} parentRule={rule}/>

                if (isRoot) return <CardSection key={key} border> {label} {childTree} </CardSection>

                return <li key={key}> {label} {childTree} </li>
            })
        })
    }, [currentDataTypes, isRoot, resolveChildIdentifier, dataTypeService, parentRule])

    const validNodes = nodes.filter(Boolean)
    if (validNodes.length === 0) return null

    if (isRoot || parentRule?.variant === "PARENT_TYPE") {
        return <>{validNodes}</>
    }

    return <ul>{validNodes}</ul>
}
