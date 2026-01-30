import type {NodeParameterValue} from "@code0-tech/sagittarius-graphql-types";
import {DFlowDataTypeVariant} from "./DFlowDataTypeVariant";
import {staticImplements} from "../rules/DFlowDataTypeRule";

@staticImplements<DFlowDataTypeVariant>()
export class DFlowDataTypeNodeVariant {
    public static validate(value: NodeParameterValue): boolean {
        return value.__typename == 'NodeFunctionIdWrapper';
    }
}