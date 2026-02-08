import React from "react";
import {Editor, EditorTokenHighlights} from "../editor/Editor";
import {StreamLanguage, syntaxTree} from "@codemirror/language";
import {EditorState, Extension, keymap, Prec} from "@uiw/react-codemirror";
import {Badge} from "../badge/Badge";
import {hashToColor} from "../d-flow/DFlow.util";
import {Menu, MenuContent, MenuItem, MenuTrigger} from "../menu/Menu";
import {CompletionContext} from "@codemirror/autocomplete";

export type DataTableFilterOperator = "isOneOf" | "isNotOneOf"

export interface DataTableFilterTokens {
    token: string
    operators: DataTableFilterOperator[]
    suggestion?: (token: string, operator: DataTableFilterOperator, applySuggestion: (value: string) => void) => React.ReactNode
}

export interface DataTableFilterInputProps {
    filterTokens?: DataTableFilterTokens[]
}

export const githubQueryLanguage = StreamLanguage.define<{ expecting: "key" | "operator" | "value" }>({
    startState: () => ({expecting: "key"}),
    token(stream, state) {
        if (stream.eatSpace()) {
            if (state.expecting === "value") state.expecting = "key";
            return null;
        }
        if (state.expecting === "key" && stream.match(/[\w-]+(?=(!=|=))/)) {
            state.expecting = "operator";
            return "propertyName";
        }
        if (state.expecting === "operator" && stream.match(/^(!=|=)/)) {
            state.expecting = "value";
            return "operator";
        }
        if (state.expecting === "value") {
            if (stream.eat(',')) return null;
            if (stream.eatWhile(/[^ ,]/)) return "literal";
        }
        stream.next();
        return null;
    }
})

const singleLineExtension: Extension = [
    Prec.highest(keymap.of([{key: "Enter", run: () => true}])),
    EditorState.transactionFilter.of((tr) => tr.docChanged && tr.newDoc.lines > 1 ? [] : tr),
]

const operatorLabels: Record<string, string> = {"=": "is one of", "!=": "is not one of"};

const tokenHighlights: EditorTokenHighlights = {
    literal: ({content}) => <Badge>{content}</Badge>,
    operator: ({content}) => operatorLabels[content] ?
        <Badge color="tertiary" style={{boxShadow: "none"}}>{operatorLabels[content]}</Badge> : content,
    propertyName: ({content}) => <Badge color={hashToColor(content)}>{content}</Badge>
}

const basicSetup = {
    lineNumbers: false,
    foldGutter: false,
    highlightActiveLine: false,
    highlightActiveLineGutter: false,
    dropCursor: false,
    allowMultipleSelections: false,
    indentOnInput: false,
};

const SuggestionsMenu = ({context, node, pos, prevNode}: { context: CompletionContext, node: any, pos: number, prevNode: any }) => {
    const handleSelect = () => {
        const targetNode = prevNode.type.name === "literal" ? node : null;
        const from = targetNode ? targetNode.from : pos;
        const to = targetNode ? targetNode.to : pos;

        context.view?.dispatch({
            changes: {from, to, insert: "value"},
            selection: {anchor: from + "value".length}
        });
        context.view?.focus();
    };

    const MenuContentAny = MenuContent as any;

    const content = <MenuContentAny
        onOpenAutoFocus={(e: Event) => {
            e.preventDefault();
            ((e.currentTarget as HTMLElement).querySelector('[role="menuitem"]') as HTMLElement)?.focus();
        }}
        onKeyDown={(event: any) => {
            if (!["Escape", "ArrowUp", "ArrowDown"].includes(event.key)) context.view?.focus();
        }}
        style={{position: 'fixed', top: 0, left: 0, pointerEvents: 'auto'}}
    >
        {["false", "true"].map(val => (
            <MenuItem key={val} onSelect={handleSelect}>{val}</MenuItem>
        ))}
    </MenuContentAny>;

    return (
        <Menu open={true} modal={false}>
            <MenuTrigger asChild>
                <div style={{position: 'absolute', top: 0, left: 0, width: 0, height: 0}}/>
            </MenuTrigger>
            {content}
        </Menu>
    );
}

export const DataTableFilterInput: React.FC<DataTableFilterInputProps> = () => {
    return <Editor
        w={"400px"}
        style={{
            backgroundColor: "rgba(255,255,255,.1)",
            padding: "0.35rem",
            borderRadius: "1rem",
            boxShadow: "inset 0 1px 1px 0 rgba(255,255,255,.2)",
        }}
        tokenHighlights={tokenHighlights}
        initialValue={'members=233,2323 status!=false'}
        showTooltips={false}
        showValidation={false}
        customSuggestionComponent={true}
        suggestions={context => {
            const prevNode = syntaxTree(context.state).resolveInner(context.pos, -1);
            if (prevNode.type.name !== "operator" && prevNode.type.name !== "literal") return null;

            return <SuggestionsMenu
                context={context}
                node={syntaxTree(context.state).resolveInner(context.pos, -1)}
                pos={context.state.selection.main.head}
                prevNode={prevNode}
            />
        }}
        extensions={[singleLineExtension]}
        basicSetup={basicSetup}
        language={githubQueryLanguage}
    />
}