import {describe, expect, test} from '@jest/globals'
import {DataType, EDataType, EDataTypeRuleType} from "./DFlowDataType.view";
import {dataTypes} from "./DFlowDataType.data";
import {
    createNonReactiveArrayService,
    NonReactiveArrayService,
    NonReactiveArrayStore
} from "../../../utils/nonReactiveArrayStore";
import {DFlowDataTypeService} from "./DFlowDataType.service";

class NonReactiveDataTypeService extends NonReactiveArrayService<DataType> implements DFlowDataTypeService {

    constructor(store: NonReactiveArrayStore<DataType>) {
        super(store);
    }

    public getDataType = (id: string): DataType | undefined => {
        return this.values().find(value => value.id === id)
    }


}

describe('data type validation against data type', () => {
    const [_, service] = createNonReactiveArrayService<DataType, NonReactiveDataTypeService>(NonReactiveDataTypeService);

    [...dataTypes, {
        data_type_id: "NUMBER_2",
        type: EDataType.PRIMITIVE,
        rules: [{
            type: EDataTypeRuleType.REGEX,
            config: {pattern: "^(?:-(?:[1-9](?:\d{0,2}(?:,\d{3})+|\d*))|(?:0|(?:[1-9](?:\d{0,2}(?:,\d{3})+|\d*))))(?:.\d+|)$"}
        }]
    }].forEach((dataType) => {
        service.add(new DataType(dataType, service))
    })

    test('NUMBER match', () => {
        expect(service.getDataType("NUMBER")?.validateDataType(service.getDataType("NUMBER") as DataType)).toBe(true)
    })

    test('HTTP_METHOD match', () => {
        expect(service.getDataType("HTTP_METHOD")?.validateDataType(service.getDataType("HTTP_METHOD") as DataType)).toBe(true)
    })

    test('different data type id match', () => {
        expect(service.getDataType("NUMBER")?.validateDataType(service.getDataType("NUMBER_2") as DataType)).toBe(true)
    })

    test('NUMBER with TEXT not match', () => {
        expect(service.getDataType("NUMBER")?.validateDataType(service.getDataType("TEXT") as DataType)).toBe(false)
    })
})

describe('value validation against data type', () => {

    const [_, service] = createNonReactiveArrayService<DataType, NonReactiveDataTypeService>(NonReactiveDataTypeService);

    dataTypes.forEach((dataType) => {
        service.add(new DataType(dataType, service))
    })

    test('1 is of type NUMBER', () => {
        expect(service.getDataType("NUMBER")?.validateValue(1)).toBeTruthy()
    })

    test('Array of numbers against number array', () => {
        expect(service.getDataType('ARRAY')?.validateValue([1, 2], [{
            type: "NUMBER",
            generic_target: "T"
        }])).toBeTruthy()
    })

    test('does node return number', () => {
        expect(service.getDataType("NUMBER_NODE")?.validateValue({
            function: {
                function_id: "some_database_id",
                runtime_function_id: "math::add"
            },
            parameters: [{
                definition: {
                    parameter_id: "some_database_id",
                    runtime_parameter_id: "math::add__firstValue"
                },
                value: 1
            }, {
                definition: {
                    parameter_id: "some_database_id",
                    runtime_parameter_id: "math::add__secondValue"
                },
                value: 1
            }],
            next_node: {
                function: {
                    function_id: "some_database_id",
                    runtime_function_id: "RETURN"
                },
                parameters: [{
                    definition: {
                        parameter_id: "string",
                        runtime_parameter_id: "RETURN_VALUE"
                    },
                    value: {
                        type: "NUMBER",
                        primaryLevel: 0,
                        secondaryLevel: 1
                    }
                }]
            }
        })).toBeTruthy()
    })

})