import React from "react";
import {ButtonGroup} from "../button-group/ButtonGroup";
import {Button} from "../button/Button";
import {IconPlus, IconTrash} from "@tabler/icons-react";
import {Panel} from "@xyflow/react";
import {useService, useStore} from "../../utils";
import {FileTabsService} from "../file-tabs/FileTabs.service";
import {DFlowReactiveService} from "../d-flow";
import {Flow, NodeFunction} from "@code0-tech/sagittarius-graphql-types";
import {Tooltip, TooltipArrow, TooltipContent, TooltipPortal, TooltipTrigger} from "../tooltip/Tooltip";
import {Text} from "../text/Text";
import {Badge} from "../badge/Badge";
import {DFlowSuggestionMenu} from "../d-flow-suggestion/DFlowSuggestionMenu";
import {useSuggestions} from "../d-flow-suggestion/DFlowSuggestion.hook";

export interface DFlowPanelControlProps {
    flowId: Flow['id']
}

export const DFlowPanelControl: React.FC<DFlowPanelControlProps> = (props) => {

    //props
    const {flowId} = props

    //services and stores
    const fileTabsService = useService(FileTabsService)
    const fileTabsStore = useStore(FileTabsService)
    const flowService = useService(DFlowReactiveService)
    const flowStore = useStore(DFlowReactiveService)
    const [, startTransition] = React.useTransition()

    //memoized values
    const activeTab = React.useMemo(() => {
        return fileTabsStore.find((t: any) => (t as any).active)
    }, [fileTabsStore, fileTabsService])

    const result = useSuggestions(flowId, activeTab?.content?.props?.node?.id as NodeFunction['id'] | undefined)

    //callbacks
    const deleteActiveNode = React.useCallback(() => {
        if (!activeTab) return
        if (!(activeTab.content.props.flowId as Flow['id'])) return
        // @ts-ignore
        startTransition(async () => {
            const linkedNodes = flowService.getLinkedNodesById(flowId, activeTab.content.props.node.id)
            linkedNodes.forEach(node => {
                if (node.id) fileTabsService.deleteById(node.id)
            })

            await flowService.deleteNodeById((activeTab.content.props.flowId as Flow['id']), (activeTab.content.props.node.id as NodeFunction['id']))
        })
    }, [activeTab, flowService, flowStore])

    const addNodeToFlow = React.useCallback((suggestion: any) => {
        if (flowId && suggestion.value.__typename === "NodeFunction" && "node" in activeTab.content.props) {
            startTransition(async () => {
                await flowService.addNextNodeById(flowId, (activeTab.content.props.node.id as NodeFunction['id']) ?? undefined, suggestion.value)
            })
        } else {
            startTransition(async () => {
                await flowService.addNextNodeById(flowId, null, suggestion.value)
            })
        }
    }, [flowId, flowService, flowStore, activeTab])

    return <Panel position={"bottom-center"}>
        <ButtonGroup>
            {/*<Tooltip>*/}
            {/*    <TooltipTrigger asChild>*/}
            {/*        <Button paddingSize={"xxs"}*/}
            {/*                variant={"filled"}*/}
            {/*                color={"primary"}>*/}
            {/*            Execute flow*/}
            {/*        </Button>*/}
            {/*    </TooltipTrigger>*/}
            {/*    <TooltipPortal>*/}
            {/*        <TooltipContent maw={"300px"}>*/}
            {/*            <Text>*/}
            {/*                To execute this flow you can call the following endpoint {" "} <br/>*/}
            {/*                <Badge>*/}
            {/*                    <Text>POST</Text>*/}
            {/*                </Badge>*/}
            {/*                <Badge color={"info"} border>*/}
            {/*                    <Text style={{color: "inherit"}}>localhost:6212/72hsa13/users/get</Text>*/}
            {/*                </Badge>*/}
            {/*            </Text>*/}
            {/*            <TooltipArrow/>*/}
            {/*        </TooltipContent>*/}
            {/*    </TooltipPortal>*/}
            {/*</Tooltip>*/}
            <Tooltip>
                <TooltipTrigger asChild>
                    <Button disabled={!activeTab || !(activeTab.content.props.flowId as Flow['id'])}
                            onClick={deleteActiveNode}
                            paddingSize={"xxs"}
                            variant={"filled"}
                            color={"error"}>
                        <IconTrash size={16}/>
                        Delete
                    </Button>
                </TooltipTrigger>
                <TooltipPortal>
                    <TooltipContent>
                        <Text>Select a node to delete it</Text>
                        <TooltipArrow/>
                    </TooltipContent>
                </TooltipPortal>
            </Tooltip>
            <DFlowSuggestionMenu suggestions={result}
                                 onSuggestionSelect={addNodeToFlow}
                                 triggerContent={
                                     <Button disabled={!activeTab}
                                             paddingSize={"xxs"}
                                             variant={"filled"}
                                             color={"secondary"}>
                                         <IconPlus size={16}/>
                                         Next node
                                     </Button>
                                 }/>
        </ButtonGroup>
    </Panel>

}
