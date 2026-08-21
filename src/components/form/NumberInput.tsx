import React, {RefObject} from "react";
import {Input, InputProps} from "./Input";
import {IconMinus, IconPlus} from "@tabler/icons-react";
import {Button} from "../button/Button";
import {ButtonGroup} from "../button-group/ButtonGroup";


interface NumberInputProps extends Omit<InputProps<string | null>, "wrapperComponent" | "type" | "left" | "right" | "leftType" | "rightType"> {

}

export const NumberInput: React.ForwardRefExoticComponent<NumberInputProps> = React.forwardRef((props, ref: RefObject<HTMLInputElement>) => {

    ref = ref || React.useRef(null)

    const {
        step = 1,
        ...rest
    } = props

    const countUp = () => {
        if (ref.current) {
            if (!ref.current.value) ref.current.value = "0"
            ref.current.value = (Number.parseInt(ref.current.value) + (step as number)).toString()
        }
    }

    const countDown = () => {
        if (ref.current) {
            if (!ref.current.value) ref.current.value = "0"
            ref.current.value = (Number.parseInt(ref.current.value) - (step as number)).toString()
        }
    }

    return <Input
        className={"number-input"}
        right={<ButtonGroup color={"primary"}>
            <Button color={"secondary"} paddingSize={"xxs"} onClick={countUp}><IconPlus size={13}/></Button>
        </ButtonGroup>}
        left={<ButtonGroup color={"primary"}>
            <Button color={"secondary"} paddingSize={"xxs"} onClick={countDown}><IconMinus size={13}/></Button>
        </ButtonGroup>}
        leftType={"action"}
        type={"number"}
        ref={ref}
        {...rest}
    />

})