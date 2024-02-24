import {Meta} from "@storybook/react";
import React from "react";
import Badge from "./Badge";
import Button from "../button/Button";
import {IconGitBranch} from "@tabler/icons-react";
import {Colors as BadgeVariants}  from "../../utils/types";

const meta: Meta = {
    title: "Badge",
    component: Badge
}

export const Variants = () => {
    return <>

        {
            BadgeVariants.map(value => {
                return <Badge style={{marginRight: ".5rem"}} color={value}>
                    {value}
                </Badge>
            })
        }

    </>
}

export const ButtonExample = () => {
    return <Button color={"primary"}>
        <Button.Icon>
            <IconGitBranch/>
        </Button.Icon>
        Merge Branch
        <Badge style={{marginLeft: ".5rem"}} color={"secondary"}>
            Badge
        </Badge>
    </Button>
}

export default meta