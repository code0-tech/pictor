import {ValidationProps} from "../../../form/useForm";
import {
    DataType,
    DataTypeRule,
    DataTypeRulesConfig,
    DataTypeRulesParentTypeConfig,
    DataTypeRulesVariant,
    GenericMapper,
    GenericType
} from "@code0-tech/sagittarius-graphql-types";
import React from "react";
import InputMessage from "../../../form/InputMessage";
import "./DFlowViewportDataTypeInput.style.scss"
import TextInput from "../../../form/TextInput";
import Button from "../../../button/Button";
import {IconGripVertical, IconSettings, IconTrash} from "@tabler/icons-react";
import Text from "../../../text/Text";
import Flex from "../../../flex/Flex";
import Badge from "../../../badge/Badge";
import InputLabel from "../../../form/InputLabel";

export interface DFlowViewportDataTypeInputProps extends ValidationProps<DataType | GenericType> {
    onChange?: (value: DataType | GenericType) => void
    blockingDataType?: DataType | GenericType
}

export const DFlowViewportDataTypeInput: React.FC<DFlowViewportDataTypeInputProps> = (props) => {

    const {
        formValidation,
        required,
        initialValue,
        onChange = (_) => {},
        blockingDataType
    } = props

    //TODO: dataTypeIdentifiers need to be mapped with potential existing generic mapper
    const dataType = "rules" in initialValue!! ? initialValue : initialValue?.dataType
    return <div>

        <div className={"d-flow-viewport-data-type-input"}>

            {dataType?.rules?.nodes?.map((rule: DataTypeRule) => {
                const [open, setOpen] = React.useState<boolean>(false)
                const isParentType = rule?.variant === "PARENT_TYPE";
                const ptConfig = rule?.config as DataTypeRulesParentTypeConfig | undefined;

                const parentHasRules =
                    ((ptConfig?.dataTypeIdentifier?.dataType?.rules?.nodes?.length ?? 0) > 0) ||
                    ((ptConfig?.dataTypeIdentifier?.genericType?.dataType?.rules?.nodes?.length ?? 0) > 0);

                const shouldRender = !isParentType || parentHasRules;
                const genericMap = new Map<string, GenericMapper>((initialValue as GenericType).genericMappers?.map((generic: GenericMapper) => [generic.target, generic]))

                return shouldRender ? (
                    <div className="d-flow-viewport-data-type-input__rule">

                        {rule?.config?.dataTypeIdentifier?.dataType || rule?.config?.dataTypeIdentifier?.genericType ? (
                            <>
                                <RuleHeader rule={rule} genericMapper={genericMap}
                                            onClick={() => setOpen(prevState => !prevState)}/>
                                {open ? <DFlowViewportDataTypeInput
                                    initialValue={
                                        rule?.config?.dataTypeIdentifier?.dataType ??
                                        rule?.config?.dataTypeIdentifier?.genericType
                                    }
                                /> : null}
                            </>
                        ) : rule?.config?.dataTypeIdentifier?.genericKey ? genericMap.get(rule?.config?.dataTypeIdentifier?.genericKey)?.sourceDataTypeIdentifiers?.map(type => {
                            return <>
                                <RuleHeader rule={rule} genericMapper={genericMap}
                                            onClick={() => setOpen(prevState => !prevState)}/>
                                <DFlowViewportDataTypeInput
                                    initialValue={
                                        type?.dataType ??
                                        type?.genericType
                                    }
                                />
                            </>
                        }) : (
                            <div>
                                <Flex align="center">
                                    <Button disabled variant="none">
                                        <IconGripVertical size={16}/>
                                    </Button>
                                    <div style={{flex: 1}}>
                                        <RuleHeader rule={rule} genericMapper={genericMap}
                                                    onClick={() => setOpen(prevState => !prevState)}/>
                                        <TextInput clearable defaultValue={getConfigValue(rule?.config!!)} w="100%"/>
                                    </div>
                                </Flex>
                            </div>
                        )}
                    </div>
                ) : null;
            })}
            <Button color={"primary"}><IconSettings size={16}/> Add new rule</Button>
        </div>

        {!formValidation?.valid && formValidation?.notValidMessage && (
            <InputMessage>{formValidation.notValidMessage}</InputMessage> // Show validation error
        )}
    </div>

}

const RuleHeader = ({rule, genericMapper, onClick}: {
    rule: DataTypeRule,
    genericMapper?: Map<string, GenericMapper>,
    onClick?: () => void
}) => {

    const nonTypeRulesArray = [DataTypeRulesVariant.ItemOfCollection, DataTypeRulesVariant.Regex, DataTypeRulesVariant.NumberRange]
    const isTypeRule = !nonTypeRulesArray.includes(rule.variant!!)
    const isGenericKey = !!rule?.config?.dataTypeIdentifier?.genericKey
    const dataTypeLabel = isGenericKey ? genericMapper.get(rule?.config?.dataTypeIdentifier?.genericKey)?.sourceDataTypeIdentifiers[0]?.dataType?.name?.nodes!![0].content ?? genericMapper.get(rule?.config?.dataTypeIdentifier?.genericKey)?.sourceDataTypeIdentifiers[0]?.genericType?.dataType?.name?.nodes!![0].content : rule?.config?.dataTypeIdentifier?.dataType?.name?.nodes!![0].content ?? rule?.config?.dataTypeIdentifier?.genericType?.dataType?.name?.nodes!![0].content

    return isTypeRule ? <div>
        <Flex justify={"space-between"} style={{
            position: "absolute",
            top: 0,
            left: "1rem",
            width: "calc(100% - 2rem)",
            transform: "translate(0%, -50%)",
            zIndex: 2,
            gap: ".7rem"
        }}>
            <Badge color={"info"}>
                {rule?.variant}
            </Badge>
            <Button color={"error"}>
                <IconTrash size={16}/>
            </Button>
        </Flex>
        <Flex mt={0.7} style={{flexDirection: "column", gap: ".7rem"}}>

            <InputLabel>Configuration</InputLabel>
            <Flex align={"center"} style={{gap: ".7rem"}}>
                <TextInput left={<Text size={"sm"}>DataType</Text>} leftType={"icon"} disabled
                           defaultValue={dataTypeLabel}/>
                {rule.variant === "CONTAINS_KEY" ?
                    <TextInput left={<Text size={"sm"}>Key</Text>} leftType={"icon"} disabled
                               defaultValue={rule.config.key}/> : null}
            </Flex>
            <InputLabel>
                <Flex align={"center"} style={{gap: ".7rem"}}>
                    +{rule?.config?.dataTypeIdentifier?.dataType?.rules?.nodes?.length ?? rule?.config?.dataTypeIdentifier?.genericType?.dataType?.rules?.nodes?.length ?? 0} rules
                    included
                    <Button color={"primary"} onClick={onClick}>Show/Hide Rules</Button>
                </Flex>
            </InputLabel>
        </Flex>

    </div> : <Badge color={"info"} mb={0.35}>
        {rule?.variant}
    </Badge>

}

const getConfigValue = (payload: DataTypeRulesConfig): string => {

    if ("pattern" in payload || payload.__typename == "DataTypeRulesRegexConfig") {
        return payload.pattern!!
    }

    return JSON.stringify(payload)

}