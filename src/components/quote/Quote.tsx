import React from "react";
import Card, {CardType} from "../card/Card";
import "./Quote.style.scss"
import Text from "../Text/Text";

export interface QuoteType extends Omit<CardType, "children"> {
    children: string
    logo: string
    name: string
    position: string
    // defaults to true
    inlineBorder?: boolean
}

const Quote: React.FC<QuoteType> = (props) => {
    const {logo, name, position, inlineBorder = true, children, ...args} = props;
    return <Card {...args}>
        <div className={"quote"}>
            <Card.Section border={inlineBorder}>
                <div className={"quote__text"}>
                    {children}
                </div>
            </Card.Section>
            <Card.Section>
                <img className={"quote__img"} src={logo} alt={"logo of quote"}/>
            </Card.Section>
            <Card.Section>
                <Text size={"md"} hierarchy={"primary"}>{name}</Text><br/>
                <Text size={"sm"}>{position}</Text>
            </Card.Section>
        </div>
    </Card>
}

export default Quote;