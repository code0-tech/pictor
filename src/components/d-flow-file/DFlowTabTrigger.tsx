import React from "react";
import {useService} from "../../utils";
import {DFlowReactiveService} from "../d-flow";
import {TextInput} from "../form";
import {Flex} from "../flex/Flex";
import {DFlowTypeReactiveService} from "../d-flow-type";
import {DFlowSuggestion} from "../d-flow-suggestion";
import {useValueSuggestions} from "../d-flow-suggestion/DFlowValueSuggestions.hook";
import {useFunctionSuggestions} from "../d-flow-suggestion/DFlowFunctionSuggestions.hook";
import {useDataTypeSuggestions} from "../d-flow-suggestion/DFlowDataTypeSuggestions.hook";
import {DFlowSuggestionMenuFooter} from "../d-flow-suggestion/DFlowSuggestionMenuFooter";
import {toInputSuggestions} from "../d-flow-suggestion/DFlowSuggestionMenu.util";
import type {DataType, Flow, NodeParameterValue, Scalars} from "@code0-tech/sagittarius-graphql-types";
import {DFlowInputDataType} from "../d-flow-input/DFlowInputDataType";
import {Text} from "../text/Text";
import {MenuItem} from "../menu/Menu";

export interface DFlowTabTriggerProps {
    instance: Flow
}

export const DFlowTabTrigger: React.FC<DFlowTabTriggerProps> = (props) => {

    const {instance} = props

    const flowTypeService = useService(DFlowTypeReactiveService)
    const flowService = useService(DFlowReactiveService)
    const [,startTransition] = React.useTransition()

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
            const title = settingDefinition.names?.nodes!![0]?.content ?? ""
            const description = settingDefinition?.descriptions?.nodes!![0]?.content ?? ""
            const result = suggestionsById[settingDefinition.identifier!!]

            if (!setting) return null

            // @ts-ignore
            const defaultValue = setting.value?.__typename === "LiteralValue" ? typeof setting?.value == "object" ? JSON.stringify(setting?.value) : setting?.value : typeof setting?.value == "object" ? JSON.stringify(setting?.value) : setting?.value

            const submitValue = (value: NodeParameterValue) => {
                startTransition(async () => {
                    if (value.__typename == "LiteralValue") {
                        await flowService.setSettingValue(props.instance.id, setting.id, value.value)
                    } else {
                        await flowService.setSettingValue(props.instance.id, setting.id, value)
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
                    // @ts-ignore
                    submitValue(event.target.value)
                }
            }

            return <div>
                <TextInput title={title}
                           description={description}
                           clearable
                           suggestionsEmptyState={<MenuItem><Text>No suggestion found</Text></MenuItem>}
                           key={JSON.stringify(setting.value)}
                           defaultValue={defaultValue}
                           onClear={submitValueEvent}
                           onSuggestionSelect={(suggestion) => {
                               submitValue(suggestion.value)
                           }}
                           suggestionsFooter={<DFlowSuggestionMenuFooter/>}
                           suggestions={toInputSuggestions(result)}
                />
            </div>
        })}
    </Flex>
}
