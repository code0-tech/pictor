import React, {RefObject} from "react";
import Input, {InputProps} from "./Input";
import {IconMinus, IconPlus} from "@tabler/icons-react";
import Button from "../button/Button";


interface NumberInputProps extends Omit<InputProps<string | null>, "wrapperComponent" | "type" | "left" | "right" | "leftType" | "rightType"> {

}

const NumberInput: React.ForwardRefExoticComponent<NumberInputProps> = React.forwardRef((props, ref: RefObject<HTMLInputElement>) => {

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
        right={<Button variant={"none"} onClick={countUp}><IconPlus size={13}/></Button>}
        left={<Button variant={"none"} onClick={countDown}><IconMinus size={13}/></Button>}
        leftType={"action"}
        type={"number"}
        ref={ref}
        {...rest}
    />

})

export default NumberInput