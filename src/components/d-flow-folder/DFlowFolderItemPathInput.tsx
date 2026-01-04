import React from "react";
import {InputSuggestion, TextInput, TextInputProps} from "../form";
import {InputSyntaxSegment} from "../form/Input.syntax.hook";
import {Badge} from "../badge/Badge";

export interface DFlowFolderItemPathInputProps extends TextInputProps {

}

export const DFlowFolderItemPathInput: React.FC<DFlowFolderItemPathInputProps> = (props) => {

    const {...rest} = props

    const transformSyntax = (
        value?: string | null,
        _: (InputSuggestion | any)[] = [],
    ): InputSyntaxSegment[] => {

        const normalizePath = (s: string) => {
            const r = [], b = ""
            let buf = b
            s.split("").forEach(c =>
                c === "/"
                    ? (buf && r.push(buf), buf = "", r.push("/"))
                    : buf += c
            )
            buf && r.push(buf)
            return r
        };
        const splitValue = normalizePath(value ?? "")
        let cursor = 0

        return splitValue.map((value, index) => {
            const segment = {
                type: splitValue.length - 1 !== index ? "block" : "text",
                value: value,
                start: cursor,
                end: cursor + value.length,
                visualLength: splitValue.length - 1 !== index ? 1 : value.length,
                content: splitValue.length - 1 !== index ? <Badge color={value == "/" ? "warning" : "info"}>{value}</Badge> : value,
            }
            cursor += value.length
            return [segment]
        }).flat() as InputSyntaxSegment[]

    }

    return <TextInput transformSyntax={transformSyntax} {...rest}/>
}
