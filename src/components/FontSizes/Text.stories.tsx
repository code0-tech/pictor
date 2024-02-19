import Text from "./Text";
import React from "react";
import {Sizes} from "../../utils/types";
import {Button, ButtonGroup} from "../../index";


export default {
    title: "Font",
    component: Text
};

export const Fonts = () => <>
    {
        <ButtonGroup>
            {
                Sizes.map(value =>
                    <Button>
                        <Text size={value}>{value}</Text>
                    </Button>
                )
            }
        </ButtonGroup>
    }
</>