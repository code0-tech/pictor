import React, {useEffect} from "react";
import {Meta} from "@storybook/react";
import DFullScreen from "../d-fullscreen/DFullScreen";
import DSplitScreen from "./DSplitScreen";
import DSplitPane, {DSplitPaneHandle} from "./pane/DSplitPane";
import DFolder, {useFolderControls} from "../d-folder/DFolder";
import DScreenButton from "../d-screen/DScreenButton";
import {IconBrandAdobe, IconDatabase, IconHierarchy3, IconSettings, IconTicket} from "@tabler/icons-react";
import {ZoomPanPinchExample} from "../d-zoom-pan-pinch/DZoomPanPinch.stories";
import Button from "../button/Button";
import ButtonGroup from "../button-group/ButtonGroup";

const meta: Meta = {
    title: "DSplitPane",
    parameters: {
        visualTest: {
            selector: 'body'
        },
        layout: "fullscreen"
    },
}

export const test = () => {

    const ref = React.useRef<DSplitPaneHandle>(null);

    return <DFullScreen>
        <div style={{
            borderBottom: "1px solid rgba(255, 255, 255, 0.1)",
            padding: ".5rem",
            display: "flex",
            justifyContent: "flex-end"
        }}>
            <ButtonGroup>
                <Button onClick={() => {
                    ref!!.current!!.show()
                }}>Show</Button>
                <Button onClick={() => {
                    // @ts-ignore
                    ref!!.current!!.add()
                }}>Add First</Button>
                <Button>Add Last</Button>
                <Button color={"error"}>Reset</Button>
            </ButtonGroup>
        </div>
        <DSplitScreen>
            <DSplitPane ref={ref}>
                <Button onClick={() => ref!!.current!!.hide()}>Hide</Button>
            </DSplitPane>
            <DSplitPane miw={"50%"}>
                2
            </DSplitPane>
            <DSplitPane>
                3
            </DSplitPane>
            <DSplitPane>
                4
            </DSplitPane>
        </DSplitScreen>
    </DFullScreen>

}
export const Dashboard = () => {

    const [controls, openAll, closeAll] = useFolderControls()

    return <DFullScreen>
        <DSplitScreen>
            <DSplitPane maw={"fit-content"} p={0.5} justify={"space-between"}
                        style={{writingMode: "vertical-rl", display: "flex"}}>
                <div style={{display: "flex", gap: ".5rem", overflow: "hidden"}}>
                    <DScreenButton color={"secondary"}>
                        <IconHierarchy3 size={12}/>
                        Flows
                    </DScreenButton>
                    <DScreenButton color={"warning"}>
                        <IconTicket size={12}/>
                        Issues
                    </DScreenButton>
                    <DScreenButton color={"info"}>
                        <IconDatabase size={12}/>
                        Database
                    </DScreenButton>
                </div>
                <div style={{display: "flex", gap: ".5rem", overflow: "hidden"}}>
                    <DScreenButton color={"primary"}>
                        <IconSettings size={12}/>
                        Settings
                    </DScreenButton>
                </div>
            </DSplitPane>
            <DSplitPane maw={"fit-content"}>
                <div style={{padding: ".5rem"}}>
                    <DScreenButton onClick={openAll}>
                        Open All
                    </DScreenButton>
                    <DScreenButton onClick={closeAll}>
                        Close All
                    </DScreenButton>
                    {[1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1].map((_, index) => {
                        return <DFolder controls={controls} name={"Google Cloud Flows"} defaultOpen>
                            <DFolder controls={controls} name={"Google Cloud Flows"}>
                                <DFolder.Item icon={<IconBrandAdobe size={12}/>}
                                              name={"Google Cloud Flows"}/>
                                <DFolder.Item active={index === 1} name={"Google Cloud Flows"}/>
                            </DFolder>
                        </DFolder>
                    })}
                </div>
            </DSplitPane>
            <DSplitPane>
                <ZoomPanPinchExample/>
            </DSplitPane>
        </DSplitScreen>
    </DFullScreen>

}


export default meta