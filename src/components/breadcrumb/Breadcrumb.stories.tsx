import {Meta} from "@storybook/react";
import React from "react";
import Breadcrumb from "./Breadcrumb";
import Text from "../text/Text";

const meta: Meta = {
    title: "Breadcrumb",
    component: Breadcrumb
}

export default meta

export const BreadcrumbExample = () => {
    return <Breadcrumb>
        <Text>Test1</Text>
        <Text>Test2</Text>
        <Text>Test3</Text>
    </Breadcrumb>
}