import {Badge, BadgeType} from "../badge/Badge";
import {ReferenceValue} from "@code0-tech/sagittarius-graphql-types";
import React from "react";
import {Text} from "../text/Text";
import {IconCirclesRelation} from "@tabler/icons-react";
import {md5} from "js-md5";

export interface DFlowInputReferenceBadge extends Omit<BadgeType, 'value' | 'children'> {
    value: ReferenceValue
}

export const DFlowInputReferenceBadge: React.FC<DFlowInputReferenceBadge> = (props) => {

    const {value, ...rest} = props
    const hashRef = md5(md5(value.nodeFunctionId || ""))

    const hashToHue = (md5: string): number => {
        const int = parseInt(md5.slice(0, 8), 16)
        return int % 360
    }

    return <Badge style={{verticalAlign: "middle"}}
                  color={`hsl(${hashToHue(hashRef)}, 100%, 72%)`}
                  border
                  {...rest}>
        <IconCirclesRelation size={12}/>
        <Text size={"sm"} style={{color: "inherit"}}>
            {String(value.depth)}-{String(value.scope)}-{String(value.node)}-{value.referencePath?.map(path => path.path).join(".") ?? ""}
        </Text>
    </Badge>
}