import React from "react";
import {useForm} from "./useForm";
import {Card} from "../card/Card";
import {Button} from "../button/Button";
import {IconKey, IconLogin, IconMail} from "@tabler/icons-react";
import {Text} from "../text/Text";
import {PasswordInput} from "./PasswordInput";
import {TextInput} from "./TextInput";
import {EmailInput, emailValidation} from "./EmailInput";
import {NumberInput} from "./NumberInput";
import {SwitchInput} from "./SwitchInput";
import {PinInput, PinInputField, PinInputHiddenField} from "./PinInput";
import {CheckboxInput} from "./CheckboxInput";
import {RadioGroup} from "./RadioGroup";
import {RadioInput} from "./RadioInput";
import {Badge} from "../badge/Badge";
import {InputSyntaxSegment} from "./Input.syntax.hook";

export default {
    title: "Form"
}

export const Login = () => {

    const [inputs, validate] = useForm({
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
            password: (value) => {
                if (!value) return "Password is required"
                return null
            }
        },
        onSubmit: (values) => {
            console.log(values)
        }
    })

    return <Card color={"primary"} maw={300}>
        <Text size={"xl"} display={"block"} hierarchy={"primary"}>Login</Text>
        <br/>
        <Text size={"sm"} display={"block"}>
            Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et
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
            {...inputs.getInputProps("password")}
        />
        <br/>
        <div style={{
            display: "flex",
            justifyContent: "space-between",
            gap: ".75rem",
        }}>
            <Button w={"100%"} color={"secondary"} variant={"outlined"} onClick={validate}>
                Login
            </Button>

            <Button w={"100%"} color={"secondary"} variant={"outlined"} onClick={() => {
                const publicKeyCredentialCreationOptions: PublicKeyCredentialCreationOptions = {
                    challenge: crypto.getRandomValues(new Uint8Array(32)),
                    rp: { name: "Code0 Dev", id: "localhost" },
                    user: {
                        id: Uint8Array.from("nico", c => c.charCodeAt(0)),
                        name: "nico@localhost",
                        displayName: "Nico Sammito",
                    },
                    pubKeyCredParams: [
                        { type: "public-key", alg: -7 },
                        { type: "public-key", alg: -257 }
                    ] as const,
                    authenticatorSelection: {
                        userVerification: "preferred" as UserVerificationRequirement,
                        // authenticatorAttachment: "platform" as AuthenticatorAttachment,
                    },
                    timeout: 60000,
                }

                navigator.credentials.create({
                    publicKey: publicKeyCredentialCreationOptions,
                }).then(cred => {
                    console.log("Passkey registriert:", cred);
                });
            }}>
                Login with Passkeys
            </Button>

            <Button
                w={"100%"}
                color={"primary"}
                variant={"normal"}
                onClick={async () => {
                    const publicKeyCredentialRequestOptions: PublicKeyCredentialRequestOptions = {
                        challenge: crypto.getRandomValues(new Uint8Array(32)), // Demo: sollte vom Server kommen!
                        rpId: "localhost",
                        userVerification: "preferred" as UserVerificationRequirement,
                        timeout: 60000,
                        // allowCredentials: [
                        //   {
                        //     id: new Uint8Array([/* credentialId als Uint8Array vom Server */]).buffer,
                        //     type: "public-key" as PublicKeyCredentialType,
                        //   }
                        // ],
                    };

                    try {
                        await navigator.credentials.get({
                            publicKey: publicKeyCredentialRequestOptions,
                        }).then(value => {
                            console.log("Passkey Login erfolgreich:", value);
                        });
                    } catch (err) {
                        console.error("Login fehlgeschlagen:", err);
                    }
                }}
            >
                Login with Passkeys
            </Button>

        </div>
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
            radio: null
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
            pinInput: null
        },
        validate: {
            pinInput: (value: string | null) => {
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

export const InputSuggestionStory = () => {
    const suggestionValues = [
        "Niklas van Schrick",
        "Nico Sammito"
    ]

    const buildSegments = (value?: string | null): InputSyntaxSegment[] => {
        const textValue = value ?? ""
        const matches = suggestionValues.flatMap((badgeValue) => {
            const occurrences: { start: number, end: number, value: string }[] = []
            let searchIndex = textValue.indexOf(badgeValue)

            while (searchIndex !== -1) {
                occurrences.push({
                    start: searchIndex,
                    end: searchIndex + badgeValue.length,
                    value: badgeValue
                })

                searchIndex = textValue.indexOf(badgeValue, searchIndex + badgeValue.length)
            }

            return occurrences
        }).sort((a, b) => a.start - b.start)

        if (!matches.length) {
            return [{
                type: "text" as const,
                start: 0,
                end: textValue.length,
                visualLength: textValue.length,
                content: textValue,
            }]
        }

        const segments: InputSyntaxSegment[] = []
        let cursor = 0

        matches.forEach(match => {
            if (match.start > cursor) {
                const content = textValue.slice(cursor, match.start)
                segments.push({
                    type: "text" as const,
                    start: cursor,
                    end: match.start,
                    visualLength: content.length,
                    content,
                })
            }

            segments.push({
                type: "block" as const,
                start: match.start,
                end: match.end,
                visualLength: 1,
                content: <Badge color={"info"}>@{match.value}</Badge>,
            })

            cursor = match.end
        })

        if (cursor < textValue.length) {
            const content = textValue.slice(cursor)
            segments.push({
                type: "text" as const,
                start: cursor,
                end: textValue.length,
                visualLength: content.length,
                content,
            })
        }

        return segments
    }

    return <Card maw={300}>
        <TextInput placeholder={"Search for users"} transformSyntax={buildSegments} suggestions={[{
            children: "Niklas van Schrick",
            value: "Niklas van Schrick",
            insertMode: "insert"
        }, {
            children: "Nico Sammito",
            value: "Nico Sammito",
            insertMode: "append"
        }]}/>
    </Card>
}