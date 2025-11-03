import {Panel} from "@xyflow/react";
import React from "react";
import {useDFlowValidations} from "./DFlow.validation.hook";
import {Scalars} from "@code0-tech/sagittarius-graphql-types";
import Flex from "../flex/Flex";
import {InspectionSeverity} from "../../utils/inspection";
import Badge from "../badge/Badge";
import {IconAlertTriangle, IconExclamationCircle, IconMessageExclamation} from "@tabler/icons-react";
import "./DFlowValidation.style.scss"

export interface DFlowValidationProps {
    flowId: Scalars['FlowID']['output']
}

export const DFlowValidation: React.FC<DFlowValidationProps> = (props) => {

    const {flowId} = props
    const validations = useDFlowValidations(flowId)

    return <Panel position="top-right">
        {(validations?.length ?? 0) > 0 ? (
            <div className={"d-flow-viewport-validations"}>
                <Flex style={{gap: "0.35rem"}}>
                    {(validations?.filter(v => v.type === InspectionSeverity.ERROR)?.length ?? 0) > 0 ? (
                        <Badge color={"error"}>
                            <Flex align={"center"} style={{gap: "0.35rem"}}>
                                <IconExclamationCircle size={12}/>
                                {validations?.filter(v => v.type === InspectionSeverity.ERROR)?.length}
                            </Flex>
                        </Badge>
                    ) : null}

                    {(validations?.filter(v => v.type === InspectionSeverity.WARNING)?.length ?? 0) > 0 ? (
                        <Badge color={"warning"}>
                            <Flex align={"center"} style={{gap: "0.35rem"}}>
                                <IconAlertTriangle size={12}/>
                                {validations?.filter(v => v.type === InspectionSeverity.WARNING)?.length}
                            </Flex>
                        </Badge>
                    ) : null}

                    {(validations?.filter(v => v.type === InspectionSeverity.GRAMMAR)?.length ?? 0) > 0 ? (
                        <Badge>
                            <Flex align={"center"} style={{gap: "0.35rem"}}>
                                <IconMessageExclamation size={12}/>
                                {validations?.filter(v => v.type === InspectionSeverity.GRAMMAR)?.length}
                            </Flex>
                        </Badge>
                    ) : null}
                </Flex>
            </div>
        ) : null}
    </Panel>
}