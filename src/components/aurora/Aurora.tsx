"use client";

import React, {HTMLAttributes} from "react";
import "./Aurora.style.scss";

export interface AuroraBackgroundProps extends HTMLAttributes<HTMLDivElement> {
    showRadialGradient?: boolean;
}

export const AuroraBackground: React.FC<AuroraBackgroundProps> = ({
                                                                      className,
                                                                      showRadialGradient = true,
                                                                      ...props
                                                                  }) => {
    const rootClassNames = [
        "aurora-background",
        showRadialGradient && "aurora-background--radial-mask",
        className,
    ]
        .filter(Boolean)
        .join(" ");

    return (
        <div className={rootClassNames} {...props}>
            <div className="aurora-background__overlay">
                <div className="aurora-background__aurora"/>
            </div>
        </div>
    );
};