import React from "react";
import {JsonView} from "./JsonView";
import {Card} from "../card/Card";

export default {
    title: "JsonView",
    component: JsonView,
}

export const Default = () => {

    const value = {
        body: {
            users: [{
                username: "Text",
                email: "Text",
                password: "Text",
                lastLogin: 1,
                active: true,
                deletedAt: null,
            }]
        },
        headers: {
            "Access-Control-Request-Method": "GET",
            "Authorization": "Bearer token",
            "Cache-Control": "no-cache"
        }
    }

    return <Card color={"secondary"} w={"500px"}>
        <JsonView value={value}/>
    </Card>
}

export const Collapsed = () => {

    const value = {
        body: {
            users: [{
                username: "Text",
                email: "Text",
            }]
        },
        headers: {
            "Authorization": "Bearer token",
        }
    }

    return <Card color={"secondary"} w={"500px"}>
        <JsonView value={value} collapsed={2}/>
    </Card>
}

export const WithDataTypes = () => {

    const value = {
        string: "hello",
        number: 42,
        float: 3.14,
        boolean: true,
        nullValue: null,
        array: [1, 2, 3],
        object: {nested: "value"}
    }

    return <Card color={"secondary"} w={"500px"}>
        <JsonView value={value} displayDataTypes displayObjectSize/>
    </Card>
}

export const Primitive = () => {

    const value = "hello"

    return <Card color={"secondary"} w={"500px"}>
        {/**@ts-ignore**/}
        <JsonView value={value} displayDataTypes displayObjectSize/>
    </Card>
}
