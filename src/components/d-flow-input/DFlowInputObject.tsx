import React from "react"
import {Card} from "../card/Card"
import {Flex} from "../flex/Flex"
import {Text} from "../text/Text"
import {Button} from "../button/Button"
import {IconAlignLeft, IconEdit, IconX} from "@tabler/icons-react"
import DFlowInputObjectEditDialog from "./DFlowInputObjectEditDialog"
import "./DFlowInputDataType.style.scss"
import {ButtonGroup} from "../button-group/ButtonGroup";
import {DFlowInputObjectTree} from "./DFlowInputObjectTree";
import {DFlowInputProps} from "./DFlowInput";
import {useService, useStore} from "../../utils";
import {DFlowReactiveService} from "../d-flow";
import {DFlowDataTypeReactiveService} from "../d-flow-data-type";
import {DFlowFunctionReactiveService} from "../d-flow-function";
import {DFlowSuggestionMenu} from "../d-flow-suggestion/DFlowSuggestionMenu";
import {useSuggestions} from "../d-flow-suggestion/DFlowSuggestion.hook";
import {InputDescription, InputLabel, InputMessage} from "../form";
import {LiteralValue, NodeFunction, NodeParameterValue} from "@code0-tech/sagittarius-graphql-types";
import {DFlowInputNodeBadge} from "./DFlowInputNodeBadge";
import {DFlowInputReferenceBadge} from "./DFlowInputReferenceBadge";

export interface EditableObjectEntry {
    key: string
    value: LiteralValue | null
    path: string[]
}

export type DFlowInputObjectProps = DFlowInputProps

export const DFlowInputObject: React.FC<DFlowInputObjectProps> = (props) => {


    const {flowId, nodeId, parameterId, title, description, formValidation, onChange} = props

    const flowService = useService(DFlowReactiveService)
    const flowStore = useStore(DFlowReactiveService)
    const dataTypeService = useService(DFlowDataTypeReactiveService)
    const dataTypeStore = useStore(DFlowDataTypeReactiveService)
    const functionService = useService(DFlowFunctionReactiveService)
    const functionStore = useStore(DFlowFunctionReactiveService)

    const node = React.useMemo(
        () => flowService.getNodeById(flowId, nodeId),
        [flowStore, flowId, nodeId]
    )

    const parameter = React.useMemo(
        () => node?.parameters?.nodes?.find(p => p?.id === parameterId),
        [node, parameterId]
    )

    const functionDefinition = React.useMemo(
        () => functionService.getById(node?.functionDefinition?.id!),
        [functionStore, node]
    )

    const parameterDefinition = React.useMemo(
        () => functionDefinition?.parameterDefinitions?.find(pd => pd.id === parameter?.parameterDefinition?.id),
        [functionDefinition, parameter]
    )

    const initialValue: NodeParameterValue | undefined = React.useMemo(() => {
        if (!parameter?.value || (parameter?.value?.__typename === "LiteralValue" && parameter.value.value == null)) {
            return dataTypeService.getValueFromType(parameterDefinition?.dataTypeIdentifier!)
        }
        return parameter?.value
    }, [parameter, parameterDefinition, dataTypeStore])


    const suggestions = useSuggestions(flowId, nodeId, parameterId)

    const [value, setValue] = React.useState<NodeParameterValue | NodeFunction | undefined>(initialValue)
    const [editDialogOpen, setEditDialogOpen] = React.useState(false)
    const [editEntry, setEditEntry] = React.useState<EditableObjectEntry | null>(null)
    const [collapsedState, setCollapsedStateRaw] = React.useState<Record<string, boolean>>({})

    const setCollapsedState = (path: string[], collapsed: boolean) => {
        setCollapsedStateRaw(prev => ({...prev, [path.join(".")]: collapsed}))
    }

    const handleEntryClick = (entry: EditableObjectEntry) => {
        setEditEntry(entry)
        setEditDialogOpen(true)
    }

    const handleClear = React.useCallback(() => {
        setValue(dataTypeService.getValueFromType(parameterDefinition?.dataTypeIdentifier!))
    }, [parameter, parameterDefinition, dataTypeStore])

    React.useEffect(() => {
        formValidation?.setValue(value)
        // @ts-ignore
        onChange?.()
    }, [value])

    return (
        <>
            <DFlowInputObjectEditDialog
                key={String(editDialogOpen)}
                open={editDialogOpen}
                entry={editEntry}
                value={value as any}
                onOpenChange={open => setEditDialogOpen(open)}
                onObjectChange={v => setValue(v ?? undefined)}
            />
            <InputLabel>{title}</InputLabel>
            <InputDescription>{description}</InputDescription>
            <Card color="secondary" paddingSize="xs">
                <Flex style={{gap: ".7rem"}} align="center" justify="space-between">
                    <Flex style={{gap: ".35rem"}} align="center">
                        <Text>{"Object"}</Text>
                    </Flex>
                    <ButtonGroup color={"primary"}>
                        <DFlowSuggestionMenu suggestions={suggestions}
                                             onSuggestionSelect={suggestion => setValue(suggestion.value)}
                                             triggerContent={<Button paddingSize="xxs" variant="filled"
                                                                     color="secondary"
                                                                     onClick={() => setEditDialogOpen(true)}>
                                                 <IconAlignLeft size={13}/>
                                             </Button>}/>
                        <Button paddingSize="xxs" variant="filled" color="secondary"
                                onClick={() => setEditDialogOpen(true)}>
                            <IconEdit size={13}/>
                        </Button>
                        <Button paddingSize="xxs" variant="filled" color="secondary"
                                onClick={handleClear}>
                            <IconX size={13}/>
                        </Button>
                    </ButtonGroup>
                </Flex>
                <Card paddingSize="xs" mt={0.7} mb={-0.55} mx={-0.55}>
                    {value?.__typename === "NodeFunction" || value?.__typename === "NodeFunctionIdWrapper" ? (
                        <DFlowInputNodeBadge value={value} flowId={flowId}/>
                    ) : value?.__typename === "ReferenceValue" ? (
                        <DFlowInputReferenceBadge value={value} flowId={flowId}/>
                    ) : (
                        <DFlowInputObjectTree
                            object={value as any}
                            onEntryClick={handleEntryClick}
                            collapsedState={collapsedState}
                            setCollapsedState={setCollapsedState}
                        />
                    )}
                </Card>
            </Card>
            {!formValidation?.valid && formValidation?.notValidMessage && (
                <InputMessage>{formValidation.notValidMessage}</InputMessage>
            )}
        </>
    )
}
