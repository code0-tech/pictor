import {Meta} from "@storybook/react";
import {SegmentedControl, SegmentedControlItem} from "./SegmentedControl";
import React from "react";

export default {
    title: "Segmented Control",
} as Meta

export const SegmentedControlExample = () => {
    return <SegmentedControl  type={"single"}>
        <SegmentedControlItem value={"codezero"}>
            CodeZero
        </SegmentedControlItem>
        <SegmentedControlItem value={"github"}>
            Github
        </SegmentedControlItem>
        <SegmentedControlItem value={"apple"}>
            Apple
        </SegmentedControlItem>
    </SegmentedControl>
}
