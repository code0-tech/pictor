import {Meta} from "@storybook/react";
import React from "react";
import {DataType, GenericType} from "../data-type/DFlowDataType.view";
import {dataTypes} from "../data-type/DFlowDataType.data";
import {functionData} from "../function/DFlowFunction.data";
import {FunctionDefinition} from "../function/DFlowFunction.view";
import {Flow} from "../DFlow.view";
import {flow} from "../DFlow.data";
import {ContextStoreProvider} from "../../../utils/contextStore";
import {createReactiveArrayService} from "../../../utils/reactiveArrayService";
import {DFlowDataTypeReactiveService} from "../data-type/DFlowDataType.service";
import {DFlowFunctionReactiveService} from "../function/DFlowFunction.service";
import {DFlowReactiveService} from "../DFlow.service";
import {DFlowReactiveSuggestionService} from "./DFlowSuggestion.service";
import {DFlowSuggestion} from "./DFlowSuggestion.view";
import {useSuggestions} from "./DFlowSuggestion.hook";
import NumberInput from "../../form/NumberInput";

export default {
    title: "DFlowSuggestionMenu",
} as Meta

export const Example = () => {

    const dataTypesData: DataType[] = dataTypes.map((dt) => new DataType(dt, null as any))
    const functionsData: FunctionDefinition[] = functionData.map((fd) => new FunctionDefinition(fd))

    const [dataTypeStore, dataTypeService] = createReactiveArrayService<DataType, DFlowDataTypeReactiveService>(DFlowDataTypeReactiveService, undefined, dataTypesData);
    const [functionStore, functionService] = createReactiveArrayService<FunctionDefinition, DFlowFunctionReactiveService>(DFlowFunctionReactiveService, undefined, functionsData);
    const [flowStore, flowService] = createReactiveArrayService<Flow, DFlowReactiveService>(DFlowReactiveService, undefined, [new Flow(flow)]);
    const [suggestionStore, suggestionService] = createReactiveArrayService<DFlowSuggestion, DFlowReactiveSuggestionService>(DFlowReactiveSuggestionService);

    return <ContextStoreProvider
        services={[[dataTypeStore, dataTypeService], [functionStore, functionService], [flowStore, flowService], [suggestionStore, suggestionService]]}>
        {React.useMemo(() => <SuggestionMenu/>, [])}
    </ContextStoreProvider>
}

const SuggestionMenu = () => {

    const result = useSuggestions({
        type: "ARRAY",
        generic_mapper: [{generic_target: "T", types: ["NUMBER"]}]
    } as GenericType, [], "some_database_id", 0, 0)

    return <div>
        <NumberInput title={"number"}
                     suggestions={result}
                     description={"Increase and decrease your number"}
                     placeholder={"code0.tech"}/>
    </div>
}