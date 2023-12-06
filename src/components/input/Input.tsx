import React, {DetailedHTMLProps, InputHTMLAttributes, ReactElement, ReactNode} from "react";
import "./Input.style.scss"
import {b} from "@storybook/theming/dist/create-3ae9aa71";
import {Icon, TablerIconsProps} from "@tabler/icons-react";

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
    children: React.ReactNode

    //default is text type
    type?: InputControlTypesType
    icon?: ReactElement<Partial<Omit<TablerIconsProps, "size">>>
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

    const {type, placeholder, children, icon} = props

    return <>
        <div className={"input__control"}>
            {icon ? <span className={"input__icon"}>
                {icon}
            </span> : null}
            <input onFocus={event => {
                if (event.target.parentElement)
                    event.target.parentElement.classList.add("input__control--focus")
            }} onBlur={event => {
                if (event.target.parentElement)
                    event.target.parentElement.classList.remove("input__control--focus")
            }} type={type} placeholder={placeholder} className={"input__field"}/>
        </div>
        {children}
    </>
}

const InputControlMessage: React.FC<{ children: string }> = ({children}) => {
    return <div className={"input__message"}><p>{children}</p></div>
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
        Message: InputControlMessage
    })
});