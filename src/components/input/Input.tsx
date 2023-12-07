import React, {DetailedHTMLProps, InputHTMLAttributes, ReactElement, ReactNode} from "react";
import "./Input.style.scss"
import {TablerIconsProps} from "@tabler/icons-react";

export interface InputType {
    children: React.ReactNode | React.ReactNode[]
    //defaults to false
    disabled?: boolean
    //defaults to undefined
    valid?: boolean | undefined
}

export type InputControlTypesType = "email"
    | "date"
    | "datetime-local"
    | "hidden"
    | "number"
    | "password"
    | "search"
    | "tel"
    | "text"
    | "time"
    | "url"
    | "week"

// params / props declaration for InputComponent
export interface InputControlType extends DetailedHTMLProps<InputHTMLAttributes<HTMLInputElement>, HTMLInputElement> {
    placeholder: string
    //TODO: allow both as non required and make sure this does not result in errors inside the component
    children?: ReactElement<InputControlMessageType | InputControlIconType>[] | ReactElement<InputControlMessageType | InputControlIconType>

    //default is text type
    type?: InputControlTypesType
}

const Input: React.FC<InputType> = (props: InputType) => {

    const {disabled, children, valid} = props

    return <div
        className={`input ${disabled ? "input--disabled" : ""} ${valid ? "input--valid" : valid !== undefined ? "input--not-valid" : ""}`}>
        {children}
    </div>
}

/**
 * Component to create the input. Manages the icon and the success / failure message.
 * Extends the normal HTMLInputElement to allow further adjustments.
 *
 * @example
 * <Input.Control placeholder={} type={} args...>{@link InputControlIcon} {@link InputControlMessage}</Input.Control>
 *
 * @since 0.1.0-pre-alpha
 * @author Nico Sammito
 */
const InputControl: React.FC<InputControlType> = (props: InputControlType) => {

    const {type, placeholder, children, ...args} = props
    const childNodes = children && !Array.isArray(children) ? Array.of(children) : children;
    const icon = childNodes ?  childNodes.find(child => child.type == InputControlIcon) : null
    const message = childNodes ? childNodes.find(child => child.type == InputControlMessage) : null

    const onFocusParam = args.onFocus
    const onBlurParam = args.onBlur

    const onFocus = ((event: React.FocusEvent<HTMLInputElement>) => {
        if (event.target.parentElement)
            event.target.parentElement.classList.add("input__control--focus")
        if (onFocusParam) onFocusParam(event)
    })
    const onBlur = ((event: React.FocusEvent<HTMLInputElement>) => {
        if (event.target.parentElement)
            event.target.parentElement.classList.remove("input__control--focus")
        if (onBlurParam) onBlurParam(event)
    })

    args.onFocus = onFocus
    args.onBlur = onBlur

    return <>
        <div className={"input__control"}>
            {icon ?? null}
            <input type={type} placeholder={placeholder} className={"input__field"} {...args}/>
        </div>
        {message ?? null}
    </>
}

export type InputControlMessageType = {
    children: string
}

const InputControlMessage: React.FC<InputControlMessageType> = ({children}) => {
    return <div className={"input__message"}><p>{children}</p></div>
}

export type InputControlIconType = {
    children: ReactElement<TablerIconsProps>
}

const InputControlIcon: React.FC<InputControlIconType> = ({children}) => {
    return <span className={"input__icon"}>
        {children}
    </span>
}

const InputLabel: React.FC<{ children: string }> = ({children}) => {
    return <label className={"input__label"}>{children}</label>
}

const InputDesc: React.FC<{ children: string }> = ({children}) => {
    return <p className={"input__desc"}>{children}</p>
}

export default Object.assign(Input, {
    Desc: InputDesc,
    Label: InputLabel,
    Control: Object.assign(InputControl, {
        Message: InputControlMessage,
        Icon: InputControlIcon
    })
});