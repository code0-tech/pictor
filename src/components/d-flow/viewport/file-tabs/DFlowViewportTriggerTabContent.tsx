import React from "react";
import {FlowView, NodeFunctionView} from "../../DFlow.view";
import {useService} from "../../../../utils/contextStore";
import {DFlowReactiveService} from "../../DFlow.service";
import TextInput from "../../../form/TextInput";
import Flex from "../../../flex/Flex";
import {DFlowTypeReactiveService} from "../../type/DFlowType.service";
import {FlowTypeSetting} from "../../type/DFlowType.view";
import {DFlowSuggestion} from "../../suggestions/DFlowSuggestion.view";
import {useSuggestions} from "../../suggestions/DFlowSuggestion.hook";
import {DFlowSuggestionMenuFooter} from "../../suggestions/DFlowSuggestionMenuFooter";
import {toInputSuggestions} from "../../suggestions/DFlowSuggestionMenu.util";

export interface DFlowViewportTriggerTabContentProps {
    instance: FlowView
}

export const DFlowViewportTriggerTabContent: React.FC<DFlowViewportTriggerTabContentProps> = (props) => {

    const {instance} = props
    const flowService = useService(DFlowReactiveService)
    const flowTypeService = useService(DFlowTypeReactiveService)
    const definition = flowTypeService.getById(instance.type)

    const flowTypeSettingsDefinition = React.useMemo(() => {
        const map: Record<string, FlowTypeSetting> = {}
        definition?.settings.forEach(def => {
            map[def.flow_definition_settings_id] = def
        })
        return map
    }, [definition?.settings])

    const suggestionsById: Record<string, DFlowSuggestion[]> = {}
    instance?.settings?.forEach(setting => {
        const settingDefinition = flowTypeSettingsDefinition[setting.definition.setting_id]
        suggestionsById[setting.definition.setting_id] = useSuggestions(settingDefinition.type, [], "some_database_id", 0, [0], 0)
    })

    return <Flex style={{gap: ".7rem", flexDirection: "column"}}>
        {instance.settings?.map(setting => {

            const settingsDefinition = flowTypeSettingsDefinition[setting.definition.setting_id]
            const title = settingsDefinition?.name ? settingsDefinition.name[0]?.text : setting.definition.setting_id
            const description = settingsDefinition?.description ? settingsDefinition?.description[0]?.text : JSON.stringify(settingsDefinition!!.type)
            const result = suggestionsById[setting.definition.setting_id]
            const defaultValue = setting.value instanceof NodeFunctionView ? JSON.stringify(setting.value.json) : typeof setting.value == "object" || typeof setting.value == "boolean" ? JSON.stringify(setting.value) : setting.value

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