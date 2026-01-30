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

interface EditorInputProps extends ReactCodeMirrorProps, ValidationProps<string> {
    type: 'single' | 'multiple'
    suggestions?: any
    language?: 'json' | 'javascript' | 'typescript' | 'xml' | 'css' | 'markdown'



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
            { tag: t.keyword, color: '#cf6edf' },
            { tag: [t.name, t.deleted, t.character, t.macroName], color: '#56c8d8' },
            { tag: [t.propertyName], color: '#facf4e' },
            { tag: [t.variableName], color: '#bdbdbd' },
            { tag: [t.function(t.variableName)], color: '#56c8d8' },
            { tag: [t.labelName], color: '#cf6edf' },
            { tag: [t.color, t.constant(t.name), t.standard(t.name)], color: '#facf4e' },
            { tag: [t.definition(t.name), t.separator], color: '#fa5788' },
            { tag: [t.brace], color: '#cf6edf' },
            { tag: [t.annotation], color: '#ff5f52' },
            { tag: [t.number, t.changed, t.annotation, t.modifier, t.self, t.namespace], color: '#ffad42' },
            { tag: [t.typeName, t.className], color: '#ffad42' },
            { tag: [t.operator, t.operatorKeyword], color: '#7186f0' },
            { tag: [t.tagName], color: '#99d066' },
            { tag: [t.squareBracket], color: '#ff5f52' },
            { tag: [t.angleBracket], color: '#606f7a' },
            { tag: [t.attributeName], color: '#bdbdbd' },
            { tag: [t.regexp], color: '#ff5f52' },
            { tag: [t.quote], color: '#6abf69' },
            { tag: [t.string], color: '#99d066' },
            {
                tag: t.link,
                color: '#56c8d8',
                textDecoration: 'underline',
                textUnderlinePosition: 'under',
            },
            { tag: [t.url, t.escape, t.special(t.string)], color: '#facf4e' },
            { tag: [t.meta], color: '#707d8b' },
            { tag: [t.comment], color: '#707d8b', fontStyle: 'italic' },
            { tag: t.monospace, color: '#bdbdbd' },
            { tag: t.strong, fontWeight: 'bold', color: '#ff5f52' },
            { tag: t.emphasis, fontStyle: 'italic', color: '#99d066' },
            { tag: t.strikethrough, textDecoration: 'line-through' },
            { tag: t.heading, fontWeight: 'bold', color: '#facf4e' },
            { tag: t.heading1, fontWeight: 'bold', color: '#facf4e' },
            {
                tag: [t.heading2, t.heading3, t.heading4],
                fontWeight: 'bold',
                color: '#facf4e',
            },
            { tag: [t.heading5, t.heading6], color: '#facf4e' },
            { tag: [t.atom, t.bool, t.special(t.variableName)], color: '#56c8d8' },
            { tag: [t.processingInstruction, t.inserted], color: '#ff5f52' },
            { tag: [t.contentSeparator], color: '#56c8d8' },
            { tag: t.invalid, color: '#606f7a', borderBottom: `1px dotted #ff5f52` },
        ]
    })
    return (
        <DFullScreen>
            <ScrollArea h={"100%"} type={"always"}>
                <ScrollAreaViewport>
                    <CodeMirror height={"100%"} value={formatted} theme={myTheme} width={"100%"} extensions={[json()]}/>
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