import React from "react";
import {useService} from "../../utils";
import {DFlowReactiveService} from "../d-flow";
import {Flex} from "../flex/Flex";
import {DFlowTypeReactiveService} from "../d-flow-type";
import {DFlowSuggestion} from "../d-flow-suggestion";
import {useValueSuggestions} from "../d-flow-suggestion/DFlowValueSuggestions.hook";
import {useDataTypeSuggestions} from "../d-flow-suggestion/DFlowDataTypeSuggestions.hook";
import {toInputSuggestions} from "../d-flow-suggestion/DFlowSuggestionMenu.util";
import type {DataType, Flow, LiteralValue, NodeParameterValue, Scalars} from "@code0-tech/sagittarius-graphql-types";
import {DFlowInputDataType} from "../d-flow-input/DFlowInputDataType";
import {DFlowInputDefault} from "../d-flow-input/DFlowInputDefault";

export interface DFlowTabTriggerProps {
    instance: Flow
}

export const DFlowTabTrigger: React.FC<DFlowTabTriggerProps> = (props) => {

    const {instance} = props

    const flowTypeService = useService(DFlowTypeReactiveService)
    const flowService = useService(DFlowReactiveService)
    const [, startTransition] = React.useTransition()

    const definition = flowTypeService.getById(instance.type?.id!!)

    const suggestionsById: Record<string, DFlowSuggestion[]> = {}
    definition?.flowTypeSettings?.forEach(settingDefinition => {
        const dataTypeIdentifier = {dataType: settingDefinition.dataType}
        const valueSuggestions = useValueSuggestions(dataTypeIdentifier)
        const dataTypeSuggestions = useDataTypeSuggestions(dataTypeIdentifier)
        suggestionsById[settingDefinition.identifier!!] = [
            ...valueSuggestions,
            ...dataTypeSuggestions,
        ].sort()
    })


    return <Flex style={{gap: ".7rem", flexDirection: "column"}}>
        {definition?.inputType ? <DFlowInputDataType onDataTypeChange={value => {
            instance.inputType = value as DataType
            flowService.update()
        }} initialValue={instance.inputType || definition.inputType} blockingDataType={definition.inputType}/> : null}
        {definition?.flowTypeSettings?.map(settingDefinition => {
            const setting = instance.settings?.nodes?.find(s => s?.flowSettingIdentifier == settingDefinition.identifier)
            const title = settingDefinition.names!![0]?.content ?? ""
            const description = settingDefinition?.descriptions!![0]?.content ?? ""
            const result = suggestionsById[settingDefinition.identifier!!]


            const defaultValue = setting?.value?.__typename === "LiteralValue" ? typeof setting?.value == "object" ? JSON.stringify(setting?.value) : setting?.value : typeof setting?.value == "object" ? JSON.stringify(setting?.value) : setting?.value

            const submitValue = (value: NodeParameterValue) => {
                startTransition(async () => {
                    if (value?.__typename == "LiteralValue" && settingDefinition.identifier) {
                        await flowService.setSettingValue(props.instance.id, String(settingDefinition.identifier), value.value)
                    } else if (settingDefinition.identifier)  {
                        await flowService.setSettingValue(props.instance.id, String(settingDefinition.identifier), value)
                    }
                })

            }

            const submitValueEvent = (event: any) => {
                try {
                    const value = JSON.parse(event.target.value) as Scalars['JSON']['output']
                    if (value.__typename == "LiteralValue") {
                        submitValue(value.value)
                        return
                    }
                    submitValue(value)
                } catch (e) {
                    submitValue({
                        value: event.target.innerText,
                        __typename: "LiteralValue"
                    } as LiteralValue)
                }
            }

            return <div>
                <DFlowInputDefault flowId={undefined}
                                   nodeId={undefined}
                                   parameterId={undefined}
                                   title={title}
                                   description={description}
                                   clearable
                                   key={settingDefinition.identifier}
                                   defaultValue={defaultValue}
                                   onBlur={submitValueEvent}
                                   onClear={submitValueEvent}
                                   onSuggestionSelect={(suggestion) => {
                                       submitValue(suggestion.value)
                                   }}
                                   suggestions={toInputSuggestions(result)}
                />
            </div>
        })}
    </Flex>
}
