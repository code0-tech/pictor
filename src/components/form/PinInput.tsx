import   {InputProps} from "./Input";
import React, {RefObject} from "react";
import NumberInput from "./NumberInput";

interface PinInputProps extends Omit<InputProps<string | null>, "wrapperComponent" | "type"| "left" | "right" | "leftType" | "rightType" > {
    inputLength: number
    splitFields: boolean
}

/// TODO
/// - Add Styling to the pin-input-group (each field must be smaller
/// - Input in SplitField Input should skip to the next input

const PinInput: React.ForwardRefExoticComponent<PinInputProps> = React.forwardRef((props, ref: RefObject<HTMLInputElement>) => {

    ref = ref || React.useRef(null)

    const {
        ...rest
    } = props

    if (props.splitFields) {
        const indexes = Array.from({ length: props.inputLength }, (_, i) => i);
        return (
            <div className={"pin-input-group"} >
            {
                indexes.map((_) => (
                    <NumberInput
                        withToggleButtons={false}
                        maxLength={1}
                    />
                ))
            }
            </div>
        )
    }

    return <NumberInput
        withToggleButtons={false}
        maxLength={props.inputLength}
        ref={ref}
        {...rest}
    />
})

export default PinInput