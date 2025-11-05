import {Meta} from "@storybook/react";
import {ScrollArea, ScrollAreaScrollbar, ScrollAreaThumb, ScrollAreaViewport} from "./ScrollArea";
import React from "react";
import {Button} from "../button/Button";
import {Flex} from "../flex/Flex";

export default {
    title: "Scroll Area",
} as Meta

export const HorizontalScrollArea = () => {
    return <ScrollArea w={"200px"} type={"always"}>
        <ScrollAreaViewport>
            <Flex>
                {Array.from({length: 10}, (_, i) => {
                    return <Button>
                        Test
                    </Button>
                })}
            </Flex>
        </ScrollAreaViewport>
        <ScrollAreaScrollbar orientation={"horizontal"}>
            <ScrollAreaThumb/>
        </ScrollAreaScrollbar>
    </ScrollArea>
}