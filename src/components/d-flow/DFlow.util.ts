import {md5} from "js-md5";
import {DataType, DataTypeIdentifier} from "@code0-tech/sagittarius-graphql-types";

const GOLDEN_ANGLE = 137.50776405003785

const extractIdNumber = (s: string) => {
    const m = s.match(/\/(\d+)\s*$/)
    return m ? Number(m[1]) : null
}

export const hashToColor = (s: string): string => {
    const n = extractIdNumber(s)
    if (n != null) {
        const range = 320
        const hue = 25 + ((n * GOLDEN_ANGLE) % range)
        return `hsl(${hue}, 100%, 72%)`
    }

    const h = md5(md5(s))
    const a = parseInt(h.slice(0, 8), 16)
    return `hsl(${25 + (a % 320)}, 100%, 72%)`
}

export const attachDataTypeIdentifiers = <T>(
    identifiers: DataTypeIdentifier[],
    input: T
): T => {
    const map = new Map(
        identifiers
            .filter(x => x?.id)
            .map(x => [x.id!, x])
    )

    const walk = (v: any): any =>
        Array.isArray(v)
            ? v.map(walk)
            : v && typeof v === "object"
                ? {
                    ...Object.fromEntries(
                        Object.entries(v).map(([k, val]) => [k, walk(val)])
                    ),
                    ...(v.dataTypeIdentifierId
                        ? { dataTypeIdentifier: map.get(v.dataTypeIdentifierId) ?? null }
                        : {}),
                    ...(Array.isArray(v.sourceDataTypeIdentifierIds)
                        ? {
                            sourceDataTypeIdentifiers: v.sourceDataTypeIdentifierIds
                                .map((id: any) => map.get(id))
                                .filter(Boolean)
                        }
                        : {})
                }
                : v

    return walk(input)
}

export const resolveDataTypeIdentifiers = (
    list: DataTypeIdentifier[]
): DataTypeIdentifier[] => {
    const byId = new Map(list.filter(x => x?.id).map(x => [x.id!, x]))
    const memo = new Map<string, DataTypeIdentifier>()

    const build = (x?: DataTypeIdentifier | null): DataTypeIdentifier | null => {
        if (!x?.id) return x as any
        if (memo.has(x.id)) return memo.get(x.id)!

        const out: DataTypeIdentifier = { ...(x as any) }
        memo.set(x.id, out)

        if (x.genericType) {
            out.genericType = { ...(x.genericType as any) }

            const mappers = (x.genericType as any).genericMappers
            if (Array.isArray(mappers)) {
                ;(out.genericType as any).genericMappers = mappers.map((m: any) => ({
                    ...m,
                    ...(Array.isArray(m.sourceDataTypeIdentifierIds)
                        ? {
                            sourceDataTypeIdentifiers: m.sourceDataTypeIdentifierIds
                                .map((id: any) => build(byId.get(id) ?? null))
                                .filter(Boolean),
                        }
                        : {}),
                })) as any
            }
        }

        return out
    }

    const resolved = list.map(x => build(x)!).filter(Boolean) as DataTypeIdentifier[]

    const resolveDataType = (dt: any) => {
        if (!dt) return dt

        const nodes = dt?.dataTypeIdentifiers?.nodes
        if (!Array.isArray(nodes)) return dt

        const localResolved = resolveDataTypeIdentifiers(nodes)

        const dtWithNodes = {
            ...dt,
            dataTypeIdentifiers: { ...dt.dataTypeIdentifiers, nodes: localResolved },
        }

        return attachDataTypeIdentifiers(localResolved, dtWithNodes)
    }

    resolved.forEach((id: any) => {
        if (id?.dataType) id.dataType = resolveDataType(id.dataType)
        if (id?.genericType?.dataType) id.genericType.dataType = resolveDataType(id.genericType.dataType)
    })

    return resolved
}