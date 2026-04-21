import {Meta} from "@storybook/react-vite"
import React from "react"
import {
    CommandDialog,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
    CommandSeparator,
    CommandShortcut
} from "./Command"
import {Tab, TabList, TabTrigger} from "../tab/Tab";
import {Button} from "../button/Button";
import {
    IconBrandDiscord,
    IconBrandTeams,
    IconMath,
    IconNumber, IconSearch,
    IconSelectAll,
    IconSwitch,
    IconTextGrammar
} from "@tabler/icons-react";
import {Text} from "../text/Text";
import {hashToColor} from "../../utils";
import {ScrollArea, ScrollAreaScrollbar, ScrollAreaThumb, ScrollAreaViewport} from "../scroll-area/ScrollArea";
import {Layout} from "../layout/Layout";
import {Card} from "../card/Card";

export default {
    title: "Command",
} as Meta


export const ExampleCommand = () => {

    return (
        <CommandDialog p={"0"} open={true} contentProps={{h: "75vh"}}>
            <Layout p={0.7} layoutGap={0} showLayoutSplitter={false} bottomContent={<Text>sd</Text>} topContent={<div style={{paddingBottom: "0.35rem"}}><CommandInput left={<IconSearch size={13}/>} placeholder="Type a command or search..." clearable/></div>}>
                <Card mx={-0.5} h={"100%"} paddingSize={"xxs"}>
                    <Layout style={{overflow: "hidden"}} leftContent={<ScrollArea p={0.7} h={"100%"} type={"always"} w={"fit-content"} miw={"25%"}>
                        <ScrollAreaViewport h={"100%"} w={"100%"}>
                            <Tab orientation={"vertical"} defaultValue={"all"}>
                                <TabList>
                                    <TabTrigger value={"all"} asChild>
                                        <Button w={"100%"} justify={"start"} paddingSize={"xxs"} variant={"none"}>
                                            <IconSelectAll color={hashToColor("all")} size={13}/>
                                            <Text size={"sm"}>All</Text>
                                        </Button>
                                    </TabTrigger>
                                    <TabTrigger value={"control"} asChild>
                                        <Button w={"100%"} justify={"start"} paddingSize={"xxs"} variant={"none"}>
                                            <IconMath color={hashToColor("control")} size={13}/>
                                            <Text size={"sm"}>Control</Text>
                                        </Button>
                                    </TabTrigger>
                                    <TabTrigger value={"number"} asChild>
                                        <Button w={"100%"} justify={"start"} paddingSize={"xxs"} variant={"none"}>
                                            <IconNumber color={hashToColor("number")} size={13}/>
                                            <Text size={"sm"}>Number</Text>
                                        </Button>
                                    </TabTrigger>
                                    <TabTrigger value={"text"} asChild>
                                        <Button w={"100%"} justify={"start"} paddingSize={"xxs"} variant={"none"}>
                                            <IconTextGrammar color={hashToColor("text")} size={13}/>
                                            <Text size={"sm"}>Text</Text>
                                        </Button>
                                    </TabTrigger>
                                    <TabTrigger value={"bool"} asChild>
                                        <Button w={"100%"} justify={"start"} paddingSize={"xxs"} variant={"none"}>
                                            <IconSwitch color={hashToColor("bool")} size={13}/>
                                            <Text size={"sm"}>Boolean</Text>
                                        </Button>
                                    </TabTrigger>
                                    <TabTrigger value={"teams"} asChild>
                                        <Button w={"100%"} justify={"start"} paddingSize={"xxs"} variant={"none"}>
                                            <IconBrandTeams color={hashToColor("teams")} size={16}/>
                                            <Text size={"sm"}>Teams</Text>
                                        </Button>
                                    </TabTrigger>
                                    <TabTrigger value={"discord"} asChild>
                                        <Button w={"100%"} justify={"start"} paddingSize={"xxs"} variant={"none"}>
                                            <IconBrandDiscord color={hashToColor("discord")} size={16}/>
                                            <Text size={"sm"}>Discord</Text>
                                        </Button>
                                    </TabTrigger>
                                </TabList>
                            </Tab>
                        </ScrollAreaViewport>
                        <ScrollAreaScrollbar orientation={"vertical"}>
                            <ScrollAreaThumb/>
                        </ScrollAreaScrollbar>
                    </ScrollArea>}>
                        <ScrollArea h={"100%"} w={"100%"} type={"always"}>
                            <ScrollAreaViewport>
                                <CommandList w={"100%"}>
                                    <CommandEmpty>No results found.</CommandEmpty>
                                    <CommandGroup heading="Suggestions">
                                        <CommandItem>
                                            <span>Calendar</span>
                                        </CommandItem>
                                        <CommandItem>
                                            <span>Search Emoji</span>
                                        </CommandItem>
                                        <CommandItem disabled>
                                            <span>Calculator</span>
                                        </CommandItem>
                                    </CommandGroup>
                                    <CommandSeparator/>
                                    <CommandGroup heading="Settings">
                                        <CommandItem value={"profile3"}>
                                            <span>Profile</span>
                                            <CommandShortcut>⌘P</CommandShortcut>
                                        </CommandItem>
                                        <CommandItem>
                                            <span>Billing</span>
                                            <CommandShortcut>⌘B</CommandShortcut>
                                        </CommandItem>
                                        <CommandItem>
                                            <span>Settings</span>
                                            <CommandShortcut>⌘S</CommandShortcut>
                                        </CommandItem>
                                    </CommandGroup>
                                    <CommandGroup heading="Settings2">
                                        <CommandItem>
                                            <span>Profile</span>
                                            <CommandShortcut>⌘P</CommandShortcut>
                                        </CommandItem>
                                        <CommandItem>
                                            <span>Billing</span>
                                            <CommandShortcut>⌘B</CommandShortcut>
                                        </CommandItem>
                                        <CommandItem>
                                            <span>Settings</span>
                                            <CommandShortcut>⌘S</CommandShortcut>
                                        </CommandItem>
                                    </CommandGroup>
                                    <CommandGroup heading="Settings3">
                                        <CommandItem>
                                            <span>Profile</span>
                                            <CommandShortcut>⌘P</CommandShortcut>
                                        </CommandItem>
                                        <CommandItem>
                                            <span>Billing</span>
                                            <CommandShortcut>⌘B</CommandShortcut>
                                        </CommandItem>
                                        <CommandItem>
                                            <span>Settings</span>
                                            <CommandShortcut>⌘S</CommandShortcut>
                                        </CommandItem>
                                    </CommandGroup>
                                </CommandList>
                            </ScrollAreaViewport>
                            <ScrollAreaScrollbar orientation={"vertical"}>
                                <ScrollAreaThumb/>
                            </ScrollAreaScrollbar>
                        </ScrollArea>
                    </Layout>
                </Card>
            </Layout>
        </CommandDialog>
    )

}