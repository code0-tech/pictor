import {ColorPicker, parseColor, type Color, type UseColorPickerContext} from "@ark-ui/react";
import {ComponentProps, mergeComponentProps} from "../../utils";
import React from "react";
import {InputWrapper, InputWrapperProps} from "./InputWrapper";
import {Flex} from "../flex/Flex";
import {Badge} from "../badge/Badge";
import {Button} from "../button/Button";
import {Menu, MenuContent, MenuContentProps, MenuPortal, MenuTrigger, MenuTriggerProps} from "../menu/Menu";
import {SegmentedControl, SegmentedControlItem} from "../segmented-control/SegmentedControl";
import {useCopyToClipboard} from "@uidotdev/usehooks";
import {useHotkeys} from "react-hotkeys-hook";
import "./ColorInput.style.scss"

type ColorChannel = "hue" | "saturation" | "brightness" | "lightness" | "red" | "green" | "blue" | "alpha"

type ColorNotation = "rgba" | "hsla" | "hexa"

interface ValueChangeDetails {
    value: Color
    valueAsString: string
}

interface ColorInputState {
    hasValue: boolean
    placeholder: React.ReactNode
}

export type ColorProps = InputWrapperProps & {
    placeholder?: React.ReactNode
    name?: string
    disabled?: boolean
    readOnly?: boolean
    closeOnSelect?: boolean
    onValueChange?: (details: ValueChangeDetails) => void
    children?: React.ReactNode
}
export type ColorInputControlProps = ComponentProps & ColorPicker.ControlProps
export type ColorInputSwatchProps = ComponentProps & ColorPicker.ValueSwatchProps
export type ColorInputValueTextProps = ComponentProps & Omit<React.HTMLProps<HTMLSpanElement>, "value">
export type ColorInputTriggerProps = ComponentProps & MenuTriggerProps
export type ColorInputContentProps = ComponentProps & MenuContentProps & {
    defaultNotation?: ColorNotation
}

const ColorInputStateContext = React.createContext<ColorInputState>({hasValue: false, placeholder: null})

const COLOR_PATTERN = /^(#([0-9a-f]{3,4}|[0-9a-f]{6}|[0-9a-f]{8})|(rgba?|hsla?|hsba?)\(\s*-?[\d.]+%?(\s*,\s*-?[\d.]+%?){2,3}\s*\))$/i

const safeParseColor = (input: string): Color | undefined => {
    const value = input.trim()
    return COLOR_PATTERN.test(value) ? parseColor(value) : undefined
}

const toColor = (input: unknown): Color | undefined => {
    if (typeof input === "string") return safeParseColor(input)
    if (input == null) return undefined
    return input as Color
}

const parsePastedColor = (text: string): { color: Color, notation: ColorNotation } | null => {
    const trimmed = text.trim().replace(/°/g, "").replace(/deg\b/gi, "")
    if (!trimmed) return null

    const parsed = safeParseColor(trimmed)
    if (parsed) {
        const lower = trimmed.toLowerCase()
        const notation: ColorNotation = lower.startsWith("#") ? "hexa" : lower.startsWith("hsl") ? "hsla" : "rgba"
        return {color: parsed, notation}
    }

    const isBareHex = /^[0-9a-f]+$/i.test(trimmed) && (
        trimmed.length === 6 || trimmed.length === 8 ||
        ((trimmed.length === 3 || trimmed.length === 4) && /[a-f]/i.test(trimmed))
    )
    if (isBareHex) return {color: parseColor(`#${trimmed}`), notation: "hexa"}

    const parts = trimmed.split(/[\s,]+/).filter(Boolean)
    const nums = parts.map((part) => Number(part.replace("%", "")))
    if ((parts.length === 3 || parts.length === 4) && nums.every((n) => !Number.isNaN(n))) {
        const alpha = parts.length === 4 ? nums[3] : 1
        const isHsl = parts[1].includes("%") || parts[2].includes("%")
        return isHsl
            ? {color: parseColor(`hsla(${nums[0]}, ${nums[1]}%, ${nums[2]}%, ${alpha})`), notation: "hsla"}
            : {color: parseColor(`rgba(${nums[0]}, ${nums[1]}, ${nums[2]}, ${alpha})`), notation: "rgba"}
    }
    return null
}

export const ColorInput: React.FC<ColorProps> = (props) => {

    const {
        title, description, left, leftType, rightType, right, formValidation, initialValue, defaultValue, value,
        placeholder = "Pick a color", name, disabled, readOnly, closeOnSelect, onValueChange, children
    } = props

    const initial = toColor(value ?? initialValue ?? defaultValue)
    const [current, setCurrent] = React.useState<Color>(() => initial ?? parseColor("hsla(0, 0%, 0%, 1)"))
    const [hasValue, setHasValue] = React.useState<boolean>(() => initial !== undefined)
    const [open, setOpen] = React.useState(false)

    React.useEffect(() => {
        if (value === undefined) return
        const next = toColor(value)
        setHasValue(next !== undefined)
        if (next) setCurrent(next)
    }, [value])

    const handleValueChange = (details: ValueChangeDetails) => {
        setCurrent(details.value)
        setHasValue(true)
        formValidation?.setValue?.(details.value.toString("hsla"))
        onValueChange?.(details)
    }

    return <ColorPicker.Root {...mergeComponentProps("color-input", {
        value: current,
        onValueChange: handleValueChange,
        open,
        onOpenChange: (details: { open: boolean }) => setOpen(details.open),
        name, disabled, readOnly, closeOnSelect
    }) as ColorPicker.RootProps}>
        <ColorInputStateContext.Provider value={{hasValue, placeholder}}>
            <Menu open={open} onOpenChange={setOpen}>
                <InputWrapper title={title}
                              description={description}
                              left={left}
                              leftType={leftType}
                              right={right}
                              rightType={rightType}
                              formValidation={formValidation}>
                    {children}
                </InputWrapper>
            </Menu>
        </ColorInputStateContext.Provider>
    </ColorPicker.Root>
}

export const ColorInputControl: React.FC<ColorInputControlProps> = (props) => {
    const {children, ...rest} = props
    return <ColorPicker.Control {...mergeComponentProps("color-input__control", rest) as ColorInputControlProps}>
        {children}
        <ColorPicker.HiddenInput/>
    </ColorPicker.Control>
}

export const ColorInputSwatch: React.FC<ColorInputSwatchProps> = (props) => {
    const {hasValue} = React.useContext(ColorInputStateContext)
    return <div className={"color-input__swatch-wrapper"}>
        {hasValue ? <>
            <ColorPicker.TransparencyGrid className={"color-input__transparency-grid"}/>
            <ColorPicker.ValueSwatch {...mergeComponentProps("color-input__swatch", props) as ColorInputSwatchProps}/>
        </> : (
            <div className={"color-input__swatch color-input__swatch--empty"}/>
        )}
    </div>
}

export const ColorInputValueText: React.FC<ColorInputValueTextProps> = (props) => {
    const {hasValue, placeholder} = React.useContext(ColorInputStateContext)
    if (!hasValue) {
        return <span {...mergeComponentProps("color-input__value-text color-input__value-text--placeholder", props)}>
            {placeholder}
        </span>
    }
    return <ColorPicker.Context>
        {(api) => (
            <span {...mergeComponentProps("color-input__value-text", props)}>
                {api.value.toString("hsla")}
            </span>
        )}
    </ColorPicker.Context>
}

export const ColorInputTrigger: React.FC<ColorInputTriggerProps> = (props) => {
    return <MenuTrigger {...mergeComponentProps("color-input__trigger", props) as ColorInputTriggerProps}/>
}

export const ColorInputContent: React.FC<ColorInputContentProps> = (props) => {
    const {defaultNotation, ...rest} = props
    return <MenuPortal>
        <MenuContent align={"end"}
                     sideOffset={8} {...mergeComponentProps("color-input__content", rest) as MenuContentProps}>
            <div className={"color-input__body"}>

                <ColorPicker.Area className={"color-input__area"}>
                    <ColorPicker.AreaBackground className={"color-input__area-background"}/>
                    <ColorPicker.AreaThumb className={"color-input__area-thumb"}/>
                </ColorPicker.Area>

                <div className={"color-input__sliders"}>
                    <ColorPicker.ChannelSlider channel={"hue"} className={"color-input__channel-slider"}>
                        <ColorPicker.ChannelSliderTrack className={"color-input__channel-slider-track"}/>
                        <ColorPicker.ChannelSliderThumb className={"color-input__channel-slider-thumb"}/>
                    </ColorPicker.ChannelSlider>
                    <ColorPicker.ChannelSlider channel={"alpha"} className={"color-input__channel-slider"}>
                        <ColorPicker.TransparencyGrid className={"color-input__channel-slider-grid"}/>
                        <ColorPicker.ChannelSliderTrack className={"color-input__channel-slider-track"}/>
                        <ColorPicker.ChannelSliderThumb className={"color-input__channel-slider-thumb"}/>
                    </ColorPicker.ChannelSlider>
                </div>

                <ColorPicker.Context>
                    {(api) => <ColorInputChannels api={api} defaultNotation={defaultNotation ?? "hsla"}/>}
                </ColorPicker.Context>

            </div>
        </MenuContent>
    </MenuPortal>
}

const ColorInputChannels: React.FC<{
    api: UseColorPickerContext
    defaultNotation: ColorNotation
}> = ({api, defaultNotation}) => {

    const [notation, setNotation] = React.useState<ColorNotation>(defaultNotation)

    const handleNotation = (next: string) => {
        if (next === "rgba" || next === "hsla" || next === "hexa") setNotation(next)
    }

    return <div className={"color-input__channels"}
                onKeyDown={(event) => {
                    if (event.key !== "Escape" && !event.metaKey && !event.ctrlKey) event.stopPropagation()
                }}>

        <SegmentedControl type={"single"} value={notation} onValueChange={handleNotation}
                          className={"segmented-control color-input__notation"}>
            <SegmentedControlItem value={"rgba"}>RGBA</SegmentedControlItem>
            <SegmentedControlItem value={"hsla"}>HSLA</SegmentedControlItem>
            <SegmentedControlItem value={"hexa"}>HEXA</SegmentedControlItem>
        </SegmentedControl>

        {notation === "hexa" ? (
            <label className={"color-input__channel color-input__channel--hex"}>
                <span className={"color-input__channel-label"}>HEXA</span>
                <ColorInputHexInput api={api}/>
            </label>
        ) : (
            <div className={"color-input__channel-row"}>
                {(notation === "rgba" ? ["red", "green", "blue"] : ["hue", "saturation", "lightness"]).map((channel) => (
                    <ColorInputChannel key={channel} api={api} format={notation} channel={channel as ColorChannel}/>
                ))}
                <ColorInputChannel api={api} format={notation} channel={"alpha"}/>
            </div>
        )}

        <ColorInputActions api={api} notation={notation} setNotation={setNotation}/>

    </div>
}

const ColorInputActions: React.FC<{
    api: UseColorPickerContext
    notation: ColorNotation
    setNotation: (notation: ColorNotation) => void
}> = ({api, notation, setNotation}) => {

    const {hasValue} = React.useContext(ColorInputStateContext)
    const [, copyToClipboard] = useCopyToClipboard()
    const apiRef = React.useRef(api)
    apiRef.current = api

    const copyColor = () => {
        if (!hasValue) return
        copyToClipboard(notation === "hexa" ? api.value.toString("hexa") : api.value.toString(notation))
    }

    const pasteColor = () => {
        navigator.clipboard.readText().then((text) => {
            const result = parsePastedColor(text)
            if (!result) return
            apiRef.current.setValue(result.color)
            setNotation(result.notation)
            if (document.activeElement instanceof HTMLElement) document.activeElement.blur()
        }, () => undefined)
    }

    useHotkeys("mod+c", copyColor, {enabled: hasValue, enableOnFormTags: true}, [hasValue, notation, api])
    useHotkeys("mod+v", pasteColor, {enableOnFormTags: true})

    const mod = /mac|iphone|ipad|ipod/i.test(navigator.userAgent) ? "⌘" : "Ctrl"

    return <Flex className={"color-input__actions"} align={"center"}>
        <Button paddingSize={"xxs"} onClick={pasteColor}>
            Paste
            <Badge>{mod}V</Badge>
        </Button>
        <Button paddingSize={"xxs"} onClick={copyColor} disabled={!hasValue}>
            Copy
            <Badge>{mod}C</Badge>
        </Button>
    </Flex>
}

const ColorInputChannel: React.FC<{
    channel: ColorChannel
    format: "rgba" | "hsla"
    api: UseColorPickerContext
}> = ({channel, format, api}) => {
    return <label className={"color-input__channel"}>
        <span className={"color-input__channel-label"}>{channel[0].toUpperCase()}</span>
        <ColorInputTextInput committed={api.getChannelValue(channel)}
                             inputMode={channel === "alpha" ? "decimal" : "numeric"}
                             commit={(value) => {
                                 const num = Number(value)
                                 if (value.trim() === "" || Number.isNaN(num)) return
                                 api.setValue(api.value.toFormat(format).withChannelValue(channel, num))
                             }}/>
    </label>
}

const ColorInputHexInput: React.FC<{ api: UseColorPickerContext }> = ({api}) => {
    return <ColorInputTextInput committed={api.value.toString("hexa")}
                                commit={(value) => {
                                    const color = safeParseColor(value)
                                    if (color) api.setValue(color)
                                }}/>
}

const ColorInputTextInput: React.FC<{
    committed: string
    commit: (value: string) => void
    inputMode?: "numeric" | "decimal" | "text"
}> = ({committed, commit, inputMode = "text"}) => {
    const [draft, setDraft] = React.useState(committed)
    const focused = React.useRef(false)

    React.useEffect(() => {
        if (!focused.current) setDraft(committed)
    }, [committed])

    return <input className={"color-input__channel-input"}
                  type={"text"}
                  inputMode={inputMode}
                  value={draft}
                  spellCheck={false}
                  autoComplete={"off"}
                  onFocus={() => (focused.current = true)}
                  onChange={(event) => {
                      setDraft(event.target.value)
                      commit(event.target.value)
                  }}
                  onBlur={() => {
                      focused.current = false
                      setDraft(committed)
                  }}/>
}
