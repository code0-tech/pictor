import React from "react";
import CodeMirror, {ReactCodeMirrorProps} from '@uiw/react-codemirror';
import {createTheme} from '@uiw/codemirror-themes';
import {ValidationProps} from "../form";
import prettier from "prettier/standalone";
import parserBabel from "prettier/plugins/babel";
import parserEstree from "prettier/plugins/estree";
import {DFullScreen} from "../d-fullscreen/DFullScreen";
import { json } from '@codemirror/lang-json';
import {ScrollArea, ScrollAreaScrollbar, ScrollAreaThumb, ScrollAreaViewport} from "../scroll-area/ScrollArea";
import { tags as t } from '@lezer/highlight';
import {hashToColor} from "../d-flow/DFlow.util";

interface EditorInputProps extends ReactCodeMirrorProps, ValidationProps<string> {
    type: 'single' | 'multiple'
    suggestions?: any
    language?: 'json'



}

export const Concept: React.FC = () => {

    const [formatted, setFormatted] = React.useState("")

    React.useEffect(() => {
        (async () => {
            const pretty = await prettier.format(
                JSON.stringify({
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
                    test: {
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
                    test2: {
                        users: [{
                            username: 1,
                            email: "Text",
                            password: false
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
                }),
                {parser: "json", plugins: [parserBabel, parserEstree], printWidth: 1}
            );
            setFormatted(pretty);
        })();
    }, [])

    const myTheme = createTheme({
        theme: 'light',
        settings: {
            background: 'transparent',
            backgroundImage: '',
            foreground: 'rgba(255,255,255, 0.75)',
            caret: 'gray',
            selection: 'rgba(112,179,255,0.25)',
            selectionMatch: 'rgba(112,179,255,0.1)',
            fontSize: "0.8rem",
            gutterBackground: 'transparent',
            gutterForeground: 'rgba(255,255,255, 0.5)',
            gutterBorder: 'transparent',
            gutterActiveForeground: 'rgba(255,255,255, 1)',
            lineHighlight: 'rgba(255,255,255, 0.1)',
        }, styles: [
            {tag: t.squareBracket, color: hashToColor("squareBracket")},
            {tag: t.bracket, color: hashToColor("bracket")},
            {tag: t.string, color: hashToColor("Text")},
            {tag: t.bool, color: hashToColor("Boolean")},
            {tag: t.number, color: hashToColor("Number")},
        ]
    })
    return (
        <DFullScreen>
            <ScrollArea h={"100%"} type={"always"}>
                <ScrollAreaViewport>
                    <CodeMirror readOnly height={"100%"} value={formatted} theme={myTheme} width={"100%"} extensions={[json()]}/>
                </ScrollAreaViewport>
                <ScrollAreaScrollbar orientation={"vertical"}>
                    <ScrollAreaThumb/>
                </ScrollAreaScrollbar>
                <ScrollAreaScrollbar orientation={"horizontal"}>
                    <ScrollAreaThumb/>
                </ScrollAreaScrollbar>
            </ScrollArea>
        </DFullScreen>

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