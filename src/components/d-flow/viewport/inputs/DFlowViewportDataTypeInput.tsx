import {ValidationProps} from "../../../form/useForm";
import {
    DataType,
    DataTypeRulesContainsKeyConfig,
    DataTypeRulesParentTypeConfig, GenericMapper
} from "@code0-tech/sagittarius-graphql-types";
import React from "react";
import InputMessage from "../../../form/InputMessage";
import "./DFlowViewportDataTypeInput.style.scss"
import TextInput from "../../../form/TextInput";
import Button from "../../../button/Button";
import {IconChevronDown, IconGripVertical, IconSettings} from "@tabler/icons-react";
import Text from "../../../text/Text";
import Flex from "../../../flex/Flex";
import {DataTypeRulesConfig} from "@code0-tech/sagittarius-graphql-types";
import {replaceGenericKeysInDataTypeObject} from "../../../../utils/generics";

export interface DFlowViewportDataTypeInputProps extends ValidationProps<DataType> {
}

export const DFlowViewportDataTypeInput: React.FC<DFlowViewportDataTypeInputProps> = (props) => {

    const {
        formValidation,
        required,
        initialValue
    } = props

    //TODO: dataTypeIdentifiers need to be mapped with potential existing generic mapper

    return <div>

        {/**
        <Flex justify={"space-between"}>
            <Text mb={1} display={"block"}>{initialValue?.name?.nodes!![0]?.content}</Text>
            <IconChevronDown size={16}/>
        </Flex>
        **/}

        <div className={"d-flow-viewport-data-type-input"}>

            {initialValue?.rules?.nodes?.map(rule => {
                const isParentType = rule?.variant === "PARENT_TYPE";
                const ptConfig = rule?.config as DataTypeRulesParentTypeConfig | undefined;

                const parentHasRules =
                    ((ptConfig?.dataTypeIdentifier?.dataType?.rules?.nodes?.length ?? 0) > 0) ||
                    ((ptConfig?.dataTypeIdentifier?.genericType?.dataType?.rules?.nodes?.length ?? 0) > 0);

                const shouldRender = !isParentType || parentHasRules;

                return shouldRender ? (
                    <div className="d-flow-viewport-data-type-input__rule">
                        <Text hierarchy="tertiary" size="xs">
                            {rule?.variant} {rule?.variant === "CONTAINS_KEY" ? ((rule?.config as DataTypeRulesContainsKeyConfig).key ?? "") : ""}
                        </Text>

                        {rule?.config?.dataTypeIdentifier?.dataType || rule?.config?.dataTypeIdentifier?.genericType?.dataType ? (
                            <DFlowViewportDataTypeInput
                                initialValue={
                                    rule.config.dataTypeIdentifier.dataType ??
                                    replaceGenericKeysInDataTypeObject((rule?.config?.dataTypeIdentifier?.genericType?.dataType as DataType), new Map<string, GenericMapper>(rule?.config?.dataTypeIdentifier?.genericType?.genericMappers?.map((generic: GenericMapper) => [generic.target, generic])))
                                }
                            />
                        ) : (
                            <div>
                                <Flex align="center">
                                    <Button variant="none">
                                        <IconGripVertical size={16} />
                                    </Button>
                                    <div style={{ flex: 1 }}>
                                        <TextInput clearable defaultValue={getConfigValue(rule?.config!!)} w="100%" />
                                    </div>
                                </Flex>
                            </div>
                        )}
                    </div>
                ) : null;
            })}
            <Button color={"primary"}><IconSettings size={16}/> add new rule</Button>
        </div>

        {!formValidation?.valid && formValidation?.notValidMessage && (
            <InputMessage>{formValidation.notValidMessage}</InputMessage> // Show validation error
        )}
    </div>

}

const getConfigValue = (payload: DataTypeRulesConfig): string => {

    if ("pattern" in payload || payload.__typename == "DataTypeRulesRegexConfig") {
        return payload.pattern!!
    }

    return JSON.stringify(payload)

}