import {describe, expect, test} from '@jest/globals'
import {
    DataType,
    DataTypeRuleObject,
    EDataType,
    GenericCombinationStrategy,
    GenericMapper,
    isRefObject,
    Object,
    Type,
    Value
} from "./DFlowDataType.view";
import {dataTypes} from "./DFlowDataType.data";
import {
    createNonReactiveArrayService,
    NonReactiveArrayStore,
    NonReactiveArrayService
} from "../../../utils/nonReactiveArrayService";
import {DFlowDataTypeService} from "./DFlowDataType.service";
import {DFlowDataTypeContainsKeyRuleConfig} from "./rules/DFlowDataTypeContainsKeyRule";
import {NodeFunctionObject} from "../DFlow.view";
import {EDataTypeRuleType} from "./rules/DFlowDataTypeRules";

export class NonReactiveDataTypeService extends NonReactiveArrayService<DataType> implements DFlowDataTypeService {

    constructor(store: NonReactiveArrayStore<DataType>) {
        super(store);
    }

    public getDataType = (type: Type): DataType | undefined => {
        return this.values().find(value => value.id === (typeof type === "string" ? type : (type?.type ?? "")));
    }

    public getDataTypeFromValue = (value: Value): DataType | undefined => {

        //hardcode primitive types (NUMBER, BOOLEAN, TEXT)
        if (typeof value === "string") return this.getDataType("TEXT")
        if (typeof value === "number") return this.getDataType("NUMBER")
        if (typeof value === "boolean") return this.getDataType("BOOLEAN")

        const matchingDataTypes = this.values().filter(type => {
            return type.validateValue(value)
        }).sort((a, b) => {
            return a.depth - b.depth
        })

        return matchingDataTypes[matchingDataTypes.length - 1]

    }

    public getTypeFromValue = (value: Value): Type => {

        if (isRefObject(value)) return value.type

        const dataType = this.getDataTypeFromValue(value)
        if (!dataType?.genericKeys) return dataType?.id ?? ""

        const genericMapper: GenericMapper[] = dataType.genericKeys.map(genericKey => {

            const ruleThatIncludesGenericKey = dataType.rules.find((rule: DataTypeRuleObject) => {
                return "type" in rule.config && rule.config.type === genericKey
            })

            if (ruleThatIncludesGenericKey
                && ruleThatIncludesGenericKey.type === EDataTypeRuleType.CONTAINS_TYPE
                && dataType.type === EDataType.ARRAY) {
                return {
                    types: [this.getTypeFromValue((value as Array<any>)[0])],
                    generic_target: genericKey
                }
            }

            if (ruleThatIncludesGenericKey
                && ruleThatIncludesGenericKey.type === EDataTypeRuleType.CONTAINS_TYPE
                && dataType.type === EDataType.OBJECT) {
                return {
                    types: [this.getTypeFromValue((value as Object)[(ruleThatIncludesGenericKey.config as DFlowDataTypeContainsKeyRuleConfig).key])],
                    generic_target: genericKey
                }
            }

            if (ruleThatIncludesGenericKey
                && ruleThatIncludesGenericKey.type === EDataTypeRuleType.RETURNS_TYPE
                && dataType.type === EDataType.NODE) {
                return {
                    types: [this.getTypeFromValue((value as NodeFunctionObject))],
                    generic_target: genericKey
                }
            }
            return null
        }).filter(mapper => !!mapper)

        return {
            type: dataType?.id ?? "",
            generic_mapper: genericMapper
        }

    }

    public hasDataTypes = (types: Type[]): boolean => {
        return types.every(type => {
            return this.values().find(value => value.id === (typeof type === "string" ? type : type.type))
        })
    }


}

describe('data type validation against data type', () => {
    const [_, service] = createNonReactiveArrayService<DataType, NonReactiveDataTypeService>(NonReactiveDataTypeService);

    [...dataTypes, {
        data_type_id: "NUMBER_2",
        type: EDataType.PRIMITIVE,
        rules: [{
            type: EDataTypeRuleType.REGEX,
            config: {pattern: "^-?\\d+(?:[.,]\\d+)?$"}
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
            types: ["NUMBER"],
            generic_target: "T"
        }])).toBeTruthy()
    })

    test('Array of numbers and text against number array', () => {
        expect(service.getDataType('ARRAY')?.validateValue([1, "test", "test"], [{
            types: ["NUMBER"],
            generic_target: "T"
        }])).toBeFalsy()
    })

    test('Array of text against text array', () => {
        expect(service.getDataType('ARRAY')?.validateValue(["1", "2"], [{
            types: ["TEXT"],
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
                        depth: 0,
                        nodeLevel: 1
                    }
                }]
            }
        })).toBeTruthy()
    })

})

describe('generics', () => {

    const [_, service] = createNonReactiveArrayService<DataType, NonReactiveDataTypeService>(NonReactiveDataTypeService);

    dataTypes.forEach((dataType) => {
        service.add(new DataType(dataType, service))
    })

    test('Array of array numbers against two dimensional number array', () => {
        expect(service.getDataType('ARRAY')?.validateValue([[1], [1]], [{
            types: [{
                type: "ARRAY",
                generic_mapper: [{
                    types: ["NUMBER"],
                    generic_target: "T"
                }]
            }],
            generic_target: "T"
        }])).toBeTruthy()

        expect(service.getDataType('ARRAY')?.validateValue([[[1]], [[1]]], [{
            types: [{
                type: "ARRAY",
                generic_mapper: [{
                    types: [{
                        type: "ARRAY",
                        generic_mapper: [{
                            types: ["NUMBER"],
                            generic_target: "T"
                        }]
                    }],
                    generic_target: "T"
                }]
            }],
            generic_target: "T"
        }])).toBeTruthy()

        expect(service.getDataType('ARRAY')?.validateValue([{"number": 1}, {"number": 1}], [{
            types: ["TEST_OBJECT"],
            generic_target: "T"
        }])).toBeTruthy()

        expect(service.getDataType('ARRAY')?.validateValue([{"generic_value": "11"}, {"generic_value": "1"}], [{
            types: [{
                type: "GENERIC_OBJECT",
                generic_mapper: [{
                    types: ["TEXT"],
                    generic_target: "D"
                }]
            }],
            generic_target: "T"
        }])).toBeTruthy()
    })
})

describe('test1', () => {
    const [_, service] = createNonReactiveArrayService<DataType, NonReactiveDataTypeService>(NonReactiveDataTypeService);

    dataTypes.forEach((dataType) => {
        service.add(new DataType(dataType, service))
    })

    test('test', () => {

        expect(service.getDataType("GENERIC_OBJECT")?.validateValue({generic_value: {generic_value: "sd"}}, [{
            types: [{
                type: "NUMBER"
            }, {
                type: "TEXT"
            }, {
                type: "GENERIC_OBJECT",
                generic_mapper: [{
                    types: [{
                        type: "NUMBER"
                    }, {
                        type: "TEXT"
                    }],
                    generic_combination: [GenericCombinationStrategy.OR],
                    generic_target: "D"
                }]
            }],
            generic_combination: [GenericCombinationStrategy.OR, GenericCombinationStrategy.OR],
            generic_target: "D"
        }])).toBeTruthy()

    })
})

describe('test2', () => {
    const [_, service] = createNonReactiveArrayService<DataType, NonReactiveDataTypeService>(NonReactiveDataTypeService);

    dataTypes.forEach((dataType) => {
        service.add(new DataType(dataType, service))
    })

    test('test', () => {

        expect(service.getDataType("GENERIC_OBJECT_GENERIC")?.validateValue({generic_value: [1, 2, 3]}, [{
            types: [{
                type: "NUMBER"
            }, {
                type: "TEXT"
            }],
            generic_combination: [GenericCombinationStrategy.OR],
            generic_target: "D"
        }])).toBeTruthy()

    })
})