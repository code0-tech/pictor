import {InputDescription, InputLabel} from "../form";
import {Card} from "../card/Card";
import {Flex} from "../flex/Flex";
import {Text} from "../text/Text";
import {Badge} from "../badge/Badge";
import CardSection from "../card/CardSection";
import React from "react";
import {hashToColor} from "../d-flow/DFlow.util";
import {IconEdit} from "@tabler/icons-react";
import {Button} from "../button/Button";
import {Dialog, DialogContent, DialogOverlay, DialogPortal} from "../dialog/Dialog";
import {DResizableHandle, DResizablePanel, DResizablePanelGroup} from "../d-resizable/DResizable";
import {DLayout} from "../d-layout/DLayout";
import {Spacing} from "../spacing/Spacing";
import {Breadcrumb} from "../breadcrumb/Breadcrumb";

export const Concept1 = () => {

    const [open, setOpen] = React.useState(false)

    return <div>
        <Dialog open={open} onOpenChange={(open) => setOpen(open)}>
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
                                <Breadcrumb style={{gap: "0.35rem", textWrap: "nowrap"}}>
                                    <Text hierarchy={"tertiary"}>Rest Adapter Input Type</Text>
                                    <Text hierarchy={"tertiary"}>InputBody</Text>
                                    <Text hierarchy={"tertiary"}>List of User</Text>
                                    <Text>User</Text>
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
        <InputLabel>Input type</InputLabel>
        <InputDescription>Here you can define the expected pattern which the trigger needs to follow on
            trigger.</InputDescription>
        <Card color={"secondary"} paddingSize={"xs"}
              style={{boxShadow: "inset 0 1px 1px 0 rgba(255, 255, 255, 0.15)", border: "none"}}>
            <Flex style={{gap: ".7rem"}} align={"center"} justify={"space-between"}>
                <Flex style={{gap: ".35rem"}} align={"center"}>
                    <Text>Rest Adapter Input Type</Text>
                    <Badge color={"secondary"} border>2 rules</Badge>
                </Flex>
                <Flex style={{gap: ".35rem"}} align={"center"}>
                    <Button onClick={() => setOpen(true)} paddingSize={"xxs"} variant={"filled"} color={"primary"}
                            style={{boxShadow: "inset 0 1px 1px 0 rgba(255, 255, 255, 0.15)", border: "none"}}><IconEdit
                        size={13}/> </Button>
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
            <Text size={"md"}>Contains key</Text>
            <Badge border color={"secondary"} style={{verticalAlign: "middle"}}>
                <Text style={{color: "inherit"}}>body</Text>
            </Badge>
            <Text size={"md"}>of type</Text>
            <Badge border color={hashToColor("InputBody")} style={{verticalAlign: "middle"}}>
                <Text style={{color: "inherit"}}>InputBody</Text>
            </Badge>
        </Flex>
        <ul style={{
            listStyle: "none",
            margin: 0,
            padding: 0,
            position: "relative",
            textWrap: "nowrap"
        }}>
            {/* Vertikale Linie */}
            <div
                style={{
                    position: "absolute",
                    top: 0,
                    left: 0,
                    width: 2,
                    height: "100%",
                    backgroundColor: "white",
                    borderRadius: 999,
                }}
            />

            <li
                style={{
                    position: "relative",
                    margin: 0,
                    paddingLeft: 28,
                    minHeight: 28,
                    display: "flex",
                    alignItems: "end",
                }}
            >
                {/* Verbindung */}
                <div
                    style={{
                        position: "absolute",
                        left: 0,
                        top: "50%",
                        width: 20,
                        height: 20,
                        transform: "translateY(-50%)",
                        borderLeft: "2px solid white",
                        borderBottom: "2px solid white",
                        borderRadius: "0 0 0 0.5rem",
                        boxSizing: "border-box",
                    }}
                />
                <Flex align={"center"} style={{gap: ".35rem"}}>
                    <Text>Contains key</Text>
                    <Badge border color={"secondary"} style={{verticalAlign: "middle"}}>
                        <Text size={"xs"} style={{color: "inherit"}}>users</Text>
                    </Badge>
                    <Text>of type</Text>
                    <Badge border color={hashToColor("List of User")} style={{verticalAlign: "middle"}}>
                        <Text size={"xs"} style={{color: "inherit"}}>List of User</Text>
                    </Badge>
                </Flex>
            </li>
        </ul>
    </>
}

const ExampleRule2 = () => {
    return <>
        <Flex align={"center"} style={{gap: ".35rem", textWrap: "nowrap"}}>
            <Text size={"md"}>Contains key</Text>
            <Badge border color={"secondary"} style={{verticalAlign: "middle"}}>
                <Text style={{color: "inherit"}}>headers</Text>
            </Badge>
            <Text size={"md"}>of type</Text>
            <Badge border color={hashToColor("InputHeaders")} style={{verticalAlign: "middle"}}>
                <Text style={{color: "inherit"}}>InputHeaders</Text>
            </Badge>
        </Flex>
        <ul
            style={{
                listStyle: "none",
                margin: 0,
                padding: 0,
                position: "relative",
                textWrap: "nowrap"
            }}
        >
            {/* Vertikale Linie */}
            <div
                style={{
                    position: "absolute",
                    top: 0,
                    left: 0,
                    width: 2,
                    height: "100%",
                    backgroundColor: "white",
                    borderRadius: 999,
                }}
            />

            <li
                style={{
                    position: "relative",
                    margin: 0,
                    paddingLeft: 28,
                    minHeight: 28,
                    display: "flex",
                    alignItems: "end",
                }}
            >
                {/* Verbindung */}
                <div
                    style={{
                        position: "absolute",
                        left: 0,
                        top: "50%",
                        width: 20,
                        height: 20,
                        transform: "translateY(-50%)",
                        borderLeft: "2px solid white",
                        borderBottom: "2px solid white",
                        borderRadius: "0 0 0 0.5rem",
                        boxSizing: "border-box",
                    }}
                />
                <Flex align={"center"} style={{gap: ".35rem"}}>
                    <Text>Contains key</Text>
                    <Badge border color={"secondary"} style={{verticalAlign: "middle"}}>
                        <Text size={"xs"} style={{color: "inherit"}}>Access-Control-Request-Method</Text>
                    </Badge>
                    <Text>of type</Text>
                    <Badge border color={hashToColor("Text")} style={{verticalAlign: "middle"}}>
                        <Text size={"xs"} style={{color: "inherit"}}>Text</Text>
                    </Badge>
                </Flex>
            </li>
            <li
                style={{
                    position: "relative",
                    margin: 0,
                    paddingLeft: 28,
                    minHeight: 28,
                    display: "flex",
                    alignItems: "end",
                }}
            >
                {/* Verbindung */}
                <div
                    style={{
                        position: "absolute",
                        left: 0,
                        top: "50%",
                        width: 20,
                        height: 20,
                        transform: "translateY(-50%)",
                        borderLeft: "2px solid white",
                        borderBottom: "2px solid white",
                        borderRadius: "0 0 0 0.5rem",
                        boxSizing: "border-box",
                    }}
                />
                <Flex align={"center"} style={{gap: ".35rem"}}>
                    <Text>Contains key</Text>
                    <Badge border color={"secondary"} style={{verticalAlign: "middle"}}>
                        <Text size={"xs"} style={{color: "inherit"}}>Authorization</Text>
                    </Badge>
                    <Text>of type</Text>
                    <Badge border color={hashToColor("Text")} style={{verticalAlign: "middle"}}>
                        <Text size={"xs"} style={{color: "inherit"}}>Text</Text>
                    </Badge>
                </Flex>
            </li>
            <li
                style={{
                    position: "relative",
                    margin: 0,
                    paddingLeft: 28,
                    minHeight: 28,
                    display: "flex",
                    alignItems: "end",
                }}
            >
                {/* Verbindung */}
                <div
                    style={{
                        position: "absolute",
                        left: 0,
                        top: "50%",
                        width: 20,
                        height: 20,
                        transform: "translateY(-50%)",
                        borderLeft: "2px solid white",
                        borderBottom: "2px solid white",
                        borderRadius: "0 0 0 0.5rem",
                        boxSizing: "border-box",
                    }}
                />
                <Flex align={"center"} style={{gap: ".35rem"}}>
                    <Text>Contains key</Text>
                    <Badge border color={"secondary"} style={{verticalAlign: "middle"}}>
                        <Text size={"xs"} style={{color: "inherit"}}>Cache-Control</Text>
                    </Badge>
                    <Text>of type</Text>
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