import React from "react";
import Card, {CardType} from "../card/Card";
import "./Quote.style.scss"
import Text from "../text/Text";
import CardSection from "../card/CardSection";

export interface QuoteType extends Omit<CardType, "children"> {
    children: string
    logo?: string
    name: string
    position: string
    // defaults to true
    inlineBorder?: boolean
}

const Quote: React.FC<QuoteType> = (props) => {
    const {logo, name, position, inlineBorder = true, children, ...args} = props;
    return <Card {...args}>
        <div className={"quote"}>
            <CardSection border={inlineBorder}>
                <div className={"quote__text"}>
                    {children}
                </div>
            </CardSection>
            <CardSection className={"quote__footer"}>
                {
                    !!logo ? <div>
                        <img className={"quote__img"} src={logo} alt={"logo of quote"}/>
                    </div> : null
                }
                <div>
                    <Text size={"md"} hierarchy={"primary"} m={0}>{name}</Text>
                    <Text size={"sm"}>{position}</Text>
                </div>
            </CardSection>
        </div>
    </Card>
}

export default Quote;