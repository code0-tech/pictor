import {ValidationProps} from "../../../form/useForm";
import {DataType} from "@code0-tech/sagittarius-graphql-types";
import React from "react";
import InputMessage from "../../../form/InputMessage";
import "./DFlowViewportDataTypeInput.style.scss"
import TextInput from "../../../form/TextInput";
import Button from "../../../button/Button";
import {IconChevronDown, IconGripVertical, IconSettings} from "@tabler/icons-react";
import Text from "../../../text/Text";
import Flex from "../../../flex/Flex";
import {DataTypeRulesConfig} from "@code0-tech/sagittarius-graphql-types";

export interface DFlowViewportDataTypeInputProps extends ValidationProps<DataType> {
}

export const DFlowViewportDataTypeInput: React.FC<DFlowViewportDataTypeInputProps> = (props) => {

    const {
        formValidation,
        required,
        initialValue
    } = props

    return <div>
        <Flex justify={"space-between"}>
            <Text mb={1} display={"block"}>{initialValue?.name?.nodes!![0]?.content}</Text>
            <IconChevronDown size={16}/>
        </Flex>

        <div className={"d-flow-viewport-data-type-input"}>

            {initialValue?.rules?.nodes?.map(rule => {
                return <div className={"d-flow-viewport-data-type-input__rule"}>
                    {rule?.config?.dataTypeIdentifier?.dataType || rule?.config?.dataTypeIdentifier?.genericType   ?
                        <DFlowViewportDataTypeInput initialValue={rule.config.dataTypeIdentifier.dataType || rule.config.dataTypeIdentifier.genericType.dataType}/> : null}
                    {!rule?.config?.dataTypeIdentifier?.dataType && !rule?.config?.dataTypeIdentifier?.genericType  ?
                        (
                            <div>
                                <Text hierarchy={"tertiary"} size={"xs"}>{rule?.variant}</Text>
                                <Flex align={"center"}>
                                    <Button variant={"none"}><IconGripVertical size={16}/></Button>
                                    <div style={{flex: 1}}>
                                        <TextInput clearable defaultValue={getConfigValue(rule?.config!!)} w={"100%"}/>
                                    </div>

                                </Flex>
                            </div>
                        ) : null}
                </div>
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