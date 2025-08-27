import {GenericMapper, Type, Value} from "../DFlowDataType.view";
import {DFlowDataTypeRule, staticImplements} from "./DFlowDataTypeRule";
import {DFlowDataTypeService} from "../DFlowDataType.service";
import {DFlowDataTypeContainsKeyRuleConfig} from "./DFlowDataTypeContainsKeyRule";
import {replaceGenericKeysInType} from "../../../../utils/generics";

export interface DFlowDataTypeParentRuleConfig {
    type: Type
}

@staticImplements<DFlowDataTypeRule>()
export class DFlowDataTypeParentRule {
    public static validate(value: Value, config: DFlowDataTypeContainsKeyRuleConfig, generics?: Map<string, GenericMapper>, service?: DFlowDataTypeService): boolean {

        const replacedType = generics ? replaceGenericKeysInType(config.type, generics) : config.type

        if (!service) return false
        return service.getDataType(replacedType)!!.validateValue(value, Array.from(generics!!, ([_, value]) => value));

    }
}