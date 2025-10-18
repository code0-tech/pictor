
import {DFlowDataTypeService} from "./DFlowDataType.service";
import {RuleMap} from "./rules/DFlowDataTypeRules";
import {
    DataType,
    DataTypeIdentifier, DataTypeRuleConnection,
    DataTypeVariant, GenericMapper, Maybe, NodeParameterValue,
    TranslationConnection
} from "@code0-tech/sagittarius-graphql-types";

/*
    @todo is DataType castable to another DataType
 */
export class DataTypeView {

    private readonly _service: DFlowDataTypeService
    private readonly _id: string
    private readonly _type: DataTypeVariant
    private readonly _name?: TranslationConnection
    private readonly _rules?: DataTypeRuleConnection
    private readonly _parent?: Maybe<DataTypeIdentifier>
    private readonly _generic_keys?: Maybe<string[]>

    constructor(dataType: DataType, service: DFlowDataTypeService) {
        this._id = dataType.identifier
        this._type = dataType.variant
        this._name = dataType.name
        this._rules = dataType.rules
        this._parent = dataType.parent
        this._service = service
        this._generic_keys = dataType.genericKeys
    }

    public validateDataType(dataType: DataTypeView): boolean {

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

        return arraysEqual(this.rules?.nodes as [], this.rules?.nodes as [])
    }

    public validateValue(value: NodeParameterValue, generics?: GenericMapper[]): boolean {

        //TODO: needs to be replaced with general validation for all types
        /*
        if (this._type === DataTypeVariant.Object && !isObject(value)) {
            return false
        }

        if (this._type === DataTypeVariant.Node && !isNodeFunctionObject(value as NodeFunctionObject)) {
            return false
        }
        */

        const map = new Map<string, GenericMapper>(generics?.map(generic => [generic.target, generic]))

        return this.rules?.nodes?.every(rule => {
            if (!rule) return false
            return RuleMap.get(rule.variant)?.validate(value, rule.config, map, this._service)
        }) ?? false
    }


    get rules(): DataTypeRuleConnection | undefined {
        return this._rules
    }

    get id(): string {
        return this._id
    }

    get service(): DFlowDataTypeService {
        return this._service
    }

    get genericKeys(): Maybe<string[]> | undefined {
        return this._generic_keys
    }

    get type(): DataTypeVariant {
        return this._type;
    }

    get depth(): number {
        return this._parent ? 1 + (this._service.getDataType(this._parent)?.depth ?? 0) : 0
    }

    get json(): DataType | undefined {
        return undefined
    }
}