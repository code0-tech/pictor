import React from "react";
import {DFlowFolderControls} from "./DFlowFolder";

export const useDFlowFolderControls = (): [DFlowFolderControls, () => void, () => void] => {

    const [folderControlState, setFolderControlState] = React.useState<DFlowFolderControls>(undefined)
    const openAll = () => setFolderControlState(prevState => prevState === -1 ? -3 : -1)
    const closeAll = () => setFolderControlState(prevState => prevState === -2 ? -4 : -2)

    return [folderControlState, openAll, closeAll]
}