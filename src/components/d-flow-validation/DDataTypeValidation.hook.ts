import {DataTypeView} from "../d-flow-data-type";

const IGNORE_ID_KEYS = ["id", "__typename", "createdAt", "updatedAt", "aliases", "displayMessages", "name", "runtime"];

export const useDataTypeValidation = (
    firstDataType: DataTypeView,
    secondDataType: DataTypeView
) => {

    if (firstDataType?.variant !== secondDataType?.variant) return false

    const isObject = (value: unknown): value is Record<string, unknown> => {
        return value !== null && typeof value === "object"
    }

    const isDeepEqual = (value1: unknown, value2: unknown): boolean => {
        if (value1 === value2) return true

        const value1IsArray = Array.isArray(value1)
        const value2IsArray = Array.isArray(value2)

        if (value1IsArray || value2IsArray) {
            if (!value1IsArray || !value2IsArray) return false

            if (value1.length !== value2.length) return false

            return (value1 as unknown[]).every((entry, index) => isDeepEqual(entry, (value2 as unknown[])[index]))
        }

        if (isObject(value1) && isObject(value2)) {
            const objKeys1 = Object.keys(value1)
            const objKeys2 = Object.keys(value2)

            if (objKeys1.length !== objKeys2.length) return false

            return objKeys1.every(key => {
                if (IGNORE_ID_KEYS.includes(key)) return true // Ignore IDs in deep comparison
                return isDeepEqual((value1 as Record<string, unknown>)[key], (value2 as Record<string, unknown>)[key])
            })
        }

        return false
    }

    const firstRules = firstDataType.rules?.nodes ?? []
    const secondRules = secondDataType.rules?.nodes ?? []

    if (!firstRules.length && !secondRules.length) return true
    if (!firstRules.length || !secondRules.length) return false

    if (firstRules.length !== secondRules.length) return false

    return firstRules.every((rule, index) => isDeepEqual(rule, secondRules[index]))
}
