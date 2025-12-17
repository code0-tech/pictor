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

//TODO: simple use useReturnType function
@staticImplements<DFlowDataTypeRule>()
export class DFlowDataTypeReturnTypeRule {
    public static validate(
        value: NodeParameterValue,
        config: DataTypeRulesReturnTypeConfig,
        generics?: Map<string, GenericMapper>,
        service?: DFlowDataTypeReactiveService,
        flow?: Flow
    ): boolean {

        const genericMapper = generics?.get(config?.dataTypeIdentifier?.genericKey!!)
        const genericTypes = generics?.get(config?.dataTypeIdentifier?.genericKey!!)?.sourceDataTypeIdentifiers
        const genericCombination = generics?.get(config?.dataTypeIdentifier?.genericKey!!)?.genericCombinationStrategies

        if (value.__typename != "NodeFunctionIdWrapper") return false

        const foundReturnFunction = findReturnNode(value, flow!!)
        if (!foundReturnFunction) return false

        if (config?.dataTypeIdentifier?.genericKey && !genericMapper && !service?.getDataType(config.dataTypeIdentifier)) return true

        if (!(service?.getDataType(config.dataTypeIdentifier!!) || genericMapper)) return false

        //use of generic key but datatypes does not exist
        if (genericMapper && !service?.hasDataTypes(genericTypes!!)) return false

        //check if all generic combinations are set
        if (genericMapper && !(((genericCombination?.length ?? 0) + 1) == genericTypes!!.length)) return false

        if (foundReturnFunction?.parameters?.nodes!![0]?.value!!.__typename === "ReferenceValue") {

            //use generic given type for checking against value
            if (config?.dataTypeIdentifier?.genericKey && genericMapper && genericTypes) {

                const checkAllTypes: boolean[] = genericTypes.map(genericType => {
                    return useDataTypeValidation(service?.getDataType(genericType)!!, service?.getDataType((foundReturnFunction?.parameters?.nodes!![0]?.value!! as ReferenceValue).dataTypeIdentifier!!)!!)
                })

                return checkAllTypes.length > 1 ? checkAllTypes.reduce((previousValue, currentValue, currentIndex) => {
                    if (genericCombination && genericCombination[currentIndex - 1].type == "OR") {
                        return previousValue || currentValue
                    }

                    return previousValue && currentValue
                }) : checkAllTypes[0]
            }

            if (config?.dataTypeIdentifier?.dataType) {
                return useDataTypeValidation(service?.getDataType(config.dataTypeIdentifier!!)!!, service?.getDataType(foundReturnFunction?.parameters?.nodes!![0]?.value?.dataTypeIdentifier!!)!!)
            }

        } else if (foundReturnFunction?.parameters?.nodes!![0]?.value?.__typename == "NodeFunctionIdWrapper") {
            //TODO : allow function as return value
        } else {

            //use generic given type for checking against value
            if (config?.dataTypeIdentifier?.genericKey && genericMapper && genericTypes) {

                const checkAllTypes: boolean[] = genericTypes.map(genericType => {
                    return useValueValidation(foundReturnFunction?.parameters?.nodes!![0]?.value!!, service?.getDataType(genericType)!!, service!!, flow, ((genericType.genericType as GenericType)!!.genericMappers as GenericMapper[]))
                })

                return checkAllTypes.length > 1 ? checkAllTypes.reduce((previousValue, currentValue, currentIndex) => {
                    if (genericCombination && genericCombination[currentIndex - 1].type == "OR") {
                        return previousValue || currentValue
                    }

                    return previousValue && currentValue
                }) : checkAllTypes[0]
            }

            if (config?.dataTypeIdentifier?.dataType) {
                return useValueValidation(foundReturnFunction?.parameters?.nodes!![0]?.value!!, service?.getDataType(config.dataTypeIdentifier!!)!!, service!!)
            }

            return useValueValidation(foundReturnFunction?.parameters?.nodes!![0]?.value!!, service?.getDataType(config.dataTypeIdentifier!!)!!, service!!, flow, genericMapping(config.dataTypeIdentifier?.genericType?.genericMappers!!, generics))

        }

        return false

    }
}

const findReturnNode = (n: NodeFunctionIdWrapper, flow: Flow): NodeFunction | undefined => {


    const node = flow.nodes?.nodes?.find(node => node?.id === n.id) as NodeFunction | undefined
    if (node?.functionDefinition?.runtimeFunctionDefinition?.identifier === 'RETURN') return node

    if (node) {
        const found = findReturnNode({
            id: node.nextNodeId,
            __typename: "NodeFunctionIdWrapper"
        }, flow)
        if (found) return found
    }

    return undefined
}