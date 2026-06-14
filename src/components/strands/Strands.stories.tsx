import React from "react";
import {Meta} from "@storybook/react-vite";
import Strands from "./Strands";

export default {
    title: "Strands",
} as Meta

export const StrandsExample = () => {
    return <div style={{width: "50vw", height: "50vh"}}>
        <Strands
            colors={["#e270ff", "#c7ff70", "#70ffb2"]}
            count={3}
            speed={1}
            amplitude={1}
            waviness={2}
            thickness={2}
            glow={1}
            taper={5}
            spread={2}
            intensity={0.2}
            saturation={2}
            opacity={1}
            scale={1}
            glass={false}
            refraction={0}
            dispersion={0}
            glassSize={0}
            hueShift={0}/>
    </div>
}