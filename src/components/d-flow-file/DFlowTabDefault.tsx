import React from "react";
import {useForm} from "../form";
import {Flex} from "../flex/Flex";
import {useService, useStore} from "../../utils";
import {DFlowFunctionReactiveService, ParameterDefinitionView} from "../d-flow-function";
import {DFlowReactiveService} from "../d-flow";
import {
    Flow,
    LiteralValue,
    NodeFunction,
    NodeParameterValue,
    ReferenceValue,
    Scalars
} from "@code0-tech/sagittarius-graphql-types";
import {InputSyntaxSegment} from "../form/Input.syntax.hook";
import {useNodeValidation} from "../d-flow-validation/DNodeValidation.hook";
import {FileTabsService} from "../file-tabs/FileTabs.service";
import {DFlowInputDefault} from "../d-flow-input/DFlowInputDefault";

export interface DFlowTabDefaultProps {
    node: NodeFunction
    flowId: Flow['id']
}

export const DFlowTabDefault: React.FC<DFlowTabDefaultProps> = (props) => {

    const {node, flowId} = props

    const functionService = useService(DFlowFunctionReactiveService)
    const functionStore = useStore(DFlowFunctionReactiveService)
    const flowService = useService(DFlowReactiveService)
    const flowStore = useStore(DFlowReactiveService)
    const fileTabsService = useService(FileTabsService)
    const validation = useNodeValidation(node.id, flowId)

    const changedParameters = React.useRef<Set<string>>(new Set())
    const [, startTransition] = React.useTransition()

    const definition = React.useMemo(() => {
        return functionService.getById(node.functionDefinition?.id!!)
    }, [functionStore])

    const paramDefinitions = React.useMemo(() => {
        const map: Record<string, ParameterDefinitionView> = {}
        definition?.parameterDefinitions?.forEach(pd => {
            map[pd.id!!] = pd
        })
        return map
    }, [definition])

    const sortedParameters = React.useMemo(() => {
        return [...(node.parameters?.nodes || [])].sort((a, b) => a!!.id!!.localeCompare(b?.id!!))
    }, [node])

    const initialValues = React.useMemo(() => {
        const values: Record<string, any> = {}
        sortedParameters.forEach(parameter => {
            values[parameter?.id!!] = parameter?.value?.__typename === "LiteralValue" ? (typeof parameter.value?.value === "object" ? JSON.stringify(parameter.value?.value) : parameter.value.value) : JSON.stringify(parameter?.value)
        })
        return values
    }, [sortedParameters])

    const validations = React.useMemo(() => {
        const values: Record<string, any> = {}
        sortedParameters.forEach(parameter => {
            values[parameter?.id!!] = (_: any) => {
                const validationForParameter = validation?.find(v => v.parameterId === parameter?.id)
                if (validationForParameter) {
                    return validationForParameter.message!![0]?.content || "Invalid value"
                }
                return null
            }
        })
        return values
    }, [sortedParameters, validation])

    const onSubmit = React.useCallback((values: any) => {
        startTransition(async () => {
            for (const paramDefinitions1 of sortedParameters) {
                if (!changedParameters.current.has(paramDefinitions1?.id!!)) continue;
                const syntaxSegment = values[paramDefinitions1?.id!]
                const previousValue = paramDefinitions1?.value as NodeParameterValue
                const syntaxValue = syntaxSegment?.[0]?.value as NodeFunction | LiteralValue | ReferenceValue

                if (previousValue && previousValue.__typename === "NodeFunctionIdWrapper" && previousValue.id) {
                    const linkedNodes = flowService.getLinkedNodesById(flowId, previousValue.id)
                    linkedNodes.reverse().forEach(node => {
                        if (node.id) fileTabsService.deleteById(node.id)
                    })
                }

                if (!syntaxValue || !syntaxSegment) {
                    await flowService.setParameterValue(flowId, node.id!!, paramDefinitions1!!.id!!, undefined);
                }

                try {
                    const parsedSyntaxValue = JSON.parse(String(syntaxValue))
                    if (!syntaxValue?.__typename) {
                        await flowService.setParameterValue(flowId, node.id!!, paramDefinitions1!!.id!!, syntaxValue ? {
                            __typename: "LiteralValue",
                            value: parsedSyntaxValue === null || parsedSyntaxValue === undefined ? String(parsedSyntaxValue) : parsedSyntaxValue
                        } : undefined);
                        continue;
                    }
                } catch (e) {
                    if (!syntaxValue?.__typename) {
                        await flowService.setParameterValue(flowId, node.id!!, paramDefinitions1!!.id!!, syntaxValue ? {
                            __typename: "LiteralValue",
                            value: syntaxValue,
                        } : undefined);
                        continue;
                    }
                }

                await flowService.setParameterValue(flowId, node.id!!, paramDefinitions1!!.id!!, syntaxValue.__typename === "LiteralValue" ? (!!syntaxValue.value ? syntaxValue : undefined) : syntaxValue);
            }
            changedParameters.current.clear()
        })
    }, [flowStore, sortedParameters])

    const [inputs, validate] = useForm<Record<Scalars['NodeParameterID']['output'], InputSyntaxSegment[]>>({
        initialValues: initialValues,
        validate: validations,
        truthyValidationBeforeSubmit: false,
        onSubmit: onSubmit
    })

    return <Flex style={{gap: ".7rem", flexDirection: "column"}}>
        {sortedParameters.map(parameter => {

            if (!parameter) return null

            const parameterDefinition = paramDefinitions[parameter?.parameterDefinition?.id!!]
            const title = parameterDefinition?.names ? parameterDefinition?.names!![0]?.content : parameterDefinition?.id
            const description = parameterDefinition?.descriptions ? parameterDefinition?.descriptions!![0]?.content : JSON.stringify(parameterDefinition?.dataTypeIdentifier)

            return <div>
                {/*@ts-ignore*/}
                <DFlowInputDefault flowId={flowId}
                                   nodeId={node.id}
                                   parameterId={parameter.id}
                                   title={title}
                                   description={description}
                                   clearable
                                   onChange={() => {
                                       changedParameters.current.add(parameter.id!!)
                                       validate()
                                   }}
                                   {...inputs.getInputProps(parameter.id!!)}
                />
            </div>
        })}
    </Flex>
}
