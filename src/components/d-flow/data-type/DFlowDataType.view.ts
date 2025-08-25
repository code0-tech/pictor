import {Translation} from "../../../utils/translation";
import {DFlowDataTypeService} from "./DFlowDataType.service";
import {CombinesRuleConfig, EDataTypeRuleType, RuleMap} from "./rules/DFlowDataTypeRules";
import {isNodeFunctionObject, NodeFunctionObject} from "../DFlow.view";

export enum GenericCombinationStrategy {
    AND,
    OR
}

export interface GenericMapper {
    types: Type[]
    generic_target: string
    generic_combination?: GenericCombinationStrategy[]
}

export interface GenericType {
    type: string
    generic_mapper?: GenericMapper[]
}

export type Type = GenericType | string

export interface RefPath {
    path?: string
    index?: number
}

/**
 * This interface represents a reference value coming from either
 * the return or from the input of a node.
 * Because references, don't hold the actual value we perform just a {@link DataType#validateDataType}
 * check against the {@link RefObject#type}.
 *
 * Every possible reference can be tracked down via it's depth inside the flow.
 *
 * {@link RefObject#depth} links to the context of the node inside the flow
 * starting at 0.
 *
 * {@link RefObject#nodeLevel} links to the node inside the flow
 * starting at 0.
 *
 * {@link RefObject#tertiaryLevel} links to an {@link DataTypeObject#rule#inputtype} of the node
 * starting at 0.
 */
export interface RefObject {
    type: Type
    depth: number
    scope: number
    nodeLevel: number
    tertiaryLevel?: string
    path?: RefPath[]
}

export const isRefObject = (v: any): v is RefObject =>
    v && typeof v === 'object' &&
    typeof v.type === 'string' &&
    typeof v.depth === 'number' &&
    typeof v.scope === 'number' &&
    typeof v.nodeLevel === 'number' &&
    (v.tertiaryLevel === undefined || typeof v.tertiaryLevel === 'number') &&
    Object.keys(v).every(k => ['type', 'depth', 'scope', 'nodeLevel', 'tertiaryLevel'].includes(k))

/**
 * This type represents a raw object including the rule
 * that every key has to be of type string and every value must be of type
 * {@link Value}.
 */
export type Object = { [key: string]: Value }

export const isObject = (v: any): v is Object =>
    v && typeof v === 'object' && !Array.isArray(v) &&
    Object.keys(v).every(k => typeof k === 'string') &&
    Object.values(v).every(isValue)

export type Value =
    number
    | boolean
    | string
    | Object
    | Array<Value>
    | RefObject
    | NodeFunctionObject

export const isValue = (v: any): boolean =>
    ['string', 'number', 'boolean'].includes(typeof v) ||
    Array.isArray(v) && v.every(isValue) ||
    isRefObject(v) ||
    isObject(v) ||
    isNodeFunctionObject(v)

export enum EDataType {
    PRIMITIVE,
    TYPE,
    OBJECT,
    DATATYPE,
    ARRAY,
    NODE,
    ERROR
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
    parent?: Type // data type id
    genericKeys?: string[]
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
    private readonly _parent?: Type
    private readonly _generic_keys?: string[]

    constructor(dataType: DataTypeObject, service: DFlowDataTypeService) {
        this._id = dataType.data_type_id
        this._type = dataType.type
        this._name = dataType.name
        this._rules = dataType.rules
        this._parent = dataType.parent
        this._service = service
        this._generic_keys = dataType.genericKeys
    }

    public validateDataType(dataType: DataType): boolean {

        if (this._type != dataType.type) return false

        const isObject = (object: object) => {
            return object != null && typeof object === "object";
        }

        //all rules need to match
        const isDeepEqual = (object1: { [index: string]: any }, object2: { [index: string]: any }) => {
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

        const arraysEqual = (a1: [], a2: []): boolean =>
            a1.length === a2.length && a1.every((o: any, idx: any) => isDeepEqual(o, a2[idx]))


        if (this._rules && !dataType._rules) return false
        if (!this._rules && dataType._rules) return false

        return arraysEqual(this.rules as [], dataType.rules as [])
    }

    public validateValue(value: Value, generics?: GenericMapper[]): boolean {

        if (this._type === EDataType.OBJECT && !isObject(value)) {
            return false
        }

        if (this._type === EDataType.NODE && !isNodeFunctionObject(value as NodeFunctionObject)) {
            return false
        }

        const map = new Map<string, GenericMapper>(generics?.map(generic => [generic.generic_target, generic]))

        return this.rules.every(rule => {
            return RuleMap.get(rule.type)?.validate(value, rule.config, map, this._service)
        })
    }


    get rules(): DataTypeRuleObject[] {
        return this._rules || []
    }

    get id(): string {
        return this._id
    }

    get service(): DFlowDataTypeService {
        return this._service
    }

    get genericKeys(): string[] | undefined {
        return this._generic_keys
    }

    get type(): EDataType {
        return this._type;
    }

    get depth(): number {
        return this._parent ? 1 + (this._service.getDataType(this._parent as string)?.depth ?? 0) : 0
    }

    get json(): DataTypeObject {
        return {
            type: this._type,
            data_type_id: this._id,
            name: this._name,
            rules: this._rules,
            parent: this._parent,
            genericKeys: this._generic_keys
        }
    }
}