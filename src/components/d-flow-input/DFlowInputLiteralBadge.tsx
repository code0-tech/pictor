import React from "react";
import {Badge, BadgeType} from "../badge/Badge";
import {LiteralValue} from "@code0-tech/sagittarius-graphql-types";
import {Text} from "../text/Text";

export interface DFlowInputLiteralBadgeProps extends Omit<BadgeType, 'value' | 'children'> {
    value: LiteralValue
}

export const DFlowInputLiteralBadge: React.FC<DFlowInputLiteralBadgeProps> = (props) => {

    const {value, ...rest} = props

    return <Badge style={{verticalAlign: "middle"}}
                  color={"secondary"}
                  {...rest}>
        <Text size={"sm"}>
            {String(value.value)}
        </Text>
    </Badge>
}