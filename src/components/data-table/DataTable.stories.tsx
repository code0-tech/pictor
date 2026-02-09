import React from "react";
import {DataTableFilterInput} from "./DataTableFilterInput";
import {DataTableFilterSuggestionMenu} from "./DataTableFilterSuggestionMenu";
import {MenuItem} from "../menu/Menu";
import {DataTable, DataTableFilterProps} from "./DataTable";
import {Text} from "../text/Text";
import {Button} from "../button/Button";
import {IconDotsVertical} from "@tabler/icons-react";
import {Avatar} from "../avatar/Avatar";
import {Spacing} from "../spacing/Spacing";
import {Flex} from "../flex/Flex";
import {ButtonGroup} from "../button-group/ButtonGroup";

export const Default = () => {

    const testData = [
        {
            name: "TestProject",
            members: [{
                name: "@nschrick",
            }, {
                name: "@nsammito",
            }],
            payload: {
                id: "1",
            }
        },
        {
            name: "TestProject TestProject",
            members: [{
                name: "@rgoetz",
            }, {
                name: "@nsammito",
            }],
            payload: {
                id: "3",
            }
        },
        {
            name: "TestProject TestProject TestProject",
            members: [{
                name: "@nmorawitz",
            }, {
                name: "@mstaedtler",
            }],
            payload: {
                id: "2",
            }
        }
    ]
    const [filter, setFilter] = React.useState<DataTableFilterProps>({})

    return <>
        <Flex align={"end"} justify={"space-between"} style={{gap: "1.3rem"}}>
            <Flex style={{gap: "0.35rem", flexDirection: "column"}}>
                <Text size={"xl"} hierarchy={"primary"}>
                    Organizations
                </Text>
                <Text size={"sm"} hierarchy={"tertiary"}>
                    Manage organizations that you belong to. You can create new organizations and switch between them.
                </Text>
            </Flex>
            <ButtonGroup>
                <Button color={"success"} variant={"filled"}>Create</Button>
                <Button color={"secondary"} variant={"filled"}>Sort</Button>
            </ButtonGroup>
        </Flex>
        <Spacing spacing={"xl"}/>
        <DataTableFilterInput onChange={filter => setFilter(filter)} filterTokens={[
            {
                token: "name",
                key: "name",
                operators: ["isOneOf", "isNotOneOf"],
                suggestion: (context, operator, applySuggestion) => {
                    return <DataTableFilterSuggestionMenu context={context}>
                        {testData.map(item => {
                            return <MenuItem onSelect={() => applySuggestion(item.name)}>{item.name}</MenuItem>
                        })}
                    </DataTableFilterSuggestionMenu>
                }
            },
            {
                token: "members",
                key: "members.name",
                operators: ["isOneOf", "isNotOneOf"],
                suggestion: (context, operator, applySuggestion) => {
                    const allMembers = testData.flatMap(item => item.members.map(m => m.name));
                    const uniqueMembers = Array.from(new Set(allMembers));

                    return <DataTableFilterSuggestionMenu context={context}>
                        {uniqueMembers.map(memberName => {
                            return <MenuItem key={memberName} onSelect={() => applySuggestion(memberName)}>{memberName}</MenuItem>
                        })}
                    </DataTableFilterSuggestionMenu>
                }
            }
        ]}/>
        <Spacing spacing={"xl"}/>
        <DataTable filter={filter} data={testData}>
            {(item: any) => {
                return <>
                    <td>
                        <Avatar identifier={String(item.name)}/>
                    </td>
                    <td>
                        <Text>{String(item.name)}</Text>
                    </td>
                    <td style={{maxWidth: "100px", wordWrap: "break-word"}}>
                        <Text>{item.members.map((m: any) => m.name).join(", ")}</Text>
                    </td>
                    <td>
                        <Text>{item.payload.id}</Text>
                    </td>
                    <td>
                        <Button><IconDotsVertical size={13}/> </Button>
                    </td>
                </>
            }}
        </DataTable>

    </>
}


export default {
    title: "DataTable",
    component: Default,
}
