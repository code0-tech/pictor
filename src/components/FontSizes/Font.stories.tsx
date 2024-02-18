import Font from "./Font";
import React from "react";
import {Sizes} from "../../utils/utils";
import {Button, ButtonGroup} from "../../index";


export default {
    title: "Font",
    component: Font
};

export const Fonts = () => <>
    {
        <ButtonGroup>
            {
                Sizes.map(value =>
                    <Button>
                        <Font size={value}>{value}</Font>
                    </Button>
                )
            }
        </ButtonGroup>
    }
</>