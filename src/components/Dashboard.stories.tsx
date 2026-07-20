import React from "react";
import {FullScreen} from "./fullscreen/FullScreen";
import {Layout} from "./layout/Layout";
import {Flex} from "./flex/Flex";
import {Button} from "./button/Button";
import {
    IconAdjustmentsHorizontal,
    IconAppsFilled,
    IconArrowAutofitLeftFilled,
    IconArrowsSort,
    IconCheck,
    IconChevronDown,
    IconChevronLeft,
    IconChevronRight,
    IconFolders,
    IconHomeFilled,
    IconPlus,
    IconRoute,
    IconSearch,
    IconSettings,
    IconSettingsFilled,
    IconSwitch,
    IconTrendingUp,
    IconUsers
} from "@tabler/icons-react";
import {Menu, MenuContent, MenuItem, MenuLabel, MenuPortal, MenuSeparator, MenuTrigger} from "./menu/Menu";
import {Text} from "./text/Text";
import {Spacing} from "./spacing/Spacing";
import {Avatar} from "./avatar/Avatar";
import {Badge} from "./badge/Badge";
import {AuroraBackground} from "./aurora/Aurora";
import {Card} from "./card/Card";
import {Breadcrumb} from "./breadcrumb/Breadcrumb";
import {ButtonGroup} from "./button-group/ButtonGroup";
import {DataTable, DataTableFilterProps, DataTableSortProps} from "./data-table/DataTable";
import {
    DataTableMaxPaginationValue,
    DataTablePagination,
    DataTablePaginationBackwardsTrigger,
    DataTablePaginationForwardTrigger,
    DataTablePaginationValue
} from "./data-table/DataTablePagination";
import {DataTableColumn} from "./data-table/DataTableColumn";
import {DataTableHeader, DataTableHeaderColumn} from "./data-table/DataTableHeader";
import {ScrollArea, ScrollAreaScrollbar, ScrollAreaThumb, ScrollAreaViewport} from "./scroll-area/ScrollArea";
import {hashToColor} from "../utils";

export default {
    title: "Concepts/Dashboard",
    parameters: {
        visualTest: {
            selector: 'body'
        },
        layout: "fullscreen"
    },
}

export const Dashboard = () => {

    const stats = [
        {value: "1,284", label: "Runs today", delta: "+12%", tone: "success"},
        {value: "98.2%", label: "Success rate", delta: "+0.4pt", tone: "success"},
        {value: "41", label: "Active flows", delta: "+2 new", tone: "success"},
        {value: "3", label: "Need attention", delta: "2 urgent", tone: "warning"},
    ] as const

    const recent = [
        {name: "Exhouse Hub", project: "Exhouse GTM", status: "success", duration: "1.8s", when: "just now"},
        {
            name: "Data Retrieval Nexus",
            project: "Project Discovery",
            status: "success",
            duration: "4.2s",
            when: "3m ago"
        },
        {
            name: "Memory Archive Initiative",
            project: "Marketing Collateral",
            status: "success",
            duration: "2.3s",
            when: "6m ago"
        },
        {name: "Project Echo Vault", project: "Project Discovery", status: "success", duration: "0.9s", when: "9m ago"},
        {name: "Neural Integration System", project: "Exhouse GTM", status: "error", duration: "6.1s", when: "12m ago"},
    ]

    // The flows surfaced by the "needs attention" banner. Clicking the banner opens
    // this as its own table rather than filtering the projects table below.
    const attentionFlows = [
        {name: "Neural Integration System", project: "Exhouse GTM", issue: "Repeated failures", when: "12m ago"},
        {name: "Quantum Data Bridge", project: "Data Warehouse Sync", issue: "Step timeout", when: "34m ago"},
        {name: "Insight Aggregation Platform", project: "Product Analytics", issue: "Auth expired", when: "1h ago"},
    ]

    const projects = [
        {name: "Project Discovery", flows: 18, active: 4, health: "98%"},
        {name: "Exhouse GTM", flows: 14, active: 6, health: "94%"},
        {name: "Marketing Collateral", flows: 9, active: 2, health: "100%"},
        {name: "Onboarding Automation", flows: 12, active: 3, health: "97%"},
        {name: "Billing & Invoicing", flows: 21, active: 5, health: "91%"},
        {name: "Customer Success", flows: 8, active: 1, health: "100%"},
        {name: "Data Warehouse Sync", flows: 16, active: 7, health: "88%"},
        {name: "Support Triage", flows: 11, active: 2, health: "96%"},
        {name: "Lead Enrichment", flows: 7, active: 3, health: "99%"},
        {name: "Contract Lifecycle", flows: 13, active: 2, health: "95%"},
        {name: "Product Analytics", flows: 19, active: 6, health: "92%"},
        {name: "Compliance Reporting", flows: 6, active: 0, health: "100%"},
        {name: "Inventory Ops", flows: 10, active: 4, health: "93%"},
        {name: "Recruiting Pipeline", flows: 9, active: 1, health: "98%"},
        {name: "Internal IT Requests", flows: 15, active: 3, health: "90%"},
        {name: "Partner Integrations", flows: 22, active: 8, health: "87%"},
        {name: "Content Publishing", flows: 8, active: 2, health: "100%"},
        {name: "Security Alerts", flows: 5, active: 5, health: "94%"},
        {name: "Finance Close", flows: 12, active: 1, health: "96%"},
        {name: "Growth Experiments", flows: 17, active: 4, health: "89%"},
    ]

    const [attentionOpen, setAttentionOpen] = React.useState(false)
    const [filter, setFilter] = React.useState<"all" | "active" | "attention" | "healthy">("all")
    const [sort, setSort] = React.useState<"name" | "flows" | "active" | "health">("name")

    const filterLabels = {
        all: "All projects",
        active: "Has active flows",
        attention: "Needs attention",
        healthy: "Healthy"
    } as const
    const sortLabels = {name: "Name", flows: "Most flows", active: "Most active", health: "Health"} as const

    const pct = (h: string) => parseInt(h, 10)

    // Decorate each project with categorical/numeric fields so that DataTable's own
    // filter (isOneOf) and sort can operate on them directly.
    const decoratedProjects = projects.map((p) => ({
        ...p,
        healthValue: pct(p.health),
        hasActive: p.active > 0 ? "yes" : "no",
        healthState: pct(p.health) >= 95 ? "healthy" : "attention",
    }))

    const dataFilter: DataTableFilterProps | undefined =
        filter === "active" ? {hasActive: {operator: "isOneOf", value: "yes"}}
            : filter === "attention" ? {healthState: {operator: "isOneOf", value: "attention"}}
                : filter === "healthy" ? {healthState: {operator: "isOneOf", value: "healthy"}}
                    : undefined

    const dataSort: DataTableSortProps =
        sort === "flows" ? {flows: "desc"}
            : sort === "active" ? {active: "desc"}
                : sort === "health" ? {healthValue: "desc"}
                    : {name: "asc"}

    // DataTable owns filtering/sorting/limiting of the rendered rows; the story only
    // needs the number of matches for the badge and the "show all" affordance.
    const matchCount = decoratedProjects.filter((p) =>
        filter === "active" ? p.hasActive === "yes"
            : filter === "attention" ? p.healthState === "attention"
                : filter === "healthy" ? p.healthState === "healthy"
                    : true).length

    return <FullScreen bg={"var(--secondary)"}>
        <Layout p={0.5} showLayoutSplitter={false} layoutGap={16} leftContent={
            <Flex h={"100%"} style={{boxSizing: "border-box", flexDirection: 'column', gap: "0.7rem"}}>
                <Button variant={"none"} p={0.5}>
                    <svg xmlns="http://www.w3.org/2000/svg" height={16} width={16} fill={"#fff"} id="c"
                         viewBox="8.01 8.97 23.83 23.83">
                        <path
                            d="M25.498,8.966h-11.132c-3.508,0-6.351,2.843-6.351,6.351v11.132c0,3.507,2.843,6.351,6.351,6.351h11.132c3.508,0,6.351-2.843,6.351-6.351v-11.132c0-3.507-2.843-6.351-6.351-6.351ZM24.829,15.569h-.379c-.454,0-.759.101-.915.303-.157.202-.234.514-.234.938v2.011c0,.525-.071.968-.212,1.331s-.423.676-.847.938c.424.262.706.575.847.938s.212.807.212,1.331v2.012c0,.423.078.736.234.937.156.202.461.303.915.303h.379v1.8h-.303c-.635,0-1.167-.061-1.596-.182-.429-.121-.771-.298-1.029-.53s-.441-.516-.552-.855c-.111-.337-.167-.724-.167-1.157v-2.285c0-.423-.101-.766-.303-1.028-.198-.258-.522-.387-.965-.391-.443.004-.766.132-.966.391-.201.262-.302.605-.302,1.028v2.285c0,.433-.056.819-.167,1.157-.111.338-.295.623-.552.855s-.6.408-1.029.53c-.428.12-.96.182-1.596.182h-.303v-1.8h.379c.454,0,.758-.101.915-.303.156-.201.234-.514.234-.937v-2.012c0-.524.07-.968.212-1.331.141-.363.423-.676.847-.938-.423-.262-.705-.575-.847-.938-.142-.363-.212-.806-.212-1.331v-2.011c0-.424-.078-.736-.234-.938-.157-.201-.461-.303-.915-.303h-.379v-1.799h.303c.635,0,1.167.06,1.596.182.429.12.771.297,1.029.529.257.233.441.517.552.855.111.338.167.724.167,1.158v2.284c0,.423.101.766.302,1.029.199.258.522.386.966.39.443-.004.766-.131.965-.39.202-.262.303-.606.303-1.029v-2.284c0-.434.055-.819.167-1.158.111-.337.295-.622.552-.855.257-.232.6-.408,1.029-.529.428-.121.96-.182,1.596-.182h.303v1.799Z"/>
                    </svg>
                </Button>
                <Button variant={"none"} p={0.5}>
                    <IconHomeFilled size={16}/>
                </Button>
                <Button variant={"none"} p={0.5}>
                    <IconAppsFilled size={16}/>
                </Button>
                <Flex style={{marginTop: "auto", boxSizing: "border-box", flexDirection: 'column', gap: "0.7rem"}}>
                    <Button variant={"none"} p={0.5} style={{marginTop: 'auto'}}>
                        <IconSettingsFilled size={16}/>
                    </Button>
                    <Button variant={"none"} p={0.5} style={{marginTop: 'auto'}}>
                        <Avatar type={"character"} identifier={"Nico Sammito"} size={16}/>
                    </Button>
                </Flex>
            </Flex>
        }>
            <Layout showLayoutSplitter={false} layoutGap={16} leftContent={
                <div style={{
                    height: "100%",
                    boxSizing: "border-box",
                    borderRadius: "1rem",
                }}>
                    <Flex h={"100%"} style={{boxSizing: "border-box", flexDirection: 'column', gap: "1.3rem"}}>
                        <Button paddingSize={"xxs"} justify={"flex-start"} w={"100%"} variant={"none"}>
                            <IconSearch size={16}/>
                            <Text size={"md"} hierarchy={"tertiary"}>
                                Search...
                            </Text>
                        </Button>
                        <Flex style={{boxSizing: "border-box", flexDirection: 'column'}}>
                            <Flex align={"center"} justify={"space-between"}>
                                <Text pl={0.7} hierarchy={"tertiary"}>
                                    Projects
                                </Text>
                                <Badge color={"secondary"}>
                                    3 of 20
                                </Badge>
                            </Flex>
                            <Spacing spacing={"xxs"}/>
                            <Button variant={"none"} w={"100%"} justify={"flex-start"}
                                    paddingSize={"xxs"}>
                                <Avatar identifier={"Project Discovery"} size={13}/>
                                <Text size={"md"}>
                                    Project Discovery
                                </Text>
                            </Button>
                            <Button variant={"none"} w={"100%"} justify={"flex-start"}
                                    paddingSize={"xxs"}>
                                <Avatar identifier={"Exhouse GTM"} size={13}/>
                                <Text size={"md"}>
                                    Exhouse GTM
                                </Text>
                            </Button>
                            <Button variant={"none"} w={"100%"} justify={"flex-start"}
                                    paddingSize={"xxs"}>
                                <Avatar identifier={"Marketing Collateral"} size={13}/>
                                <Text size={"md"}>
                                    Marketing Collateral
                                </Text>
                            </Button>
                            <Button variant={"none"} w={"100%"} justify={"flex-start"}
                                    paddingSize={"xxs"}>
                                <IconPlus size={13}/>
                                <Text size={"md"} hierarchy={"tertiary"}>
                                    Add Project
                                </Text>
                            </Button>
                            <Button variant={"none"} w={"100%"} justify={"flex-start"}
                                    paddingSize={"xxs"}>
                                <IconPlus color={"transparent"} size={13}/>
                                <Text size={"md"} hierarchy={"tertiary"}>
                                    Load all Projects
                                </Text>
                            </Button>
                        </Flex>
                        <div style={{
                            borderTop: "1px dashed rgba(255,255,255, .1)",
                        }}/>
                        <Flex style={{boxSizing: "border-box", flexDirection: 'column'}}>
                            <Flex align={"center"} justify={"space-between"}>
                                <Text pl={0.7} hierarchy={"tertiary"}>
                                    Workflows
                                </Text>
                                <Badge color={"secondary"}>
                                    10 of 41
                                </Badge>
                            </Flex>
                            <Spacing spacing={"xxs"}/>
                            <Button variant={"none"} w={"100%"} justify={"flex-start"}
                                    paddingSize={"xxs"}>
                                <Text size={"md"}>
                                    Information Resurgence P...
                                </Text>
                            </Button>
                            <Button variant={"none"} w={"100%"} justify={"flex-start"}
                                    paddingSize={"xxs"}>
                                <Text size={"md"}>
                                    Exhouse Hub
                                </Text>
                            </Button>
                            <Button variant={"none"} w={"100%"} justify={"flex-start"}
                                    paddingSize={"xxs"}>
                                <Text size={"md"}>
                                    Data Retrieval Nexus
                                </Text>
                            </Button>
                            <Button variant={"none"} w={"100%"} justify={"flex-start"}
                                    paddingSize={"xxs"}>
                                <Text size={"md"}>
                                    Memory Archive Initiative
                                </Text>
                            </Button>
                            <Button variant={"none"} w={"100%"} justify={"flex-start"}
                                    paddingSize={"xxs"}>
                                <Text size={"md"}>
                                    Project Echo Vault
                                </Text>
                            </Button>
                            <Button variant={"none"} w={"100%"} justify={"flex-start"}
                                    paddingSize={"xxs"}>
                                <Text size={"md"}>
                                    Cognitive Enhancement F...
                                </Text>
                            </Button>
                            <Button variant={"none"} w={"100%"} justify={"flex-start"}
                                    paddingSize={"xxs"}>
                                <Text size={"md"}>
                                    Neural Integration System
                                </Text>
                            </Button>
                            <Button variant={"none"} w={"100%"} justify={"flex-start"}
                                    paddingSize={"xxs"}>
                                <Text size={"md"}>
                                    Quantum Data Bridge
                                </Text>
                            </Button>
                            <Button variant={"none"} w={"100%"} justify={"flex-start"}
                                    paddingSize={"xxs"}>
                                <Text size={"md"}>
                                    Insight Aggregation Platfo...
                                </Text>
                            </Button>
                            <Button variant={"none"} w={"100%"} justify={"flex-start"}
                                    paddingSize={"xxs"}>
                                <Text size={"md"}>
                                    Adaptive Learning Reposit...
                                </Text>
                            </Button>
                        </Flex>
                        <Flex style={{
                            marginTop: "auto",
                            boxSizing: "border-box",
                            flexDirection: 'column',
                            gap: "1.3rem"
                        }}>
                            <Menu>
                                <MenuTrigger asChild>
                                    <Button paddingSize={"xxs"} style={{borderRadius: "50rem"}} w={"100%"}
                                            variant={"none"} justify={"flex-start"}>
                                        <Avatar bg={"transparent"} identifier={"GLS organization"} size={16}/>
                                        <Flex align={"flex-start"} style={{flexDirection: "column"}}>
                                            <Text>
                                                GLS workspace
                                            </Text>
                                            <Text hierarchy={"tertiary"}>
                                                Workspace description
                                            </Text>
                                        </Flex>
                                        <Flex align={"center"} justify={"center"} style={{marginLeft: "auto"}}>
                                            <IconChevronDown size={16}/>
                                        </Flex>
                                    </Button>
                                </MenuTrigger>
                                <MenuPortal>
                                    <MenuContent sideOffset={8} w={"var(--radix-popper-anchor-width)"}>
                                        <MenuLabel>
                                            Workspace
                                        </MenuLabel>
                                        <MenuItem>
                                            <IconSettings size={16}/>
                                            Settings
                                        </MenuItem>
                                        <MenuItem>
                                            <IconSettings color={"transparent"} size={16}/>
                                            Members
                                        </MenuItem>
                                        <MenuItem>
                                            <IconSettings color={"transparent"} size={16}/>
                                            Roles
                                        </MenuItem>
                                        <MenuItem>
                                            <IconSettings color={"transparent"} size={16}/>
                                            Servers
                                        </MenuItem>
                                        <MenuSeparator/>
                                        <MenuItem>
                                            <IconSwitch size={16}/>
                                            Switch Workspace
                                        </MenuItem>
                                    </MenuContent>
                                </MenuPortal>

                            </Menu>
                        </Flex>
                    </Flex>
                </div>
            }>
                <Layout showLayoutSplitter={false} layoutGap={16}>
                    <div style={{
                        background: "var(--primary)",
                        height: "100%",
                        position: "relative",
                        boxSizing: "border-box",
                        borderRadius: "1rem",
                        padding: "1rem",
                    }}>
                        <AuroraBackground/>
                        <Badge py={0.35} px={0.7} style={{
                            transform: "translateX(-50%)",
                            zIndex: 2,
                        }} pos={"absolute"} top={"1rem"} left={"50%"}>
                            <Breadcrumb>
                                <Flex align={"center"} style={{gap: "0.35rem"}}>
                                    <Avatar bg={"transparent"} identifier={"GLS organization"} size={13}/>
                                    <Text hierarchy={"tertiary"}>
                                        GLS workspace
                                    </Text>
                                </Flex>
                                <Text>
                                    Overview
                                </Text>
                            </Breadcrumb>
                        </Badge>
                        <ScrollArea style={{position: "absolute", inset: 0, zIndex: 1}}>
                            <ScrollAreaViewport>
                                <div style={{maxWidth: "52rem", margin: "0 auto", padding: "4rem 1rem"}}>

                                    {/* ── One quiet summary card: four numbers + trend, hairline dividers ── */}
                                    <Card color={"secondary"}>
                                        <Flex align={"center"}>
                                            {stats.map((s, i) => (
                                                <React.Fragment key={s.label}>
                                                    {i > 0 && <div style={{
                                                        width: 1,
                                                        alignSelf: "stretch",
                                                        background: "rgba(255,255,255,0.08)",
                                                        margin: "0 1.5rem",
                                                    }}/>}
                                                    <Flex style={{flexDirection: "column", gap: "0.7rem", flex: 1}}>
                                                        <Flex align={"center"} justify={"space-between"}
                                                              style={{gap: "0.5rem"}}>
                                                            <Text size={"sm"} hierarchy={"tertiary"}>{s.label}</Text>
                                                            <Badge color={s.tone === "warning" ? "warning" : "success"}>
                                                                {s.tone === "success" && <IconTrendingUp size={12}/>}
                                                                {s.delta}
                                                            </Badge>
                                                        </Flex>
                                                        <Text fz={3} style={{lineHeight: 0.9}} fw={600}>{s.value}</Text>
                                                    </Flex>
                                                </React.Fragment>
                                            ))}
                                        </Flex>
                                    </Card>

                                    <Spacing spacing={"md"}/>

                                    {/* ── Slim attention banner — expands its own table of the flows ── */}
                                    <Card color={"secondary"} className={"card--hover"}
                                          onClick={() => setAttentionOpen((o) => !o)}>
                                        <Flex align={"center"} justify={"space-between"} style={{gap: "0.75rem"}}>
                                            <Flex align={"center"} style={{gap: "0.75rem", minWidth: 0}}>
                                                <div style={{
                                                    width: 8,
                                                    height: 8,
                                                    borderRadius: "50%",
                                                    background: "#FFBE0B",
                                                    flexShrink: 0
                                                }}/>
                                                <Text size={"md"}>3 flows need attention</Text>
                                                <Text size={"sm"} hierarchy={"tertiary"}>
                                                    Neural Integration, Quantum Bridge and 1 more
                                                </Text>
                                            </Flex>
                                            <IconChevronRight size={16} style={{
                                                transition: "transform 150ms ease",
                                                transform: attentionOpen ? "rotate(90deg)" : "none",
                                            }}/>
                                        </Flex>
                                        {attentionOpen && (
                                            <div onClick={(e) => e.stopPropagation()}>
                                                <DataTable data={attentionFlows}>
                                                    <DataTableHeader>
                                                        <DataTableHeaderColumn>
                                                            <Text size={"sm"} hierarchy={"tertiary"}>Flow</Text>
                                                        </DataTableHeaderColumn>
                                                        <DataTableHeaderColumn>
                                                            <Text size={"sm"} hierarchy={"tertiary"}>Project</Text>
                                                        </DataTableHeaderColumn>
                                                        <DataTableHeaderColumn>
                                                            <Text size={"sm"} hierarchy={"tertiary"}>Issue</Text>
                                                        </DataTableHeaderColumn>
                                                        <DataTableHeaderColumn>
                                                            <Text size={"sm"} hierarchy={"tertiary"}>Last run</Text>
                                                        </DataTableHeaderColumn>
                                                    </DataTableHeader>
                                                    {(f) => <>
                                                        <DataTableColumn>
                                                            <Flex align={"center"}
                                                                  style={{gap: "0.75rem", minWidth: 0}}>
                                                                <div style={{
                                                                    width: 8,
                                                                    height: 8,
                                                                    borderRadius: "50%",
                                                                    background: "#FFBE0B",
                                                                    flexShrink: 0
                                                                }}/>
                                                                <Text size={"md"}>{f.name}</Text>
                                                            </Flex>
                                                        </DataTableColumn>
                                                        <DataTableColumn>
                                                            <Text size={"sm"} hierarchy={"tertiary"}>{f.project}</Text>
                                                        </DataTableColumn>
                                                        <DataTableColumn>
                                                            <Badge color={"warning"}>{f.issue}</Badge>
                                                        </DataTableColumn>
                                                        <DataTableColumn>
                                                            <Text size={"sm"} hierarchy={"tertiary"}>{f.when}</Text>
                                                        </DataTableColumn>
                                                    </>}
                                                </DataTable>
                                            </div>
                                        )}
                                    </Card>

                                    <Spacing spacing={"lg"}/>

                                    {/* ── Recent activity: clean list, status dots, trailing time ── */}
                                    <Text pl={0.25} hierarchy={"tertiary"} size={"md"}>Recent activity</Text>
                                    <Spacing spacing={"xs"}/>
                                    <Card color={"secondary"} paddingSize={"sm"}>
                                        <DataTable data={recent}>
                                            <DataTableHeader>
                                                <DataTableHeaderColumn>
                                                    <Text size={"sm"} hierarchy={"tertiary"}>Flow</Text>
                                                </DataTableHeaderColumn>
                                                <DataTableHeaderColumn>
                                                    <Text size={"sm"} hierarchy={"tertiary"}>Project</Text>
                                                </DataTableHeaderColumn>
                                                <DataTableHeaderColumn>
                                                    <Text size={"sm"} hierarchy={"tertiary"}>Duration</Text>
                                                </DataTableHeaderColumn>
                                                <DataTableHeaderColumn>
                                                    <Text size={"sm"} hierarchy={"tertiary"}>Ran</Text>
                                                </DataTableHeaderColumn>
                                            </DataTableHeader>
                                            {(r) => <>
                                                <DataTableColumn>
                                                    <Flex align={"center"} style={{gap: "0.75rem", minWidth: 0}}>
                                                        <div style={{
                                                            width: 8,
                                                            height: 8,
                                                            borderRadius: "50%",
                                                            flexShrink: 0,
                                                            background: r.status === "success" ? "#29BF12" : "#D90429",
                                                        }}/>
                                                        <Text size={"md"}>{r.name}</Text>
                                                    </Flex>
                                                </DataTableColumn>
                                                <DataTableColumn>
                                                    <Text size={"sm"} hierarchy={"tertiary"}>{r.project}</Text>
                                                </DataTableColumn>
                                                <DataTableColumn>
                                                    <Text size={"sm"} hierarchy={"tertiary"}>{r.duration}</Text>
                                                </DataTableColumn>
                                                <DataTableColumn>
                                                    <Text size={"sm"} hierarchy={"tertiary"}>{r.when}</Text>
                                                </DataTableColumn>
                                            </>}
                                        </DataTable>
                                    </Card>

                                    <Spacing spacing={"lg"}/>

                                    {/* ── Projects: full list with filter, sort & create ── */}
                                    <Flex align={"center"} justify={"space-between"} style={{gap: "0.5rem"}}>
                                        <Flex align={"center"} style={{gap: "0.5rem"}}>
                                            <Text hierarchy={"tertiary"} size={"md"}>Projects</Text>
                                            <Badge color={"secondary"}>{matchCount}</Badge>
                                        </Flex>

                                        <ButtonGroup>
                                            {/* Filter */}
                                            <Menu>
                                                <MenuTrigger asChild>
                                                    <Button variant={"none"} paddingSize={"xxs"}
                                                            active={filter !== "all"}>
                                                        <IconAdjustmentsHorizontal size={13}/>
                                                    </Button>
                                                </MenuTrigger>
                                                <MenuPortal>
                                                    <MenuContent sideOffset={8} align={"end"}>
                                                        <MenuLabel>Filter</MenuLabel>
                                                        {(Object.keys(filterLabels) as (keyof typeof filterLabels)[]).map((k) => (
                                                            <MenuItem key={k} onSelect={() => setFilter(k)}>
                                                                <IconCheck size={13}
                                                                           color={filter === k ? undefined : "transparent"}/>
                                                                {filterLabels[k]}
                                                            </MenuItem>
                                                        ))}
                                                    </MenuContent>
                                                </MenuPortal>
                                            </Menu>

                                            {/* Sort */}
                                            <Menu>
                                                <MenuTrigger asChild>
                                                    <Button variant={"none"} paddingSize={"xxs"}>
                                                        <IconArrowsSort size={13}/>
                                                    </Button>
                                                </MenuTrigger>
                                                <MenuPortal>
                                                    <MenuContent sideOffset={8} align={"end"}>
                                                        <MenuLabel>Sort by</MenuLabel>
                                                        {(Object.keys(sortLabels) as (keyof typeof sortLabels)[]).map((k) => (
                                                            <MenuItem key={k} onSelect={() => setSort(k)}>
                                                                <IconCheck size={13}
                                                                           color={sort === k ? undefined : "transparent"}/>
                                                                {sortLabels[k]}
                                                            </MenuItem>
                                                        ))}
                                                    </MenuContent>
                                                </MenuPortal>
                                            </Menu>

                                            {/* Create */}
                                            <Button variant={"none"} paddingSize={"xxs"}>
                                                <IconPlus size={13}/>
                                            </Button>
                                        </ButtonGroup>
                                    </Flex>
                                    <Spacing spacing={"xs"}/>
                                    <Card color={"secondary"} paddingSize={"sm"}>
                                        <DataTable data={decoratedProjects} filter={dataFilter} sort={dataSort}
                                                   pagination limit={8}>
                                            <DataTableHeader>
                                                <DataTableHeaderColumn>
                                                    <Text size={"sm"} hierarchy={"tertiary"}>Project</Text>
                                                </DataTableHeaderColumn>
                                                <DataTableHeaderColumn>
                                                    <Text size={"sm"} hierarchy={"tertiary"}>Flows</Text>
                                                </DataTableHeaderColumn>
                                                <DataTableHeaderColumn>
                                                    <Text size={"sm"} hierarchy={"tertiary"}>Active</Text>
                                                </DataTableHeaderColumn>
                                                <DataTableHeaderColumn>
                                                    <Text size={"sm"} hierarchy={"tertiary"}>Health</Text>
                                                </DataTableHeaderColumn>
                                            </DataTableHeader>
                                            {(p) => <>
                                                <DataTableColumn>
                                                    <Flex align={"center"} style={{gap: "0.75rem", minWidth: 0}}>
                                                        <Avatar identifier={p.name} size={13}/>
                                                        <Text size={"md"}>{p.name}</Text>
                                                    </Flex>
                                                </DataTableColumn>
                                                <DataTableColumn>
                                                    <Text size={"sm"} hierarchy={"tertiary"}>{p.flows} flows</Text>
                                                </DataTableColumn>
                                                <DataTableColumn>
                                                    <Text size={"sm"} hierarchy={"tertiary"}>{p.active} active</Text>
                                                </DataTableColumn>
                                                <DataTableColumn>
                                                    <Badge color={"secondary"}>{p.health} healthy</Badge>
                                                </DataTableColumn>
                                            </>}
                                            <DataTablePagination style={{paddingTop: "0.2rem"}}>
                                                <Text size={"sm"} hierarchy={"tertiary"}>
                                                    Page <DataTablePaginationValue/> / <DataTableMaxPaginationValue/>
                                                </Text>
                                                <ButtonGroup color={"primary"}>
                                                    <DataTablePaginationBackwardsTrigger asChild>
                                                        <Button variant={"none"} paddingSize={"xxs"}>
                                                            <IconChevronLeft size={13}/>
                                                        </Button>
                                                    </DataTablePaginationBackwardsTrigger>
                                                    <DataTablePaginationForwardTrigger asChild>
                                                        <Button variant={"none"} paddingSize={"xxs"}>
                                                            <IconChevronRight size={13}/>
                                                        </Button>
                                                    </DataTablePaginationForwardTrigger>
                                                </ButtonGroup>
                                            </DataTablePagination>
                                        </DataTable>
                                    </Card>
                                </div>
                            </ScrollAreaViewport>
                            <ScrollAreaScrollbar orientation={"vertical"}>
                                <ScrollAreaThumb/>
                            </ScrollAreaScrollbar>
                        </ScrollArea>

                    </div>
                </Layout>
            </Layout>
        </Layout>
    </FullScreen>
}

// The level above `Dashboard`: this is where users land right after login, before
// entering any workspace. It lists all workspaces the account belongs to
// (Workspaces → Projects → Flows). Selecting one leads into the `Dashboard` view.
export const Workspaces = () => {

    const workspaces = [
        {
            name: "Nico Sammito",
            description: "Your personal workspace",
            projects: 3,
            flows: 6,
            members: 1,
            personal: true,
        },
        {
            name: "GLS workspace",
            description: "Logistics & delivery automation",
            projects: 20,
            flows: 41,
            members: 12,
            personal: false,
        },
        {
            name: "Acme Robotics",
            description: "Hardware fleet orchestration",
            projects: 8,
            flows: 17,
            members: 6,
            personal: false,
        },
        {
            name: "Northwind Retail",
            description: "Storefront & inventory flows",
            projects: 14,
            flows: 33,
            members: 9,
            personal: false,
        },
        {
            name: "Helios Energy",
            description: "Grid monitoring & alerting",
            projects: 5,
            flows: 11,
            members: 4,
            personal: false,
        },
    ]

    // Projects live one level below a workspace, but the ones a user touched most
    // recently are surfaced here so they can jump straight back in.
    const recentProjects = [
        {name: "Project Discovery", workspace: "GLS workspace"},
        {name: "Exhouse GTM", workspace: "GLS workspace"},
        {name: "Fleet Telemetry", workspace: "Acme Robotics"},
        {name: "Storefront Sync", workspace: "Northwind Retail"},
    ]

    // Account-wide totals rolled up across every workspace.
    const stats = [
        {value: `${workspaces.length}`, label: "Workspaces", delta: "+1 new", tone: "success"},
        {value: `${workspaces.reduce((n, w) => n + w.projects, 0)}`, label: "Projects", delta: "+4", tone: "success"},
        {value: "8,420", label: "Saved minutes", delta: "+12%", tone: "success"},
        {value: "2", label: "Need attention", delta: "1 urgent", tone: "warning"},
    ] as const

    const [filter, setFilter] = React.useState<"all" | "personal" | "team">("all")
    const [sort, setSort] = React.useState<"name" | "projects" | "flows" | "members">("name")

    const filterLabels = {all: "All workspaces", personal: "Personal", team: "Team"} as const
    const sortLabels = {name: "Name", projects: "Most projects", flows: "Most flows", members: "Most members"} as const

    // Personal workspace is pinned to the front; only the team workspaces get sorted.
    const teamWorkspaces = [...workspaces.filter((w) => !w.personal)].sort((a, b) =>
        sort === "projects" ? b.projects - a.projects
            : sort === "flows" ? b.flows - a.flows
                : sort === "members" ? b.members - a.members
                    : a.name.localeCompare(b.name))

    const visibleWorkspaces =
        filter === "personal" ? workspaces.filter((w) => w.personal)
            : filter === "team" ? teamWorkspaces
                : [...workspaces.filter((w) => w.personal), ...teamWorkspaces]

    return <FullScreen bg={"var(--secondary)"}>
        <Layout p={1} showLayoutSplitter={false} layoutGap={16} leftContent={
            <Flex h={"100%"} style={{boxSizing: "border-box", flexDirection: 'column', gap: "0.7rem"}}>
                <Button variant={"none"} p={0.5}>
                    <svg xmlns="http://www.w3.org/2000/svg" height={16} width={16} fill={"#fff"} id="c"
                         viewBox="8.01 8.97 23.83 23.83">
                        <path
                            d="M25.498,8.966h-11.132c-3.508,0-6.351,2.843-6.351,6.351v11.132c0,3.507,2.843,6.351,6.351,6.351h11.132c3.508,0,6.351-2.843,6.351-6.351v-11.132c0-3.507-2.843-6.351-6.351-6.351ZM24.829,15.569h-.379c-.454,0-.759.101-.915.303-.157.202-.234.514-.234.938v2.011c0,.525-.071.968-.212,1.331s-.423.676-.847.938c.424.262.706.575.847.938s.212.807.212,1.331v2.012c0,.423.078.736.234.937.156.202.461.303.915.303h.379v1.8h-.303c-.635,0-1.167-.061-1.596-.182-.429-.121-.771-.298-1.029-.53s-.441-.516-.552-.855c-.111-.337-.167-.724-.167-1.157v-2.285c0-.423-.101-.766-.303-1.028-.198-.258-.522-.387-.965-.391-.443.004-.766.132-.966.391-.201.262-.302.605-.302,1.028v2.285c0,.433-.056.819-.167,1.157-.111.338-.295.623-.552.855s-.6.408-1.029.53c-.428.12-.96.182-1.596.182h-.303v-1.8h.379c.454,0,.758-.101.915-.303.156-.201.234-.514.234-.937v-2.012c0-.524.07-.968.212-1.331.141-.363.423-.676.847-.938-.423-.262-.705-.575-.847-.938-.142-.363-.212-.806-.212-1.331v-2.011c0-.424-.078-.736-.234-.938-.157-.201-.461-.303-.915-.303h-.379v-1.799h.303c.635,0,1.167.06,1.596.182.429.12.771.297,1.029.529.257.233.441.517.552.855.111.338.167.724.167,1.158v2.284c0,.423.101.766.302,1.029.199.258.522.386.966.39.443-.004.766-.131.965-.39.202-.262.303-.606.303-1.029v-2.284c0-.434.055-.819.167-1.158.111-.337.295-.622.552-.855.257-.232.6-.408,1.029-.529.428-.121.96-.182,1.596-.182h.303v1.799Z"/>
                    </svg>
                </Button>
                <Button variant={"none"} p={0.5} active>
                    <IconHomeFilled color={"#fff"} size={16}/>
                </Button>
                <Button variant={"none"} p={0.5}>
                    <IconAppsFilled color={"#fff"} size={16}/>
                </Button>
                <Flex style={{marginTop: "auto", boxSizing: "border-box", flexDirection: 'column', gap: "0.7rem"}}>
                    <Button variant={"none"} p={0.5} style={{marginTop: 'auto'}}>
                        <IconSettingsFilled color={"#fff"} size={16}/>
                    </Button>
                    <Button variant={"none"} p={0.5} style={{marginTop: 'auto'}}>
                        <IconArrowAutofitLeftFilled color={"#fff"} size={16}/>
                    </Button>
                    <Button variant={"none"} p={0.5} style={{marginTop: 'auto'}}>
                        <Avatar type={"character"} identifier={"Nico Sammito"} size={16}/>
                    </Button>
                </Flex>
            </Flex>
        }>
            <Layout showLayoutSplitter={false} layoutGap={16} leftContent={
                <div style={{
                    height: "100%",
                    boxSizing: "border-box",
                    borderRadius: "1rem",
                }}>
                    <Flex h={"100%"} style={{boxSizing: "border-box", flexDirection: 'column', gap: "1.3rem"}}>
                        <Button paddingSize={"xxs"} justify={"flex-start"} w={"100%"} variant={"none"}>
                            <IconSearch size={16}/>
                            <Text size={"md"} hierarchy={"tertiary"}>
                                Search...
                            </Text>
                        </Button>
                        {/* ── Workspaces: the primary navigation at this level ── */}
                        <Flex style={{boxSizing: "border-box", flexDirection: 'column'}}>
                            <Flex align={"center"} justify={"space-between"}>
                                <Text pl={0.7} hierarchy={"tertiary"}>
                                    Workspaces
                                </Text>
                                <Badge color={"secondary"}>
                                    {workspaces.length}
                                </Badge>
                            </Flex>
                            <Spacing spacing={"xxs"}/>
                            {workspaces.map((w) => (
                                <Button key={w.name} variant={"none"} w={"100%"} justify={"flex-start"}
                                        paddingSize={"xxs"}>
                                    <Avatar bg={"transparent"} color={hashToColor(w.name, 0, 100)} identifier={w.name}
                                            size={13}/>
                                    <Text size={"md"}>
                                        {w.name}
                                    </Text>
                                </Button>
                            ))}
                            <Button variant={"none"} w={"100%"} justify={"flex-start"}
                                    paddingSize={"xxs"}>
                                <IconPlus size={13}/>
                                <Text size={"md"} hierarchy={"tertiary"}>
                                    Add Workspace
                                </Text>
                            </Button>
                        </Flex>
                        <div style={{
                            borderTop: "1px dashed rgba(255,255,255, .1)",
                        }}/>
                        {/* ── Recent projects across every workspace ── */}
                        <Flex style={{boxSizing: "border-box", flexDirection: 'column'}}>
                            <Flex align={"center"} justify={"space-between"}>
                                <Text pl={0.7} hierarchy={"tertiary"}>
                                    Recent projects
                                </Text>
                                <Badge color={"secondary"}>
                                    {recentProjects.length}
                                </Badge>
                            </Flex>
                            <Spacing spacing={"xxs"}/>
                            {recentProjects.map((p) => (
                                <Button key={p.name} variant={"none"} w={"100%"} justify={"flex-start"}
                                        paddingSize={"xxs"}>
                                    <Avatar identifier={p.name} color={hashToColor(p.name, 200, 300)} size={13}/>
                                    <Text size={"md"}>
                                        {p.name}
                                    </Text>
                                </Button>
                            ))}
                        </Flex>
                    </Flex>
                </div>
            }>
                <Layout showLayoutSplitter={false} layoutGap={16}>
                    <div style={{
                        background: "var(--primary)",
                        height: "100%",
                        position: "relative",
                        boxSizing: "border-box",
                        borderRadius: "1rem",
                        padding: "1rem",
                    }}>
                        <AuroraBackground/>
                        <ScrollArea style={{position: "absolute", inset: 0, zIndex: 1}}>
                            <ScrollAreaViewport>
                                <div style={{maxWidth: "52rem", margin: "0 auto", padding: "4rem 1rem"}}>

                                    {/* ── Account-wide summary: four numbers + trend, hairline dividers ── */}
                                    <Card color={"secondary"}>
                                        <Flex align={"center"}>
                                            {stats.map((s, i) => (
                                                <React.Fragment key={s.label}>
                                                    {i > 0 && <div style={{
                                                        width: 1,
                                                        alignSelf: "stretch",
                                                        background: "rgba(255,255,255,0.08)",
                                                        margin: "0 1.5rem",
                                                    }}/>}
                                                    <Flex style={{flexDirection: "column", gap: "0.7rem", flex: 1}}>
                                                        <Flex align={"center"} justify={"space-between"}
                                                              style={{gap: "0.5rem"}}>
                                                            <Text size={"sm"} hierarchy={"tertiary"}>{s.label}</Text>
                                                            <Badge color={s.tone === "warning" ? "warning" : "success"}>
                                                                {s.tone === "success" && <IconTrendingUp size={12}/>}
                                                                {s.delta}
                                                            </Badge>
                                                        </Flex>
                                                        <Text fz={3} style={{lineHeight: 0.9}} fw={600}>{s.value}</Text>
                                                    </Flex>
                                                </React.Fragment>
                                            ))}
                                        </Flex>
                                    </Card>

                                    <Spacing spacing={"md"}/>

                                    {/* ── Slim attention banner: flows across workspaces needing action ── */}
                                    <Card color={"secondary"} className={"card--hover"}>
                                        <Flex align={"center"} justify={"space-between"} style={{gap: "0.75rem"}}>
                                            <Flex align={"center"} style={{gap: "0.75rem", minWidth: 0}}>
                                                <div style={{
                                                    width: 8,
                                                    height: 8,
                                                    borderRadius: "50%",
                                                    background: "#FFBE0B",
                                                    flexShrink: 0
                                                }}/>
                                                <Text size={"md"}>2 flows need attention</Text>
                                                <Text size={"sm"} hierarchy={"tertiary"}>
                                                    in GLS workspace and Acme Robotics
                                                </Text>
                                            </Flex>
                                            <IconChevronRight size={16}/>
                                        </Flex>
                                    </Card>

                                    <Spacing spacing={"lg"}/>

                                    {/* ── Workspaces: header with filter, sort & create ── */}
                                    <Flex align={"center"} justify={"space-between"} style={{gap: "0.5rem"}}>
                                        <Flex align={"center"} style={{gap: "0.5rem"}}>
                                            <Text hierarchy={"tertiary"} size={"md"}>Workspaces</Text>
                                            <Badge color={"secondary"}>{visibleWorkspaces.length}</Badge>
                                        </Flex>

                                        <ButtonGroup>
                                            {/* Filter */}
                                            <Menu>
                                                <MenuTrigger asChild>
                                                    <Button variant={"none"} paddingSize={"xxs"}
                                                            active={filter !== "all"}>
                                                        <IconAdjustmentsHorizontal size={13}/>
                                                    </Button>
                                                </MenuTrigger>
                                                <MenuPortal>
                                                    <MenuContent sideOffset={8} align={"end"}>
                                                        <MenuLabel>Filter</MenuLabel>
                                                        {(Object.keys(filterLabels) as (keyof typeof filterLabels)[]).map((k) => (
                                                            <MenuItem key={k} onSelect={() => setFilter(k)}>
                                                                <IconCheck size={13}
                                                                           color={filter === k ? undefined : "transparent"}/>
                                                                {filterLabels[k]}
                                                            </MenuItem>
                                                        ))}
                                                    </MenuContent>
                                                </MenuPortal>
                                            </Menu>

                                            {/* Sort */}
                                            <Menu>
                                                <MenuTrigger asChild>
                                                    <Button variant={"none"} paddingSize={"xxs"}>
                                                        <IconArrowsSort size={13}/>
                                                    </Button>
                                                </MenuTrigger>
                                                <MenuPortal>
                                                    <MenuContent sideOffset={8} align={"end"}>
                                                        <MenuLabel>Sort by</MenuLabel>
                                                        {(Object.keys(sortLabels) as (keyof typeof sortLabels)[]).map((k) => (
                                                            <MenuItem key={k} onSelect={() => setSort(k)}>
                                                                <IconCheck size={13}
                                                                           color={sort === k ? undefined : "transparent"}/>
                                                                {sortLabels[k]}
                                                            </MenuItem>
                                                        ))}
                                                    </MenuContent>
                                                </MenuPortal>
                                            </Menu>

                                            {/* Create */}
                                            <Button variant={"none"} paddingSize={"xxs"}>
                                                <IconPlus size={13}/>
                                            </Button>
                                        </ButtonGroup>
                                    </Flex>
                                    <Spacing spacing={"xs"}/>

                                    {/* ── The grid users choose from; create sits in the same grid ── */}
                                    <div style={{
                                        display: "grid",
                                        gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
                                        gap: "0.9rem",
                                        alignItems: "stretch",
                                    }}>
                                        {visibleWorkspaces.map((w) => (
                                            <Card key={w.name} color={"secondary"} className={"card--hover"}
                                                  style={w.personal ? {
                                                      border: "1px solid var(--info)",
                                                  } : undefined}>
                                                <Flex style={{flexDirection: "column", gap: "1.25rem"}}>
                                                    {/* identity: avatar, name (+ personal marker) and description */}
                                                    <Flex align={"center"} style={{gap: "0.85rem"}}>
                                                        <Avatar type={w.personal ? "character" : undefined}
                                                                color={hashToColor(w.name, 0, 100)}
                                                                bg={"transparent"} identifier={w.name} size={24}/>
                                                        <Flex align={"flex-start"} style={{
                                                            flexDirection: "column",
                                                            gap: "0.2rem",
                                                            minWidth: 0,
                                                            flex: 1,
                                                        }}>
                                                            <Flex align={"center"} style={{gap: "0.5rem", minWidth: 0}}>
                                                                <Text fw={500}>{w.name}</Text>
                                                                {w.personal &&
                                                                    <Badge color={"info"}>Personal</Badge>}
                                                            </Flex>
                                                            <Text size={"sm"} hierarchy={"tertiary"}>
                                                                {w.description}
                                                            </Text>
                                                        </Flex>
                                                    </Flex>
                                                    {/* metadata: one calm, labelled line */}
                                                    <Flex align={"center"} style={{gap: "1.25rem"}}>
                                                        <Flex align={"center"} style={{gap: "0.4rem"}}>
                                                            <IconFolders size={15}/>
                                                            <Text size={"sm"} hierarchy={"tertiary"}>
                                                                {w.projects} projects
                                                            </Text>
                                                        </Flex>
                                                        <Flex align={"center"} style={{gap: "0.4rem"}}>
                                                            <IconRoute size={15}/>
                                                            <Text size={"sm"} hierarchy={"tertiary"}>
                                                                {w.flows} flows
                                                            </Text>
                                                        </Flex>
                                                        <Flex align={"center"} style={{gap: "0.4rem"}}>
                                                            <IconUsers size={15}/>
                                                            <Text size={"sm"} hierarchy={"tertiary"}>
                                                                {w.members} members
                                                            </Text>
                                                        </Flex>
                                                    </Flex>
                                                </Flex>
                                            </Card>
                                        ))}

                                        {/* create-workspace affordance, matching card footprint */}
                                        <Button variant={"none"} h={"100%"} w={"100%"} style={{
                                            border: "1px dashed rgba(255,255,255, .15)",
                                            borderRadius: "0.75rem",
                                        }}>
                                            <Flex align={"center"} justify={"center"} style={{
                                                flexDirection: "column",
                                                gap: "0.4rem",
                                            }}>
                                                <IconPlus size={18}/>
                                                <Text size={"md"} hierarchy={"tertiary"}>
                                                    Create workspace
                                                </Text>
                                            </Flex>
                                        </Button>
                                    </div>
                                </div>
                            </ScrollAreaViewport>
                            <ScrollAreaScrollbar orientation={"vertical"}>
                                <ScrollAreaThumb/>
                            </ScrollAreaScrollbar>
                        </ScrollArea>
                    </div>
                </Layout>
            </Layout>
        </Layout>
    </FullScreen>
}