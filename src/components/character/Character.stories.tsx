import { Meta } from "@storybook/react-vite";
import React from "react";
import { Character, CharacterMood } from "./Character";
import { Colors } from "../../utils";

const meta: Meta = {
    title: "Character",
    component: Character,
}

const MOODS: CharacterMood[] = ["idle", "happy", "thinking", "error", "loading"]

export const Moods = () => (
    <div style={{ display: "flex", gap: "2rem", alignItems: "center", padding: "2rem" }}>
        {MOODS.map((mood) => (
            <div key={mood} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "0.75rem" }}>
                <Character mood={mood} color="info" size={120} />
                <span style={{ color: "#bfbfbf", fontSize: "0.75rem" }}>{mood}</span>
            </div>
        ))}
    </div>
)

export const ColorVariants = () => (
    <div style={{ display: "flex", gap: "2rem", alignItems: "center", flexWrap: "wrap", padding: "2rem" }}>
        {Colors.filter(c => c !== "primary").map((color) => (
            <div key={color} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "0.75rem" }}>
                <Character mood="idle" color={color} size={100} />
                <span style={{ color: "#bfbfbf", fontSize: "0.75rem" }}>{color}</span>
            </div>
        ))}
    </div>
)

export const Sizes = () => (
    <div style={{ display: "flex", gap: "2rem", alignItems: "center", padding: "2rem" }}>
        {[60, 90, 120, 160, 200].map((size) => (
            <Character key={size} mood="idle" color="info" size={size} />
        ))}
    </div>
)

export default meta
