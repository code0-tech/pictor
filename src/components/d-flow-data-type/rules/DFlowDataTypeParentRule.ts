import {DFlowDataTypeRule, staticImplements} from "./DFlowDataTypeRule";
import {DFlowDataTypeReactiveService} from "../DFlowDataType.service";
import {replaceGenericKeysInType} from "../../../utils/generics";
import type {DataTypeIdentifier, Flow, GenericMapper, NodeParameterValue} from "@code0-tech/sagittarius-graphql-types";
import {useValueValidation} from "../../d-flow-validation/DValueValidation.hook";

export interface DFlowDataTypeParentRuleConfig {
    type: DataTypeIdentifier
}

@staticImplements<DFlowDataTypeRule>()
export class DFlowDataTypeParentRule {
    public static validate(value: NodeParameterValue, config: DFlowDataTypeParentRuleConfig, generics?: Map<string, GenericMapper>, flow?: Flow, dataTypeService?: DFlowDataTypeReactiveService): boolean {

        const replacedType = generics ? replaceGenericKeysInType(config.type, generics) : config.type

        if (!dataTypeService) return false
        return useValueValidation(value, dataTypeService.getDataType(replacedType)!!, dataTypeService, flow, Array.from(generics!!, ([_, value]) => value))

    }
}