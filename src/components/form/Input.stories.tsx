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
import {EditorInput, EditorTokenRule} from "./EditorInput";
import {Badge} from "../badge/Badge";
import {InputSuggestion} from "./InputSuggestion";
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
    FileInputItemSizeText,
    FileInputTrigger
} from "./FileInput";
import {FileUploadFileChangeDetails} from "@ark-ui/react";
import {expect, userEvent, within} from "storybook/test";
import {ValidationProps} from "./useForm";

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

// ---- Badge tag rendering ----
// Shows {{ variable }} tokens rendered as Badge components via tokenRules
export const EditorBadgeTags = () => {

    const [inputs, validate] = useForm({
        initialValues: {
            expression: ""
        },
        validate: {
            expression: (value) => {
                if (!value?.trim()) return "Please enter an expression"
                return null
            }
        },
        onSubmit: (values) => {
            console.log(values)
        }
    })

    const tokenRules: EditorTokenRule[] = [
        {
            pattern: /\{\{([^}]+)\}\}/g,
            wrap: (_text, children) => (
                <Badge color={"info"}>{children}</Badge>
            ),
        },
    ]

    return <Card color={"secondary"} w={"400px"}>
        <EditorInput
            {...inputs.getInputProps("expression")}
            onChange={() => validate("expression")}
            title={"Template Expression"}
            description={"Use {{ variable }} to reference variables"}
            placeholder={"Hello {{ user.name }}!"}
            tokenRules={tokenRules}
            right={
                <ButtonGroup color={"primary"}>
                    <Button paddingSize={"xxs"}>
                        <IconVariable size={13}/>
                    </Button>
                    <Button paddingSize={"xxs"} onClick={() => validate()}>
                        <IconLogin size={13}/>
                    </Button>
                </ButtonGroup>
            }
            rightType={"action"}
        />
    </Card>
}

// ---- Single line ----
// Renders the EditorInput as a one-line field (like a text input): line breaks
// are blocked and pasted newlines collapse to spaces, while token highlighting
// still works.
export const EditorSingleLine = () => {

    const [inputs, validate] = useForm({
        initialValues: {
            expression: ""
        },
        validate: {
            expression: (value) => {
                if (!value?.trim()) return "Please enter an expression"
                return null
            }
        },
        onSubmit: (values) => {
            console.log(values)
        }
    })

    const tokenRules: EditorTokenRule[] = [
        {
            pattern: /\{\{([^}]+)\}\}/g,
            wrap: (_text, children) => (
                <Badge color={"info"}>{children}</Badge>
            ),
        },
    ]

    return <Card color={"secondary"} w={"400px"}>
        <EditorInput
            {...inputs.getInputProps("expression")}
            onChange={() => validate("expression")}
            singleLine
            title={"Expression"}
            description={"A single-line expression — Enter does not add a new line"}
            placeholder={"Hello {{ user.name }}!"}
            tokenRules={tokenRules}
        />
    </Card>
}

// ---- Suggestions via Radix menu ----
// Demonstrates the built-in Radix DropdownMenu for autocomplete
export const EditorSuggestions = () => {

    const [inputs, validate] = useForm({
        initialValues: {
            value: ""
        },
        validate: {
            value: (value) => {
                if (!value?.trim()) return "Please select or type a value"
                return null
            }
        },
        onSubmit: (values) => {
            console.log(values)
        }
    })

    const suggestions: InputSuggestion[] = [
        {value: "user.name", children: "user.name", groupBy: "User"},
        {value: "user.email", children: "user.email", groupBy: "User"},
        {value: "user.role", children: "user.role", groupBy: "User"},
        {value: "order.id", children: "order.id", groupBy: "Order"},
        {value: "order.total", children: "order.total", groupBy: "Order"},
        {value: "order.status", children: "order.status", groupBy: "Order"},
    ]

    return <Card color={"secondary"} w={"400px"}>
        <EditorInput
            {...inputs.getInputProps("value")}
            onChange={() => validate("value")}
            title={"Variable"}
            description={"Press Ctrl+Space to open, ↑ ↓ to navigate, Enter to select"}
            placeholder={"Select or type a variable…"}
            suggestions={suggestions}
            onSuggestionSelect={(s) => {
                console.log("selected:", s)
                validate("value")
            }}
        />
        <br/>
        <div style={{display: "flex", justifyContent: "end"}}>
            <Button color={"info"} onClick={() => validate()}>
                <IconLogin size={13}/>
                Submit
            </Button>
        </div>
    </Card>
}

// ---- Combined: badge tags + filtered suggestions + useForm ----
// Full-featured template editor: badge rendering + contextual suggestion filtering
export const EditorCombined = () => {

    const [inputs, validate] = useForm({
        initialValues: {
            template: ""
        },
        validate: {
            template: (value) => {
                if (!value?.trim()) return "Template is required"
                return null
            }
        },
        onSubmit: (values) => {
            console.log(values)
        }
    })

    const [filterText, setFilterText] = React.useState("")

    const allVariables = [
        {name: "user.name", group: "User"},
        {name: "user.email", group: "User"},
        {name: "user.role", group: "User"},
        {name: "order.id", group: "Order"},
        {name: "order.total", group: "Order"},
        {name: "order.status", group: "Order"},
    ]

    const suggestions: InputSuggestion[] = allVariables
        .filter(v => !filterText || v.name.toLowerCase().includes(filterText.toLowerCase()))
        .map(v => ({
            value: `{{ ${v.name} }}`,
            children: <Badge color={"info"}>{v.name}</Badge>,
            groupBy: v.group,
            insertMode: "insert" as const,
        }))

    const tokenRules: EditorTokenRule[] = [
        {
            pattern: /\{\{([^}]+)\}\}/g,
            wrap: (_text, children) => <Badge color={"info"}>{children}</Badge>,
        },
    ]

    return <Card color={"secondary"} w={"500px"}>
        <EditorInput
            {...inputs.getInputProps("template")}
            onChange={(value) => {
                validate("template")
                // Show suggestions when user opens {{ — filter by partial variable name inside
                const match = value.match(/\{\{([^}]*)$/)
                setFilterText(match ? match[1].trim() : "")
            }}
            title={"Email Template"}
            description={"Type text, then Ctrl+Space to insert a variable"}
            placeholder={"Hi {{ user.name }}, your order {{ order.id }} is ready!"}
            tokenRules={tokenRules}
            suggestions={suggestions}
            onSuggestionSelect={() => {
                setFilterText("")
                validate("template")
            }}
            right={
                <ButtonGroup color={"primary"}>
                    <Button paddingSize={"xxs"}>
                        <IconVariable size={13}/>
                    </Button>
                </ButtonGroup>
            }
            rightType={"action"}
        />
        <br/>
        <div style={{display: "flex", justifyContent: "end"}}>
            <Button color={"info"} onClick={() => validate()}>
                <IconLogin size={13}/>
                Submit
            </Button>
        </div>
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

// ---- formValidation prop identity stability ----
// Measures whether getInputProps(key) keeps referential identity for keys whose value
// did NOT change. Typing happens only in the first input; the counters of the second
// (untouched) input show how often its props were rebuilt anyway.
// Hoisted: with "use no memo" the React Compiler no longer memoizes inline literals,
// and useForm keys its reset effect off the identity of `initialValues`.
const propStabilityInitialValues = {
    typed: "",
    untouched: ""
}
const propStabilityValidate = {
    typed: (value: string) => value ? null : "Required",
    untouched: (value: string) => value !== undefined ? null : "Required"
}

const PropStabilityStats = () => {
    "use no memo" // opt out of the React Compiler so the raw getInputProps behavior is measured

    const [inputs, validate] = useForm({
        useInitialValidation: false,
        initialValues: propStabilityInitialValues,
        validate: propStabilityValidate
    })

    const keys = ["typed", "untouched"] as const
    const statsRef = React.useRef<Record<string, Record<string, number>>>({
        typed: {props: 0, setValue: 0, validation: 0, value: 0},
        untouched: {props: 0, setValue: 0, validation: 0, value: 0}
    })
    const prevRef = React.useRef<Record<string, ValidationProps<any>>>({})

    const propsByKey: Record<string, ValidationProps<any>> = {}
    for (const key of keys) {
        const props = inputs.getInputProps(key)
        const prev = prevRef.current[key]
        if (prev) {
            const stats = statsRef.current[key]
            if (props !== prev) stats.props++
            if (props.formValidation?.setValue !== prev.formValidation?.setValue) stats.setValue++
            if (props.formValidation?.valid !== prev.formValidation?.valid
                || props.formValidation?.notValidMessage !== prev.formValidation?.notValidMessage) stats.validation++
            if (!Object.is(props.initialValue, prev.initialValue)) stats.value++
        }
        prevRef.current[key] = props
        propsByKey[key] = props
    }

    return <Card color={"secondary"} w={"400px"}>
        <TextInput
            placeholder={"typed"}
            title={"Typed input"}
            onChange={() => validate("typed")}
            {...propsByKey.typed}
        />
        <br/>
        <TextInput
            placeholder={"untouched"}
            title={"Untouched input"}
            {...propsByKey.untouched}
        />
        <br/>
        {keys.map(key => (
            <div key={key}>
                <Text size={"sm"}>{key}: </Text>
                <span data-testid={`stats-${key}`}>{JSON.stringify(statsRef.current[key])}</span>
            </div>
        ))}
    </Card>
}

export const FormValidationPropStability = {
    render: () => <PropStabilityStats/>,
    play: async ({canvasElement}: { canvasElement: HTMLElement }) => {
        const canvas = within(canvasElement)
        const readStats = (key: string): Record<string, number> =>
            JSON.parse(canvas.getByTestId(`stats-${key}`).textContent ?? "{}")

        await userEvent.type(canvas.getByPlaceholderText("typed"), "hello")

        console.log("prop identity changes after typing 5 chars into 'typed':",
            JSON.stringify({typed: readStats("typed"), untouched: readStats("untouched")}))

        const untouched = readStats("untouched")
        // Sanity check: the untouched input's value really never changed.
        expect(untouched.value).toBe(0)
        // Desired behavior: props of a key whose value and validation result did not
        // change keep their identity. Fails while getInputProps rebuilds them per render.
        expect(untouched.validation).toBe(0)
        expect(untouched.setValue).toBe(0)
        expect(untouched.props).toBe(0)
    }
}

// ---- Performance: many EditorInputs in a single form ----
// Stress-tests the Slate-based EditorInput by rendering up to 50 instances at once,
// each with token highlighting + suggestions, so we can spot rendering/typing lag.
export const EditorPerformance = () => {

    const MAX_INPUTS = 200

    const [count, setCount] = React.useState(MAX_INPUTS)
    const [renderTime, setRenderTime] = React.useState<number | null>(null)

    // Measure the time from the start of a render pass to the browser paint.
    const renderStart = React.useRef(performance.now())
    renderStart.current = performance.now()
    React.useLayoutEffect(() => {
        const start = renderStart.current
        requestAnimationFrame(() => {
            setRenderTime(prev => {
                const measured = performance.now() - start
                // Avoid an infinite measure->setState->measure loop.
                return prev === null || Math.abs(prev - measured) > 0.5 ? measured : prev
            })
        })
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [count])

    const fields = React.useMemo(
        () => Array.from({length: MAX_INPUTS}, (_, i) => `field_${i}`),
        []
    )

    // Stable reference — useForm keys its internal state off the identity of
    // `initialValues`, so recreating this object each render would loop forever.
    const initialValues = React.useMemo(
        () => fields.reduce((acc, key) => {
            acc[key] = ""
            return acc
        }, {} as Record<string, string>),
        [fields]
    )

    const [inputs, validate] = useForm<Record<string, string>>({
        initialValues,
        useInitialValidation: false,
        onSubmit: (values) => {
            console.log(values)
        }
    })

    const tokenRules: EditorTokenRule[] = React.useMemo(() => [
        {
            pattern: /\{\{([^}]+)\}\}/g,
            wrap: (_text, children) => <Badge color={"info"}>{children}</Badge>,
        },
    ], [])

    const suggestions: InputSuggestion[] = React.useMemo(() => [
        {value: "user.name", children: "user.name", groupBy: "User"},
        {value: "user.email", children: "user.email", groupBy: "User"},
        {value: "order.id", children: "order.id", groupBy: "Order"},
        {value: "order.total", children: "order.total", groupBy: "Order"},
    ], [])

    return <Card color={"secondary"} w={"600px"}>
        <Flex align={"center"} justify={"space-between"} style={{marginBottom: "1rem"}}>
            <Text size={"sm"}>
                Rendering <b>{count}</b> EditorInput{count === 1 ? "" : "s"}
                {renderTime !== null && ` · last render ${renderTime.toFixed(1)}ms`}
            </Text>
            <ButtonGroup color={"primary"}>
                <Button paddingSize={"xxs"} onClick={() => setCount(c => Math.max(1, c - 10))}>
                    -10
                </Button>
                <Button paddingSize={"xxs"} onClick={() => setCount(c => Math.min(MAX_INPUTS, c + 10))}>
                    +10
                </Button>
                <Button paddingSize={"xxs"} onClick={() => setCount(MAX_INPUTS)}>
                    Max ({MAX_INPUTS})
                </Button>
            </ButtonGroup>
        </Flex>

        <Flex style={{flexDirection: "column", gap: "0.5rem"}}>
            {fields.slice(0, count).map((key, i) => (
                <EditorInput
                    key={key}
                    {...inputs.getInputProps(key)}
                    onChange={() => validate(key)}
                    title={`Expression ${i + 1}`}
                    placeholder={"Hello {{ user.name }}!"}
                    tokenRules={tokenRules}
                    suggestions={suggestions}
                    onSuggestionSelect={() => validate(key)}
                />
            ))}
        </Flex>

        <br/>
        <div style={{display: "flex", justifyContent: "end"}}>
            <Button color={"info"} onClick={() => validate()}>
                <IconLogin size={13}/>
                Submit all
            </Button>
        </div>
    </Card>
}