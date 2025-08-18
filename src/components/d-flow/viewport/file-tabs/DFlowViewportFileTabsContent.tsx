import React from "react";
import {NodeFunction} from "../../DFlow.view";
import TextInput from "../../../form/TextInput";
import Flex from "../../../flex/Flex";
import {useService} from "../../../../utils/contextStore";
import {DFlowFunctionReactiveService} from "../../function/DFlowFunction.service";
import {useSuggestions} from "../../suggestions/DFlowSuggestion.hook";
import {DFlowSuggestionMenuFooter} from "../../suggestions/DFlowSuggestionMenuFooter";
import {toInputSuggestions} from "../../suggestions/DFlowSuggestionMenu.util";

export interface DFlowViewportFileTabsContentProps {
    functionInstance: NodeFunction
    contextLevel?: number
    nodeLevel?: number
}

export const DFlowViewportFileTabsContent: React.FC<DFlowViewportFileTabsContentProps> = (props) => {

    const {functionInstance, contextLevel, nodeLevel} = props
    const functionService = useService(DFlowFunctionReactiveService)
    const definition = functionService.getFunctionDefinition(functionInstance.id)
    return <Flex style={{gap: ".7rem", flexDirection: "column"}}>
        {functionInstance.parameters!!.map(parameter => {

            const parameterDefinition = definition?.parameters!!.find(parameterDefinition => parameterDefinition.parameter_id === parameter.id)
            const result = useSuggestions(parameterDefinition!!.type, [], "some_database_id", contextLevel, nodeLevel)
            return <div>
                <TextInput title={parameterDefinition!!.parameter_id}
                           description={JSON.stringify(parameterDefinition!!.type)}
                           clearable
                           defaultValue={JSON.stringify(parameter.value)}
                           suggestionsFooter={<DFlowSuggestionMenuFooter/>}
                           suggestions={toInputSuggestions(result)}

                />
            </div>
        })}
    </Flex>

}