"use client";

import React from "react";
import {MenuLabel} from "../menu/Menu";
import {
    IconArrowsShuffle,
    IconBulb,
    IconCircleDot,
    IconCirclesRelation,
    IconCornerDownLeft,
    IconFileFunctionFilled
} from "@tabler/icons-react";
import {Text} from "../text/Text";
import {Flex} from "../flex/Flex";
import {Tooltip, TooltipContent, TooltipPortal, TooltipTrigger} from "../tooltip/Tooltip";

export const DFlowSuggestionMenuFooter: React.FC = () => {
    return <MenuLabel>
        <Flex w={"100%"} justify={"space-between"}>
            <Flex align={"center"} style={{gap: ".35rem"}}>Press <IconCornerDownLeft size={12}/> to insert</Flex>
            <Flex ml={1} align={"center"} justify={"center"}>
                <Tooltip>
                    <TooltipTrigger asChild>
                        <IconBulb size={12}/>
                    </TooltipTrigger>
                    <TooltipPortal>
                        <TooltipContent align={"center"} side={"right"} sideOffset={8}>
                            <Flex pt={0.35} pb={0.35} style={{flexDirection: "column", gap: ".35rem"}}>
                                <Flex align={"center"} style={{gap: ".35rem"}}>
                                    <IconFileFunctionFilled color={"#70ffb2"} size={16}/>
                                    <Text hierarchy={"tertiary"} size={"xs"}>FUNCTION</Text>
                                </Flex>
                                <Flex align={"center"} style={{gap: ".35rem"}}>
                                    <IconArrowsShuffle color={"#29BF12"} size={16}/>
                                    <Text hierarchy={"tertiary"} size={"xs"}>FUNCTION COMBINATION</Text>
                                </Flex>
                                <Flex align={"center"} style={{gap: ".35rem"}}>
                                    <IconCirclesRelation color={"#FFBE0B"} size={16}/>
                                    <Text hierarchy={"tertiary"} size={"xs"}>VARIABLE</Text>
                                </Flex>
                                <Flex align={"center"} style={{gap: ".35rem"}}>
                                    <IconCircleDot color={"#D90429"} size={16}/>
                                    <Text hierarchy={"tertiary"} size={"xs"}>VALUE</Text>
                                </Flex>
                            </Flex>

                        </TooltipContent>
                    </TooltipPortal>
                </Tooltip>
            </Flex>
        </Flex>
    </MenuLabel>
}