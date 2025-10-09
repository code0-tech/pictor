import {describe, expect, test} from '@jest/globals'
import {
    createNonReactiveArrayService,
    NonReactiveArrayService,
    NonReactiveArrayStore
} from "../../../utils/nonReactiveArrayService";
import {FunctionDefinitionView} from "./DFlowFunction.view";
import {DFlowFunctionService} from "./DFlowFunction.service";
import {functionData} from "./DFlowFunction.data";
import {NonReactiveDataTypeService} from "../data-type/DFlowDataType.test";
import {DataTypeView} from "../data-type/DFlowDataType.view";
import {dataTypes} from "../data-type/DFlowDataType.data";
import {useReturnType} from "./DFlowFunction.return.hook";

export class DFlowFunctionNonReactiveService extends NonReactiveArrayService<FunctionDefinitionView> implements DFlowFunctionService {

    constructor(store: NonReactiveArrayStore<FunctionDefinitionView>) {
        super(store);
    }

    public getFunctionDefinition(id: string): FunctionDefinitionView | undefined {
        return this.values().find(functionDefinition => functionDefinition.function_id === id)
    }

}


/*
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

 */

describe('return type', () => {

    const [__, functionService] = createNonReactiveArrayService<FunctionDefinitionView, DFlowFunctionNonReactiveService>(DFlowFunctionNonReactiveService);

    functionData.forEach((functionData) => {
        functionService.add(new FunctionDefinitionView(functionData));
    })

    const [_, dataTypeService] = createNonReactiveArrayService<DataTypeView, NonReactiveDataTypeService>(NonReactiveDataTypeService);

    dataTypes.forEach((dataType) => {
        dataTypeService.add(new DataTypeView(dataType, dataTypeService))
    })

    test('', () => {
        expect(useReturnType(functionService.getFunctionDefinition('std::array::add')!!, [[1, 2, 3], 1], dataTypeService)).toMatchObject( {"type":"ARRAY","generic_mapper":[{"types":["NUMBER"],"generic_target":"T"}]})
    })
})