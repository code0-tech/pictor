import React from "react";
import {ButtonGroup} from "../../button-group/ButtonGroup";
import {Button} from "../../button/Button";
import {IconCopy, IconTrash} from "@tabler/icons-react";
import {Panel} from "@xyflow/react";
import {useService, useStore} from "../../../utils";
import {FileTabsService} from "../../file-tabs/FileTabs.service";
import {DFlowReactiveService} from "../DFlow.service";
import {Flow, NodeFunction} from "@code0-tech/sagittarius-graphql-types";

export const DFlowPanelControl: React.FC = () => {

    const fileTabsService = useService(FileTabsService)
    const fileTabsStore = useStore(FileTabsService)
    const flowService = useService(DFlowReactiveService)
    const activeTab = React.useMemo(() => fileTabsService.getActiveTab(), [fileTabsStore])

    const deleteActiveNode = React.useCallback(() => {
        if (!activeTab) return
        // @ts-ignore
        flowService.deleteNodeById((activeTab.content.props.flowId as Flow['id']), (activeTab.content.props.node.id as NodeFunction['id']))
    }, [activeTab, flowService])

    //TODO: Add execute flow button functionality
    //TODO: disable button if active tab is the trigger node
    return <Panel position={"bottom-center"}>
        <ButtonGroup>
            <Button disabled color={"info"} paddingSize={"xxs"} style={{border: "none"}}>
                Execute flow
            </Button>
            <Button disabled={!activeTab} onClick={deleteActiveNode} paddingSize={"xxs"} variant={"none"} color={"primary"}>
                <IconTrash size={16}/>
            </Button>
        </ButtonGroup>
    </Panel>

}