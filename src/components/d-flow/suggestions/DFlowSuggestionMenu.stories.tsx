import {Meta} from "@storybook/react";
import React from "react";
import {DataTypeView} from "../data-type/DFlowDataType.view";
import {dataTypes} from "../data-type/DFlowDataType.data";
import {functionData} from "../function/DFlowFunction.data";
import {FunctionDefinition} from "../function/DFlowFunction.view";
import {FlowView} from "../DFlow.view";
import {flow} from "../DFlow.data";
import {ContextStoreProvider} from "../../../utils/contextStore";
import {useReactiveArrayService} from "../../../utils/reactiveArrayService";
import {DFlowDataTypeReactiveService} from "../data-type/DFlowDataType.service";
import {DFlowFunctionReactiveService} from "../function/DFlowFunction.service";
import {DFlowReactiveService} from "../DFlow.service";
import {DFlowReactiveSuggestionService} from "./DFlowSuggestion.service";
import {DFlowSuggestion} from "./DFlowSuggestion.view";
import {useSuggestions} from "./DFlowSuggestion.hook";
import TextInput from "../../form/TextInput";
import {DFlowSuggestionMenuFooter} from "./DFlowSuggestionMenuFooter";
import {toInputSuggestions} from "./DFlowSuggestionMenu.util";

export default {
    title: "DFlowSuggestionMenuWithInput",
} as Meta

export const Example = () => {

    const functionsData: FunctionDefinition[] = functionData.map((fd) => new FunctionDefinition(fd))

    const [dataTypeStore, dataTypeService] = useReactiveArrayService<DataTypeView, DFlowDataTypeReactiveService>(DFlowDataTypeReactiveService)
    const [functionStore, functionService] = useReactiveArrayService<FunctionDefinition, DFlowFunctionReactiveService>(DFlowFunctionReactiveService, functionsData);
    const [flowStore, flowService] = useReactiveArrayService<FlowView, DFlowReactiveService>(DFlowReactiveService, [new FlowView(flow)]);
    const [suggestionStore, suggestionService] = useReactiveArrayService<DFlowSuggestion, DFlowReactiveSuggestionService>(DFlowReactiveSuggestionService);

    React.useEffect(() => {
        dataTypes.forEach(dt => dataTypeService.add(new DataTypeView(dt, dataTypeService)));
    }, [dataTypeService])

    return <ContextStoreProvider
        services={[[dataTypeStore, dataTypeService], [functionStore, functionService], [flowStore, flowService], [suggestionStore, suggestionService]]}>
        {React.useMemo(() => <SuggestionMenu/>, [])}
    </ContextStoreProvider>
}

const SuggestionMenu = () => {

    const result = useSuggestions("NUMBER", [], "some_database_id", 0, 0)

    return <div>
        <TextInput title={"Text"}
                   clearable
                   transformValue={(value) => <span style={{color: "red"}}>{value}</span>}
                   suggestionsFooter={<DFlowSuggestionMenuFooter/>}
                   suggestions={toInputSuggestions(result)}
                   description={"Type what ever text you like"}
                   placeholder={"code0.tech"}/>
    </div>
}