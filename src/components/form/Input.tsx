import React, {
    LegacyRef,
    RefObject,
    useEffect,
    useMemo,
    useRef,
    ForwardRefExoticComponent,
} from "react";
import { Code0Component } from "../../utils/types";
import { ValidationProps } from "./useForm";
import { mergeCode0Props } from "../../utils/utils";
import "./Input.style.scss";

import InputLabel from "./InputLabel";
import InputDescription from "./InputDescription";
import InputMessage from "./InputMessage";

import {
    Menu,
    MenuPortal,
    MenuTrigger
} from "../menu/Menu";

import {
    DFlowSuggestionMenu,
    DFlowSuggestionMenuRef
} from "../d-flow/suggestions/DFlowSuggestionMenu";
import {DFlowSuggestion} from "../d-flow/suggestions/DFlowSuggestion.view";

// Hilfsfunktion zur programmgesteuerten Value-Setzung
export const setElementKey = (element: HTMLElement, key: string, value: any, event: string) => {
    const valueSetter = Object.getOwnPropertyDescriptor(element, key)?.set;
    const prototype = Object.getPrototypeOf(element);
    const prototypeValueSetter = Object.getOwnPropertyDescriptor(prototype, key)?.set;

    if (valueSetter && valueSetter !== prototypeValueSetter) {
        prototypeValueSetter?.call(element, value);
    } else {
        valueSetter?.call(element, value);
    }

    element.dispatchEvent(new Event(event, { bubbles: true }));
};

type Code0Input = Omit<Omit<Omit<Omit<Code0Component<HTMLInputElement>, "defaultValue">, "left">, "right">, "title">;

export interface InputProps<T> extends Code0Input, ValidationProps<T> {
    suggestions?: DFlowSuggestion[];
    wrapperComponent?: Code0Component<HTMLDivElement>;
    right?: React.ReactNode;
    left?: React.ReactNode;
    leftType?: "action" | "placeholder" | "icon";
    rightType?: "action" | "placeholder" | "icon";
    title?: React.ReactNode;
    description?: React.ReactNode;
}

const Input: ForwardRefExoticComponent<InputProps<any>> = React.forwardRef(
    (props: InputProps<any>, ref: RefObject<HTMLInputElement>) => {
        const inputRef = ref || useRef<HTMLInputElement>(null);
        const menuRef = useRef<DFlowSuggestionMenuRef | null>(null);
        const [open, setOpen] = React.useState(false);
        const shouldPreventCloseRef = useRef(true);

        const {
            wrapperComponent = {},
            title,
            description,
            disabled = false,
            left,
            right,
            leftType = "icon",
            rightType = "action",
            formValidation = { valid: true, notValidMessage: null, setValue: null },
            suggestions,
            ...rest
        } = props;

        // Input-Change auf Form setzen
        useEffect(() => {
            const el = inputRef.current;
            if (!el || !formValidation?.setValue) return;

            const handler = (ev: any) => {
                const value = rest.type !== "checkbox" ? ev.target.value : ev.target.checked;
                formValidation.setValue?.(value);
            };

            el.addEventListener("change", handler);
            return () => el.removeEventListener("change", handler);
        }, [inputRef, formValidation?.setValue]);

        // PointerDown für ClickOutside-Steuerung
        useEffect(() => {
            if (!suggestions) return;

            const handler = (e: PointerEvent) => {
                shouldPreventCloseRef.current = !!inputRef.current?.contains(e.target as Node);
            };

            document.addEventListener("pointerdown", handler, true);
            return () => document.removeEventListener("pointerdown", handler, true);
        }, [inputRef, suggestions]);

        const suggestionMenu = useMemo(() => {
            return (
                <Menu
                    open={open}
                    modal={false}
                    onOpenChange={(next) => {
                        if (!next && shouldPreventCloseRef.current) {
                            shouldPreventCloseRef.current = false;
                            return;
                        }

                        setOpen(next);

                        if (next) {
                            setTimeout(() => {
                                inputRef.current?.focus();
                            }, 0);
                        }
                    }}
                >
                    <MenuTrigger asChild>
                        <input
                            ref={inputRef as LegacyRef<HTMLInputElement>}
                            {...mergeCode0Props("input__control", rest)}
                            onMouseDown={() => (shouldPreventCloseRef.current = true)}
                            onFocus={() => !open && setOpen(true)}
                            onKeyDown={(e) => {
                                if (e.key === "ArrowDown") {
                                    e.preventDefault();
                                    menuRef.current?.focusFirstItem();
                                } else if (e.key === "ArrowUp") {
                                    e.preventDefault();
                                    menuRef.current?.focusLastItem();
                                }
                            }}
                        />
                    </MenuTrigger>
                    <MenuPortal>
                        {/* @ts-ignore */}
                        <DFlowSuggestionMenu ref={menuRef} suggestions={suggestions} />
                    </MenuPortal>
                </Menu>
            );
        }, [open, suggestions]);

        return (
            <>
                {title && <InputLabel>{title}</InputLabel>}
                {description && <InputDescription>{description}</InputDescription>}

                <div {...mergeCode0Props(`input ${!formValidation?.valid ? "input--not-valid" : ""}`, wrapperComponent)}>
                    {left && <div className={`input__left input__left--${leftType}`}>{left}</div>}

                    {suggestions ? suggestionMenu : (
                        <input
                            tabIndex={2}
                            ref={inputRef as LegacyRef<HTMLInputElement>}
                            {...mergeCode0Props("input__control", rest)}
                        />
                    )}

                    {right && <div className={`input__right input__right--${rightType}`}>{right}</div>}
                </div>

                {!formValidation?.valid && formValidation?.notValidMessage && (
                    <InputMessage>{formValidation.notValidMessage}</InputMessage>
                )}
            </>
        );
    }
);

export default Input;