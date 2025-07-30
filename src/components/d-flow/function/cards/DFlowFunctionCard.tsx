import {Code0Component} from "../../../../utils/types";
import {Handle, Node, NodeProps, Position, useReactFlow, useStore} from "@xyflow/react";
import {NodeFunctionObject, NodeParameterObject} from "../../DFlow.view";
import React, {memo} from "react";
import Card from "../../../card/Card";
import "./DFlowFunctionCard.style.scss";
import CardSection from "../../../card/CardSection";
import Flex from "../../../flex/Flex";
import {
    IconAlertTriangle,
    IconCopy,
    IconDots,
    IconExclamationCircle,
    IconFileLambdaFilled,
    IconGripVertical, IconMessageExclamation,
    IconTrash
} from "@tabler/icons-react";
import Text from "../../../text/Text";
import Button from "../../../button/Button";
import {Menu, MenuContent, MenuItem, MenuLabel, MenuPortal, MenuTrigger} from "../../../menu/Menu";
import Badge from "../../../badge/Badge";
import {useService} from "../../../../utils/contextStore";
import {DFlowFunctionReactiveService} from "../DFlowFunction.service";
import {useFunctionValidation} from "../DFlowFunction.vaildation.hook";
import {DFlowDataTypeReactiveService} from "../../data-type/DFlowDataType.service";
import {InspectionSeverity} from "../../../../utils/inspection";

type CodeZeroComponentProps = Code0Component<HTMLDivElement>;

// @ts-ignore
export interface DFlowFunctionCardProps extends NodeProps<Node<CodeZeroComponentProps & NodeFunctionObject>> {
}

export const DFlowFunctionCard: React.FC<DFlowFunctionCardProps> = memo((props) => {
    const {data, id} = props;
    const functionData = data as NodeFunctionObject & { isParameter: boolean };

    const viewportWidth = useStore(s => s.width);
    const viewportHeight = useStore(s => s.height);
    const flowInstance = useReactFlow()
    const functionService = useService(DFlowFunctionReactiveService)
    const definition = functionService.getFunctionDefinition(data.function.function_id)
    const validation = useFunctionValidation(definition!!, data.parameters!!.map(p => p.value!!), useService(DFlowDataTypeReactiveService)!!)
    console.log(validation)
    validation && console.log(definition, data.parameters!!.map(p => p.value!!), validation)
    // Greife auf alle aktuellen Edges im Flow zu:
    const edges = useStore(s => s.edges);

    // Helper, ob zu diesem Parameter eine Edge existiert:
    function isParamConnected(paramId: string): boolean {
        return edges.some(e =>
            e.target === id &&
            e.targetHandle === `param-${paramId}`
        );
    }

    return (
        <Card w={300} color={"secondary"} onClick={() => {
            flowInstance.setViewport({
                x: (viewportWidth / 2) + (props.positionAbsoluteX * -1) - 150,
                y: (viewportHeight / 2) + (props.positionAbsoluteY * -1) - 50,
                zoom: 1
            }, {
                duration: 250,
            })
        }} style={{position: "relative"}}>

            <CardSection border>
                <Flex align={"center"} justify={"space-between"} style={{gap: "0.7rem"}}>
                    <Flex align={"center"} style={{gap: "0.7rem"}}>
                        <IconFileLambdaFilled size={16}/>
                        <Text size={"md"}>{functionData.function.function_id}</Text>
                    </Flex>
                    <Flex align={"center"} style={{gap: "0.7rem"}}>
                        <Menu modal={true}>
                            <MenuTrigger asChild>
                                <Button variant={"none"}>
                                    <IconDots size={16}/>
                                </Button>
                            </MenuTrigger>
                            <MenuPortal>
                                <MenuContent>
                                    <MenuLabel>Actions</MenuLabel>
                                    <MenuItem><IconTrash size={16}/> Delete node</MenuItem>
                                    <MenuItem disabled><IconCopy size={16}/> Copy node</MenuItem>
                                </MenuContent>
                            </MenuPortal>
                        </Menu>
                        <Button disabled>
                            <IconGripVertical size={16}/>
                        </Button>
                    </Flex>
                </Flex>
            </CardSection>

            <Handle
                isConnectable={false}
                draggable={false}
                type="target"
                className={"function-card__handle function-card__handle--target"}
                style={{...(functionData.isParameter ? {right: "1rem"} : {top: "1rem"})}}
                position={functionData.isParameter ? Position.Right : Position.Top}
            />

            <div className={"function-card__inspection"}>
                <Flex style={{gap: "0.35rem"}}>
                    {(validation?.filter(v => v.type === InspectionSeverity.ERROR)?.length ?? 0) > 0 ? (
                        <Badge color={"error"}>
                            <Flex align={"center"} style={{gap: "0.35rem"}}>
                                <IconExclamationCircle size={12}/>
                                {validation?.filter(v => v.type === InspectionSeverity.ERROR)?.length}
                            </Flex>
                        </Badge>
                    ) : null}

                    {(validation?.filter(v => v.type === InspectionSeverity.WARNING)?.length ?? 0) > 0 ? (
                        <Badge color={"warning"}>
                            <Flex align={"center"} style={{gap: "0.35rem"}}>
                                <IconAlertTriangle size={12}/>
                                {validation?.filter(v => v.type === InspectionSeverity.WARNING)?.length}
                            </Flex>
                        </Badge>
                    ) : null}

                    {(validation?.filter(v => v.type === InspectionSeverity.GRAMMAR)?.length ?? 0) > 0 ? (
                        <Badge>
                            <Flex align={"center"} style={{gap: "0.35rem"}}>
                                <IconMessageExclamation size={12}/>
                                {validation?.filter(v => v.type === InspectionSeverity.GRAMMAR)?.length}
                            </Flex>
                        </Badge>
                    ) : null}
                </Flex>
            </div>

            {/* Dynamische Parameter-Eingänge (rechts), nur wenn wirklich verbunden */}
            {functionData.parameters?.map((param: NodeParameterObject, index: number) => (
                <Flex pos={"relative"}>
                    {param.definition.parameter_id}
                    <Handle
                        key={param.definition.parameter_id}
                        type="target"
                        position={Position.Right}
                        style={{position: "absolute", transform: "translate(50%, -50%)", top: "50%", right: "0"}}
                        id={`param-${param.definition.parameter_id}`}
                        isConnectable={false}
                        hidden={!isParamConnected(param.definition.parameter_id)}
                        className={"function-card__handle function-card__handle--target"}
                    />
                </Flex>
            ))}

            {/* Ausgang */}
            <Handle
                isConnectable={false}
                type="source"
                style={{...(functionData.isParameter ? {left: "1rem"} : {bottom: "1rem"})}}
                className={"function-card__handle function-card__handle--source"}
                position={functionData.isParameter ? Position.Left : Position.Bottom}
            />
        </Card>
    );
});