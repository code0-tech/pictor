import React from "react"
import type {
    Flow,
    Maybe,
    NodeFunction,
    NodeFunctionIdWrapper,
    NodeParameterValue,
    Scalars
} from "@code0-tech/sagittarius-graphql-types"
import {DataTypeView, DFlowDataTypeReactiveService} from "../d-flow-data-type"
import {InspectionSeverity, useService, useStore, ValidationResult} from "../../utils"
import {
    GenericMap,
    replaceGenericKeysInDataTypeObject,
    replaceGenericKeysInType,
    resolveGenericKeys
} from "../../utils/generics"
import {useReturnType} from "../d-flow-function/DFlowFunction.return.hook"
import {DFlowFunctionReactiveService} from "../d-flow-function/DFlowFunction.service"
import {useDataTypeValidation} from "./DDataTypeValidation.hook"
import {useValueValidation} from "./DValueValidation.hook"
import {DFlowReactiveService} from "../d-flow/DFlow.service"

const isReferenceOrNode = (value: NodeParameterValue) =>
    value.__typename === "ReferenceValue" || value.__typename === "NodeFunctionIdWrapper"

const isNode = (value: NodeParameterValue) =>
    value.__typename === "NodeFunctionIdWrapper"

const resolveDataTypeWithGenerics = (
    dataType: DataTypeView,
    genericMap: GenericMap
) =>
    new DataTypeView(
        replaceGenericKeysInDataTypeObject(dataType.json!, genericMap)
    )

const errorResult = (
    parameterId: Maybe<Scalars["ParameterDefinitionID"]["output"]>,
    expected?: DataTypeView,
    actual?: DataTypeView
): ValidationResult => ({
    parameterId,
    type: InspectionSeverity.ERROR,
    message: {
        nodes: [{
            code: "en-US",
            content: `Argument of type ${actual?.name?.nodes!![0]?.content} is not assignable to parameter of type ${expected?.name?.nodes!![0]?.content}`
        }]
    }
})

export const useNodeValidation = (
    nodeId: NodeFunction['id'],
    flowId: Flow['id']
): ValidationResult[] | null => {

    const functionService = useService(DFlowFunctionReactiveService)
    const functionStore = useStore(DFlowFunctionReactiveService)
    const flowService = useService(DFlowReactiveService)
    const flowStore = useStore(DFlowReactiveService)
    const dataTypeService = useService(DFlowDataTypeReactiveService)
    const dataTypeStore = useStore(DFlowDataTypeReactiveService)

    const flow = React.useMemo(() => flowService.getById(flowId), [flowService, flowId, flowStore])
    const node = React.useMemo(() => flowService.getNodeById(flowId, nodeId), [flowId, nodeId, flowStore])
    const values = React.useMemo(() => node?.parameters?.nodes?.map(p => p?.value!!) ?? [], [node])
    const functionDefinition = React.useMemo(() => functionService.getById(node?.functionDefinition?.id), [node, functionStore])
    const parameters = React.useMemo(() => functionDefinition?.parameterDefinitions ?? [], [functionDefinition])
    const genericKeys = React.useMemo(() => functionDefinition?.genericKeys ?? [], [functionDefinition])
    const genericMap = React.useMemo(() => resolveGenericKeys(functionDefinition!, values, dataTypeService, flow), [functionDefinition, values, dataTypeStore, flow])

    const resolveValueType = React.useCallback(
        (value: NodeParameterValue, expectedDT?: DataTypeView) => {
            if (isNode(value) && expectedDT?.variant !== "NODE") {
                const node = flowService.getNodeById(flowId, (value as NodeFunctionIdWrapper).id)
                const fn = functionService.getById(node?.functionDefinition?.id!!)!!
                const params = node?.parameters?.nodes?.map(p => p?.value!!) ?? []
                return useReturnType(fn, params, dataTypeService)
            }
            return dataTypeService.getTypeFromValue(value, flow)
        },
        [functionService, dataTypeService, flow, dataTypeStore]
    )

    return React.useMemo(() => {
        const errors: ValidationResult[] = []

        for (let i = 0; i < parameters.length; i++) {
            const parameter = parameters[i]
            const value = values[i]
            if (!value) continue

            const expectedType = parameter.dataTypeIdentifier
            const expectedDT = dataTypeService.getDataType(expectedType!!)
            const valueType = resolveValueType(value, expectedDT)
            const valueDT = dataTypeService.getDataType(valueType!!)

            if (!expectedDT || !valueDT) {
                errors.push(errorResult(parameter.id!!, expectedDT, valueDT))
                continue
            }

            const isGeneric =
                !!expectedType?.genericType ||
                (!!expectedType?.genericKey && genericKeys.includes(expectedType.genericKey))

            let isValid = true

            if (isGeneric) {
                const resolvedExpectedDT = resolveDataTypeWithGenerics(expectedDT, genericMap)

                if (isReferenceOrNode(value)) {
                    const resolvedValueDT = resolveDataTypeWithGenerics(valueDT, genericMap)
                    isValid = useDataTypeValidation(resolvedExpectedDT, resolvedValueDT)
                } else {
                    const resolvedType = replaceGenericKeysInType(expectedType, genericMap)
                    isValid = useValueValidation(
                        value,
                        resolvedExpectedDT,
                        dataTypeService,
                        flow,
                        resolvedType?.genericType?.genericMappers!
                    )
                }
            } else {
                if (isReferenceOrNode(value) && expectedDT.variant !== "NODE") {
                    isValid = useDataTypeValidation(expectedDT, valueDT)
                } else {
                    isValid = useValueValidation(value, expectedDT, dataTypeService, flow)
                }
            }

            if (!isValid) {
                errors.push(errorResult(parameter.id!!, expectedDT, valueDT))
            }
        }

        return errors.length > 0 ? errors : null
    }, [parameters, values, dataTypeStore, flow, genericMap, genericKeys, resolveValueType])
}