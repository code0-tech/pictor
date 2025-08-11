import {describe, expect, test} from '@jest/globals'
import {
    createNonReactiveArrayService,
    NonReactiveArrayStore,
    NonReactiveArrayService
} from "../../../utils/nonReactiveArrayService";
import {FunctionDefinition} from "./DFlowFunction.view";
import {DFlowFunctionService} from "./DFlowFunction.service";
import {functionData} from "./DFlowFunction.data";
import {DataType} from "../data-type/DFlowDataType.view";
import {dataTypes} from "../data-type/DFlowDataType.data";
import {NonReactiveDataTypeService} from "../data-type/DFlowDataType.test";
import {useFunctionValidation} from "./DFlowFunction.vaildation.hook";
import {useReturnType} from "./DFlowFunction.return.hook";

export class DFlowFunctionNonReactiveService extends NonReactiveArrayService<FunctionDefinition> implements DFlowFunctionService {

    constructor(store: NonReactiveArrayStore<FunctionDefinition>) {
        super(store);
    }

    public getFunctionDefinition(id: string): FunctionDefinition | undefined {
        return this.values().find(functionDefinition => functionDefinition.function_id === id)
    }

}


describe('function', () => {

    const [__, functionService] = createNonReactiveArrayService<FunctionDefinition, DFlowFunctionNonReactiveService>(DFlowFunctionNonReactiveService);

    functionData.forEach((functionData) => {
        functionService.add(new FunctionDefinition(functionData));
    })

    const [_, dataTypeService] = createNonReactiveArrayService<DataType, NonReactiveDataTypeService>(NonReactiveDataTypeService);

    dataTypes.forEach((dataType) => {
        dataTypeService.add(new DataType(dataType, dataTypeService))
    })

    test('', () => {
        expect(useFunctionValidation(functionService.getFunctionDefinition('std::array::add')!!, [[1, 2, 3], 1], dataTypeService)).toBeNull()
    })

    test('', () => {
        expect(useFunctionValidation(functionService.getFunctionDefinition('std::array::add')!!, [[[1], [2], [3]], [1]], dataTypeService)).toBeNull()
    })

    test('', () => {
        expect(useFunctionValidation(functionService.getFunctionDefinition('std::array::add')!!, [[1, 2, 3], {type: "NUMBER", primaryLevel: 0, secondaryLevel: 1}], dataTypeService)).toBeNull()
    })

    test('', () => {
        expect(useFunctionValidation(functionService.getFunctionDefinition('std::array::add')!!, [[[1], 2, 3], {type: "NUMBER", primaryLevel: 0, secondaryLevel: 1}], dataTypeService)).toMatchObject([{"message": [{"code": "de_DE", "text": "Parameter #1: Ungültiger Wert. Erwartet: {\"type\":\"ARRAY\",\"generic_mapper\":[{\"types\":[\"D\"],\"generic_target\":\"T\"}]}, Erhalten: [[1],2,3]. [Generic Value: Invalid value]"}], "type": 4}])
    })
})

describe('return type', () => {

    const [__, functionService] = createNonReactiveArrayService<FunctionDefinition, DFlowFunctionNonReactiveService>(DFlowFunctionNonReactiveService);

    functionData.forEach((functionData) => {
        functionService.add(new FunctionDefinition(functionData));
    })

    const [_, dataTypeService] = createNonReactiveArrayService<DataType, NonReactiveDataTypeService>(NonReactiveDataTypeService);

    dataTypes.forEach((dataType) => {
        dataTypeService.add(new DataType(dataType, dataTypeService))
    })

    test('', () => {
        expect(useReturnType(functionService.getFunctionDefinition('std::array::add')!!, [[1, 2, 3], 1], dataTypeService)).toMatchObject( {"type":"ARRAY","generic_mapper":[{"types":["NUMBER"],"generic_target":"T"}]})
    })
})