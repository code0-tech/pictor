import type {NodeParameterValue} from "@code0-tech/sagittarius-graphql-types";

export enum DFlowSuggestionType {
    REF_OBJECT,
    VALUE,
    FUNCTION,
    FUNCTION_COMBINATION,
    DATA_TYPE,
}

export class DFlowSuggestion {

    public constructor(
        private readonly _hash: string,
        private readonly _path: number[],
        private readonly _value: NodeParameterValue,
        private readonly _type: DFlowSuggestionType,
        private readonly _displayText: string[]
    ){}

    get displayText(): string[] {
        return this._displayText;
    }

    get hash(): string {
        return this._hash;
    }

    get path(): number[] {
        return this._path;
    }

    get value(): NodeParameterValue {
        return this._value;
    }

    get type(): DFlowSuggestionType {
        return this._type;
    }
}