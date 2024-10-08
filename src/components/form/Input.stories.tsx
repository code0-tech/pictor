import React, {forwardRef} from "react";
import useForm from "./useForm";

const TestC: React.FC<any> = forwardRef((props, ref) => {
    console.log(props)
    return <input type={"text"} {...props} ref={ref}></input>
})
export default {
    title: "Input",
    component: TestC
}

export const Test = () => {

    const [inputs, validate] = useForm({
        initialValues: {
            test: "test@"
        },
        validate: {
            test: (value) => !value.includes("@") ? "Hier ist was falsch" : null
        }
    })

    return <>
        <TestC {...inputs.test}/>
        <button onClick={validate}></button>
    </>

}