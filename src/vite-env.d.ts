/// <reference types="vite/client" />
/// <reference types="vite-plugin-svgr/client" />

// Explicit fallback so the `.d.ts` build (vite-plugin-dts) resolves `?react`
// SVG imports even if the reference above is not picked up by its program.
declare module "*.svg?react" {
    import * as React from "react"
    const ReactComponent: React.FunctionComponent<React.SVGProps<SVGSVGElement> & { title?: string }>
    export default ReactComponent
}
