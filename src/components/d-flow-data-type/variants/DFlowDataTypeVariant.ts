import type {NodeParameterValue} from "@code0-tech/sagittarius-graphql-types";

export interface DFlowDataTypeVariant {
    validate(value: NodeParameterValue): boolean
}