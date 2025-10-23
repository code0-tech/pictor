import {DFlowDataTypeRule, staticImplements} from "./DFlowDataTypeRule";
import {DFlowDataTypeService} from "../DFlowDataType.service";
import {replaceGenericKeysInType} from "../../../../utils/generics";
import {DataTypeIdentifier, GenericMapper, NodeParameterValue} from "@code0-tech/sagittarius-graphql-types";
import {useValidateValue} from "../DFlowDataType.validation.value";

export interface DFlowDataTypeParentRuleConfig {
    type: DataTypeIdentifier
}

@staticImplements<DFlowDataTypeRule>()
export class DFlowDataTypeParentRule {
    public static validate(value: NodeParameterValue, config: DFlowDataTypeParentRuleConfig, generics?: Map<string, GenericMapper>, service?: DFlowDataTypeService): boolean {

        const replacedType = generics ? replaceGenericKeysInType(config.type, generics) : config.type

        if (!service) return false
        return useValidateValue(value, service.getDataType(replacedType)!!, Array.from(generics!!, ([_, value]) => value))

    }
}