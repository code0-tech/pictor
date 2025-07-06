import {useService} from "../../../utils/contextStore";
import {DFlowSuggestionService} from "./DFlowSuggestion.service";
import {DFlowDataTypeReactiveService} from "../data-type/DFlowDataType.service";
import {DataTypeObject, GenericMapper, GenericType, Type} from "../data-type/DFlowDataType.view";
import {replaceGenericKeysInDataTypeObject, replaceGenericKeysInType} from "../../../utils/generics";
import {md5} from 'js-md5';
import {DFlowSuggestion} from "./DFlowSuggestion.view";

export const useSuggestions = (type: Type): DFlowSuggestion[] | undefined => {

    const suggestionService = useService(DFlowSuggestionService)
    const dataTypeService = useService(DFlowDataTypeReactiveService)

    //hash this type
    const hashedType = useTypeHash(type)
    if (!hashedType) return undefined

    return suggestionService.getSuggestionsByHash(hashedType)

}

export const useTypeHash = (type: Type, generic_keys?: string[]): string | undefined => {

    const dataTypeService = useService(DFlowDataTypeReactiveService)
    const dataType = dataTypeService.getDataType(type)
    const genericTypeMap = new Map<string, Type>(generic_keys?.map((key) => [key, "GENERIC"]))
    const replacedType = generic_keys ? replaceGenericKeysInType(type, genericTypeMap) : type
    const genericDataTypeMap = new Map<string, GenericMapper>((replacedType as GenericType).generic_mapper!!.map((key) => [key.generic_target, key]))

    if (!dataType) return undefined


    const dataTypeObject = replaceGenericKeysInDataTypeObject(dataType.json, genericDataTypeMap)
    const partialDataTypeObject: Partial<DataTypeObject> = {
        type: dataTypeObject.type,
        rules: dataTypeObject.rules,
        parent: dataTypeObject.parent
    }

    return md5(JSON.stringify(dataTypeObject))

}