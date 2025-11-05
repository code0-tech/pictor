import React from "react";
import {FlowView} from "../DFlow.view";
import {useService} from "../../../utils/contextStore";
import {DFlowReactiveService} from "../DFlow.service";
import TextInput from "../../form/TextInput";
import Flex from "../../flex/Flex";
import {DFlowTypeReactiveService} from "../type/DFlowType.service";
import {DFlowSuggestion} from "../suggestion/DFlowSuggestion.view";
import {useSuggestions} from "../suggestion/DFlowSuggestion.hook";
import {DFlowSuggestionMenuFooter} from "../suggestion/DFlowSuggestionMenuFooter";
import {toInputSuggestions} from "../suggestion/DFlowSuggestionMenu.util";
import {DataType, NodeParameterValue, Scalars} from "@code0-tech/sagittarius-graphql-types";
import {DFlowInputDataType} from "../input/DFlowInputDataType";

export interface DFlowTabTriggerProps {
    instance: FlowView
}

export const DFlowTabTrigger: React.FC<DFlowTabTriggerProps> = (props) => {

    const {instance} = props
    const flowTypeService = useService(DFlowTypeReactiveService)
    const flowService = useService(DFlowReactiveService)
    const definition = flowTypeService.getById(instance.type?.id!!)

    const suggestionsById: Record<string, DFlowSuggestion[]> = {}
    definition?.flowTypeSettings?.forEach(settingDefinition => {
        suggestionsById[settingDefinition.identifier!!] = useSuggestions({dataType: settingDefinition.dataType}, [], instance.id, 0, [0], 0)
    })


    return <Flex style={{gap: ".7rem", flexDirection: "column"}}>
        {definition?.inputType ? <DFlowInputDataType onDataTypeChange={value => {
            instance.inputType = value as DataType
            flowService.update()
        }} initialValue={instance.inputType || definition.inputType} blockingDataType={definition.inputType}/> : null}
        {definition?.flowTypeSettings?.map(settingDefinition => {
            const setting = instance.settings?.find(s => s.flowSettingIdentifier == settingDefinition.identifier)
            const title = settingDefinition.names?.nodes!![0]?.content ?? ""
            const description = settingDefinition?.descriptions?.nodes!![0]?.content ?? ""
            const result = suggestionsById[settingDefinition.identifier!!]

            if (!setting) return null

            // @ts-ignore
            const defaultValue = setting.value?.__typename === "LiteralValue" ? typeof setting?.value == "object" ? JSON.stringify(setting?.value) : setting?.value : typeof setting?.value == "object" ? JSON.stringify(setting?.value) : setting?.value

            const submitValue = (value: NodeParameterValue) => {
                if (value.__typename == "LiteralValue") {
                    setting.value = value.value
                } else {
                    setting.value = value
                }
                flowService.update()
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