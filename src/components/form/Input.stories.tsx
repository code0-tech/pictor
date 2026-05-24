import React from "react";
import {useForm} from "./useForm";
import {Card} from "../card/Card";
import {Button} from "../button/Button";
import {
    IconChevronDown,
    IconFileInfoFilled,
    IconKey,
    IconLogin,
    IconMail,
    IconUpload,
    IconVariable,
    IconX
} from "@tabler/icons-react";
import {Text} from "../text/Text";
import {PasswordInput, passwordValidation} from "./PasswordInput";
import {TextInput} from "./TextInput";
import {EmailInput, emailValidation} from "./EmailInput";
import {NumberInput} from "./NumberInput";
import {SwitchInput} from "./SwitchInput";
import {PinInput, PinInputField, PinInputHiddenField} from "./PinInput";
import {CheckboxInput} from "./CheckboxInput";
import {RadioGroup} from "./RadioGroup";
import {RadioInput} from "./RadioInput";
import {TextAreaInput} from "./TextAreaInput";
import {
    SelectContent,
    SelectInput,
    SelectItem,
    SelectItemText,
    SelectPortal,
    SelectTrigger,
    SelectValue,
    SelectViewport
} from "./SelectInput";
import {Flex} from "../flex/Flex";
import {ButtonGroup} from "../button-group/ButtonGroup";
import {EditorInput} from "./EditorInput";
import {StreamLanguage} from "@codemirror/language";
import {tags as t} from "@lezer/highlight";
import {hashToColor} from "../../utils";
import {
    FileInput,
    FileInputContext,
    FileInputDropzone,
    FileInputHiddenInput,
    FileInputItem,
    FileInputItemDeleteTrigger,
    FileInputItemGroup,
    FileInputItemName,
    FileInputItemPreview,
    FileInputItemPreviewImage,
    FileInputItemSizeText, FileInputTrigger
} from "./FileInput";
import {FileUploadFileChangeDetails} from "@ark-ui/react";

export default {
    title: "Form"
}

export const Login = () => {

    const [inputs, validate] = useForm({
        useInitialValidation: false,
        initialValues: {
            email: "nicoq@de.de",
            password: null,
        },
        validate: {
            email: (value) => {
                if (!value) return "Email is required"
                if (!emailValidation(value)) return "Please provide a valid email"
                return null
            },
            password: passwordValidation
        },
        onSubmit: (values) => {
            console.log(values)
        }
    })

    return <Card color={"secondary"} miw={"300px"} maw={"15vw"}>
        <form noValidate onSubmit={(e) => {
            validate()
            e.preventDefault()
            e.stopPropagation()
            return false
        }}>
            <Text size={"xl"} display={"block"} hierarchy={"primary"}>Login</Text>
            <br/>
            <Text size={"sm"} display={"block"}>
                Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut
                labore et
                dolore magna aliquyam erat, sed diam voluptua.
            </Text>
            <br/>
            <EmailInput
                placeholder={"Email"}
                title={"Email"}
                description={"Your Email address for login"}
                left={<IconMail size={13}/>}
                {...inputs.getInputProps("email")}
            />
            <br/>
            <PasswordInput
                placeholder={"Password"}
                title={"Password"}
                description={"Your password for login"}
                left={<IconKey size={13}/>}
                onChange={() => validate("password")}
                {...inputs.getInputProps("password")}
            />
            <br/>
            <div style={{
                display: "flex",
                justifyContent: "space-between",
                gap: ".75rem",
            }}>
                <Button type={"submit"} w={"100%"} color={"tertiary"}>
                    Login
                </Button>

            </div>
        </form>
    </Card>

}

export const Website = () => {

    return <Card maw={300}>
        <TextInput
            title={"website"}
            description={"Your website for linking"}
            clearable
            placeholder={"code0.tech"}
            left={"https://"}
            leftType={"placeholder"}
        />
    </Card>

}

export const Number = () => {

    return <Card maw={300}>
        <NumberInput
            title={"number"}
            description={"Increase and decrease your number"}
            placeholder={"code0.tech"}
        />
    </Card>

}

export const RadioExample = () => {

    const [inputs, validate] = useForm({
        initialValues: {
            radio: undefined
        },
        validate: {
            radio: (value) => {
                if (!value) return "Error"
                return null
            }
        },
        onSubmit: (values) => {
            console.log(values)
        }
    })


    return <Card maw={300}>
        <RadioGroup title={"Runtime"}
                    description={"Change runtime mode production version"}
                    {...inputs.getInputProps("radio")}>
            <RadioInput
                value={"dynamic"}
                label={"Dynamic"}
            />
            <RadioInput
                value={"hybrid"}
                label={"Hybrid"}
            />
            <RadioInput
                value={"static"}
                label={"Static"}
            />
        </RadioGroup>
        <br/>
        <div style={{
            display: "flex",
            justifyContent: "end"
        }}>
            <Button color={"info"} onClick={validate}>
                <IconLogin size={13}/>
                Login
            </Button>

        </div>
    </Card>

}

export const Checkbox = () => {

    const [inputs, validate] = useForm({
        initialValues: {
            checkbox: true
        },
        validate: {
            checkbox: (value) => {
                if (!value) return "Error"
                return null
            }
        },
        onSubmit: (values) => {
            console.log(values)
        }
    })


    return <Card maw={300}>

        <CheckboxInput
            title={"Runtime"}
            description={"Change runtime mode production version"}
            label={"Dynamic"}
            {...inputs.getInputProps("checkbox")}
        />

        <br/>
        <div style={{
            display: "flex",
            justifyContent: "end"
        }}>
            <Button color={"info"} onClick={validate}>
                <IconLogin size={13}/>
                Login
            </Button>

        </div>
    </Card>


}

export const Switch = () => {

    const [inputs, validate] = useForm({
        initialValues: {
            switch: true
        },
        validate: {
            switch: (value) => {
                if (!value) return "Error"
                return null
            }
        },
        onSubmit: (values) => {
            console.log(values)
        }
    })


    return <Card maw={300}>
        <SwitchInput
            title={"Runtime"}
            description={"Change runtime mode production version"}
            {...inputs.getInputProps("switch")}
        />
        <br/>
        <div style={{
            display: "flex",
            justifyContent: "end"
        }}>
            <Button color={"info"} onClick={validate}>
                <IconLogin size={13}/>
                Login
            </Button>

        </div>
    </Card>

}

export const PinInputExample = () => {

    const [inputs, validate] = useForm({
        initialValues: {
            pinInput: undefined
        },
        validate: {
            pinInput: (value: string | undefined) => {
                if (!value || value.length != 6) return "Please type or paste your 6-digit code"
                return null
            }
        },
        onSubmit: (values) => {
            console.log(values)
        }
    })

    return <>
        <Card maw={300}>
            <PinInput title={"OTP"}
                      description={"Paste or type your 6-digit code"} {...inputs.getInputProps("pinInput")}>
                <PinInputField/>
                <PinInputField/>
                <PinInputField/>
                <PinInputField/>
                <PinInputField/>
                <PinInputField/>
                <PinInputHiddenField/>
            </PinInput>
            <div style={{
                display: "flex",
                justifyContent: "end",
                marginTop: ".7rem"
            }}>
                <Button color={"secondary"} onClick={validate}>
                    <IconLogin size={13}/>
                    Login
                </Button>

            </div>
        </Card>
    </>

}

export const TextAreaExample = () => {
    return <Card>
        <TextAreaInput
            title={"website"}
            description={"Your website for linking"}
            clearable
            placeholder={"code0.tech"}
            left={"https://"}
            leftType={"placeholder"}
        />
    </Card>
}

export const Select = () => {

    const [inputs, validate] = useForm({
        initialValues: {
            select: undefined
        },
        validate: {
            select: (value) => {
                if (!value) return "Please select an option"
                return null
            }
        },
        onSubmit: (values) => {
            console.log(values)
        }
    })

    return <Card color={"secondary"} w={"400px"}>
        <SelectInput title={"HTTP Method"}
                     onValueChange={() => validate()}
                     description={"You can choose between the standard http methods like GET, POST, etc."} right={
            <ButtonGroup color={"primary"}>
                <Button paddingSize={"xxs"}>
                    <IconVariable size={13}/>
                </Button>
                <Button paddingSize={"xxs"}>
                    <IconX size={13}/>
                </Button>
            </ButtonGroup>
        } rightType={"action"} {...inputs.getInputProps("select")}>
            <SelectTrigger asChild>
                <Flex justify={"space-between"} align={"center"}>
                    <SelectValue placeholder={"Select..."}/>
                    <IconChevronDown size={13}/>
                </Flex>
            </SelectTrigger>
            <SelectPortal>
                <SelectContent position={"item-aligned"}>
                    <SelectViewport>
                        <SelectItem value={"1"}>
                            <SelectItemText>
                                Option 1
                            </SelectItemText>
                        </SelectItem>
                        <SelectItem value={"2"}>
                            <SelectItemText>
                                Option 2
                            </SelectItemText>
                        </SelectItem>
                        <SelectItem value={"3"}>
                            <SelectItemText>
                                Option 3
                            </SelectItemText>
                        </SelectItem>
                        <SelectItem value={"4"}>
                            <SelectItemText>
                                Option 4
                            </SelectItemText>
                        </SelectItem>
                    </SelectViewport>
                </SelectContent>
            </SelectPortal>
        </SelectInput>
    </Card>
}

export const Editor = () => {


    const [inputs, validate] = useForm({
        initialValues: {
            editor: undefined
        },
        validate: {
            editor: (value) => {
                if (!value) return "Please type something"
                return null
            }
        },
        onSubmit: (values) => {
            console.log(values)
        }
    })

    return <Card color={"secondary"} w={"400px"}>
        <EditorInput {...inputs.getInputProps("editor")} onChange={() => validate("editor")} placeholder={"sd"}
                     language={StreamLanguage.define({
                         token(stream) {
                             if (stream.match(/\{\{\s*(.*?)\s*\}\}/)) {
                                 return "keyword";
                             }

                             stream.next();
                             return null;
                         }
                     })} tokenStyles={[
            {tag: t.keyword, color: hashToColor("bracket")},
        ]} title={"Bla"} description={"test"} right={
            <ButtonGroup color={"primary"}>
                <Button paddingSize={"xxs"}>
                    <IconVariable size={13}/>
                </Button>
                <Button paddingSize={"xxs"}>
                    <IconX size={13}/>
                </Button>
            </ButtonGroup>
        } rightType={"action"}/>
    </Card>
}

export const File = () => {

    const [inputs, validate, values] = useForm<{ file: FileUploadFileChangeDetails | undefined }>({
        initialValues: {
            file: undefined
        },
        validate: {
            file: (value) => {
                if (!value) return "Please upload a license file"
                return null
            }
        },
        onSubmit: (values) => {
            React.startTransition(async () => {
                const fileContent = await values.file?.acceptedFiles[0].text()
                console.log(fileContent)
            })
        }
    })

    React.useEffect(() => {
        validate()
    }, [values])

    // @ts-ignore
    return <Card color={"secondary"} w={"400px"}><FileInput title={"License"}
                                                            description={"Build high-class workflows, endpoints and software without coding"}
                                                            accept={".code0license"}
                                                            maxFiles={5}
                                                            {...inputs.getInputProps("file")}>
        <FileInputDropzone asChild>
            <Card color={"tertiary"} style={{boxShadow: "none", border: "1px dashed rgba(191, 191, 191, 0.1)"}}>
                <Flex align={"center"} justify={"center"}
                      style={{textAlign: "center", flexDirection: "column", gap: "1rem"}}>
                    <Text size={"md"} hierarchy={"primary"} display={"flex"} align={"center"} style={{gap: "0.35rem"}}>
                        Drag & Drop or
                        <FileInputTrigger asChild>
                            <Button paddingSize={"xxs"}>
                                <Text hierarchy={"primary"}>Choose file</Text>
                            </Button>
                        </FileInputTrigger>
                        to upload
                    </Text>
                    <Text>
                        To use the cloud features, you need to have at least one license connected to your <br/>
                        namespace.
                    </Text>
                </Flex>
            </Card>
        </FileInputDropzone>
        <FileInputItemGroup display={"flex"} mt={1} style={{flexDirection: "column", gap: "0.35rem"}}>
            <FileInputContext>
                {({acceptedFiles}) => acceptedFiles?.map((file) => (
                    <FileInputItem file={file} key={file.name} asChild>
                        <Card paddingSize={"xxs"}>
                            <Flex align={"center"} justify={"space-between"}>
                                <Flex align={"center"} style={{gap: "0.7rem"}}>
                                    {
                                        file.name.endsWith(".code0license") && (
                                            <FileInputItemPreview type=".*" style={{borderRadius: "0.6rem"}}>
                                                <svg style={{width: 0, height: 0, position: "absolute"}}>
                                                    <defs>
                                                        <linearGradient id="iconGradient" x1="0%" y1="0%" x2="100%"
                                                                        y2="100%">
                                                            <stop offset="0%" stopColor={hashToColor(file.name)}/>
                                                            <stop offset="100%" stopColor={"#ffffff"}/>
                                                        </linearGradient>
                                                    </defs>
                                                </svg>
                                                <IconFileInfoFilled color={"url(#iconGradient)"} size={24}/>
                                            </FileInputItemPreview>
                                        )
                                    }
                                    <FileInputItemPreview type="image/*" style={{borderRadius: "0.6rem"}}>
                                        <FileInputItemPreviewImage/>
                                    </FileInputItemPreview>
                                    <Flex style={{flexDirection: "column", gap: "0.35rem"}}>
                                        <Text>
                                            <FileInputItemName/>
                                        </Text>
                                        <Text>
                                            <FileInputItemSizeText/>
                                        </Text>
                                    </Flex>
                                </Flex>
                                <FileInputItemDeleteTrigger asChild>
                                    <Button variant={"none"}>
                                        <IconX size={16}/>
                                    </Button>
                                </FileInputItemDeleteTrigger>
                            </Flex>
                        </Card>
                    </FileInputItem>
                ))}
            </FileInputContext>
        </FileInputItemGroup>
        <FileInputHiddenInput/>
    </FileInput>
    </Card>

}