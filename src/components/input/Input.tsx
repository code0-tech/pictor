import React, {DetailedHTMLProps, InputHTMLAttributes, ReactElement, ReactNode, RefAttributes} from "react";
import "./Input.style.scss"
import {TablerIcon} from "@tabler/icons-react";


export type InputChildType = InputControlType | InputDescType | InputLabelType

export interface InputType {
    children: ReactElement<InputControlType> | ReactElement<InputChildType>[]
    //defaults to false
    disabled?: boolean
    //defaults to undefined
    valid?: boolean | undefined
}


const Input: React.FC<InputType> = (props: InputType) => {

    const {disabled= false, children, valid} = props
    const childNodes = React.Children.toArray(children).map(value => {
        if (React.isValidElement(value) && value.type == InputControl)
            return React.cloneElement(value as ReactElement, {
                "aria-disabled": disabled,
                "disabled": disabled
            })
        return value
    })

    return <div
        className={`input ${disabled ? "input--disabled" : ""} ${valid ? "input--valid" : valid !== undefined ? "input--not-valid" : ""}`}
        aria-disabled={disabled ? "true" : "false"}>
        {childNodes}
    </div>
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
    //defaults to false
    disabled?: boolean
    //default is text type
    type?: InputControlTypesType
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
const InputControl: React.ForwardRefExoticComponent<Omit<InputControlType, "ref"> & RefAttributes<HTMLInputElement>> = React.forwardRef<HTMLInputElement, InputControlType>((props, ref) => {

    const {type, placeholder, children, disabled, ...args} = props
    const childNodes = children && !Array.isArray(children) ? Array.of(children) : children;
    const icon = childNodes ?  childNodes.find(child => child.type == InputControlIcon) : null
    const message = childNodes ? childNodes.find(child => child.type == InputControlMessage) : null

    const onFocusParam = args.onFocus
    const onBlurParam = args.onBlur

    const onFocus = ((event: React.FocusEvent<HTMLInputElement>) => {
        if (event.target.parentElement)
            event.target.parentElement.classList.add("input__control--active")
        if (onFocusParam) onFocusParam(event)
    })
    const onBlur = ((event: React.FocusEvent<HTMLInputElement>) => {
        if (event.target.parentElement)
            event.target.parentElement.classList.remove("input__control--active")
        if (onBlurParam) onBlurParam(event)
    })

    args.onFocus = onFocus
    args.onBlur = onBlur

    return <>
        <div className={"input__control"}>
            {icon ?? null}
            <input ref={ref} disabled={disabled} type={type} placeholder={placeholder} className={"input__field"} {...args} onMouseDown={event => {
                (event.target as HTMLInputElement).focus()
            }}/>
        </div>
        {message ?? null}
    </>
})

export type InputControlMessageType = {
    children: string
}

const InputControlMessage: React.FC<InputControlMessageType> = ({children}) => {
    return <div className={"input__message"}><p>{children}</p></div>
}

export type InputControlIconType = {
    children: ReactElement<TablerIcon>
}

const InputControlIcon: React.FC<InputControlIconType> = ({children}) => {
    return <span className={"input__icon"}>
        {children}
    </span>
}

export type InputLabelType = {
    children: string
}

const InputLabel: React.FC<InputLabelType> = ({children}) => {
    return <label className={"input__label"}>{children}</label>
}


export type InputDescType = {
    children: string
}

const InputDesc: React.FC<InputDescType> = ({children}) => {
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