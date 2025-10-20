
import {DFlowDataTypeService} from "./DFlowDataType.service";
import {RuleMap} from "./rules/DFlowDataTypeRules";
import {
    DataType,
    DataTypeRuleConnection,
    DataTypeVariant, GenericMapper, Maybe, Namespace, NodeParameterValue, Scalars,
    TranslationConnection
} from "@code0-tech/sagittarius-graphql-types";

/*
    @todo is DataType castable to another DataType
 */
export class DataTypeView {

    /** Time when this DataType was created */
    private readonly _createdAt?: Maybe<Scalars['Time']['output']>;
    /** Generic keys of the datatype */
    private readonly _genericKeys?: Maybe<Array<Scalars['String']['output']>>;
    /** Global ID of this DataType */
    private readonly _id?: Maybe<Scalars['DataTypeID']['output']>;
    /** The identifier scoped to the namespace */
    private readonly _identifier?: Maybe<Scalars['String']['output']>;
    /** Names of the flow type setting */
    private readonly _name?: Maybe<TranslationConnection>;
    /** The namespace where this datatype belongs to */
    private readonly _namespace?: Maybe<Namespace>;
    /** Rules of the datatype */
    private readonly _rules?: Maybe<DataTypeRuleConnection>;
    /** Time when this DataType was last updated */
    private readonly _updatedAt?: Maybe<Scalars['Time']['output']>;
    /** The type of the datatype */
    private readonly _variant?: Maybe<DataTypeVariant>;
    private readonly _service: DFlowDataTypeService

    constructor(dataType: DataType, service: DFlowDataTypeService) {
        this._id = dataType.id
        this._createdAt = dataType.createdAt
        this._updatedAt = dataType.updatedAt
        this._identifier = dataType.identifier
        this._name = dataType.name ?? undefined
        this._namespace = dataType.namespace ?? undefined
        this._variant = dataType.variant
        this._genericKeys = dataType.genericKeys ?? undefined
        this._rules = dataType.rules ?? undefined
        this._service = service

    }

    public validateDataType(dataType: DataTypeView): boolean {

        if (this._variant != dataType.variant) return false

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

        const map = new Map<string, GenericMapper>(generics?.map(generic => [generic.target!!, generic]))

        return this.rules?.nodes?.every(rule => {
            if (!rule || !rule.variant || !rule.config) return false
            return RuleMap.get(rule.variant)?.validate(value, rule.config, map, this._service)
        }) ?? false
    }


    get createdAt(): Maybe<Scalars["Time"]["output"]> | undefined {
        return this._createdAt;
    }

    get genericKeys(): Maybe<Array<Scalars["String"]["output"]>> | undefined {
        return this._genericKeys;
    }

    get id(): Maybe<Scalars["DataTypeID"]["output"]> | undefined {
        return this._id;
    }

    get identifier(): Maybe<Scalars["String"]["output"]> | undefined {
        return this._identifier;
    }

    get name(): Maybe<TranslationConnection> | undefined {
        return this._name;
    }

    get namespace(): Maybe<Namespace> | undefined {
        return this._namespace;
    }

    get rules(): Maybe<DataTypeRuleConnection> | undefined {
        return this._rules;
    }

    get updatedAt(): Maybe<Scalars["Time"]["output"]> | undefined {
        return this._updatedAt;
    }

    get variant(): Maybe<DataTypeVariant> | undefined {
        return this._variant;
    }

    get service(): DFlowDataTypeService {
        return this._service;
    }

    get json(): DataType | undefined {
        return undefined
    }
}