import MultiSelect from "./MultiSelect";
import {Meta, StoryObj} from "@storybook/react";
import React from "react";
import Badge from "../badge/Badge";
import Card from "../card/Card";


const meta: Meta = {
    title: "MultiSelect",
    component: MultiSelect,
    argTypes: {
        clearable: {
            type: "boolean"
        },
        placement: {
            options: ['left start', 'left end', 'bottom start', 'bottom end', 'top start', 'top end', 'right start', 'right end'],
            control: {type: 'radio'},
        },
        placeholder: {
            type: "string"
        },
        disabled: {
            type: "boolean"
        },
        maxValues: {
            type: "number"
        },
        minValues: {
            type: "number"
        }
    }
}


export default meta;

type MenuStory = StoryObj<typeof MultiSelect>

export const BasicMultiSelect: MenuStory = {
    render: (args) => {
        const {placement, placeholder, disabled, maxValues, minValues} = args

        const arr: React.ReactElement[] = [];

        for (let i = 0; i < 100; i++) {
            arr.push(<MultiSelect.Option key={i}>{i}</MultiSelect.Option>)
        }

        return <div style={{width: "300px"}}>
            <MultiSelect maxValues={maxValues} minValues={minValues} disabled={disabled}  placement={placement}
                         placeholder={placeholder}>
                {arr}
            </MultiSelect>
        </div>

    },
    args: {
        placement: "bottom start",
        placeholder: "Placeholder",
        disabled: false,
        maxValues: -1,
        minValues: -1
    }
}


export const CarSelection: MenuStory = {
    render: (args) => {
        const {placement, placeholder, disabled, maxValues, minValues} = args

        return <div style={{width: "300px"}}>
            <MultiSelect disabled={disabled} minValues={minValues} maxValues={maxValues} placement={placement}
                          placeholder={placeholder}>
                <MultiSelect.Option key={"Mercedes"}><Badge>Mercedes</Badge></MultiSelect.Option>
                <MultiSelect.Option key={"BMW"}><Badge>BMW</Badge></MultiSelect.Option>
                <MultiSelect.Option key={"Toyota"}><Badge>Toyota</Badge></MultiSelect.Option>
                <MultiSelect.Option key={"Tesla"}><Badge>Tesla</Badge></MultiSelect.Option>
                <MultiSelect.Option key={"Jeep"}><Badge>Jeep</Badge></MultiSelect.Option>
                <MultiSelect.Option key={"Chevrolet"}><Badge>Chevrolet</Badge></MultiSelect.Option>
                <MultiSelect.Option key={"Honda"}><Badge>Honda</Badge></MultiSelect.Option>
                <MultiSelect.Option key={"Ford"}><Badge>Ford</Badge></MultiSelect.Option>
            </MultiSelect>
        </div>

    },
    args: {
        placement: "bottom start",
        placeholder: "Select your 2 favorite Car Brand",
        disabled: false,
        minValues: 1,
        maxValues: 2
    }
}

export const UserSelection: MenuStory = {
    render: (args) => {
        const {placement, placeholder, disabled, maxValues, minValues} = args

        return <div style={{width: "300px"}}>
            <MultiSelect disabled={disabled} minValues={minValues} maxValues={maxValues} placement={placement}
                         placeholder={placeholder}>
                <MultiSelect.Option key={"Nico"}><Card>
                    <Card.Image src={"https://cdn.discordapp.com/avatars/456437986238791701/52e17b56cd6b4789a910f5cf9ecb56cc.webp?size=128"}></Card.Image>
                    <Card.Title>Nico</Card.Title>
                </Card></MultiSelect.Option>
                <MultiSelect.Option key={"Niklas"}><Card>
                    <Card.Image src={"https://cdn.discordapp.com/avatars/444889694002741249/e39a7eb2f4a435b72011bffb3336f2e1.webp?size=128"}></Card.Image>
                    <Card.Title>Niklas</Card.Title>
                </Card></MultiSelect.Option>
                <MultiSelect.Option key={"Raphael"}><Card>
                    <Card.Image src={"https://cdn.discordapp.com/avatars/329279009298841600/e535ff33fad78bb85d4c762b1df11a67.webp?size=128"}></Card.Image>
                    <Card.Title>Raphael</Card.Title>
                </Card></MultiSelect.Option>
                <MultiSelect.Option key={"f4ls3"}><Card>
                    <Card.Image src={"https://cdn.discordapp.com/avatars/404398262788030464/a8c96fd9e4a834fdd9fac16e72aa9aef.webp?size=128"}></Card.Image>
                    <Card.Title>f4ls3</Card.Title>
                </Card></MultiSelect.Option>
                <MultiSelect.Option key={"Raoul"}><Card>
                    <Card.Image src={"https://cdn.discordapp.com/avatars/254230363642134528/638a3b00c618f21c967a4d7b4b89753d.webp?size=128"}></Card.Image>
                    <Card.Title>Raoul</Card.Title>
                </Card></MultiSelect.Option>
                <MultiSelect.Option key={"Nicusch"}><Card>
                    <Card.Image src={"https://cdn.discordapp.com/avatars/380808844093292555/d5eb63a0b6d96ed36cd4879b8d124ad5.webp?size=128"}></Card.Image>
                    <Card.Title>Nicusch</Card.Title>
                </Card></MultiSelect.Option>
                <MultiSelect.Option key={"maxi007king"}><Card>
                    <Card.Image src={"https://cdn.discordapp.com/avatars/397525552157949952/81a94be0a204e0f46938ec3499492440.webp?size=128"}></Card.Image>
                    <Card.Title>maxi007king</Card.Title>
                </Card></MultiSelect.Option>
                <MultiSelect.Option key={"Dario"}><Card>
                    <Card.Image src={"https://cdn.discordapp.com/avatars/639416958923702292/a_b7948a625bb3313282f6e7eea026114d.webp?size=128"}></Card.Image>
                    <Card.Title>Dario</Card.Title>
                </Card></MultiSelect.Option>
                <MultiSelect.Option key={"Code0-Bot"}><Card>
                    <Card.Image src={"https://cdn.discordapp.com/avatars/915292654709923840/f3fd2f409d569417dc1d9f1094a790d4.webp?size=32"}></Card.Image>
                    <Card.Title>Code0-Bot</Card.Title>
                </Card></MultiSelect.Option>
            </MultiSelect>
        </div>

    },
    args: {
        placement: "bottom start",
        placeholder: "Select your favorite Code0 Users",
        disabled: false,
        minValues: 1,
        maxValues: 2
    }
}

