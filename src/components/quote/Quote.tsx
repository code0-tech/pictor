import React from "react";
import {TablerIconsProps} from "@tabler/icons-react";
import Card from "../card/Card";
import "./Quote.style.scss"

export interface QuoteType {
    children: React.ReactNode,
    logo: string,
    name: string,
    position: string,
}


export interface QuoteLogo {
    children: React.ReactElement<TablerIconsProps>
}

export const Quote: React.FC<QuoteType> = (props) => {
    const {logo, children} = props;
    return <Card>
        <div className={"quote"}>
            <Card.Section>
                <div className={"quote__text"}>
                    {children}
                </div>
            </Card.Section>
            <Card.Section>
                <img className={"quote__img"} src={logo} alt={"logo"}/>
            </Card.Section>

        </div>
    </Card>
}