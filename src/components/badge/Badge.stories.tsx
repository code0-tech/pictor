import {Meta} from "@storybook/react";
import React from "react";
import Badge from "./Badge";
import Button from "../button/Button";
import {IconGitBranch} from "@tabler/icons-react";

const meta: Meta = {
    title: "Badge",
    component: Badge
}

export const Variants = () => {
    return <>

        {
            ["primary", "secondary", "info", "success", "warning", "error"].map(value => {
                // @ts-ignore
                return <Badge style={{marginRight: ".5rem"}} variant={value}>
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
        <Badge style={{marginLeft: ".5rem"}} variant={"secondary"}>
            Badge
        </Badge>
    </Button>
}

export default meta