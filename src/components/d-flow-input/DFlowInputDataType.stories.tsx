import {InputDescription, InputLabel} from "../form";
import {Card} from "../card/Card";
import {Flex} from "../flex/Flex";
import {Text} from "../text/Text";
import {Badge} from "../badge/Badge";
import CardSection from "../card/CardSection";
import React from "react";
import {hashToColor} from "../d-flow/DFlow.util";
import {IconEdit, IconEyeEdit, IconFilterCheck, IconJson} from "@tabler/icons-react";
import {Button} from "../button/Button";
import {Dialog, DialogContent, DialogOverlay, DialogPortal} from "../dialog/Dialog";
import {DResizableHandle, DResizablePanel, DResizablePanelGroup} from "../d-resizable/DResizable";
import {DLayout} from "../d-layout/DLayout";
import {Spacing} from "../spacing/Spacing";
import {Breadcrumb} from "../breadcrumb/Breadcrumb";
import "./DFlowInputDataType.scss"
import {ButtonGroup} from "../button-group/ButtonGroup";
import {SegmentedControl, SegmentedControlItem} from "../segmented-control/SegmentedControl";
import {Editor} from "@monaco-editor/react";
import prettier from "prettier/standalone";
import parserBabel from "prettier/plugins/babel";
import parserEstree from "prettier/plugins/estree";
import {Concept} from "../editor/EditorInput.stories";

export const Concept1 = () => {

    const [editOpen, setEditOpen] = React.useState(false)
    const [jsonOpen, setJsonOpen] = React.useState(true)
    const [formatted, setFormatted] = React.useState("")

    React.useEffect(() => {
        (async () => {
            const pretty = await prettier.format(
                JSON.stringify({
                    body: {
                        users: [{
                            username: "Text",
                            email: "Text",
                            password: "Text"
                        }, {
                            username: "Text",
                            email: "Text",
                            password: "Text"
                        }]
                    },
                    headers: {
                        "Access-Control-Request-Method": "Text",
                        "Authorization": "Text",
                        "Cache-Control": "Text"
                    }
                }),
                {parser: "json", plugins: [parserBabel, parserEstree], printWidth: 1}
            );
            setFormatted(pretty);
        })();
    }, [])

    return <div>
        <Dialog open={editOpen} onOpenChange={(open) => setEditOpen(open)}>
            <DialogPortal>
                <DialogOverlay/>
                <DialogContent onPointerDownOutside={(e) => {
                    const target = e.target as HTMLElement;

                    if (target.closest("[data-slot=resizable-handle]") || target.closest("[data-slot=resizable-panel]")) {
                        e.preventDefault();
                    }
                }} w={"75%"} h={"75%"} style={{
                    padding: "2px",
                    boxShadow: "inset 0 1px 1px 0 rgba(255, 255, 255, 0.15)",
                    border: "none"
                }}>
                    <DLayout layoutGap={0} showLayoutSplitter={false}
                             topContent={<Flex style={{gap: ".7rem"}} p={0.7} justify={"space-between"}
                                               align={"center"}>
                                 <Flex style={{gap: ".35rem"}} align={"center"}>
                                     <Text>Rest Adapter Input Type</Text>
                                     <Badge color={"secondary"} border>2 rules</Badge>
                                 </Flex>
                                 <SegmentedControl type={"single"} color={"primary"} defaultValue={"visual"}>
                                     <SegmentedControlItem value={"json"}
                                                           style={{boxShadow: "inset 0 1px 1px 0 rgba(255, 255, 255, 0.15)"}}>
                                         <IconJson size={13}/>
                                     </SegmentedControlItem>
                                     <SegmentedControlItem value={"visual"}
                                                           style={{boxShadow: "inset 0 1px 1px 0 rgba(255, 255, 255, 0.15)"}}>
                                         <IconEyeEdit size={13}/>
                                     </SegmentedControlItem>
                                 </SegmentedControl>
                             </Flex>}>
                        <DResizablePanelGroup style={{borderRadius: "1rem"}}>
                            <DResizablePanel p={1}>
                                <Breadcrumb style={{gap: "0.35rem", textWrap: "nowrap"}}>
                                    <Text hierarchy={"tertiary"}>body</Text>
                                    <Text>users</Text>
                                </Breadcrumb>
                                <Spacing spacing={"md"}/>
                                <ExampleRule1/>
                                <Spacing spacing={"md"}/>
                                <ExampleRule2/>
                            </DResizablePanel>
                            <DResizableHandle/>
                            <DResizablePanel>
                                <Text>This is a resizable panel content area.</Text>
                            </DResizablePanel>
                        </DResizablePanelGroup>
                    </DLayout>
                </DialogContent>
            </DialogPortal>
        </Dialog>
        <Dialog open={jsonOpen} onOpenChange={(open) => setJsonOpen(open)}>
            <DialogPortal>
                <DialogOverlay/>
                <DialogContent onPointerDownOutside={(e) => {
                    const target = e.target as HTMLElement;

                    if (target.closest("[data-slot=resizable-handle]") || target.closest("[data-slot=resizable-panel]")) {
                        e.preventDefault();
                    }
                }} w={"75%"} h={"75%"} style={{
                    padding: "2px",
                    boxShadow: "inset 0 1px 1px 0 rgba(255, 255, 255, 0.15)",
                    border: "none"
                }}>
                    <DLayout layoutGap={0} showLayoutSplitter={false}
                             topContent={<Flex style={{gap: ".35rem"}} align={"center"} p={0.7}>
                                 <Text>Rest Adapter Input Type</Text>
                                 <Badge color={"secondary"} border>2 rules</Badge>
                             </Flex>}>
                        <DResizablePanelGroup style={{borderRadius: "1rem"}}>
                            <DResizablePanel p={1}>
                                <ExampleRule1/>
                                <Spacing spacing={"md"}/>
                                <ExampleRule2/>
                            </DResizablePanel>
                            <DResizableHandle/>
                            <DResizablePanel p={1}>
                                <Concept/>
                            </DResizablePanel>
                        </DResizablePanelGroup>
                    </DLayout>
                </DialogContent>
            </DialogPortal>
        </Dialog>
        <InputLabel>Input type</InputLabel>
        <InputDescription>
            Here you can define the expected data structure that incoming requests must match.
        </InputDescription>
        <Card color={"secondary"} paddingSize={"xs"}
              style={{boxShadow: "inset 0 1px 1px 0 rgba(255, 255, 255, 0.15)", border: "none"}}>
            <Flex style={{gap: ".7rem"}} align={"center"} justify={"space-between"}>
                <Flex style={{gap: ".35rem"}} align={"center"}>
                    <Text>Rest Adapter Input Type</Text>
                    <Badge color={"secondary"} border>2 rules</Badge>
                </Flex>
                <Flex style={{gap: ".35rem"}} align={"center"}>
                    <ButtonGroup color={"primary"}>
                        <Button onClick={() => setJsonOpen(true)}
                                paddingSize={"xxs"}
                                variant={"filled"}
                                color={"secondary"}
                                style={{boxShadow: "inset 0 1px 1px 0 rgba(255, 255, 255, 0.15)", border: "none"}}>
                            <IconFilterCheck size={13}/>
                        </Button>
                        <Button onClick={() => setEditOpen(true)}
                                paddingSize={"xxs"}
                                variant={"filled"}
                                color={"secondary"}
                                style={{boxShadow: "inset 0 1px 1px 0 rgba(255, 255, 255, 0.15)", border: "none"}}>
                            <IconEdit size={13}/>
                        </Button>
                    </ButtonGroup>
                </Flex>

            </Flex>
            <Card paddingSize={"xs"} mt={0.7} mb={-0.7} mx={-0.7} style={{borderWidth: "2px"}}>
                <ExampleRules/>
            </Card>
        </Card>
    </div>
}

const ExampleRule1 = () => {
    return <>
        <Flex align={"center"} style={{gap: ".35rem", textWrap: "nowrap"}}>
            <Badge border color={"secondary"} style={{verticalAlign: "middle"}}>
                <Text style={{color: "inherit"}}>body</Text>
            </Badge>
            <Text size={"md"}>is a field</Text>
        </Flex>
        <ul>
            <li>
                <div>
                    <Flex align={"center"} style={{gap: ".35rem"}}>
                        <Badge border color={"secondary"} style={{verticalAlign: "middle"}}>
                            <Text size={"xs"} style={{color: "inherit"}}>users</Text>
                        </Badge>
                        <Text>is a field inside</Text>
                    </Flex>
                    <ul>
                        <li>
                            <div>
                                <Flex align={"center"} style={{gap: ".35rem"}}>
                                    <Text>Inside</Text>
                                    <Badge border color={"secondary"} style={{verticalAlign: "middle"}}>
                                        <Text size={"xs"} style={{color: "inherit"}}>users</Text>
                                    </Badge>
                                    <Text>, each entity has</Text>
                                </Flex>
                                <ul>
                                    <li>
                                        <div>
                                            <Flex align={"center"} style={{gap: ".35rem"}}>
                                                <Badge border color={"secondary"} style={{verticalAlign: "middle"}}>
                                                    <Text size={"xs"} style={{color: "inherit"}}>username</Text>
                                                </Badge>
                                                <Text>which is a field of type</Text>
                                                <Badge border color={hashToColor("Text")}
                                                       style={{verticalAlign: "middle"}}>
                                                    <Text size={"xs"} style={{color: "inherit"}}>Text</Text>
                                                </Badge>
                                            </Flex>
                                        </div>
                                    </li>
                                    <li>
                                        <div>
                                            <Flex align={"center"} style={{gap: ".35rem"}}>
                                                <Badge border color={"secondary"} style={{verticalAlign: "middle"}}>
                                                    <Text size={"xs"} style={{color: "inherit"}}>email</Text>
                                                </Badge>
                                                <Text>which is a field of type</Text>
                                                <Badge border color={hashToColor("Text")}
                                                       style={{verticalAlign: "middle"}}>
                                                    <Text size={"xs"} style={{color: "inherit"}}>Text</Text>
                                                </Badge>
                                            </Flex>
                                        </div>
                                    </li>
                                    <li>
                                        <div>
                                            <Flex align={"center"} style={{gap: ".35rem"}}>
                                                <Badge border color={"secondary"} style={{verticalAlign: "middle"}}>
                                                    <Text size={"xs"} style={{color: "inherit"}}>password</Text>
                                                </Badge>
                                                <Text>which is a field of type</Text>
                                                <Badge border color={hashToColor("Text")}
                                                       style={{verticalAlign: "middle"}}>
                                                    <Text size={"xs"} style={{color: "inherit"}}>Text</Text>
                                                </Badge>
                                            </Flex>
                                        </div>
                                    </li>
                                    <li>
                                        <div>
                                            <Flex align={"center"} style={{gap: ".35rem"}}>
                                                <Badge border color={"secondary"} style={{verticalAlign: "middle"}}>
                                                    <Text size={"xs"} style={{color: "inherit"}}>lastLogin</Text>
                                                </Badge>
                                                <Text>which is a field of type</Text>
                                                <Badge border color={hashToColor("Number233232")}
                                                       style={{verticalAlign: "middle"}}>
                                                    <Text size={"xs"} style={{color: "inherit"}}>Number</Text>
                                                </Badge>
                                            </Flex>
                                        </div>
                                    </li>
                                </ul>
                            </div>
                        </li>
                    </ul>
                </div>
            </li>
        </ul>
    </>
}

const ExampleRule2 = () => {
    return <>
        <Flex align={"center"} style={{gap: ".35rem", textWrap: "nowrap"}}>
            <Badge border color={"secondary"} style={{verticalAlign: "middle"}}>
                <Text style={{color: "inherit"}}>headers</Text>
            </Badge>
            <Text size={"md"}>is a field</Text>
        </Flex>
        <ul>

            <li>
                <Flex align={"center"} style={{gap: ".35rem"}}>
                    <Badge border color={"secondary"} style={{verticalAlign: "middle"}}>
                        <Text size={"xs"} style={{color: "inherit"}}>Access-Control-Request-Method</Text>
                    </Badge>
                    <Text>is a field inside of type </Text>
                    <Badge border color={hashToColor("Text")} style={{verticalAlign: "middle"}}>
                        <Text size={"xs"} style={{color: "inherit"}}>Text</Text>
                    </Badge>
                </Flex>
            </li>
            <li>
                <Flex align={"center"} style={{gap: ".35rem"}}>
                    <Badge border color={"secondary"} style={{verticalAlign: "middle"}}>
                        <Text size={"xs"} style={{color: "inherit"}}>Authorization</Text>
                    </Badge>
                    <Text>is a field inside of type </Text>
                    <Badge border color={hashToColor("Text")} style={{verticalAlign: "middle"}}>
                        <Text size={"xs"} style={{color: "inherit"}}>Text</Text>
                    </Badge>
                </Flex>
            </li>
            <li>
                <Flex align={"center"} style={{gap: ".35rem"}}>
                    <Badge border color={"secondary"} style={{verticalAlign: "middle"}}>
                        <Text size={"xs"} style={{color: "inherit"}}>Cache-Control</Text>
                    </Badge>
                    <Text>is a field inside of type </Text>
                    <Badge border color={hashToColor("Text")} style={{verticalAlign: "middle"}}>
                        <Text size={"xs"} style={{color: "inherit"}}>Text</Text>
                    </Badge>
                </Flex>
            </li>
        </ul>
    </>
}

const ExampleRules = () => {
    return <>
        <CardSection border>
            <ExampleRule1/>
        </CardSection>
        <CardSection border>
            <ExampleRule2/>
        </CardSection>
    </>
}

export default {
    title: 'DFlowInputDataType',
    component: Concept1
}