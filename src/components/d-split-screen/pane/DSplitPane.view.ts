import {DSplitPaneProps} from "./DSplitPane";
import {DSplitScreenService} from "../DSplitScreen.service";
import {parseUnit} from "../../../utils/utils";

export class DSplitPaneView {

    private readonly _service: DSplitScreenService

    private _props: DSplitPaneProps
    private _element: HTMLDivElement
    private _minSize: number
    private _maxSize: number
    private _defaultSize: DOMRect

    constructor(service: DSplitScreenService, props: DSplitPaneProps) {
        this._service = service
        this._props = props
    }

    public setElement(element: HTMLDivElement) {
        this._element = element
        const parentContainer = this._element.parentElement
        const bBContainer = parentContainer?.getBoundingClientRect()
        const size = this.getSize()
        const split = this._service.getSplit()
        const sizeContainer = split == "horizontal" ? bBContainer!!.width ?? 0 : bBContainer!!.height ?? 0

        this._defaultSize = size

        if (split === "horizontal") this._element.style.width = `${(size.width / bBContainer!!.width) * 100}%`
        else this._element.style.height = `${(size.height / bBContainer!!.height) * 100}%`

        this._element.classList.add(`d-split-pane--${split}`)

        if (this._element.previousElementSibling) {
            //set initial left as percentage
            const bBPreviousElement: DOMRect = this._element.previousElementSibling!!.getBoundingClientRect()
            if (split === "horizontal") this._element.style.left = bBPreviousElement ?
                `${((bBPreviousElement.left + bBPreviousElement.width) / bBContainer!!.width) * 100}%` : `0%`
            else this._element.style.top = bBPreviousElement ?
                `${((bBPreviousElement.top + bBPreviousElement.height) / bBContainer!!.height) * 100}%` : "0%"
        }

        if (this._element.style.maxWidth == "fit-content") this._element.style.maxWidth = this._element.style.width
        if (this._element.style.minWidth == "fit-content") this._element.style.minWidth = this._element.style.width
        if (this._element.style.maxHeight == "fit-content") this._element.style.maxHeight = this._element.style.height
        if (this._element.style.minHeight == "fit-content") this._element.style.minHeight = this._element.style.height

        //calculate min and max sizes
        const minSize = parseUnit(split == "horizontal" ? getComputedStyle(this._element).minWidth : getComputedStyle(this._element).minHeight)
        this._minSize = !(minSize[1] as string).includes("px") ? sizeContainer * ((minSize[0] as number) / 100) : (minSize[0] as number)
        const maxSize = parseUnit(split == "horizontal" ? getComputedStyle(this._element).maxWidth : getComputedStyle(this._element).maxHeight)
        this._maxSize = !(maxSize[1] as string).includes("px") ? sizeContainer * ((maxSize[0] as number) / 100) : (maxSize[0] as number)

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

    get minSize(): number {
        return this._minSize || 0;
    }

    get maxSize(): number {
        return this._maxSize || Infinity;
    }
}