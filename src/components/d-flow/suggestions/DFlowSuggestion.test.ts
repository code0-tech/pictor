import {beforeEach, describe, expect, jest, test} from "@jest/globals"
import {useTypeHash} from "./DFlowSuggestion.hook" // ← dein Hook
import {NonReactiveDataTypeService} from "../data-type/DFlowDataType.test"
import {createNonReactiveArrayService} from "../../../utils/nonReactiveArrayService"
import {DataType, EDataType, EDataTypeRuleType, Type} from "../data-type/DFlowDataType.view"
import {dataTypes} from "../data-type/DFlowDataType.data"
import {useService} from "../../../utils/contextStore"

// Mock useService to inject our test service
jest.mock("../../../utils/contextStore", () => ({
    useService: jest.fn()
}))

const [_, testService] = createNonReactiveArrayService<DataType, NonReactiveDataTypeService>(NonReactiveDataTypeService)
dataTypes.forEach((dt) => testService.add(new DataType(dt, testService)))

// Add a simple "NUMBER_ARRAY" alias for a nested structure example
testService.add(new DataType({
    data_type_id: "NUMBER_ARRAY",
    type: EDataType.ARRAY,
    rules: [{
        type: EDataTypeRuleType.CONTAINS_TYPE,
        config: { type: "NUMBER" }
    }]
}, testService))

beforeEach(() => {
    (useService as jest.Mock).mockReturnValue(testService)
})

describe("useTypeHash", () => {

    test("returns a string hash for a primitive type", () => {
        const hash = useTypeHash("NUMBER")
        expect(typeof hash).toBe("string")
        expect(hash?.length).toBeGreaterThan(0)
    })

    test("returns same hash for same input", () => {
        const hash1 = useTypeHash("NUMBER")
        const hash2 = useTypeHash("NUMBER")
        expect(hash1).toBe(hash2)
    })

    test("returns same hash for ARRAY<NUMBER_ARRAY> and ARRAY<ARRAY<NUMBER>>", () => {
        // type with an alias in generic_mapper
        const t1 = {
            type: "ARRAY",
            generic_mapper: [{
                types: ["NUMBER_ARRAY"],
                generic_target: "T"
            }]
        }
        // expanded version
        const t2 = {
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
        }
        const hash1 = useTypeHash(t1)
        const hash2 = useTypeHash(t2)
        expect(hash1).toBe(hash2)
    })

    test("returns same hash for NUMBER_ARRAY and ARRAY<NUMBER>", () => {
        // type with an alias in generic_mapper
        const t1 = "NUMBER_ARRAY" // alias for ARRAY<NUMBER>
        // expanded version
        const t2 = {
            type: "ARRAY",
            generic_mapper: [{
                types: ["NUMBER"],
                generic_target: "T"
            }]
        }
        const hash1 = useTypeHash(t1)
        const hash2 = useTypeHash(t2)
        expect(hash1).toBe(hash2)
    })

    test("generic keys with different names yield the same hash", () => {
        const typeA = {
            type: "ARRAY",
            generic_mapper: [{
                types: ["FOOBAR"],
                generic_target: "T"
            }]
        }
        const typeB = {
            type: "ARRAY",
            generic_mapper: [{
                types: ["MY_KEY"],
                generic_target: "T"
            }]
        }
        const hashA = useTypeHash(typeA, ["FOOBAR"])
        const hashB = useTypeHash(typeB, ["MY_KEY"])
        expect(hashA).toBe(hashB)
    })

    test("deep generics: nested generic key normalization", () => {
        const typeA = {
            type: "ARRAY",
            generic_mapper: [{
                types: [{
                    type: "ARRAY",
                    generic_mapper: [{
                        types: ["FOO"],
                        generic_target: "T"
                    }]
                }],
                generic_target: "T"
            }]
        }
        const typeB = {
            type: "ARRAY",
            generic_mapper: [{
                types: [{
                    type: "ARRAY",
                    generic_mapper: [{
                        types: ["BAR"],
                        generic_target: "T"
                    }]
                }],
                generic_target: "T"
            }]
        }
        const hashA = useTypeHash(typeA, ["FOO"])
        const hashB = useTypeHash(typeB, ["BAR"])
        expect(hashA).toBe(hashB)
    })

    test("different types yield different hashes", () => {
        const hash1 = useTypeHash("NUMBER")
        const hash2 = useTypeHash("TEXT")
        expect(hash1).not.toBe(hash2)
    })

    test("objects with different structure yield different hashes", () => {
        const t1 = {
            type: "ARRAY",
            generic_mapper: [{
                types: ["NUMBER"],
                generic_target: "T"
            }]
        }
        const t2 = {
            type: "ARRAY",
            generic_mapper: [{
                types: ["TEXT"],
                generic_target: "T"
            }]
        }
        expect(useTypeHash(t1)).not.toBe(useTypeHash(t2))
    })

    test("object with multiple generics - order and naming does not affect hash", () => {
        const t1 = {
            type: "ARRAY",
            generic_mapper: [{
                types: ["D", "E"],
                generic_target: "T"
            }]
        }
        const t2 = {
            type: "ARRAY",
            generic_mapper: [{
                types: ["E", "D"],
                generic_target: "T"
            }]
        }
        const hash1 = useTypeHash(t1, ["D", "E"])
        const hash2 = useTypeHash(t2, ["E", "D"])
        expect(hash1).toBe(hash2)
    })

    test("useTypeHash returns same hash for GENERIC_OBJECT twice", () => {
        const t1: Type = {
            type: "GENERIC_OBJECT",
            generic_mapper: [{
                generic_target: "D",
                types: ["NUMBER_ARRAY"],
            }]
        }
        const t2: Type = {
            type: "GENERIC_OBJECT",
            generic_mapper: [{
                types: [{
                    type: "ARRAY",
                    generic_mapper: [{
                        types: ["NUMBER"],
                        generic_target: "T"
                    }]
                }],
                generic_target: "D",
            }]
        }
        const hash1 = useTypeHash(t1);
        const hash2 = useTypeHash(t2);
        expect(hash1).toBe(hash2);
    })

    test("useTypeHash returns same hash for OBJECT twice", () => {
        const t1: Type = {
            type: "OBJECT",
            generic_mapper: [{
                generic_target: "O",
                types: ["TEST_OBJECT"]
            }]
        }
        const t2: Type = {
            type: "OBJECT",
            generic_mapper: [{
                generic_target: "O",
                types: ["TEST_OBJECT"]
            }]
        }
        const hash1 = useTypeHash(t1);
        const hash2 = useTypeHash(t2);
        expect(hash1).toBe(hash2);
    })

})
