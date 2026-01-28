import React from "react";
import {useService} from "../../utils";
import {DFlowReactiveService} from "../d-flow";
import {Flex} from "../flex/Flex";
import {DFlowTypeReactiveService} from "../d-flow-type";
import {DFlowSuggestion} from "../d-flow-suggestion";
import {useValueSuggestions} from "../d-flow-suggestion/DFlowValueSuggestions.hook";
import {useDataTypeSuggestions} from "../d-flow-suggestion/DFlowDataTypeSuggestions.hook";
import {toInputSuggestions} from "../d-flow-suggestion/DFlowSuggestionMenu.util";
import type {Flow, NodeParameterValue, Scalars} from "@code0-tech/sagittarius-graphql-types";
import {DFlowInputDefault} from "../d-flow-input/DFlowInputDefault";
import {Text} from "../text/Text";
import {Badge} from "../badge/Badge";
import {Button} from "../button/Button";
import {IconEdit, IconLiveView} from "@tabler/icons-react";
import {InputDescription, InputLabel} from "../form";
import {Card} from "../card/Card";
import CardSection from "../card/CardSection";
import {ButtonGroup} from "../button-group/ButtonGroup";

export interface DFlowTabTriggerProps {
    instance: Flow
}

export const DFlowTabTrigger: React.FC<DFlowTabTriggerProps> = (props) => {

    const {instance} = props

    const flowTypeService = useService(DFlowTypeReactiveService)
    const flowService = useService(DFlowReactiveService)
    const [, startTransition] = React.useTransition()

    const definition = flowTypeService.getById(instance.type?.id!!)

    const suggestionsById: Record<string, DFlowSuggestion[]> = {}
    definition?.flowTypeSettings?.forEach(settingDefinition => {
        const dataTypeIdentifier = {dataType: settingDefinition.dataType}
        const valueSuggestions = useValueSuggestions(dataTypeIdentifier)
        const dataTypeSuggestions = useDataTypeSuggestions(dataTypeIdentifier)
        suggestionsById[settingDefinition.identifier!!] = [
            ...valueSuggestions,
            ...dataTypeSuggestions,
        ].sort()
    })


    return <Flex style={{gap: ".7rem", flexDirection: "column"}}>
        <div>
            <InputLabel>Input type</InputLabel>
            <InputDescription>Here you can define the expected pattern which the trigger needs to follow on
                trigger.</InputDescription>
            <Card color={"secondary"} paddingSize={"xs"}>
                <Flex style={{gap: ".7rem"}} align={"center"} justify={"space-between"}>
                    <Text>Rest Adapter Input Type</Text>
                    <Badge color={"secondary"} border>2 rules</Badge>
                </Flex>
                <Card paddingSize={"xs"} mt={0.7} mb={-0.7} mx={-0.7} style={{borderWidth: "2px"}}>
                    <CardSection border>
                        <Flex style={{gap: ".7rem"}} justify={"space-between"}>
                            <Flex align={"center"} style={{gap: ".35rem"}}>
                                <Text size={"md"}>Contains key</Text>
                                <Badge border color={"info"} style={{verticalAlign: "middle"}}>
                                    <Text style={{color: "inherit"}}>body</Text>
                                </Badge>
                                <Text size={"md"}>of datatype</Text>
                                <Badge border color={"info"} style={{verticalAlign: "middle"}}>
                                    <Text style={{color: "inherit"}}>Object</Text>
                                </Badge>
                            </Flex>
                            <ButtonGroup>
                                <Button paddingSize={"xxs"} variant={"filled"}><IconLiveView size={13}/> </Button>
                                <Button paddingSize={"xxs"} variant={"filled"}><IconEdit size={13}/> </Button>
                            </ButtonGroup>

                        </Flex>
                    </CardSection>
                    <CardSection border>
                        <Flex style={{gap: ".7rem"}} justify={"space-between"}>
                            <Flex align={"center"} style={{gap: ".35rem"}}>
                                <Text size={"md"}>Contains key</Text>
                                <Badge border color={"info"}>
                                    <Text style={{color: "inherit"}}>headers</Text>
                                </Badge>
                                <Text size={"md"}>of datatype</Text>
                                <Badge border color={"info"}>
                                    <Text style={{color: "inherit"}}>Object</Text>
                                </Badge>
                            </Flex>
                            <ButtonGroup>
                                <Button paddingSize={"xxs"} variant={"filled"}><IconLiveView size={13}/> </Button>
                                <Button paddingSize={"xxs"} variant={"filled"}><IconEdit size={13}/> </Button>
                            </ButtonGroup>
                        </Flex>
                    </CardSection>
                </Card>
            </Card>
        </div>
        {/*{definition?.inputType ? <DFlowInputDataType onDataTypeChange={value => {*/}
        {/*    instance.inputType = value as DataType*/}
        {/*    flowService.update()*/}
        {/*}} initialValue={instance.inputType || definition.inputType} blockingDataType={definition.inputType}/> : null}*/}
        {definition?.flowTypeSettings?.map(settingDefinition => {
            const setting = instance.settings?.nodes?.find(s => s?.flowSettingIdentifier == settingDefinition.identifier)
            const title = settingDefinition.names!![0]?.content ?? ""
            const description = settingDefinition?.descriptions!![0]?.content ?? ""
            const result = suggestionsById[settingDefinition.identifier!!]


            const defaultValue = setting?.value?.__typename === "LiteralValue" ? typeof setting?.value == "object" ? JSON.stringify(setting?.value) : setting?.value : typeof setting?.value == "object" ? JSON.stringify(setting?.value) : setting?.value

            const submitValue = (value: NodeParameterValue) => {
                startTransition(async () => {
                    if (value?.__typename == "LiteralValue" && settingDefinition.identifier) {
                        await flowService.setSettingValue(props.instance.id, String(settingDefinition.identifier), value.value)
                    } else if (settingDefinition.identifier) {
                        await flowService.setSettingValue(props.instance.id, String(settingDefinition.identifier), value)
                    }
                })

            }

            const submitValueEvent = (event: any) => {
                try {
                    const value = JSON.parse(event.target.value) as Scalars['JSON']['output']
                    if (value.__typename == "LiteralValue") {
                        submitValue(value.value)
                        return
                    }
                    submitValue(value)
                } catch (e) {
                    // @ts-ignore
                    //submitValue(event.target.value)
                }
            }

            return <div>
                <DFlowInputDefault flowId={undefined}
                                   nodeId={undefined}
                                   parameterId={undefined}
                                   title={title}
                                   description={description}
                                   clearable
                                   key={settingDefinition.identifier}
                                   defaultValue={defaultValue}
                                   onBlur={submitValueEvent}
                                   onClear={submitValueEvent}
                                   onSuggestionSelect={(suggestion) => {
                                       submitValue(suggestion.value)
                                   }}
                                   suggestions={toInputSuggestions(result)}
                />
            </div>
        })}
    </Flex>
}
