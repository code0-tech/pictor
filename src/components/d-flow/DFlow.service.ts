
import {ReactiveArrayService} from "../../utils";
import type {
    Flow, FlowSetting,
    NamespacesProjectsFlowsCreateInput,
    NamespacesProjectsFlowsCreatePayload, NamespacesProjectsFlowsDeleteInput,
    NamespacesProjectsFlowsDeletePayload, NodeFunction, NodeParameter
} from "@code0-tech/sagittarius-graphql-types";


export abstract class DFlowReactiveService extends ReactiveArrayService<Flow> {

    getById(id: Flow['id']): Flow | undefined {
        return this.values().find(value => value.id === id);
    }

    async deleteById(flowId: Flow['id']): Promise<void> {
        const index = this.values().findIndex(f => f.id === flowId)
        this.delete(index)
    }

    async renameById(flowId: Flow['id'], newName: string): Promise<void> {
        const flow = this.getById(flowId)
        const index = this.values().findIndex(f => f.id === flowId)
        if (!flow) return
        flow.name = newName
        this.set(index, flow)
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

        if (previousNodes) {
            previousNodes.nextNodeId = node.nextNodeId
        } else {
            flow.startingNodeId = node.nextNodeId ?? undefined
        }

        this.set(index, flow)
    }

    async addNextNodeById(flowId: Flow['id'], nodeId: NodeFunction['id'], nextNode: NodeFunction): Promise<void> {
        const flow = this.getById(flowId)
        const index = this.values().findIndex(f => f.id === flowId)
        const node = this.getNodeById(flowId, nodeId)
        if (!flow || !node || this.getNodeById(flowId, nextNode.id)) return
        flow.nodes?.nodes?.push(nextNode)
        node.nextNodeId = nextNode.id
        this.set(index, flow)
    }

    async setStartingNodeById(flowId: Flow['id'], startingNode: NodeFunction): Promise<void> {
        const flow = this.getById(flowId)
        if (!flow) return
        const index = this.values().findIndex(f => f.id === flowId)
        const addingIdValue: NodeFunction = {
            ...startingNode,
            id: `gid://sagittarius/NodeFunction/${(flow.nodes?.nodes?.length ?? 0) + 1}`
        }
        flow.nodes?.nodes?.push(addingIdValue)
        flow.startingNodeId = addingIdValue.id
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

    async setParameterValue(flowId: Flow['id'], nodeId: NodeFunction['id'], parameterId: NodeParameter['id'], value: NodeParameter['value']): Promise<void> {
        const flow = this.getById(flowId)
        const index = this.values().findIndex(f => f.id === flowId)
        if (!flow) return
        const node = this.getNodeById(flowId, nodeId)
        if (!node) return
        const parameter = node.parameters?.nodes?.find(p => p?.id === parameterId)
        if (!parameter) return
        if (parameter?.value?.__typename === "NodeFunction") {
            // @ts-ignore
            flow.nodes!.nodes = flow.nodes!.nodes!.filter(n => n?.id !== parameter.value?.id)
        }
        parameter.value = value
        if (value?.__typename === "NodeFunction") {
            const addingIdValue: NodeFunction = {
                ...value,
                id: `gid://sagittarius/NodeFunction/${(flow.nodes?.nodes?.length ?? 0) + 1}`
            }
            flow.nodes?.nodes?.push(addingIdValue)
            parameter.value = addingIdValue
        } else {
            parameter.value = value
        }
        this.set(index, flow)
    }

    /** Creates a new flow. */
    abstract flowCreate(payload: NamespacesProjectsFlowsCreateInput): Promise<NamespacesProjectsFlowsCreatePayload | undefined>
    /** Deletes a namespace project. */
    abstract flowDelete(payload: NamespacesProjectsFlowsDeleteInput): Promise<NamespacesProjectsFlowsDeletePayload | undefined>
}

