import React from "react";
import {ScrollArea, ScrollAreaScrollbar, ScrollAreaThumb, ScrollAreaViewport} from "../scroll-area/ScrollArea";
import {Editor, EditorTokenHighlights, EditorTokenizer} from "./Editor";
import {Badge} from "../badge/Badge";
import {hashToColor} from "../d-flow/DFlow.util";
import {DFullScreen} from "../d-fullscreen/DFullScreen";


export const Concept: React.FC = () => {

    const value = {
        body: {
            users: [{
                username: "Text",
                email: "Text",
                password: "Text",
                lastLogin: 1
            }]
        },
        headers: {
            "Access-Control-Request-Method": "Text",
            "Authorization": "Text",
            "Cache-Control": "Text"
        }
    }

    const tokenizer: EditorTokenizer = (content) => {
        if (content.startsWith("@")) return "mention";
        return null;
    };

    const myRenderMap: EditorTokenHighlights = {
        mention: ({content}) => {
            return <Badge color={hashToColor("Mention")} border>
                {content}
            </Badge>
        },
        string: ({content}) => {
            return <Badge key={"Text"} color={hashToColor("Text")} border>
                Text
            </Badge>
        },
        number: ({content}) => {
            return <Badge key={"Number"} color={hashToColor("Number")} border>
                Number
            </Badge>
        }
    };

    return (
        <DFullScreen>
                <Editor
                    language={"json"}
                    initialValue={value}
                    tokenizer={tokenizer}
                    tokenHighlights={myRenderMap}
                    onChange={(val) => console.log("New Value:", val)}
                />
        </DFullScreen>

    )
}


export default {
    title: "Concepts/Editor",
    component: Concept,
    parameters: {
        visualTest: {
            selector: 'body'
        },
        layout: "fullscreen"
    },
}