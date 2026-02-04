import React from "react";
import {Editor, EditorTokenHighlights, EditorTokenizer} from "./Editor";
import {Badge} from "../badge/Badge";
import {hashToColor} from "../d-flow/DFlow.util";
import {DFullScreen} from "../d-fullscreen/DFullScreen";
import {CompletionContext, CompletionResult} from "@codemirror/autocomplete";
import {syntaxTree} from "@codemirror/language";


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

    const tokenHighlights: EditorTokenHighlights = {
        bool: ({content}) => {
            return <Badge color={hashToColor("Boolean")} border>
                Boolean
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
    }

    const suggestions = (context: CompletionContext): CompletionResult | null => {

        const word = context.matchBefore(/\w*/)

        if (!word || (word.from === word.to && !context.explicit)) {
            return null;
        }

        const node = syntaxTree(context.state).resolveInner(context.pos, -1);
        const prevNode = syntaxTree(context.state).resolveInner(context.pos, 0);

        if (node.name === "Property" || prevNode.name === "Property") {
            return {
                from: word.from,
                options: [
                    {
                        label: "Text",
                        type: "type",
                        apply: `"Text"`,
                    },
                    {
                        label: "Boolean",
                        type: "type",
                        apply: `true`,
                    },
                    {
                        label: "Number",
                        type: "type",
                        apply: `1`,
                    },
                ]
            }
        }
        return null
    }

    return (
        <DFullScreen>
            <Editor
                language={"json"}
                initialValue={value}
                suggestions={suggestions}
                tokenHighlights={tokenHighlights}
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