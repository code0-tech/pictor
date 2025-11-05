/**
 * Input.tsx
 *
 * A highly customizable and accessible input component with extended features,
 * including dynamic suggestion rendering, validation handling, and structural
 * decoration options. Designed to integrate seamlessly with complex forms,
 * this component provides robust interaction patterns and user guidance.
 */

import React, {ForwardRefExoticComponent, LegacyRef, RefObject, useEffect, useMemo, useRef, useState} from "react";

import {Code0Component} from "../../utils/types";
import {ValidationProps} from "./useForm";
import {mergeCode0Props} from "../../utils/utils";

import "./Input.style.scss";

import {InputLabel} from "./InputLabel";
import {InputDescription} from "./InputDescription";
import {InputMessage} from "./InputMessage";

import {Menu, MenuPortal, MenuTrigger} from "../menu/Menu";
import {
    InputSuggestion,
    InputSuggestionMenuContent,
    InputSuggestionMenuContentItems,
    InputSuggestionMenuContentItemsHandle
} from "./InputSuggestion";

// Programmatically set a property (like 'value') and dispatch an event (like 'change')
export const setElementKey = (
    element: HTMLElement,
    key: string,
    value: any,
    event: string
) => {
    const valueSetter = Object.getOwnPropertyDescriptor(element, key)?.set; // Try direct setter
    const prototype = Object.getPrototypeOf(element);
    const prototypeValueSetter = Object.getOwnPropertyDescriptor(prototype, key)?.set; // Fallback to prototype

    if (valueSetter && valueSetter !== prototypeValueSetter) {
        prototypeValueSetter?.call(element, value); // Use prototype's setter if overridden
    } else {
        valueSetter?.call(element, value); // Use direct setter
    }

    element.dispatchEvent(new Event(event, {bubbles: true})); // Fire change/input event
};

// Base input props without layout-specific keys
export type Code0Input = Omit<
    Omit<Omit<Code0Component<HTMLInputElement>, "left">, "right">,
    "title"
>;

// Input component props definition
export interface InputProps<T> extends Code0Input, ValidationProps<T> {

    suggestions?: InputSuggestion[] // Optional suggestions shown in dropdown
    suggestionsHeader?: React.ReactNode // Custom header above suggestions
    suggestionsFooter?: React.ReactNode // Custom footer below suggestions
    onSuggestionSelect?: (suggestion: InputSuggestion) => void // Callback when a suggestion is selected
    transformValue?: (value: T) => React.ReactNode | T // Optional value transformation function
    disableOnValue?: (value: T) => boolean

    wrapperComponent?: Code0Component<HTMLDivElement> // Props for the wrapping div
    right?: React.ReactNode // Right-side icon or element
    left?: React.ReactNode // Left-side icon or element
    leftType?: "action" | "placeholder" | "icon" // Visual type for left slot
    rightType?: "action" | "placeholder" | "icon" // Visual type for right slot
    title?: React.ReactNode // Input label
    description?: React.ReactNode // Label description below title

}

export const Input: ForwardRefExoticComponent<InputProps<any>> = React.forwardRef(
    (props: InputProps<any>, ref: RefObject<HTMLInputElement>) => {
        const inputRef = ref || useRef<HTMLInputElement>(null); // External ref or fallback internal ref
        const menuRef = useRef<InputSuggestionMenuContentItemsHandle | null>(null); // Ref to suggestion list
        const [open, setOpen] = useState(false); // Dropdown open state
        const shouldPreventCloseRef = useRef(true); // Controls if dropdown should stay open on click
        const [value, setValue] = useState<any>(props.defaultValue || props.initialValue || props.placeholder)

        const {
            wrapperComponent = {}, // Default empty wrapper props
            title, // Optional input label
            description, // Optional description below label
            disabled = false, // Input disabled state
            left, // Left element (icon/button)
            right, // Right element (icon/button)
            leftType = "icon", // Visual hint for left
            rightType = "action", // Visual hint for right
            formValidation = {valid: true, notValidMessage: null, setValue: null}, // Validation config
            suggestions, // Optional suggestions array
            suggestionsHeader, // Optional header above suggestion list
            suggestionsFooter, // Optional footer below suggestion list
            onSuggestionSelect = () => {
            }, // Callback for suggestion selection,
            disableOnValue = () => false,
            ...rest // Remaining native input props
        } = props;

        // Sync input value changes to external validation state
        useEffect(() => {
            const el = inputRef.current;
            if (!el || !formValidation?.setValue) return;

            const handleChange = (event: any) => {
                const value = rest.type !== "checkbox" ? event.target.value : event.target.checked; // Support checkbox
                formValidation.setValue?.(value); // Push value to form context
            };

            el.addEventListener("change", handleChange); // Native listener
            return () => el.removeEventListener("change", handleChange); // Cleanup
        }, [formValidation?.setValue]);

        // Manage click-outside logic for dropdown
        useEffect(() => {
            if (!suggestions) return;

            const handlePointerDown = (event: PointerEvent) => {
                shouldPreventCloseRef.current = !!inputRef.current?.contains(event.target as Node); // Stay open if click is inside
            };

            document.addEventListener("pointerdown", handlePointerDown, true);
            return () => document.removeEventListener("pointerdown", handlePointerDown, true);
        }, [suggestions]);

        const disabledOnValue = React.useMemo(() => disableOnValue(value), [value, disableOnValue])

        useEffect(() => {
            if (!inputRef.current) return
            inputRef.current.addEventListener("change", (e: any) => {
                if (disabledOnValue) return
                setValue(e.target.value)
            })
            inputRef.current.addEventListener("input", (e: any) => {
                if (disabledOnValue) return
                setValue(e.target.value)
            })
        }, [inputRef, disabledOnValue])


        const syntax = React.useMemo(() => {
            return props.transformValue ? (
                <div className={"input__syntax"}>
                    {props.transformValue(value)} {/* Render transformed value */}
                </div>
            ) : null
        }, [props.transformValue, value])

        // Render suggestion menu dropdown
        const suggestionMenu = useMemo(() => (
            <Menu
                open={open} // Controlled open state
                modal={false}
                onOpenChange={(nextOpen) => {
                    if (!nextOpen && shouldPreventCloseRef.current) { // Prevent close if internal click
                        shouldPreventCloseRef.current = false;
                        return;
                    }

                    setOpen(nextOpen);

                    if (nextOpen) {
                        setTimeout(() => inputRef.current?.focus(), 0); // Refocus input on open
                    }
                }}
            >
                <MenuTrigger asChild>
                    <input
                        ref={inputRef as LegacyRef<HTMLInputElement>} // Cast for TS compatibility
                        {...mergeCode0Props(`input__control ${props.transformValue ? "input__control--syntax" : ""}`, rest)}
                        onFocus={() => !open && setOpen(true)} // Open on focus
                        onKeyDown={(e) => {
                            if (e.key === "ArrowDown") {
                                e.preventDefault();
                                menuRef.current?.focusFirstItem(); // Navigate down
                            } else if (e.key === "ArrowUp") {
                                e.preventDefault();
                                menuRef.current?.focusLastItem(); // Navigate up
                            }
                        }}
                        disabled={disabled || disabledOnValue}
                    />
                </MenuTrigger>
                <MenuPortal>
                    <InputSuggestionMenuContent>
                        {suggestionsHeader} {/* Custom content above suggestions */}
                        <InputSuggestionMenuContentItems
                            /* @ts-ignore */
                            ref={menuRef} // Handle keyboard focus control
                            suggestions={suggestions}
                            onSuggestionSelect={(suggestion) => {
                                // Update value and dispatch event
                                if (!onSuggestionSelect) setElementKey(ref.current, "value", typeof value == "object" ? JSON.stringify(suggestion.value) : suggestion.value, "change");
                                onSuggestionSelect(suggestion)
                                setOpen(false)
                            }}
                        />
                        {suggestionsFooter} {/* Custom content below suggestions */}
                    </InputSuggestionMenuContent>
                </MenuPortal>
            </Menu>
        ), [open, suggestions, suggestionsHeader, suggestionsFooter]);

        return (
            <>
                {title && <InputLabel>{title}</InputLabel>} {/* Optional label */}
                {description && <InputDescription>{description}</InputDescription>} {/* Optional description */}

                <div
                    {...mergeCode0Props(
                        `input ${!formValidation?.valid ? "input--not-valid" : ""}`, // Add error class if invalid
                        wrapperComponent
                    )}
                >
                    {left && <div className={`input__left input__left--${leftType}`}>{left}</div>} {/* Left element */}

                    {suggestions ? (
                        suggestionMenu // If suggestions exist, render dropdown version
                    ) : (
                        <input
                            tabIndex={2} // Ensure keyboard tab order
                            ref={inputRef as LegacyRef<HTMLInputElement>}
                            disabled={disabled}
                            {...mergeCode0Props(`input__control ${props.transformValue ? "input__control--syntax" : ""}`, rest)} // Basic input styling and props
                        />
                    )}

                    {syntax}

                    {right &&
                        <div className={`input__right input__right--${rightType}`}>{right}</div>} {/* Right element */}
                </div>

                {!formValidation?.valid && formValidation?.notValidMessage && (
                    <InputMessage>{formValidation.notValidMessage}</InputMessage> // Show validation error
                )}
            </>
        );
    }
);