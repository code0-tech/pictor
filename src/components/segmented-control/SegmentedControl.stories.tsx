import {Meta} from "@storybook/react-vite";
import {SegmentedControl, SegmentedControlItem} from "./SegmentedControl";
import React from "react";
import {Text} from "../text/Text";

export default {
    title: "Segmented Control",
} as Meta

export const SegmentedControlExample = () => {
    return <SegmentedControl defaultValue={"codezero"} type={"single"}>
        <SegmentedControlItem value={"codezero"}>
            <Text>CodeZero</Text>
        </SegmentedControlItem>
        <SegmentedControlItem value={"github"}>
            <Text>Github</Text>
        </SegmentedControlItem>
        <SegmentedControlItem value={"apple"}>
            <Text>Apple</Text>
        </SegmentedControlItem>
    </SegmentedControl>
}
