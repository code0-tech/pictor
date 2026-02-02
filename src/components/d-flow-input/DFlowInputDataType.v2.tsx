import {ValidationProps} from "../form";
import {
    DataType,
    DataTypeIdentifier,
    DataTypeRule,
    DataTypeRulesContainsKeyConfig,
    DataTypeRulesContainsTypeConfig,
    DataTypeRulesItemOfCollectionConfig,
    DataTypeRulesNumberRangeConfig,
    DataTypeRulesParentTypeConfig,
    DataTypeRulesRegexConfig,
    type GenericMapper,
    Maybe
} from "@code0-tech/sagittarius-graphql-types";
import React from "react";
import {Card} from "../card/Card";
import {Flex} from "../flex/Flex";
import {Text} from "../text/Text";
import {Badge} from "../badge/Badge";
import {ButtonGroup} from "../button-group/ButtonGroup";
import {Button} from "../button/Button";
import {IconEdit, IconFilterCheck} from "@tabler/icons-react";
import CardSection from "../card/CardSection";
import "./DFlowInputDataType.scss"
import {hashToColor} from "../d-flow/DFlow.util";
import {useService, useStore} from "../../utils";
import {DataTypeView, DFlowDataTypeReactiveService} from "../d-flow-data-type";
import {replaceIdentifiersInRule} from "../../utils/generics";

export interface DFlowInputDataTypeProps extends ValidationProps<DataType | DataTypeIdentifier> {
    onChange?: (value: DataType | DataTypeIdentifier | null) => void
    description?: string
    label?: string
}

export const DFlowInputDataType: React.FC<DFlowInputDataTypeProps> = (props) => {

    const {initialValue, defaultValue, value, label, description, onChange} = props
    const initValue = value ?? initialValue ?? defaultValue ?? null
    const isDataTypeIdentifier = initValue?.__typename === "DataTypeIdentifier" || ("dataType" in initValue!) || ("genericType" in initValue!)

    const dataTypeService = useService(DFlowDataTypeReactiveService)
    const dataTypeStore = useStore(DFlowDataTypeReactiveService)

    const initialDataType = React.useMemo(() => {
        return isDataTypeIdentifier ? dataTypeService.getDataType(initValue) : new DataTypeView((initValue as DataType))
    }, [dataTypeStore])


    console.log(initialDataType)

    return <Card color={"secondary"} paddingSize={"xs"}>
        <Flex style={{gap: ".7rem"}} align={"center"} justify={"space-between"}>
            <Flex style={{gap: ".35rem"}} align={"center"}>
                <Text hierarchy={"tertiary"}>
                    {(initialDataType?.name?.[0].content) ?? "Unnamed Data Type"}
                </Text>
            </Flex>
            <Flex style={{gap: ".35rem"}} align={"center"}>
                <ButtonGroup color={"primary"}>
                    <Button paddingSize={"xxs"}
                            variant={"filled"}
                            color={"secondary"}>
                        <IconFilterCheck size={13}/>
                    </Button>
                    <Button paddingSize={"xxs"}
                            variant={"filled"}
                            color={"secondary"}>
                        <IconEdit size={13}/>
                    </Button>
                </ButtonGroup>
            </Flex>
        </Flex>
        <Card paddingSize={"xs"} mt={0.7} mb={-0.7} mx={-0.7} style={{borderWidth: "2px"}}>
            {initialDataType?.rules?.nodes?.map(rule => {
                const map = new Map<string, GenericMapper>((initValue as DataTypeIdentifier).genericType?.genericMappers?.map(generic => [generic.target!!, generic]))
                return <CardSection border>
                    <DFlowInputDataTypeRuleTree rule={rule} genericMap={map}/>
                </CardSection>
            })}
        </Card>
    </Card>

}

export interface DFlowInputDataTypeRuleTreeProps {
    rule?: Maybe<DataTypeRule>
    genericMap?: Map<string, GenericMapper>
    previousRule?: Maybe<DataTypeRule>
}

const DFlowInputDataTypeRuleTree: React.FC<DFlowInputDataTypeRuleTreeProps> = (props) => {

    const {rule, previousRule} = props

    const ruleVariant = rule?.variant
    const previousRuleVariant = previousRule?.variant

    if (ruleVariant === "CONTAINS_KEY") {
        const config = rule?.config as DataTypeRulesContainsKeyConfig
        const dataType = config.dataTypeIdentifier?.dataType ?? config.dataTypeIdentifier?.genericType?.dataType
        return <div>
            <Flex align={"center"} style={{gap: ".35rem", textWrap: "nowrap"}}>
                <Badge border color={"secondary"} style={{verticalAlign: "middle"}}>
                    <Text style={{color: "inherit"}}>{config?.key}</Text>
                </Badge>
                <Text size={"md"}>
                    {previousRuleVariant === "CONTAINS_KEY" ? "is a field inside" : "is a field"}
                    {(dataType?.rules?.nodes?.length ?? 0) <= 0 ? ` of type` : ""}
                </Text>
                {(dataType?.rules?.nodes?.length ?? 0) <= 0 ? (
                    <Badge border color={hashToColor(dataType?.name?.[0].content ?? "")}
                           style={{verticalAlign: "middle"}}>
                        <Text style={{color: "inherit"}}>{dataType?.name?.[0].content}</Text>
                    </Badge>
                ) : null}
            </Flex>
            {(dataType?.rules?.nodes?.length ?? 0) > 0 && (
                <ul>
                    {dataType?.rules?.nodes?.map(nextRule => {
                        if (nextRule?.variant === "PARENT_TYPE") {
                            const config = nextRule?.config as DataTypeRulesParentTypeConfig
                            const dataType = config.dataTypeIdentifier?.dataType ?? config.dataTypeIdentifier?.genericType?.dataType
                            return dataType?.rules?.nodes?.map(nextRule => {
                                return <li>
                                    <DFlowInputDataTypeRuleTree rule={nextRule} previousRule={rule}/>
                                </li>
                            })
                        }
                        return <li>
                            <DFlowInputDataTypeRuleTree rule={nextRule} previousRule={rule}/>
                        </li>
                    })}
                </ul>
            )}
        </div>
    } else if (ruleVariant === "CONTAINS_TYPE") {
        const config = rule?.config as DataTypeRulesContainsTypeConfig
        const dataType = config.dataTypeIdentifier?.dataType ?? config.dataTypeIdentifier?.genericType?.dataType
        return <div>
            <Flex align={"center"} style={{gap: ".35rem"}}>
                <Text>Inside</Text>
                <Badge border color={"secondary"} style={{verticalAlign: "middle"}}>
                    <Text size={"xs"}
                          style={{color: "inherit"}}>{(previousRule?.config as DataTypeRulesContainsKeyConfig)?.key}</Text>
                </Badge>
                <Text>, each entity has</Text>
            </Flex>
            {(dataType?.rules?.nodes?.length ?? 0) > 0 && (
                <ul>
                    {dataType?.rules?.nodes?.map(nextRule => {
                        if (nextRule?.variant === "PARENT_TYPE") {
                            const config = nextRule?.config as DataTypeRulesParentTypeConfig
                            const dataType = config.dataTypeIdentifier?.dataType ?? config.dataTypeIdentifier?.genericType?.dataType
                            return dataType?.rules?.nodes?.map(nextRule => {
                                return <li>
                                    <DFlowInputDataTypeRuleTree rule={nextRule} previousRule={rule}/>
                                </li>
                            })
                        }
                        return <li>
                            <DFlowInputDataTypeRuleTree rule={nextRule} previousRule={rule}/>
                        </li>
                    })}
                </ul>
            )}
        </div>
    } else if (ruleVariant === "PARENT_TYPE") {
        const config = rule?.config as DataTypeRulesParentTypeConfig
        console.log(config)
        const dataType = config.dataTypeIdentifier?.dataType ?? config.dataTypeIdentifier?.genericType?.dataType
        return dataType?.rules?.nodes?.map(nextRule => {
            return  <DFlowInputDataTypeRuleTree rule={nextRule} previousRule={rule}/>
        })
    } else if (ruleVariant === "ITEM_OF_COLLECTION") {
        const config = rule?.config as DataTypeRulesItemOfCollectionConfig
    } else if (ruleVariant === "REGEX") {
        const config = rule?.config as DataTypeRulesRegexConfig
    } else if (ruleVariant === "NUMBER_RANGE") {
        const config = rule?.config as DataTypeRulesNumberRangeConfig
    }

    return null
}

