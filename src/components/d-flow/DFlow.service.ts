import {ReactiveArrayService} from "../../utils";
import {
    DataTypeIdentifier,
    DataTypeIdentifierInput,
    FlowInput,
    FlowSetting,
    LiteralValue,
    Maybe,
    Namespace,
    NamespaceProject,
    NamespacesProjectsFlowsCreateInput,
    NamespacesProjectsFlowsCreatePayload,
    NamespacesProjectsFlowsDeleteInput,
    NamespacesProjectsFlowsDeletePayload,
    NamespacesProjectsFlowsUpdateInput,
    NamespacesProjectsFlowsUpdatePayload,
    NodeFunction,
    NodeFunctionIdWrapper,
    NodeParameter,
    ReferenceValue,
    Scalars
} from "@code0-tech/sagittarius-graphql-types";
import {Flow} from "./DFlow.view";
import {View} from "../../utils/view";

export type DFlowDependencies = {
    namespaceId: Namespace['id']
    projectId: NamespaceProject['id']
}

export abstract class DFlowReactiveService extends ReactiveArrayService<Flow, DFlowDependencies> {

    getById(id: Flow['id'], dependencies?: DFlowDependencies): Flow | undefined {
        return this.values(dependencies).find(value => value.id === id);
    }

    protected removeParameterNode(flow: Flow, parameter: NodeParameter): void {
        if (parameter?.value?.__typename === "NodeFunctionIdWrapper") {
            const parameterNode = flow?.nodes?.nodes?.find(n => n?.id === (parameter.value as NodeFunction)?.id)
            if (parameterNode) {
                flow!.nodes!.nodes = flow!.nodes!.nodes!.filter(n => n?.id !== (parameter.value as NodeFunction)?.id)
                let nextNodeId = parameterNode.nextNodeId
                while (nextNodeId) {
                    const nextNode = flow!.nodes!.nodes!.find(n => n?.id === nextNodeId)
                    if (nextNode) {
                        flow!.nodes!.nodes = flow!.nodes!.nodes!.filter(n => n?.id !== nextNodeId)
                        nextNodeId = nextNode.nextNodeId
                    } else {
                        nextNodeId = null
                    }
                }
                parameterNode.parameters?.nodes?.forEach(p => {
                    this.removeParameterNode(flow, p!!)
                })
            }
        }
    }

    getLinkedNodesById(flowId: Flow['id'], nodeId: NodeFunction['id']): NodeFunction[] {
        const parentNode = this.getNodeById(flowId, nodeId)
        const nextNodes = parentNode ? this.getLinkedNodesById(flowId, parentNode.nextNodeId) : []
        const parameterNodes: NodeFunction[] = []
        parentNode?.parameters?.nodes?.forEach(p => {
            if (p?.value?.__typename === "NodeFunctionIdWrapper") {
                const parameterNode = this.getNodeById(flowId, (p.value as NodeFunctionIdWrapper)?.id!!)
                if (parameterNode) {
                    parameterNodes.push(parameterNode)
                    parameterNodes.push(...(parameterNode ? this.getLinkedNodesById(flowId, parameterNode.nextNodeId) : []))
                }
            }
        })
        return [...(parentNode ? [parentNode] : []), ...parameterNodes, ...nextNodes]
    }

    getNodeById(flowId: Flow['id'], nodeId: NodeFunction['id']): NodeFunction | undefined {
        return this.getById(flowId)?.nodes?.nodes?.find(node => node?.id === nodeId)!!
    }

    getPayloadById(flowId: Flow['id']): FlowInput {
        const flow = this.getById(flowId)

        const getDataTypeIdentifierPayload = (identifier: DataTypeIdentifier): DataTypeIdentifierInput => {
            return {
                ...(identifier?.dataType ? {
                    dataTypeId: identifier?.dataType?.id
                } : {}),
                ...(identifier?.genericKey ? {
                    genericKey: identifier?.genericKey
                } : {}),
                ...(identifier?.genericType ? {
                    genericType: {
                        dataTypeId: identifier?.genericType?.dataType?.id!,
                        genericMappers: identifier?.genericType?.genericMappers?.map(genericMap => ({
                            target: genericMap.target!,
                            sourceDataTypeIdentifiers: genericMap.sourceDataTypeIdentifiers?.map(getDataTypeIdentifierPayload) ?? []
                        })) ?? []
                    }
                } : {})
            }
        }

        return {
            name: flow?.name!,
            type: flow?.type?.id!,
            settings: flow?.settings?.nodes?.map(setting => {
                return {
                    flowSettingIdentifier: setting?.flowSettingIdentifier!,
                    value: setting?.value!,
                }
            }) ?? [],
            nodes: flow?.nodes?.nodes?.map(node => {
                return {
                    id: node?.id!,
                    nextNodeId: node?.nextNodeId!,
                    parameters: node?.parameters?.nodes?.map(parameter => {
                        return {
                            parameterDefinitionId: parameter?.parameterDefinition?.id!,
                            ...(parameter?.value?.__typename === "NodeFunctionIdWrapper" ? {
                                value: {
                                    nodeFunctionId: parameter.value.id!
                                }
                            } : {}),
                            ...(parameter?.value?.__typename === "LiteralValue" ? {
                                value: {
                                    literalValue: parameter.value.value!
                                }
                            } : {}),
                            ...(parameter?.value?.__typename === "ReferenceValue" ? {
                                value: {
                                    referenceValue: {
                                        dataTypeIdentifier: getDataTypeIdentifierPayload((parameter?.value as ReferenceValue).dataTypeIdentifier!),
                                        depth: (parameter?.value as ReferenceValue).depth!,
                                        node: (parameter?.value as ReferenceValue).node!,
                                        nodeFunctionId: (parameter?.value as ReferenceValue).nodeFunctionId!,
                                        referencePath: (parameter?.value as ReferenceValue).referencePath ?? [],
                                        scope: (parameter?.value as ReferenceValue).scope!,
                                    }
                                }
                            } : {}),
                            ...(!parameter?.value ? {
                                value: {
                                    literalValue: null
                                }
                            } : {})
                        }
                    }) ?? [],
                    functionDefinitionId: node?.functionDefinition?.id!
                }
            }) ?? [],
            startingNodeId: flow?.startingNodeId!,
        }
    }

    async deleteNodeById(flowId: Flow['id'], nodeId: NodeFunction['id']): Promise<void> {
        const flow = this.getById(flowId)
        const node = this.getNodeById(flowId, nodeId)
        const parentNode = flow?.nodes?.nodes?.find(node => node?.parameters?.nodes?.find(p => p?.value?.__typename === "NodeFunctionIdWrapper" && (p.value as NodeFunction)?.id === nodeId))
        const previousNodes = flow?.nodes?.nodes?.find(n => n?.nextNodeId === nodeId)
        const index = this.values().findIndex(f => f.id === flowId)
        if (!flow || !node) return

        flow.nodes!.nodes = flow.nodes!.nodes!.filter(n => n?.id !== nodeId)
        node.parameters?.nodes?.forEach(p => this.removeParameterNode(flow, p!!))


        if (previousNodes) {
            previousNodes.nextNodeId = node.nextNodeId
        } else {
            if (!parentNode) flow.startingNodeId = node.nextNodeId ?? undefined
        }

        if (parentNode) {
            const parameter = parentNode.parameters?.nodes?.find(p => p?.value?.__typename === "NodeFunctionIdWrapper" && (p.value as NodeFunction)?.id === nodeId)
            if (parameter) {
                parameter.value = undefined
            }
        }

        flow.editedAt = new Date().toISOString()

        this.set(index, new View(flow))
    }

    async addNextNodeById(flowId: Flow['id'], parentNodeId: NodeFunction['id'] | null, nextNode: NodeFunction): Promise<void> {

        const flow = this.getById(flowId)
        const index = this.values().findIndex(f => f.id === flowId)
        const parentNode = parentNodeId ? this.getNodeById(flowId, parentNodeId) : undefined

        if (!flow || (parentNodeId && !parentNode)) return

        const nextNodeIndex: number = Math.max(0, ...flow.nodes?.nodes?.map(node => Number(node?.id?.match(/NodeFunction\/(\d+)$/)?.[1] ?? 0)) ?? [0])
        const nextNodeId: NodeFunction['id'] = `gid://sagittarius/NodeFunction/${nextNodeIndex + 1}`
        const addingNode: NodeFunction = {
            ...JSON.parse(JSON.stringify(nextNode)),
            id: nextNodeId,
        }

        if (parentNode && parentNode.nextNodeId) {
            addingNode.nextNodeId = parentNode.nextNodeId
        } else if (!parentNode && flow.startingNodeId) {
            addingNode.nextNodeId = flow.startingNodeId
        }

        flow.nodes?.nodes?.push(addingNode)

        if (parentNode) {
            parentNode.nextNodeId = addingNode.id
        } else {
            flow.startingNodeId = addingNode.id
        }

        flow.editedAt = new Date().toISOString()

        this.set(index, new View(flow))
    }

    async setSettingValue(flowId: Flow['id'], settingIdentifier: Maybe<Scalars['String']['output']>, value: FlowSetting['value']): Promise<void> {
        const flow = this.getById(flowId)
        const index = this.values().findIndex(f => f.id === flowId)
        if (!flow) return
        const setting = flow.settings?.nodes?.find(s => s?.flowSettingIdentifier === settingIdentifier)
        //console.log(flow, settingIdentifier, setting, value)
        if (!setting) return //TODO if the settings is not found create it

        setting.value = value
        flow.editedAt = new Date().toISOString()

        this.set(index, new View(flow))
    }

    async setParameterValue(flowId: Flow['id'], nodeId: NodeFunction['id'], parameterId: NodeParameter['id'], value?: LiteralValue | ReferenceValue | NodeFunction): Promise<void> {
        const flow = this.getById(flowId)
        const index = this.values().findIndex(f => f.id === flowId)
        if (!flow) return
        const node = this.getNodeById(flowId, nodeId)
        if (!node) return
        const parameter = node.parameters?.nodes?.find(p => p?.id === parameterId)
        if (!parameter) return
        this.removeParameterNode(flow, parameter)
        if (value?.__typename === "NodeFunction") {
            const nextNodeIndex: number = Math.max(0, ...flow.nodes?.nodes?.map(node => Number(node?.id?.match(/NodeFunction\/(\d+)$/)?.[1] ?? 0)) ?? [0])
            const addingIdValue: NodeFunction = {
                ...value,
                id: `gid://sagittarius/NodeFunction/${nextNodeIndex + 1}`
            }
            flow.nodes?.nodes?.push(addingIdValue)
            parameter.value = {
                id: `gid://sagittarius/NodeFunction/${nextNodeIndex + 1}`,
                __typename: "NodeFunctionIdWrapper"
            } as NodeFunctionIdWrapper
        } else {
            parameter.value = value as LiteralValue | ReferenceValue
        }

        flow.editedAt = new Date().toISOString()

        this.set(index, new View(flow))
    }

    abstract flowCreate(payload: NamespacesProjectsFlowsCreateInput): Promise<NamespacesProjectsFlowsCreatePayload | undefined>

    abstract flowDelete(payload: NamespacesProjectsFlowsDeleteInput): Promise<NamespacesProjectsFlowsDeletePayload | undefined>

    abstract flowUpdate(payload: NamespacesProjectsFlowsUpdateInput): Promise<NamespacesProjectsFlowsUpdatePayload | undefined>
}

