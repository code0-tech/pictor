import {Translation} from "../../../utils/translation";
import {DFlowDataTypeService} from "./DFlowDataType.service";
import {CombinesRuleConfig, RuleMap} from "./rules/DFlowDataTypeRule";

/**
 * This interface represents a reference value coming from either
 * the return or from the input of a node.
 * Because references, don't hold the actual value we perform just a {@link DataType#validateDataType}
 * check against the {@link RawRefObject#type}.
 *
 * Every possible reference can be tracked down via it's depth inside the flow.
 *
 * {@link RawRefObject#primaryLevel} links to the context of the node inside the flow
 * starting at 0.
 *
 * {@link RawRefObject#secondaryLevel} links to the node inside the flow
 * starting at 0.
 *
 * {@link RawRefObject#secondaryLevel} links to an {@link DataTypeObject#inputTypes} of the node
 * starting at 0.
 */
export interface RawRefObject {
    type: string
    primaryLevel: number
    secondaryLevel: number
    tertiaryLevel?: number
    path?: string //TODO: should be array of refpaths
}

/**
 * This type represents a raw object including the rule
 * that every key has to be of type string and every value must be of type
 * {@link RawDataTypes}.
 */
export type RawObject = {[key: string]: RawDataTypes}

export type RawDataTypes = number | boolean | string | RawObject | Array<RawDataTypes> | RawRefObject

export enum EDataType {
    PRIMITIVE, //number, boolean, text
    TYPE,
    OBJECT,
    DATATYPE,
    ARRAY,
    GENERIC,
    NODE,
    ERROR
}

export enum EDataTypeRuleType {
    REGEX,
    NUMBER_RANGE,
    ITEM_OF_COLLECTION,
    CONTAINS_TYPE,
    CONTAINS_KEY,
    LOCK_KEY,
    //etc
}

export interface DataTypeRuleObject {
    type: EDataTypeRuleType
    config: CombinesRuleConfig
}

export interface DataTypeObject {
    data_type_id: string
    type: EDataType
    name?: Translation[]
    rules?: DataTypeRuleObject[]
    inputTypes?: string[] // data type id
    returnType?: string // data type id
    parent?: string // data type id
}

/*
    @todo is DataType castable to another DataType
 */
export class DataType {

    private readonly _service: DFlowDataTypeService
    private readonly _id: string
    private readonly _type: EDataType
    private readonly _name?: Translation[]
    private readonly _rules?: DataTypeRuleObject[]
    private readonly _inputTypes?: string[] // are only in use if Type is NODE
    private readonly _returnType?: string // are only in use if Type is NODE
    private readonly _parent?: string

    constructor(dataType: DataTypeObject, service: DFlowDataTypeService) {
        this._id = dataType.data_type_id
        this._type = dataType.type
        this._name = dataType.name
        this._rules = dataType.rules
        this._inputTypes = dataType.inputTypes
        this._returnType = dataType.returnType
        this._parent = dataType.parent
        this._service = service
    }

    /**
     * @todo check if EDataType is equal
     */
    public validateDataType(dataType: DataType): boolean {

        //all rules need to match
        const isDeepEqual = (object1: {[index: string]:any}, object2: {[index: string]:any}) => {
            const objKeys1 = Object.keys(object1)
            const objKeys2 = Object.keys(object2)

            if (objKeys1.length !== objKeys2.length) return false

            for (const key of objKeys1) {
                const value1 = object1[key]
                const value2 = object2[key]
                const isObjects = isObject(value1) && isObject(value2)

                if ((isObjects && !isDeepEqual(value1, value2)) || (!isObjects && value1 !== value2)) return false
            }
            return true
        }

        const isObject = (object: object) => {
            return object != null && typeof object === "object";
        }

        const arraysEqual = (a1: [], a2: []): boolean =>
            a1.length === a2.length && a1.every((o: any, idx: any) => isDeepEqual(o, a2[idx]))

        //check input types
        if (this._inputTypes?.length !== dataType._inputTypes?.length) return false

        const notMatchingInputTypes = this._inputTypes?.map((id, index) => {
            return this._service.getDataType(id)?.validateDataType(this._service.getDataType(dataType._inputTypes!![index] as string) as DataType)
        }).includes(false)
        if (notMatchingInputTypes === false) return false

        //check return type
        if ((this._returnType && !dataType._returnType) || !this._returnType && dataType._returnType)
            return false

        if ((this._returnType && dataType._returnType) && !(this._service.getDataType(this._returnType as string)?.validateDataType(this._service.getDataType(dataType._returnType as string) as DataType)))
            return false

        if (this.allRules && !dataType.allRules) return false
        if (!this.allRules && dataType.allRules) return false

        return arraysEqual(this.allRules as [], dataType.allRules as [])
    }

    public validateValue(value: RawDataTypes): boolean {

        //TODO structural checking of value

        return this.allRules.every(rule => {
            RuleMap.get(rule.type)?.validate(value, rule.config, this._service)
        })
    }


    get rules(): DataTypeRuleObject[] | undefined {
        return this._rules;
    }

    get allRules(): DataTypeRuleObject[] {
        return [...(this._rules || []), ...(this._service.getDataType(this._parent as string)?.rules || [])]
    }

    get id(): string {
        return this._id;
    }
}