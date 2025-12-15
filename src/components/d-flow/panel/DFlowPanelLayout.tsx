import React from "react";
import {SegmentedControl, SegmentedControlItem} from "../../segmented-control/SegmentedControl";
import {IconLayout, IconLayoutDistributeHorizontal, IconLayoutDistributeVertical} from "@tabler/icons-react";
import {Panel} from "@xyflow/react";
import {Tooltip, TooltipArrow, TooltipContent, TooltipPortal, TooltipTrigger} from "../../tooltip/Tooltip";
import {Text} from "../../text/Text";

export interface DFlowPanelLayoutProps {

}

export const DFlowPanelLayout: React.FC<DFlowPanelLayoutProps> = (props) => {

    const {} = props

    return <Panel position={"top-center"}>
        <SegmentedControl type={"single"} defaultValue={"horizontal"}>
            <Tooltip>
                <TooltipTrigger asChild>
                    <SegmentedControlItem value={"horizontal"} display={"flex"}>
                        <IconLayoutDistributeHorizontal size={16}/>
                    </SegmentedControlItem>
                </TooltipTrigger>
                <TooltipPortal>
                    <TooltipContent>
                        <TooltipArrow/>
                        <Text>Vertical layout</Text>
                    </TooltipContent>
                </TooltipPortal>
            </Tooltip>
            <Tooltip>
                <TooltipTrigger asChild>
                    <SegmentedControlItem disabled value={"vertical"} display={"flex"}>
                        <IconLayoutDistributeVertical size={16}/>
                    </SegmentedControlItem>
                </TooltipTrigger>
                <TooltipPortal>
                    <TooltipContent>
                        <TooltipArrow/>
                        <Text>Horizontal layout</Text>
                    </TooltipContent>
                </TooltipPortal>
            </Tooltip>
            <Tooltip>
                <TooltipTrigger asChild>
                    <SegmentedControlItem disabled value={"manual"} display={"flex"}>
                        <IconLayout size={16}/>
                    </SegmentedControlItem>
                </TooltipTrigger>
                <TooltipPortal>
                    <TooltipContent>
                        <TooltipArrow/>
                        <Text>Manual layout</Text>
                    </TooltipContent>
                </TooltipPortal>
            </Tooltip>
        </SegmentedControl>
    </Panel>
}