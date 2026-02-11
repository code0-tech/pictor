import React from "react";
import {DataTableFilterInput} from "./DataTableFilterInput";
import {DataTableFilterSuggestionMenu} from "./DataTableFilterSuggestionMenu";
import {Menu, MenuCheckboxItem, MenuContent, MenuItem, MenuPortal, MenuTrigger} from "../menu/Menu";
import {DataTable, DataTableFilterProps, DataTableSortProps} from "./DataTable";
import {Text} from "../text/Text";
import {Button} from "../button/Button";
import {IconCheck, IconDotsVertical, IconMinus, IconSortAscending, IconSortDescending} from "@tabler/icons-react";
import {Avatar} from "../avatar/Avatar";
import {Spacing} from "../spacing/Spacing";
import {Flex} from "../flex/Flex";
import {ButtonGroup} from "../button-group/ButtonGroup";
import {Badge} from "../badge/Badge";

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
                id: "3",
            }
        }
    ]
    const [filter, setFilter] = React.useState<DataTableFilterProps>({})
    const [sort, setSort] = React.useState<DataTableSortProps>({})

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
                <Menu>
                    <MenuTrigger asChild>
                        <Button color={"secondary"} variant={"filled"}>Sort</Button>
                    </MenuTrigger>
                    <MenuPortal>
                        <MenuContent>
                            <MenuCheckboxItem
                                checked={sort["name"] === undefined ? "indeterminate" : sort["name"] === "asc"}
                                onSelect={event => {
                                    if (sort["name"] === null || sort["name"] === undefined)
                                        setSort(prev => ({...prev, name: "asc"}))
                                    else if (sort["name"] === "asc")
                                        setSort(prev => ({...prev, name: "desc"}))
                                    else
                                        setSort(prev => ({...prev, name: undefined}))

                                    event.preventDefault()
                                    event.stopPropagation()
                                }}>
                                {sort["name"] === undefined ? <IconMinus size={13}/> : sort["name"] === "asc" ?
                                    <IconSortDescending size={13}/> : <IconSortAscending size={13}/>}
                                Name
                            </MenuCheckboxItem>
                            <MenuCheckboxItem
                                checked={sort["payload.id"] === undefined ? "indeterminate" : sort["payload.id"] === "asc"}
                                onSelect={event => {
                                    if (sort["payload.id"] === null || sort["payload.id"] === undefined)
                                        setSort(prev => ({...prev, "payload.id": "asc"}))
                                    else if (sort["payload.id"] === "asc")
                                        setSort(prev => ({...prev, "payload.id": "desc"}))
                                    else
                                        setSort(prev => ({...prev, "payload.id": undefined}))

                                    event.preventDefault()
                                    event.stopPropagation()
                                }}>
                                {sort["payload.id"] === undefined ?
                                    <IconMinus size={13}/> : sort["payload.id"] === "asc" ?
                                        <IconSortDescending size={13}/> : <IconSortAscending size={13}/>}
                                Identifier
                            </MenuCheckboxItem>
                        </MenuContent>
                    </MenuPortal>
                </Menu>
            </ButtonGroup>
        </Flex>
        <Spacing spacing={"xl"}/>
        <DataTableFilterInput onChange={filter => {
            setFilter(filter)
            console.log(filter)
        }} filterTokens={[
            {
                token: "name",
                key: "name",
                operators: ["isOneOf", "isNotOneOf"],
                suggestion: (context, operator, currentValue, applySuggestion) => {
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
                suggestion: (context, operator, currentValue, applySuggestion) => {
                    const allMembers = testData.flatMap(item => item.members.map(m => m.name));
                    const uniqueMembers = Array.from(new Set(allMembers));

                    const split = currentValue.split(",").map(s => s.trim()).filter(Boolean);

                    return <DataTableFilterSuggestionMenu context={context}>
                        {uniqueMembers.map(memberName => {
                            const isChecked = split.includes(memberName);
                            return <MenuCheckboxItem key={memberName} checked={isChecked} onSelect={e => {
                                e.preventDefault();
                                e.stopPropagation();
                                const updated = isChecked
                                    ? split.filter(name => name !== memberName)
                                    : [...split, memberName];
                                applySuggestion(updated.join(","), true);
                            }}>
                                {isChecked ? <IconCheck size={13}/> : <IconCheck color={"transparent"} size={13}/>}
                                {memberName}
                            </MenuCheckboxItem>
                        })}
                    </DataTableFilterSuggestionMenu>
                }
            }
        ]}/>
        <Spacing spacing={"xl"}/>
        <Flex align={"center"} justify={"end"} style={{gap: "0.35rem"}}>
            {Object.entries(sort).map(([key, value], index) => {
                return value ? <Text>
                    {index == 0 ? "Sort " : ""}
                    <Badge color={"secondary"}>
                        <Text>{key}</Text>
                    </Badge> {" "}
                    {value === "asc" ? "ascending" : "descending"} {" "}
                    {index < Object.entries(sort).filter(([_, v]) => v).length - 1 ? ", " : ""}
                </Text> : null
            })}
        </Flex>
        <Spacing spacing={"md"}/>
        <DataTable emptyComponent={<td>
            <Text>No data found</Text>
        </td>} sort={sort} filter={filter} data={testData}>
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
