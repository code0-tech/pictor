import {Meta} from "@storybook/react";
import {FileTabs, FileTabsContent, FileTabsList, FileTabsTrigger} from "./FileTabs";
import React from "react";
import {IconFileLambdaFilled} from "@tabler/icons-react";
import Flex from "../flex/Flex";

export default {
    title: "File Tabs",
} as Meta



export const ExampleFileTabs = () => {
    return <FileTabs defaultValue={"1"}>
        <FileTabsList>
            {[1,2,3,4,5].map((item, index) => {
                return <FileTabsTrigger value={String(index)}>
                    <Flex style={{gap: "0.35rem"}} align={"center"}>
                        <IconFileLambdaFilled color={"#70ffb2"} size={16}/>
                        std::math::add
                    </Flex>
                </FileTabsTrigger>
            })}
        </FileTabsList>
        {[1,2,3,4,5].map((item, index) => {
            return <FileTabsContent value={String(index)}>
                Flow Content {index}
            </FileTabsContent>
        })}
    </FileTabs>
}