import React from "react";
import {Flex} from "../flex/Flex";
import {DNamespaceRoleView} from "./DNamespaceRole.view";
import {NamespaceRole} from "@code0-tech/sagittarius-graphql-types";
import {useService, useStore} from "../../utils";
import {DNamespaceRoleReactiveService} from "./DNamespaceRole.service";
import {Text} from "../text/Text";
import {Badge} from "../badge/Badge";
import {Button} from "../button/Button";
import {IconCheck, IconFolders, IconSettings} from "@tabler/icons-react";
import {DNamespaceProjectReactiveService} from "../d-project";
import {Tooltip, TooltipArrow, TooltipContent, TooltipPortal, TooltipTrigger} from "../tooltip/Tooltip";

type AbilityCategory =
    | "members"
    | "projects"
    | "roles"
    | "runtimes"
    | "flows"
    | "license"
    | "organization"
    | "admin"

const abilityCategoryByAbility: Record<string, AbilityCategory> = {
    ASSIGN_MEMBER_ROLES: "members",
    INVITE_MEMBER: "members",
    DELETE_MEMBER: "members",

    CREATE_NAMESPACE_PROJECT: "projects",
    UPDATE_NAMESPACE_PROJECT: "projects",
    DELETE_NAMESPACE_PROJECT: "projects",
    ASSIGN_ROLE_PROJECTS: "projects",
    READ_NAMESPACE_PROJECT: "projects",

    CREATE_NAMESPACE_ROLE: "roles",
    UPDATE_NAMESPACE_ROLE: "roles",
    ASSIGN_ROLE_ABILITIES: "roles",

    CREATE_RUNTIME: "runtimes",
    UPDATE_RUNTIME: "runtimes",
    DELETE_RUNTIME: "runtimes",
    ROTATE_RUNTIME_TOKEN: "runtimes",
    ASSIGN_PROJECT_RUNTIMES: "runtimes",

    CREATE_FLOW: "flows",
    UPDATE_FLOW: "flows",
    DELETE_FLOW: "flows",

    CREATE_NAMESPACE_LICENSE: "license",
    READ_NAMESPACE_LICENSE: "license",
    DELETE_NAMESPACE_LICENSE: "license",

    UPDATE_ORGANIZATION: "organization",
    DELETE_ORGANIZATION: "organization",

    NAMESPACE_ADMINISTRATOR: "admin",
}

const abilityCategoryLabels: Record<AbilityCategory, string> = {
    members: "members",
    projects: "projects",
    roles: "roles",
    runtimes: "runtimes",
    flows: "flows",
    license: "licenses",
    organization: "the organization",
    admin: "everything",
}

type AbilityAction = "create" | "update" | "delete" | "assign" | "read" | "manage"

type AbilityCategoryInfo = {
    category: AbilityCategory
    label: string
    abilities: string[]
    action: AbilityAction
}

function getAbilityAction(ability: string): AbilityAction {
    if (ability.startsWith("CREATE_")) return "create"
    if (ability.startsWith("UPDATE_")) return "update"
    if (ability.startsWith("DELETE_")) return "delete"
    if (ability.startsWith("ASSIGN_")) return "assign"
    if (ability.startsWith("READ_")) return "read"
    return "manage"
}

function mergeAbilityActions(actions: AbilityAction[]): AbilityAction {
    const uniqueActions = Array.from(new Set(actions))
    if (uniqueActions.length === 1) return uniqueActions[0]
    return "manage"
}

function buildAbilityCategories(abilities: string[] | undefined): AbilityCategoryInfo[] {
    if (!abilities || abilities.length === 0) return []

    const bucket = new Map<AbilityCategory, string[]>()

    for (const ability of abilities) {
        const category = abilityCategoryByAbility[ability]
        if (!category) continue

        const list = bucket.get(category) ?? []
        list.push(ability)
        bucket.set(category, list)
    }

    return Array.from(bucket.entries()).map(([category, categoryAbilities]) => {
        const actions = categoryAbilities.map(getAbilityAction)
        const action = mergeAbilityActions(actions)

        return {
            category,
            label: abilityCategoryLabels[category],
            abilities: categoryAbilities,
            action,
        }
    })
}

function renderPermissionSummary(categories: AbilityCategoryInfo[]) {
    if (categories.length === 0) return "No special permissions."

    const renderCategory = (category: AbilityCategoryInfo) => (
        <>
            {category.action}{" "}
            <Tooltip>
                <TooltipTrigger asChild>
                    <Badge color="secondary" style={{verticalAlign: "middle"}}>
                        <Text>{category.label}</Text>
                    </Badge>
                </TooltipTrigger>
                <TooltipPortal>
                    <TooltipContent>
                        <Flex style={{flexDirection: "column", gap: "0.25rem"}}>
                            {category.abilities.map(ability => (
                                <Flex key={ability} align="center" style={{gap: "0.35rem"}}>
                                    <IconCheck size={14}/>
                                    <Text size="xs">{ability}</Text>
                                </Flex>
                            ))}
                        </Flex>
                        <TooltipArrow/>
                    </TooltipContent>
                </TooltipPortal>
            </Tooltip>
        </>
    )

    if (categories.length === 1) {
        const category = categories[0]
        return <>Can {renderCategory(category)}.</>
    }

    const leadingCategories = categories.slice(0, -1)
    const lastCategory = categories[categories.length - 1]

    return (
        <>
            Can{" "}
            {leadingCategories.map((category, index) => (
                <React.Fragment key={category.category}>
                    {index > 0 && ", "}
                    {renderCategory(category)}
                </React.Fragment>
            ))}
            {" "}and {renderCategory(lastCategory)}.
        </>
    )
}

export interface DNamespaceRoleContentProps {
    roleId: NamespaceRole["id"]
    onSetting?: (role: DNamespaceRoleView) => void
}

export const DNamespaceRoleContent: React.FC<DNamespaceRoleContentProps> = (props) => {
    const {
        roleId,
        onSetting = () => {
        }
    } = props

    const roleService = useService(DNamespaceRoleReactiveService)
    const roleStore = useStore(DNamespaceRoleReactiveService)
    const projectService = useService(DNamespaceProjectReactiveService)
    const projectStore = useStore(DNamespaceProjectReactiveService)

    const role = React.useMemo(() => roleService.getById(roleId), [roleStore, roleId])
    const assignedProjects = React.useMemo(() => projectService
        .values({namespaceId: role?.namespace?.id})
        .filter(project =>
            role?.assignedProjects?.nodes
                ?.map(p => p?.id)
                .includes(project.id)
        ), [projectStore, role])

    const abilityCategories = React.useMemo(() => buildAbilityCategories(role?.abilities as string[] | undefined), [role])
    const canEditRole =
        role?.userAbilities?.deleteNamespaceRole ||
        role?.userAbilities?.updateNamespaceRole ||
        role?.userAbilities?.assignRoleAbilities ||
        role?.userAbilities?.assignRoleProjects

    return (
        <Flex align="center" style={{gap: "1.3rem"}} justify="space-between">
            <Flex align="center" style={{gap: "1.3rem"}}>
                <Text size="lg" hierarchy="primary" display="block">
                    {role?.name}
                </Text>

                {assignedProjects.length > 0 && (
                    <Flex style={{flexDirection: "column", gap: "0.35rem"}}>
                        <Text size="xs" hierarchy="tertiary">
                            Assigned projects
                        </Text>
                        <Flex style={{gap: "0.35rem", flexWrap: "nowrap"}}>
                            {assignedProjects.map(project => (
                                <Badge
                                    key={project.id}
                                    color="info"
                                    style={{textWrap: "nowrap"}}
                                >
                                    <IconFolders size={16}/>
                                    {project.name}
                                </Badge>
                            ))}
                        </Flex>
                    </Flex>
                )}

                <Flex style={{flexDirection: "column", gap: "0.35rem"}}>
                    <Text size="xs" hierarchy="tertiary">
                        Permissions
                    </Text>
                    <Text size="sm" hierarchy="secondary">
                        {renderPermissionSummary(abilityCategories)}
                    </Text>
                </Flex>
            </Flex>

            {canEditRole && (
                <Button
                    color="secondary"
                    onClick={event => {
                        event.stopPropagation()
                        onSetting(role as DNamespaceRoleView)
                    }}
                >
                    <IconSettings size={16}/>
                </Button>
            )}
        </Flex>
    )
}