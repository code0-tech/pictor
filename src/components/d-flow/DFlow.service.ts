
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

    deleteById(id: Flow['id']): void {

    }

    renameById(id: Flow['id'], newName: string): void {

    }

    getNodeById(flowId: Flow['id'], nodeId: NodeFunction['id']): NodeFunction | undefined {
        return this.getById(flowId)?.nodes?.nodes?.find(node => node?.id === nodeId)!!
    }

    deleteNodeById(flowId: Flow['id'], nodeId: NodeFunction['id']): void {

    }

    addNextNodeById(flowId: Flow['id'], nodeId: NodeFunction['id'], nextNode: NodeFunction): void {
        const flow = this.getById(flowId)
        const index = this.values().findIndex(f => f.id === flowId)
        const node = this.getNodeById(flowId, nodeId)
        if (!flow || !node) return
        flow.nodes?.nodes?.push(nextNode)
        node.nextNodeId = nextNode.id
        this.set(index, flow)
    }

    setStartingNodeById(flowId: Flow['id'], startingNode: NodeFunction): void {
        const flow = this.getById(flowId)
        if (!flow) return
        const index = this.values().findIndex(f => f.id === flowId)
        flow.nodes?.nodes?.push(startingNode)
        flow.startingNodeId = startingNode.id
        this.set(index, flow)
    }

    setSettingValue(flowId: Flow['id'], settingId: FlowSetting['id'], value: FlowSetting['value']): void {

    }

    setParameterValue(flowId: Flow['id'], nodeId: NodeFunction['id'], parameterId: NodeParameter['id'], value: NodeParameter['value']): void {

    }

    /** Creates a new flow. */
    abstract flowCreate(payload: NamespacesProjectsFlowsCreateInput): Promise<NamespacesProjectsFlowsCreatePayload | undefined>
    /** Deletes a namespace project. */
    abstract flowDelete(payload: NamespacesProjectsFlowsDeleteInput): Promise<NamespacesProjectsFlowsDeletePayload | undefined>
}

