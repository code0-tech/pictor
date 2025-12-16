import {ReactiveArrayService} from "../../utils";
import type {
    Flow,
    FlowSetting, LiteralValue,
    NamespacesProjectsFlowsCreateInput,
    NamespacesProjectsFlowsCreatePayload,
    NamespacesProjectsFlowsDeleteInput,
    NamespacesProjectsFlowsDeletePayload, NamespacesProjectsFlowsUpdateInput, NamespacesProjectsFlowsUpdatePayload,
    NodeFunction, NodeFunctionIdWrapper,
    NodeParameter, ReferenceValue
} from "@code0-tech/sagittarius-graphql-types";


export abstract class DFlowReactiveService extends ReactiveArrayService<Flow> {

    getById(id: Flow['id']): Flow | undefined {
        return this.values().find(value => value.id === id);
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

    getNodeById(flowId: Flow['id'], nodeId: NodeFunction['id']): NodeFunction | undefined {
        return this.getById(flowId)?.nodes?.nodes?.find(node => node?.id === nodeId)!!
    }


    async deleteNodeById(flowId: Flow['id'], nodeId: NodeFunction['id']): Promise<void> {
        const flow = this.getById(flowId)
        const node = this.getNodeById(flowId, nodeId)
        const previousNodes = flow?.nodes?.nodes?.find(n => n?.nextNodeId === nodeId)
        const index = this.values().findIndex(f => f.id === flowId)
        if (!flow || !node) return

        flow.nodes!.nodes = flow.nodes!.nodes!.filter(n => n?.id !== nodeId)
        node.parameters?.nodes?.forEach(p => this.removeParameterNode(flow, p!!))

        if (previousNodes) {
            previousNodes.nextNodeId = node.nextNodeId
        } else {
            flow.startingNodeId = node.nextNodeId ?? undefined
        }

        this.set(index, flow)
    }

    async addNextNodeById(flowId: Flow['id'], parentNodeId: NodeFunction['id'] | null, nextNode: NodeFunction): Promise<void> {

        const flow = this.getById(flowId)
        const index = this.values().findIndex(f => f.id === flowId)
        const parentNode = parentNodeId ? this.getNodeById(flowId, parentNodeId) : undefined

        if (!flow || (parentNodeId && !parentNode)) return

        const nextNodeIndex: number = Math.max(0, ...flow.nodes?.nodes?.map(node => Number(node?.id?.match(/NodeFunction\/(\d+)$/)?.[1] ?? 0)) ?? [0])
        const nextNodeId: NodeFunction['id'] = `gid://sagittarius/NodeFunction/${nextNodeIndex + 1}`
        const addingNode: NodeFunction = {
            ...nextNode,
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

        this.set(index, flow)
    }

    async setSettingValue(flowId: Flow['id'], settingId: FlowSetting['id'], value: FlowSetting['value']): Promise<void> {
        const flow = this.getById(flowId)
        const index = this.values().findIndex(f => f.id === flowId)
        if (!flow) return
        const setting = flow.settings?.nodes?.find(s => s?.id === settingId)
        if (!setting) return
        setting.value = value
        this.set(index, flow)
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
        this.set(index, flow)
    }

    abstract flowCreate(payload: NamespacesProjectsFlowsCreateInput): Promise<NamespacesProjectsFlowsCreatePayload | undefined>
    abstract flowDelete(payload: NamespacesProjectsFlowsDeleteInput): Promise<NamespacesProjectsFlowsDeletePayload | undefined>
    abstract flowUpdate(payload: NamespacesProjectsFlowsUpdateInput): Promise<NamespacesProjectsFlowsUpdatePayload | undefined>
}

