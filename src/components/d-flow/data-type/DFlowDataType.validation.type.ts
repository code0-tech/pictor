import {DataTypeView} from "./DFlowDataType.view";

export const useValidateDataType = (
    firstDataType: DataTypeView,
    secondDataType: DataTypeView
) => {
    if (firstDataType.variant != secondDataType.variant) return false

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


    if (firstDataType.rules && !secondDataType.rules) return false
    if (firstDataType.rules && secondDataType.rules) return false

    return arraysEqual(firstDataType.rules?.nodes as [], secondDataType.rules?.nodes as [])
}