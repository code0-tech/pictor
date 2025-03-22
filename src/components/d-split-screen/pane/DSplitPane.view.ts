import {DSplitPaneProps} from "./DSplitPane";
import {parseUnit} from "../../../utils/utils";

export class DSplitPaneView {

    private readonly _split: 'horizontal' | 'vertical'
    private _props: DSplitPaneProps

    private _element: HTMLDivElement
    private _minSize: number
    private _maxSize: number
    private _preferredSize: DOMRect

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
        const size = this.getSize()
        const sizeContainer = split == "horizontal" ? bBContainer!!.width ?? 0 : bBContainer!!.height ?? 0
        const standardSize = sizeContainer / parentContainer!!.querySelectorAll(":scope > .d-split-pane").length
        let countZeroPanes = 0

        if (this._element.style.maxWidth == "fit-content") this._element.style.maxWidth = this._element.style.width
        if (this._element.style.minWidth == "fit-content") this._element.style.minWidth = this._element.style.width
        if (this._element.style.maxHeight == "fit-content") this._element.style.maxHeight = this._element.style.height
        if (this._element.style.minHeight == "fit-content") this._element.style.minHeight = this._element.style.height

        //calculate min and max sizes
        const minSize = parseUnit(split == "horizontal" ? getComputedStyle(this._element).minWidth : getComputedStyle(this._element).minHeight)
        this._minSize = !(minSize[1] as string).includes("px") ? sizeContainer * ((minSize[0] as number) / 100) : (minSize[0] as number)
        const maxSize = parseUnit(split == "horizontal" ? getComputedStyle(this._element).maxWidth : getComputedStyle(this._element).maxHeight)
        this._maxSize = !(maxSize[1] as string).includes("px") ? sizeContainer * ((maxSize[0] as number) / 100) : (maxSize[0] as number)

        const allPanes = Array.from(parentContainer!!.querySelectorAll(":scope > .d-split-pane")).map((pane: HTMLDivElement) => {

            //calculate min and max sizes
            const minSizeUnit = parseUnit(split == "horizontal" ? getComputedStyle(pane).minWidth : getComputedStyle(pane).minHeight)
            const minSize = !(minSizeUnit[1] as string).includes("px") ? sizeContainer * ((minSizeUnit[0] as number) / 100) : (minSizeUnit[0] as number)
            const maxSizeUnit = parseUnit(split == "horizontal" ? getComputedStyle(pane).maxWidth : getComputedStyle(pane).maxHeight)
            const maxSize = !(maxSizeUnit[1] as string).includes("px") ? sizeContainer * ((maxSizeUnit[0] as number) / 100) : (maxSizeUnit[0] as number)
            const sizeUnit = parseUnit(split == "horizontal" ? (pane.style.width ? getComputedStyle(pane).width : "undefined") : (pane.style.height ? getComputedStyle(pane).height : "undefined"))
            const sizePane = !(sizeUnit[1] as string).includes("px") ? sizeContainer * ((sizeUnit[0] as number) / 100) : (sizeUnit[0] as number)

            if (minSize > standardSize && sizePane <= minSize) {
                //subtract minSize - standardSize and subtract it from container size
                return minSize
            } else if (minSize > standardSize && sizePane > minSize) {
                //subtract sizePane - standardSize and subtract it from container size
                return sizePane
            } else if (maxSize < standardSize && sizePane >= maxSize) {
                //subtract standardSize - maxSize and add it to container size
                return maxSize
            } else if (maxSize < standardSize && sizePane < maxSize) {
                //subtract standardSize - sizePane and add it to container size
                return sizePane
            } else if (sizePane > standardSize) {
                //subtract sizePane - standardSize and subtract it from container size
                return sizePane
            } else if (sizePane < standardSize) {
                //subtract standardSize - sizePane and add it to container size
                return sizePane
            }

            countZeroPanes++
            return 0

        }).reduce((a, b) => a + b);

        const realStandardSize = (sizeContainer - allPanes) / countZeroPanes

        if (split === "horizontal" && !this._element.style.width) {
            this._element.style.width = `${(realStandardSize / bBContainer!!.width) * 100}%`
        } else if (split === "vertical" && !this._element.style.height) {
            this._element.style.height = `${(realStandardSize / bBContainer!!.height) * 100}%`
        }

        if (this._element.previousElementSibling) {
            //set initial left as percentage
            const bBPreviousElement: DOMRect = this._element.previousElementSibling!!.getBoundingClientRect()
            if (split === "horizontal") this._element.style.left = bBPreviousElement ?
                `${((bBPreviousElement.right) / bBContainer!!.width) * 100}%` : `0%`
            else this._element.style.top = bBPreviousElement ?
                `${((bBPreviousElement.top + bBPreviousElement.height) / bBContainer!!.height) * 100}%` : "0%"
        }

        //width is greater than preferred size and is inside the limit of min and max
        //set preferred size
        if (this._preferredSize && split === "horizontal" && this.isSizeWithinLimits(this._preferredSize.width)) {
            this._element.style.width = `${(this._preferredSize.width / bBContainer!!.width) * 100}%`
        } else if (this._preferredSize && split === "vertical" && this.isSizeWithinLimits(this._preferredSize.height)) {
            this._element.style.height = `${(this._preferredSize.height / bBContainer!!.height) * 100}%`
        }

        this._element.classList.add(`d-split-pane--${split}`)
    }

    public getElement(): HTMLDivElement {
        return this._element
    }

    public getSize(): DOMRect {
        return this._element.getBoundingClientRect()
    }

    public getProps(): DSplitPaneProps {
        return this._props;
    }

    get preferredSize(): DOMRect {
        return this._preferredSize;
    }

    public setPreferredSize() {
        this._preferredSize = this.getSize();
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