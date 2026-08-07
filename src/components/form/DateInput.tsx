import {DateInput as ArkDateInput, DatePicker, DateValue} from "@ark-ui/react";
import {fromDate, getLocalTimeZone, toZoned} from "@internationalized/date";
import {IconChevronDown} from "@tabler/icons-react";
import {ComponentProps, mergeComponentProps} from "../../utils";
import React from "react";
import {InputWrapper, InputWrapperProps} from "./InputWrapper";
import {Flex} from "../flex/Flex";
import {Menu, MenuContent, MenuContentProps, MenuPortal, MenuTrigger, MenuTriggerProps} from "../menu/Menu";
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
import "./DateInput.style.scss"
import {Button} from "../button/Button";

type DateGranularity = "day" | "hour" | "minute" | "second"

interface ValueChangeDetails {
    value: DateValue[]
    valueAsString: string[]
}

export type DateProps = InputWrapperProps & {
    granularity?: DateGranularity
    closeOnSelect?: boolean
    name?: string
    disabled?: boolean
    readOnly?: boolean
    locale?: string
    placeholderValue?: DateValue
    onValueChange?: (details: ValueChangeDetails) => void
    children?: React.ReactNode
}
export type DateInputControlProps = ComponentProps & ArkDateInput.ControlProps
export type DateInputFieldProps = ComponentProps & ArkDateInput.SegmentGroupProps
export type DateInputTriggerProps = ComponentProps & MenuTriggerProps
export type DateInputContentProps = ComponentProps & MenuContentProps & {
    withTime?: boolean
}
export type DateInputPrevTriggerProps = ComponentProps & DatePicker.PrevTriggerProps
export type DateInputNextTriggerProps = ComponentProps & DatePicker.NextTriggerProps

const fromUnixSeconds = (seconds: number): DateValue =>
    fromDate(new Date(seconds * 1000), getLocalTimeZone())
const toUnixSeconds = (value: DateValue): number =>
    Math.floor(toZoned(value, getLocalTimeZone()).toDate().getTime() / 1000)

const toDateValues = (input: unknown): DateValue[] => {
    const list = Array.isArray(input) ? input : [input]
    const result: DateValue[] = []
    for (const item of list) {
        if (item == null || item === "") continue
        if (typeof item === "number") {
            if (!Number.isNaN(item)) result.push(fromUnixSeconds(item))
        } else {
            result.push(item as DateValue)
        }
    }
    return result
}

export const DateInput: React.FC<DateProps> = (props) => {

    const {
        title, description, left, leftType, rightType, right, formValidation, initialValue, defaultValue, value,
        granularity, closeOnSelect, name, disabled, readOnly, locale, placeholderValue, onValueChange, children
    } = props

    const [current, setCurrent] = React.useState<DateValue[]>(() => toDateValues(value ?? initialValue ?? defaultValue))
    React.useEffect(() => {
        if (value === undefined) return
        setCurrent(toDateValues(value))
    }, [value])
    const [open, setOpen] = React.useState(false)

    const handleValueChange = (details: ValueChangeDetails) => {
        setCurrent(details.value)
        formValidation?.setValue?.(details.value[0] ? toUnixSeconds(details.value[0]) : null)
        onValueChange?.(details)
    }

    return <ArkDateInput.Root {...mergeComponentProps("date-input", {
        value: current,
        onValueChange: handleValueChange,
        granularity, name, disabled, readOnly, locale, placeholderValue
    }) as ArkDateInput.RootProps}>
        <DatePicker.Root value={current}
                         onValueChange={handleValueChange}
                         open={open}
                         onOpenChange={(details) => setOpen(details.open)}
                         closeOnSelect={closeOnSelect}
                         disabled={disabled}
                         locale={locale}>
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
        </DatePicker.Root>
    </ArkDateInput.Root>
}

export const DateInputControl: React.FC<DateInputControlProps> = (props) => {
    return <ArkDateInput.Control {...mergeComponentProps("date-input__control", props) as DateInputControlProps}/>
}

export const DateInputField: React.FC<DateInputFieldProps> = (props) => {
    return <>
        <ArkDateInput.SegmentGroup {...mergeComponentProps("date-input__segment-group", props) as DateInputFieldProps}>
            <ArkDateInput.Context>
                {(api) => api.getSegments().map((segment, id) => (
                    <ArkDateInput.Segment key={id} segment={segment} className={"date-input__segment"}/>
                ))}
            </ArkDateInput.Context>
        </ArkDateInput.SegmentGroup>
        <ArkDateInput.HiddenInput/>
    </>
}

export const DateInputTrigger: React.FC<DateInputTriggerProps> = (props) => {
    return <MenuTrigger {...mergeComponentProps("date-input__trigger", props) as DateInputTriggerProps}/>
}

export const DateInputPrevTrigger: React.FC<DateInputPrevTriggerProps> = (props) => {
    return <DatePicker.PrevTrigger {...mergeComponentProps("date-input__prev-trigger", props) as DateInputPrevTriggerProps}/>
}

export const DateInputNextTrigger: React.FC<DateInputNextTriggerProps> = (props) => {
    return <DatePicker.NextTrigger {...mergeComponentProps("date-input__next-trigger", props) as DateInputNextTriggerProps}/>
}

const DateInputViewControl: React.FC = () => {
    return <DatePicker.ViewControl className={"date-input__view-control"}>
        <DateInputPrevTrigger>‹</DateInputPrevTrigger>
        <DatePicker.ViewTrigger className={"date-input__view-trigger"}>
            <DatePicker.RangeText className={"date-input__range-text"}/>
        </DatePicker.ViewTrigger>
        <DateInputNextTrigger>›</DateInputNextTrigger>
    </DatePicker.ViewControl>
}

export const DateInputContent: React.FC<DateInputContentProps> = (props) => {
    const {withTime, ...rest} = props
    return <MenuPortal>
        <MenuContent align={"end"} sideOffset={8} {...mergeComponentProps("date-input__content", rest) as MenuContentProps}>

            <DatePicker.View view={"day"} className={"date-input__view"}>
                <DatePicker.Context>
                    {(api) => <>
                        <DateInputViewControl/>
                        <DatePicker.Table className={"date-input__table"}>
                            <DatePicker.TableHead>
                                <DatePicker.TableRow>
                                    {api.weekDays.map((weekDay, id) => (
                                        <DatePicker.TableHeader key={id} className={"date-input__table-header"}>
                                            {weekDay.narrow}
                                        </DatePicker.TableHeader>
                                    ))}
                                </DatePicker.TableRow>
                            </DatePicker.TableHead>
                            <DatePicker.TableBody>
                                {api.weeks.map((week, id) => (
                                    <DatePicker.TableRow key={id}>
                                        {week.map((day, dayId) => (
                                            <DatePicker.TableCell key={dayId} value={day}>
                                                <DatePicker.TableCellTrigger className={"date-input__cell"}>
                                                    {day.day}
                                                </DatePicker.TableCellTrigger>
                                            </DatePicker.TableCell>
                                        ))}
                                    </DatePicker.TableRow>
                                ))}
                            </DatePicker.TableBody>
                        </DatePicker.Table>
                        {withTime && <DateInputTime/>}
                    </>}
                </DatePicker.Context>
            </DatePicker.View>

            <DatePicker.View view={"month"} className={"date-input__view"}>
                <DatePicker.Context>
                    {(api) => <>
                        <DateInputViewControl/>
                        <DatePicker.Table className={"date-input__table"}>
                            <DatePicker.TableBody>
                                {api.getMonthsGrid({columns: 4, format: "short"}).map((months, id) => (
                                    <DatePicker.TableRow key={id}>
                                        {months.map((month, monthId) => (
                                            <DatePicker.TableCell key={monthId} value={month.value}>
                                                <DatePicker.TableCellTrigger className={"date-input__cell"}>
                                                    {month.label}
                                                </DatePicker.TableCellTrigger>
                                            </DatePicker.TableCell>
                                        ))}
                                    </DatePicker.TableRow>
                                ))}
                            </DatePicker.TableBody>
                        </DatePicker.Table>
                    </>}
                </DatePicker.Context>
            </DatePicker.View>

            <DatePicker.View view={"year"} className={"date-input__view"}>
                <DatePicker.Context>
                    {(api) => <>
                        <DateInputViewControl/>
                        <DatePicker.Table className={"date-input__table"}>
                            <DatePicker.TableBody>
                                {api.getYearsGrid({columns: 4}).map((years, id) => (
                                    <DatePicker.TableRow key={id}>
                                        {years.map((year, yearId) => (
                                            <DatePicker.TableCell key={yearId} value={year.value}>
                                                <DatePicker.TableCellTrigger className={"date-input__cell"}>
                                                    {year.label}
                                                </DatePicker.TableCellTrigger>
                                            </DatePicker.TableCell>
                                        ))}
                                    </DatePicker.TableRow>
                                ))}
                            </DatePicker.TableBody>
                        </DatePicker.Table>
                    </>}
                </DatePicker.Context>
            </DatePicker.View>

        </MenuContent>
    </MenuPortal>
}

const DateInputTime: React.FC = () => {
    return <ArkDateInput.Context>
        {(inputApi) => {
            const types = new Set(inputApi.getSegments().map((segment) => segment.type))
            return <DatePicker.Context>
                {(api) => {
                    const selected = api.value[0] as { hour?: number, minute?: number, second?: number } | undefined
                    const hour = selected?.hour ?? 0
                    const minute = selected?.minute ?? 0
                    const second = selected?.second ?? 0
                    const disabled = api.value.length === 0

                    const selects: React.ReactNode[] = []
                    if (types.has("hour")) selects.push(
                        <DateInputTimeSelect key={"hour"} label={"Hour"} value={hour} count={24} disabled={disabled}
                                             onValueChange={(next) => api.setTime({hour: next, minute, second})}/>
                    )
                    if (types.has("minute")) selects.push(
                        <DateInputTimeSelect key={"minute"} label={"Minute"} value={minute} count={60} disabled={disabled}
                                             onValueChange={(next) => api.setTime({hour, minute: next, second})}/>
                    )
                    if (types.has("second")) selects.push(
                        <DateInputTimeSelect key={"second"} label={"Second"} value={second} count={60} disabled={disabled}
                                             onValueChange={(next) => api.setTime({hour, minute, second: next})}/>
                    )

                    return <div className={"date-input__time"}>
                        {selects.map((select, id) => (
                            <React.Fragment key={id}>
                                {id > 0 && <span className={"date-input__time-separator"}>:</span>}
                                {select}
                            </React.Fragment>
                        ))}
                    </div>
                }}
            </DatePicker.Context>
        }}
    </ArkDateInput.Context>
}

const DateInputTimeSelect: React.FC<{
    label: string
    value: number
    count: number
    disabled: boolean
    onValueChange: (value: number) => void
}> = ({label, value, count, disabled, onValueChange}) => {
    return <SelectInput value={String(value)}
                        disabled={disabled}
                        onValueChange={(next) => onValueChange(Number(next))}
                        wrapperComponent={{className: "date-input__time-select"}}>
        <SelectTrigger asChild>
            <Button paddingSize={"xxs"} justify={"start"}>
                <Flex justify={"space-between"} w={"100%"} align={"center"}>
                    <SelectValue aria-label={label}/>
                    <IconChevronDown size={13}/>
                </Flex>
            </Button>
        </SelectTrigger>
        <SelectPortal>
            <SelectContent position={"item-aligned"}>
                <SelectViewport>
                    {Array.from({length: count}, (_, option) => (
                        <SelectItem key={option} value={String(option)}>
                            <SelectItemText>{String(option).padStart(2, "0")}</SelectItemText>
                        </SelectItem>
                    ))}
                </SelectViewport>
            </SelectContent>
        </SelectPortal>
    </SelectInput>
}
