import React from "react";
import {ScrollArea, ScrollAreaScrollbar, ScrollAreaThumb, ScrollAreaViewport} from "../scroll-area/ScrollArea";
import {EditorInput, RenderMap, UserTokenRule} from "./EditorInput";
import {Badge} from "../badge/Badge";
import {hashToColor} from "../d-flow/DFlow.util";


export const Concept: React.FC = () => {

    const value = JSON.stringify({
        body: {
            users: [{
                username: "Text",
                email: "Text",
                password: "Text"
            }, {
                username: "Text",
                email: "Text",
                password: "Text"
            }]
        },
        headers: {
            "Access-Control-Request-Method": "Text",
            "Authorization": "Text",
            "Cache-Control": "Text"
        }
    })

    const myUserRule: UserTokenRule = (stream) => {
        if (stream.match(/@\w+/)) return "mention";
        return null;
    };

    const myRenderMap: RenderMap = {
        mention: ({rawValue}) => {
            return <Badge color={hashToColor("Mention")} border>
                {rawValue}
            </Badge>
        },
        String: ({rawValue}) => {
            return <Badge color={hashToColor("Text")} border>
                Text
            </Badge>
        }
    };

    return (
        <ScrollArea h={"100%"} type={"always"}>
            <ScrollAreaViewport>
                <EditorInput
                    language={"json"}
                    initialValue={value}
                    userRule={myUserRule}
                    renderMap={myRenderMap}
                    onChange={(val) => console.log("New Value:", val)}
                />
            </ScrollAreaViewport>
            <ScrollAreaScrollbar orientation={"vertical"}>
                <ScrollAreaThumb/>
            </ScrollAreaScrollbar>
            <ScrollAreaScrollbar orientation={"horizontal"}>
                <ScrollAreaThumb/>
            </ScrollAreaScrollbar>
        </ScrollArea>

    )
}


export default {
    title: "Concepts/EditorInput",
    component: Concept,
    parameters: {
        visualTest: {
            selector: 'body'
        },
        layout: "fullscreen"
    },
}