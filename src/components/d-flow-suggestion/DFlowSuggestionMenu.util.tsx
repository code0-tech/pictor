import {DFlowSuggestion, DFlowSuggestionType} from "./DFlowSuggestion.view";
import {InputSuggestion} from "../form";
import React from "react";
import {IconCircleDot, IconCirclesRelation, IconFileFunctionFilled} from "@tabler/icons-react";
import {Text} from "../text/Text";

export const toInputSuggestions = (suggestions: DFlowSuggestion[]): InputSuggestion[] => {

    const staticGroupLabels: Partial<Record<DFlowSuggestionType, string>> = {
        [DFlowSuggestionType.VALUE]: "Values",
        [DFlowSuggestionType.REF_OBJECT]: "Variables",
        [DFlowSuggestionType.DATA_TYPE]: "Datatypes",
    }

    return suggestions.map(suggestion => {

        const iconMap: Record<DFlowSuggestionType, React.ReactNode> = {
            [DFlowSuggestionType.FUNCTION]: <IconFileFunctionFilled color="#70ffb2" size={16}/>,
            [DFlowSuggestionType.FUNCTION_COMBINATION]: <IconFileFunctionFilled color="#70ffb2" size={16}/>,
            [DFlowSuggestionType.REF_OBJECT]: <IconCirclesRelation color="#FFBE0B" size={16}/>,
            [DFlowSuggestionType.VALUE]: <IconCircleDot color="#D90429" size={16}/>,
            [DFlowSuggestionType.DATA_TYPE]: <IconCircleDot color="#D90429" size={16}/>,
        }

        const children: React.ReactNode = <>
            {iconMap[suggestion.type]}
            <div>
                <Text display="flex" style={{gap: ".5rem"}}>
                    {suggestion.displayText.map((text, idx) => (
                        <span key={idx}>{text}</span>
                    ))}
                </Text>
            </div>
        </>

        let groupLabel: string | undefined = staticGroupLabels[suggestion.type]

        if (suggestion.type === DFlowSuggestionType.FUNCTION || suggestion.type === DFlowSuggestionType.FUNCTION_COMBINATION) {
            const runtimeIdentifier = suggestion.value.__typename === "NodeFunction"
                ? suggestion.value.functionDefinition?.runtimeFunctionDefinition?.identifier
                : undefined

            if (runtimeIdentifier) {
                const [runtime, pkg] = runtimeIdentifier.split("::")
                if (runtime && pkg) {
                    groupLabel = `${runtime}::${pkg}`
                }
            }
        }

        return {
            children,
            valueData: suggestion,
            value: suggestion.value,
            groupBy: groupLabel,
        };
    })
}
