import type {DataTypeVariant} from "@code0-tech/sagittarius-graphql-types";
import {DFlowDataTypeVariant} from "./DFlowDataTypeVariant";
import {DFlowDataTypeNodeVariant} from "./DFlowDataTypeNodeVariant";

export const VariantsMap = new Map<DataTypeVariant, DFlowDataTypeVariant>([
    ["NODE" as DataTypeVariant.Node, DFlowDataTypeNodeVariant],

])