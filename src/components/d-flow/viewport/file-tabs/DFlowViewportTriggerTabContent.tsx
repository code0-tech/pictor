import React from "react";
import {FlowView, NodeFunctionView} from "../../DFlow.view";
import {useService} from "../../../../utils/contextStore";
import {DFlowReactiveService} from "../../DFlow.service";
import TextInput from "../../../form/TextInput";
import Flex from "../../../flex/Flex";
import {DFlowTypeReactiveService} from "../../type/DFlowType.service";
import {DFlowSuggestion} from "../../suggestions/DFlowSuggestion.view";
import {useSuggestions} from "../../suggestions/DFlowSuggestion.hook";
import {DFlowSuggestionMenuFooter} from "../../suggestions/DFlowSuggestionMenuFooter";
import {toInputSuggestions} from "../../suggestions/DFlowSuggestionMenu.util";
import {FlowTypeSetting} from "@code0-tech/sagittarius-graphql-types";

export interface DFlowViewportTriggerTabContentProps {
    instance: FlowView
}

export const DFlowViewportTriggerTabContent: React.FC<DFlowViewportTriggerTabContentProps> = (props) => {

    const {instance} = props
    const flowService = useService(DFlowReactiveService)
    const flowTypeService = useService(DFlowTypeReactiveService)
    const definition = flowTypeService.getById(instance.type?.id!!)

    const flowTypeSettingsDefinition = React.useMemo(() => {
        const map: Record<string, FlowTypeSetting> = {}
        definition?.flowTypeSettings?.forEach(def => {
            map[def.identifier!!] = def
        })
        return map
    }, [definition?.flowTypeSettings])

    const suggestionsById: Record<string, DFlowSuggestion[]> = {}
    instance?.settings?.forEach(setting => {
        const settingDefinition = flowTypeSettingsDefinition[setting.flowSettingId!!]
        suggestionsById[setting.flowSettingId!!] = useSuggestions({dataType: settingDefinition.dataType}, [], "some_database_id", 0, [0], 0)
    })

    return <Flex style={{gap: ".7rem", flexDirection: "column"}}>
        {instance.settings?.map(setting => {

            const settingsDefinition = flowTypeSettingsDefinition[setting.flowSettingId!!]
            const title = settingsDefinition?.names ? settingsDefinition.names?.nodes!![0]?.content : setting.flowSettingId
            const description = settingsDefinition?.descriptions ? settingsDefinition?.descriptions?.nodes!![0]?.content : JSON.stringify(settingsDefinition!!.dataType)
            const result = suggestionsById[setting.flowSettingId!!]
            const defaultValue = typeof setting.value == "object" ? JSON.stringify(setting.value) : setting.value

            return <div>
                <TextInput title={title}
                           description={description}
                           clearable
                           key={JSON.stringify(setting.value)}
                           defaultValue={defaultValue}
                           suggestionsFooter={<DFlowSuggestionMenuFooter/>}
                           suggestions={toInputSuggestions(result)}/>
            </div>
        })}
    </Flex>
}