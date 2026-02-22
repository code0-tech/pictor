import React from "react";
import { Card } from "../card/Card";
import { Flex } from "../flex/Flex";
import { Text } from "../text/Text";
import { Badge } from "../badge/Badge";
import { Button } from "../button/Button";
import { IconChevronDown, IconChevronUp, IconEdit } from "@tabler/icons-react";
import DFlowInputObjectEditDialog from "./DFlowInputObjectEditDialog";
import "./DFlowInputDataType.style.scss";
import { hashToColor } from "../../utils";

export interface DFlowInputObjectProps {
  data: any;
  label?: string;
}

export interface DFlowInputObjectRuleTreeProps {
  object: any;
  parentKey?: string;
  isRoot?: boolean;
  onRuleClick: (rule: any) => void;
  collapsedState: Record<string, boolean>;
  setCollapsedState: (path: string[], collapsed: boolean) => void;
  path?: string[];
}

export const DFlowInputObjectRuleTree: React.FC<DFlowInputObjectRuleTreeProps & {
  activePath?: string[] | null;
  onDoubleClick?: (path: string[], isCollapsed: boolean) => void;
  parentColor?: string;
}> = ({
  object,
  parentKey,
  isRoot = !parentKey,
  onRuleClick,
  collapsedState,
  setCollapsedState,
  path = [],
  activePath = null,
  onDoubleClick,
  parentColor,
}) => {
  const clickTimeout = React.useRef<NodeJS.Timeout | null>(null);

  if (typeof object !== "object" || object === null) return null;

  const handleClick = (rule: any) => {
    if (clickTimeout.current) clearTimeout(clickTimeout.current);
    clickTimeout.current = setTimeout(() => {
      onRuleClick(rule);
    }, 200);
  };

  const handleDoubleClick = (currentPath: string[], isCollapsed: boolean) => {
    if (clickTimeout.current) clearTimeout(clickTimeout.current);
    if (onDoubleClick) {
      onDoubleClick(currentPath, isCollapsed);
    } else {
      setCollapsedState(currentPath, !isCollapsed);
    }
  };

  const renderRoot = () => {
    const currentPath = [...path];
    const pathKey = "root";
    const isCollapsed = collapsedState[pathKey] || false;
    const isCollapsable = typeof object === "object" && object !== null && (Array.isArray(object) ? object.length > 0 : Object.keys(object).length > 0);
    const isActive = Array.isArray(activePath) && activePath.length === 0 && parentKey === undefined;
    const icon = isCollapsable ? (isCollapsed ? <IconChevronUp size={13} /> : <IconChevronDown size={13} />) : null;
    return (
      <div
        onClick={e => {
          e.stopPropagation();
          handleClick({ key: pathKey, value: object, path: currentPath });
        }}
        onDoubleClick={e => {
          e.stopPropagation();
          handleDoubleClick(currentPath, isCollapsed);
        }}
        aria-selected={isActive || undefined}
      >
        <Flex align="center" style={{ gap: ".35rem", textWrap: "nowrap" }} aria-selected={isActive || undefined} className="rule">
          {icon}
          <Text hierarchy="tertiary">{Array.isArray(object) ? "is a list of" : "is a nested object"}</Text>
        </Flex>
        {!isCollapsed && <ul>{renderNodes}</ul>}
      </div>
    );
  };

  const renderNodes = Object.entries(object).map(([key, value]) => {
    const currentPath = [...path, key];
    const pathKey = currentPath.join(".");
    const isCollapsed = collapsedState[pathKey] || false;
    const isActive = activePath && activePath.length > 0 && currentPath.join(".") === activePath.join(".");
    const parentColorValue = parentColor ?? hashToColor("root");
    const isCollapsable = typeof value === "object" && value !== null && (Array.isArray(value) ? value.length > 0 : Object.keys(value).length > 0);
    const collapsableColor = isCollapsable ? hashToColor(pathKey) : parentColorValue;
    const icon = isCollapsable ? (isCollapsed ? <IconChevronUp size={13} /> : <IconChevronDown size={13} />) : null;
    const label = isCollapsable ? (
      <Flex align="center" style={{ gap: ".35rem", textWrap: "nowrap" }} className="rule" aria-selected={isActive || undefined}>
        {icon}
        <Badge border color={collapsableColor} style={{ verticalAlign: "middle" }}>
          <Text size="xs" style={{ color: "inherit" }}>{key}</Text>
        </Badge>
        <Text hierarchy="tertiary">{Array.isArray(value) ? "is a list of" : "is a nested object"}</Text>
      </Flex>
    ) : (
      <Flex align="center" style={{ gap: ".35rem", textWrap: "nowrap" }} className="rule" aria-selected={isActive || undefined}>
        <Badge border color={parentColorValue} style={{ verticalAlign: "middle" }}>
          <Text size="xs" style={{ color: "inherit" }}>{key}</Text>
        </Badge>
        <Text hierarchy="tertiary">has value</Text>
        <Badge border color={"tertiary"} style={{ verticalAlign: "middle" }}>
          <Text size="xs" style={{ color: "inherit" }}>{String(value)}</Text>
        </Badge>
      </Flex>
    );
    const childTree = isCollapsable && !isCollapsed ? (
      <DFlowInputObjectRuleTree
        object={value}
        parentKey={key}
        isRoot={false}
        onRuleClick={onRuleClick}
        collapsedState={collapsedState}
        setCollapsedState={setCollapsedState}
        path={currentPath}
        activePath={activePath}
        parentColor={collapsableColor}
      />
    ) : null;
    return (
      <li key={pathKey}>
        <div
          onClick={e => {
            e.stopPropagation();
            handleClick({ key, value, path: currentPath });
          }}
          onDoubleClick={e => {
            e.stopPropagation();
            handleDoubleClick(currentPath, isCollapsed);
          }}
        >
          {label}
          {childTree}
        </div>
      </li>
    );
  });

  const rootNode = renderRoot();
  const nodes = rootNode && isRoot ? [rootNode] : renderNodes;
  const validNodes = nodes.filter(Boolean);
  if (validNodes.length === 0) return null;
  return <ul>{validNodes}</ul>;
};

export const DFlowInputObject: React.FC<DFlowInputObjectProps> = ({ data, label }) => {
  const [editDialogOpen, setEditDialogOpen] = React.useState(false);
  const [editRule, setEditRule] = React.useState<any>(null);
  const [collapsedState, setCollapsedStateRaw] = React.useState<Record<string, boolean>>({});

  const setCollapsedState = (path: string[], collapsed: boolean) => {
    setCollapsedStateRaw(prev => ({ ...prev, [path.join(".")]: collapsed }));
  };

  const handleRuleClick = (rule: any) => {
    setEditRule(rule);
  };

  React.useEffect(() => {
    if (editRule) {
      setEditDialogOpen(true);
    }
  }, [editRule]);

  return (
    <div>
      <DFlowInputObjectEditDialog
        open={editDialogOpen}
        rule={editRule}
        originalObject={data}
        onClose={() => setEditDialogOpen(false)}
      />
      <Card color="secondary" paddingSize="xs">
        <Flex style={{ gap: ".7rem" }} align="center" justify="space-between">
          <Flex style={{ gap: ".35rem" }} align="center">
            <Text>{label ?? "Object"}</Text>
          </Flex>
          <Button paddingSize="xxs" variant="filled" color="tertiary" onClick={() => setEditDialogOpen(true)}>
            <IconEdit size={13} />
          </Button>
        </Flex>
        <Card paddingSize="xs" mt={0.7} mb={-0.55} mx={-0.55}>
          <DFlowInputObjectRuleTree
            object={data}
            onRuleClick={handleRuleClick}
            collapsedState={collapsedState}
            setCollapsedState={setCollapsedState}
          />
        </Card>
      </Card>
    </div>
  );
};

