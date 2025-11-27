import {Panel} from "@xyflow/react";
import React from "react";
import type {Scalars} from "@code0-tech/sagittarius-graphql-types";
import {Flex} from "../../flex/Flex";
import {InspectionSeverity, ValidationResult} from "../../../utils/inspection";
import {Badge} from "../../badge/Badge";
import {IconAlertTriangle, IconExclamationCircle, IconMessageExclamation} from "@tabler/icons-react";
import "./DFlowValidation.style.scss"
import {Text} from "../../text/Text";
import {useDFlowValidations} from "./DFlowValidation.hook";

export interface DFlowValidationProps {
    flowId: Scalars['FlowID']['output']
}

export const DFlowValidation: React.FC<DFlowValidationProps> = (props) => {

    const {flowId} = props
    const validations: ValidationResult[] = useDFlowValidations(flowId)

    return <Panel position="top-right">
        {(validations?.length ?? 0) > 0 ? (
            <div className={"d-flow-viewport-validations"}>
                <Flex align={"center"} style={{gap: "0.7rem"}}>
                    {(validations?.filter(v => v.type === InspectionSeverity.ERROR)?.length ?? 0) > 0 ? (
                        <Badge border color={"error"}>
                            <Flex align={"center"} style={{gap: "0.35rem"}}>
                                <IconExclamationCircle size={16}/>
                                <Text style={{color: "inherit"}}>{validations?.filter(v => v.type === InspectionSeverity.ERROR)?.length}</Text>
                            </Flex>
                        </Badge>
                    ) : null}

                    {(validations?.filter(v => v.type === InspectionSeverity.WARNING)?.length ?? 0) > 0 ? (
                        <Badge border color={"warning"}>
                            <Flex align={"center"} style={{gap: "0.35rem"}}>
                                <IconAlertTriangle size={16}/>
                                {validations?.filter(v => v.type === InspectionSeverity.WARNING)?.length}
                            </Flex>
                        </Badge>
                    ) : null}

                    {(validations?.filter(v => v.type === InspectionSeverity.GRAMMAR)?.length ?? 0) > 0 ? (
                        <Badge border>
                            <Flex align={"center"} style={{gap: "0.35rem"}}>
                                <IconMessageExclamation size={16}/>
                                {validations?.filter(v => v.type === InspectionSeverity.GRAMMAR)?.length}
                            </Flex>
                        </Badge>
                    ) : null}
                </Flex>
            </div>
        ) : null}
    </Panel>
}