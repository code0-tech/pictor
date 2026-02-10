import {DFlowDataTypeRule, genericMapping, staticImplements} from "./DFlowDataTypeRule";
import {DFlowDataTypeReactiveService} from "../DFlowDataType.service";
import type {
    DataTypeRulesReturnTypeConfig,
    Flow,
    GenericMapper,
    GenericType,
    NodeFunction,
    NodeFunctionIdWrapper,
    NodeParameterValue,
    ReferenceValue
} from "@code0-tech/sagittarius-graphql-types";
import {useDataTypeValidation} from "../../d-flow-validation/DDataTypeValidation.hook";
import {useValueValidation} from "../../d-flow-validation/DValueValidation.hook";
import {DFlowFunctionReactiveService} from "../../d-flow-function";
import {useReturnType} from "../../d-flow-function/DFlowFunction.return.hook";

//TODO: simple use useReturnType function
@staticImplements<DFlowDataTypeRule>()
export class DFlowDataTypeReturnTypeRule {
    public static validate(
        value: NodeParameterValue,
        config: DataTypeRulesReturnTypeConfig,
        generics?: Map<string, GenericMapper>,
        flow?: Flow,
        dataTypeService?: DFlowDataTypeReactiveService,
        functionService?: DFlowFunctionReactiveService
    ): boolean {

        const genericMapper = generics?.get(config?.dataTypeIdentifier?.genericKey!!)
        const genericTypes = generics?.get(config?.dataTypeIdentifier?.genericKey!!)?.sourceDataTypeIdentifiers
        const genericCombination = generics?.get(config?.dataTypeIdentifier?.genericKey!!)?.genericCombinationStrategies

        if (value.__typename != "NodeFunctionIdWrapper") return false

        if (config?.dataTypeIdentifier?.genericKey && !genericMapper && !dataTypeService?.getDataType(config.dataTypeIdentifier)) return true

        const foundReturnFunction = findReturnNode(value, flow!!)
        if (!foundReturnFunction) return false
        if (!foundReturnFunction?.parameters?.nodes?.[0]?.value) return false

        if (!(dataTypeService?.getDataType(config.dataTypeIdentifier!!) || genericMapper)) return false

        //use of generic key but datatypes does not exist
        if (genericMapper && !dataTypeService?.hasDataTypes(genericTypes!!)) return false

        //check if all generic combinations are set
        if (genericMapper && !(((genericCombination?.length ?? 0) + 1) == genericTypes!!.length)) return false

        if (foundReturnFunction?.parameters?.nodes?.[0]?.value?.__typename === "ReferenceValue") {

            const value = (foundReturnFunction?.parameters?.nodes?.[0]?.value as ReferenceValue)
            const node = flow?.nodes?.nodes?.find(node => node?.id === value.nodeFunctionId) as NodeFunction
            const funcDef = functionService?.getById(node?.functionDefinition?.id!)
            const values = node.parameters?.nodes?.map(p => p?.value!) ?? []

            //use generic given type for checking against value
            if (config?.dataTypeIdentifier?.genericKey && genericMapper && genericTypes) {

                const checkAllTypes: boolean[] = genericTypes.map(genericType => {
                    return useDataTypeValidation(dataTypeService?.getDataType(genericType)!!, dataTypeService?.getDataType(useReturnType(funcDef!, values, dataTypeService, functionService!)!)!)
                })

                return checkAllTypes.length > 1 ? checkAllTypes.reduce((previousValue, currentValue, currentIndex) => {
                    if (genericCombination && genericCombination[currentIndex - 1].type == "OR") {
                        return previousValue || currentValue
                    }

                    return previousValue && currentValue
                }) : checkAllTypes[0]
            }

            if (config?.dataTypeIdentifier?.dataType) {
                return useDataTypeValidation(dataTypeService?.getDataType(config.dataTypeIdentifier!)!, dataTypeService?.getDataType(useReturnType(funcDef!, values, dataTypeService, functionService!)!)!)
            }

        } else if (foundReturnFunction?.parameters?.nodes?.[0]?.value?.__typename == "NodeFunctionIdWrapper") {
            //TODO : allow function as return value
        } else {

            //use generic given type for checking against value
            if (config?.dataTypeIdentifier?.genericKey && genericMapper && genericTypes) {

                const checkAllTypes: boolean[] = genericTypes.map(genericType => {
                    return useValueValidation(foundReturnFunction?.parameters?.nodes?.[0]?.value!, dataTypeService?.getDataType(genericType)!!, dataTypeService!!, flow, ((genericType.genericType as GenericType)!!.genericMappers as GenericMapper[]))
                })

                return checkAllTypes.length > 1 ? checkAllTypes.reduce((previousValue, currentValue, currentIndex) => {
                    if (genericCombination && genericCombination[currentIndex - 1].type == "OR") {
                        return previousValue || currentValue
                    }

                    return previousValue && currentValue
                }) : checkAllTypes[0]
            }

            if (config?.dataTypeIdentifier?.dataType) {
                return useValueValidation(foundReturnFunction?.parameters?.nodes?.[0]?.value!, dataTypeService?.getDataType(config.dataTypeIdentifier!)!, dataTypeService!!)
            }

            return useValueValidation(foundReturnFunction?.parameters?.nodes?.[0]?.value!, dataTypeService?.getDataType(config.dataTypeIdentifier!)!, dataTypeService!!, flow, genericMapping(config.dataTypeIdentifier?.genericType?.genericMappers!, generics))

        }

        return false

    }
}

export const findReturnNode = (n: NodeFunctionIdWrapper, flow: Flow): NodeFunction | undefined => {


    const node = flow.nodes?.nodes?.find(node => node?.id === n.id) as NodeFunction | undefined
    if (!node) return undefined
    if (node?.functionDefinition?.runtimeFunctionDefinition?.identifier === 'std::control::return') return node

    if (node && node.nextNodeId) {
        const found = findReturnNode({
            id: node.nextNodeId,
            __typename: "NodeFunctionIdWrapper"
        }, flow)
        if (found) return found
    }

    return undefined
}