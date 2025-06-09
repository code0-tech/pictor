import {FunctionDefinition} from "./DFlowFunction.view";
import {GenericType, Value} from "../data-type/DFlowDataType.view";
import {DFlowDataTypeService} from "../data-type/DFlowDataType.service";
import {ValidationResult} from "../../../utils/inspection";

export const useFunctionValidation = (
    func: FunctionDefinition,
    values: Value[],
    dataTypeService: DFlowDataTypeService
): ValidationResult[] | null => {


    func.parameters?.every((parameter, index) => {

        const typeFromValue = dataTypeService.getTypeFromValue(values[index])

        //check if parameter is generic or non-generic
        if (func.genericKeys?.includes(String(parameter.type))
            || (typeof parameter.type == "object"
                && "type" in (parameter.type as GenericType)
                && dataTypeService.getDataType(parameter.type))) {

            //check linked value if generic or non-generic
            if (typeof typeFromValue == "object"
                && "type" in (typeFromValue as GenericType)
                && dataTypeService.getDataType(parameter.type)) {

                //parameter and value is generic

            } else if (dataTypeService.getDataType(typeFromValue)) {

                //parameter is generic but value not

            }

        } else if (dataTypeService.getDataType(parameter.type)) {

            //check linked value if generic or non-generic
            if (typeof typeFromValue == "object"
                && "type" in (typeFromValue as GenericType)
                && dataTypeService.getDataType(parameter.type)) {

                //parameter is non-generic but value is

            } else if (dataTypeService.getDataType(typeFromValue)) {

                //parameter and value are non-generic

            }

        }

        return false
    })

    //get all datatypes from value
    const dataTypes = values.map(value => dataTypeService.getTypeFromValue(value))
    console.log(JSON.stringify(dataTypes))

    const genericTypes = func.genericKeys?.map(value => {
        const type = dataTypes.find((type, index) => {

            const genericMapper = func.genericMapper?.find(mapper => {
                return mapper.parameter_id == func.parameters!![index].parameter_id
            })

            if (dataTypeService.getDataType(type)?.genericKeys?.includes(genericMapper?.generic_target ?? "")) {
                return true
            }
            return false
        })


        return {value, type}
    })
    console.log("Mapped generics:", JSON.stringify(genericTypes))

    //get datatypes for parameters and check against values
    const checkParameters = func.parameters?.every((parameter, index) => {
        return dataTypeService.getDataType(parameter.type)?.validateValue(values[index])
    })

    if (!checkParameters) return []

    return null

}