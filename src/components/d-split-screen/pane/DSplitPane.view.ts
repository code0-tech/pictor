import {DSplitPaneProps} from "./DSplitPane";
import {parseUnit} from "../../../utils/utils";

export class DSplitPaneView {

    private readonly _split: 'horizontal' | 'vertical'
    private _props: DSplitPaneProps

    private _element: HTMLDivElement
    private _minSize: number
    private _maxSize: number
    private _size: number

    constructor(split: 'horizontal' | 'vertical', props: DSplitPaneProps) {
        this._split = split
        this._props = props
    }

    public isSizeWithinLimits(size: number) {
        return size >= (this._minSize || 0) && size <= (this._maxSize || Infinity)
    }

    public setElement(element: HTMLDivElement) {
        this._element = element ?? this._element
        const parentContainer = this._element.parentElement
        const bBContainer = parentContainer?.getBoundingClientRect()
        const split = this._split
        const sizeContainer = split == "horizontal" ? bBContainer!!.width ?? 0 : bBContainer!!.height ?? 0
        const preferredSize = this._element.dataset.preferredSize ? Number(this._element.dataset.preferredSize) : undefined

        const size = parseUnit(split == "horizontal" ? (getComputedStyle(this._element).width) : getComputedStyle(this._element).height)
        this._size = !(size[1] as string).includes("px") ? sizeContainer * ((size[0] as number) / 100) : (size[0] as number)

        if (this._element.style.maxWidth == "fit-content") this._element.style.maxWidth = `${this._size}px`
        if (this._element.style.minWidth == "fit-content") this._element.style.minWidth = `${this._size}px`
        if (this._element.style.maxHeight == "fit-content") this._element.style.maxHeight = `${this._size}px`
        if (this._element.style.minHeight == "fit-content") this._element.style.minHeight = `${this._size}px`

        //calculate min and max sizes
        const minSize = parseUnit(split == "horizontal" ? getComputedStyle(this._element).minWidth : getComputedStyle(this._element).minHeight)
        this._minSize = !(minSize[1] as string).includes("px") ? sizeContainer * ((minSize[0] as number) / 100) : (minSize[0] as number)
        const maxSize = parseUnit(split == "horizontal" ? getComputedStyle(this._element).maxWidth : getComputedStyle(this._element).maxHeight)
        this._maxSize = !(maxSize[1] as string).includes("px") ? sizeContainer * ((maxSize[0] as number) / 100) : (maxSize[0] as number)

        //width is greater than preferred size and is inside the limit of min and max
        //set preferred size
        const [numberZeroPanes, standardSize] = this.standardSize

        if (split === "horizontal") {
            this._element.style.width = `${((this._element.style.width ? this._size : standardSize) / bBContainer!!.width) * 100}%`
        } else if (split === "vertical") {
            this._element.style.height = `${(this._element.style.height ? this._size : standardSize / bBContainer!!.height) * 100}%`
        }

        //width is greater than preferred size and is inside the limit of min and max
        //set preferred size
        if (preferredSize && numberZeroPanes > 1 && split === "horizontal" && standardSize > preferredSize) {
            this._element.style.width = `${(preferredSize / bBContainer!!.width) * 100}%`
        } else if (preferredSize && numberZeroPanes > 1 && split === "vertical" && standardSize > preferredSize) {
            this._element.style.height = `${(preferredSize / bBContainer!!.height) * 100}%`
        }

        if (this._element.previousElementSibling) {
            //set initial left as percentage
            const bBPreviousElement: DOMRect = this._element.previousElementSibling!!.getBoundingClientRect()
            console.log(this._element.previousElementSibling, bBPreviousElement)
            if (split === "horizontal") this._element.style.left = bBPreviousElement ?
                `${Math.min(((bBPreviousElement.right - bBContainer!!.x) / bBContainer!!.width) * 100, 100)}%` : `0%`
            else this._element.style.top = bBPreviousElement ?
                `${((bBPreviousElement.top + bBPreviousElement.height) / bBContainer!!.height) * 100}%` : "0%"
        }

        /**
        const container = (this._element.firstElementChild as HTMLDivElement)

        if (split === "horizontal") {
            container.style.minWidth = "fit-content"
            container.style.height = "100%"
        } else if (split === "vertical") {
            container.style.height = "fit-content"
            container.style.width = "100%"
        }

            */

        this._element.classList.add(`d-split-pane--${split}`)
    }

    public getElement(): HTMLDivElement {
        return this._element
    }

    private get standardSize(): [number, number] {
        const split = this._split
        const parentContainer = this._element.parentElement
        const bBContainer = parentContainer?.getBoundingClientRect()
        let sizeContainer = split == "horizontal" ? bBContainer!!.width ?? 0 : bBContainer!!.height ?? 0
        let internalSizeContainer = split == "horizontal" ? bBContainer!!.width ?? 0 : bBContainer!!.height ?? 0
        let standardSize = sizeContainer / parentContainer!!.querySelectorAll(":scope > .d-split-pane").length
        let countZeroPanes: number = 0

        Array.from(parentContainer!!.querySelectorAll(":scope > .d-split-pane")).forEach((pane: HTMLDivElement) => {

            //calculate min and max sizes
            const minSizeUnit = parseUnit(split == "horizontal" ? getComputedStyle(pane).minWidth : getComputedStyle(pane).minHeight)
            const minSize = !(minSizeUnit[1] as string).includes("px") ? sizeContainer * ((minSizeUnit[0] as number) / 100) : (minSizeUnit[0] as number)
            const maxSizeUnit = parseUnit(split == "horizontal" ? getComputedStyle(pane).maxWidth : getComputedStyle(pane).maxHeight)
            const maxSize = !(maxSizeUnit[1] as string).includes("px") ? sizeContainer * ((maxSizeUnit[0] as number) / 100) : (maxSizeUnit[0] as number)
            const sizeUnit = parseUnit(split == "horizontal" ? (pane.style.width ? getComputedStyle(pane).width : "undefined") : (pane.style.height ? getComputedStyle(pane).height : "undefined"))
            const sizePane = !(sizeUnit[1] as string).includes("px") ? sizeContainer * ((sizeUnit[0] as number) / 100) : (sizeUnit[0] as number)
            const preferredSize = (pane.dataset.preferredSize && standardSize > Number(pane.dataset.preferredSize) ? Number(pane.dataset.preferredSize) : undefined) as number
            let size = 0

            if (minSize > standardSize && (sizePane || preferredSize) <= minSize) {
                //subtract minSize - standardSize and subtract it from container size
                size = minSize
            } else if (minSize > standardSize && (sizePane || preferredSize) > minSize) {
                //subtract sizePane - standardSize and subtract it from container size
                size = (sizePane || preferredSize)
            } else if (maxSize < standardSize && (sizePane || preferredSize) >= maxSize) {
                //subtract standardSize - maxSize and add it to container size
                size = maxSize
            } else if (maxSize < standardSize && (sizePane || preferredSize) < maxSize) {
                //subtract standardSize - sizePane and add it to container size
                size = (sizePane || preferredSize)
            } else if ((sizePane || preferredSize) > standardSize) {
                //subtract sizePane - standardSize and subtract it from container size
                size = (sizePane || preferredSize)
            } else if ((sizePane || preferredSize) < standardSize) {
                //subtract standardSize - sizePane and add it to container size
                size = (sizePane || preferredSize)
            }

            sizeContainer = sizeContainer - size
            internalSizeContainer = sizeContainer + size
            standardSize = internalSizeContainer / parentContainer!!.querySelectorAll(":scope > .d-split-pane").length
            if (size === 0) countZeroPanes++

        })

        return [countZeroPanes, sizeContainer / countZeroPanes]
    }

    public getSize(): DOMRect {
        return this._element.getBoundingClientRect()
    }

    public getProps(): DSplitPaneProps {
        return this._props;
    }

    public setPreferredSize() {
        const preferredSize = this.getSize();

        //width is greater than preferred size and is inside the limit of min and max
        //set preferred size
        if (this._split === "horizontal" && this.isSizeWithinLimits(preferredSize.width)) {
            this.props = {
                ...this._props,
                "data-preferred-size": preferredSize.width
            }
        } else if (this._split === "vertical" && this.isSizeWithinLimits(preferredSize.height)) {
            this.props = {
                ...this._props,
                "data-preferred-size": preferredSize.height
            }
        }
    }

    set props(props: DSplitPaneProps) {
        this._props = props;
    }

    get minSize(): number {
        return this._minSize || 0;
    }

    get maxSize(): number {
        return this._maxSize || Infinity;
    }
}