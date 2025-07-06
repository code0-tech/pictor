import {Value} from "../data-type/DFlowDataType.view";

export enum DFlowSuggestionType {
    REF_OBJECT,
    VALUE,
    FUNCTION,
    FUNCTION_COMBINATION
}

export class DFlowSuggestion {

    public constructor(
        private readonly _hash: string,
        private readonly _path: number[],
        private readonly _value: Value,
        private readonly _type: DFlowSuggestionType
    ){}


    get hash(): string {
        return this._hash;
    }

    get path(): number[] {
        return this._path;
    }

    get value(): Value {
        return this._value;
    }

    get type(): DFlowSuggestionType {
        return this._type;
    }
}