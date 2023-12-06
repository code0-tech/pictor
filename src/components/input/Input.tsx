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
    children: ReactElement<InputControlMessageType | InputControlIconType>[]

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
 * basic input component with code0 design and standard features like error or
 * success design or labeling and description
 *
 * @example
 * <Input label={} desc={} args...>Some description text</Input>
 *
 * @param props
 * @return the Input component as a {@link React.FC} with given parameters in JSX
 *
 * @since 0.1.0-pre-alpha
 * @author Nico Sammito
 */
const InputControl: React.FC<InputControlType> = (props: InputControlType) => {

    const {type, placeholder, children} = props
    const icon = children.find(child => child.type == InputControlIcon)
    const message = children.find(child => child.type == InputControlMessage)
    return <>
        <div className={"input__control"}>
            {icon ?? null}
            <input onFocus={event => {
                if (event.target.parentElement)
                    event.target.parentElement.classList.add("input__control--focus")
            }} onBlur={event => {
                if (event.target.parentElement)
                    event.target.parentElement.classList.remove("input__control--focus")
            }} type={type} placeholder={placeholder} className={"input__field"}/>
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