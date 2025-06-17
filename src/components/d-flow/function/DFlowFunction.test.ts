import {describe, expect, test} from '@jest/globals'
import {
    createNonReactiveArrayService,
    NonReactiveArrayService,
    NonReactiveArrayStore
} from "../../../utils/nonReactiveArrayStore";
import {FunctionDefinition} from "./DFlowFunction.view";
import {DFlowFunctionService} from "./DFlowFunction.service";
import {functionData} from "./DFlowFunction.data";
import {DataType} from "../data-type/DFlowDataType.view";
import {dataTypes} from "../data-type/DFlowDataType.data";
import {NonReactiveDataTypeService} from "../data-type/DFlowDataType.test";
import {useFunctionValidation} from "./DFlowFunction.hook";

class DFlowFunctionNonReactiveService extends NonReactiveArrayService<FunctionDefinition> implements DFlowFunctionService {

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

    test('test', () => {
        expect(functionService.getFunctionDefinition('std::array::add')).toBeInstanceOf(FunctionDefinition)

        expect(useFunctionValidation(functionService.getFunctionDefinition('std::array::add')!!, [[1, 2, 3], 1], dataTypeService)).toBeNull()
    })


})