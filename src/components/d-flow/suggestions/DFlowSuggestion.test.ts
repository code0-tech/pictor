import {beforeEach, describe, expect, jest, test} from "@jest/globals"
import {useSuggestions, useTypeHash} from "./DFlowSuggestion.hook" // ← dein Hook
import {NonReactiveDataTypeService} from "../data-type/DFlowDataType.test"
import {
    createNonReactiveArrayService,
    NonReactiveArrayService,
    NonReactiveArrayStore
} from "../../../utils/nonReactiveArrayService"
import {DataType, GenericType, Type} from "../data-type/DFlowDataType.view"
import {dataTypes} from "../data-type/DFlowDataType.data"
import {functionData} from "../function/DFlowFunction.data"
import {flow} from "../DFlow.data"
import {useService} from "../../../utils/contextStore"
import {DFlowSuggestionService} from "./DFlowReactiveSuggestionService";
import {FunctionDefinition} from "../function/DFlowFunction.view";
import {Flow} from "../DFlow.view";
import {DFlowFunctionNonReactiveService} from "../function/DFlowFunction.test";
import {DFlowNonReactiveService} from "../DFlow.test";
import {DFlowSuggestion} from "./DFlowSuggestion.view";


export class DFlowNonReactiveSuggestionService extends NonReactiveArrayService<DFlowSuggestion> implements DFlowSuggestionService {

    constructor(store: NonReactiveArrayStore<DFlowSuggestion>) {
        super(store);
    }

    //get all suggestions with matching hash
    public getSuggestionsByHash(hash: string): DFlowSuggestion[] {
        return this.values().filter(suggestion => suggestion.hash === hash);
    }


    //add suggestion with hash
    public addSuggestion(suggestion: DFlowSuggestion): void {
        this.add(suggestion)
    }

}

// Mock useService to inject our test service
jest.mock("../../../utils/contextStore", () => ({
    useService: jest.fn()
}))

// ---- Service Instanzen vorbereiten ----
const [_, dataTypeService] = createNonReactiveArrayService<DataType, NonReactiveDataTypeService>(NonReactiveDataTypeService);
const [__, functionService] = createNonReactiveArrayService<any, DFlowFunctionNonReactiveService>(DFlowFunctionNonReactiveService);
const [___, flowService] = createNonReactiveArrayService<any, DFlowNonReactiveService>(DFlowNonReactiveService);
const [____, suggestionService] = createNonReactiveArrayService<any, DFlowNonReactiveSuggestionService>(DFlowNonReactiveSuggestionService);

dataTypes.forEach((dt) => dataTypeService.add(new DataType(dt, dataTypeService)))
functionData.forEach((dt) => functionService.add(new FunctionDefinition(dt)))
flowService.add(new Flow(flow))

beforeEach(() => {
    (useService as jest.Mock).mockImplementation((serviceType?: any) => {
        if (!serviceType) return undefined;
        if (serviceType.name?.includes("DFlowDataTypeReactiveService")) return dataTypeService;
        if (serviceType.name?.includes("DFlowFunctionReactiveService")) return functionService;
        if (serviceType.name?.includes("DFlowReactiveService")) return flowService;
        if (serviceType.name?.includes("DFlowReactiveSuggestionService")) return suggestionService;
        return undefined;
    });
    suggestionService.clear();
});

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

describe("useSuggestions", () => {

    test("returns FUNCTION suggestion for NUMBER_ARRAY", () => {
        const result = useSuggestions({
            type: "ARRAY", generic_mapper: [{
                types: ["NUMBER"],
                generic_target: "T"
            }]
        } as GenericType, ["D"], "some_database_id", 0);
        console.log(JSON.stringify(result))
    })

})
