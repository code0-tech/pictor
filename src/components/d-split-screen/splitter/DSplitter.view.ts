import {DSplitScreenService} from "../DSplitScreen.service";
import {DSplitPaneView} from "../pane/DSplitPane.view";

export class DSplitView {

    private readonly _service: DSplitScreenService
    private readonly _firstPane: DSplitPaneView
    private readonly _secondPane: DSplitPaneView
    private _element: HTMLDivElement
    private _firstPaneSize: DOMRect
    private _secondPaneSize: DOMRect

    constructor(service: DSplitScreenService, firstPane: DSplitPaneView, secondPane: DSplitPaneView) {
        this._service = service
        this._firstPane = firstPane
        this._secondPane = secondPane
    }

    private getStackedSize(): number {
        const firstSize = this._firstPaneSize
        const secondSize = this._secondPaneSize
        return this._service.getSplit() === "horizontal" ? secondSize.right - firstSize.left : secondSize.bottom - firstSize.top
    }

    public setSplitter(splitter: HTMLDivElement) {
        this._element = splitter
        const bBFirst = this._firstPane.getSize()
        const bBContainer = this._element!!.parentElement!!.getBoundingClientRect()
        if (this._service.getSplit() === "horizontal") {
            this._element.style.left = `${((bBFirst.left + bBFirst.width) / bBContainer.width) * 100}%`
        } else {
            this._element.style.top = `${((bBFirst.top + bBFirst.height) / bBContainer.height) * 100}%`
        }
    }

    public getFirstPane(): DSplitPaneView {
        return this._firstPane;
    }

    public getSecondPane(): DSplitPaneView {
        return this._secondPane;
    }

    public onResizeAreaEnter(event: MouseEvent | TouchEvent) {
        this._element.dataset.resize = 'true'
        //disbale all child splitter
        this._firstPane.getElement().querySelectorAll(".d-splitter").forEach(splitter => splitter.ariaDisabled = "true")
        this._secondPane.getElement().querySelectorAll(".d-splitter").forEach(splitter => splitter.ariaDisabled = "true")
    }

    public onResizeAreaLeave(event: MouseEvent | TouchEvent) {
        delete this._element.dataset.resize
        //enable all child splitter
        this._firstPane.getElement().querySelectorAll(".d-splitter").forEach(splitter => splitter.ariaDisabled = null)
        this._secondPane.getElement().querySelectorAll(".d-splitter").forEach(splitter => splitter.ariaDisabled = null)
    }

    public onDrag(event: MouseEvent | TouchEvent) {

        const split = this._service.getSplit()
        const stackedSize = this.getStackedSize()
        const bBContainer = this._element.parentElement!!.getBoundingClientRect()

        //real coordinates within the document
        const mPY = event instanceof MouseEvent ? event.clientY : event.touches[0].clientY
        const mPX = event instanceof MouseEvent ? event.clientX : event.touches[0].clientX

        //the coordinates within the area of the two panes
        const containerMPY = Math.min(Math.max((mPY) - this._firstPaneSize.y, 0), (this._secondPaneSize.bottom - this._firstPaneSize.y))
        const containerMPX = Math.min(Math.max((mPX) - this._firstPaneSize.x, 0), (this._secondPaneSize.right - this._firstPaneSize.x))


        const firstPaneSize = Math.min(Math.max(split === "horizontal" ? containerMPX : containerMPY, this._firstPane.minSize, stackedSize - this._secondPane.maxSize), this._firstPane.maxSize, stackedSize - this._secondPane.minSize)
        const secondPaneSize = Math.min(Math.max(stackedSize - firstPaneSize, this._secondPane.minSize), this._secondPane.maxSize)

        this._firstPane.getElement().style[split === "horizontal" ? "width": "height"] = `${(firstPaneSize / bBContainer[split === "horizontal" ? "width": "height"]) * 100}%`
        this._firstPane.getElement().style[split === "horizontal" ? "left": "top"] = `${(this._firstPaneSize.x / bBContainer[split === "horizontal" ? "width": "height"]) * 100}%`

        this._secondPane.getElement().style[split === "horizontal" ? "width": "height"] = `${(secondPaneSize / bBContainer[split === "horizontal" ? "width": "height"]) * 100}%`
        this._secondPane.getElement().style[split === "horizontal" ? "left": "top"] = `${((this._firstPaneSize.x + firstPaneSize) / bBContainer[split === "horizontal" ? "width": "height"]) * 100}%`

        this._element.style[split === "horizontal" ? "left": "top"] = `${((secondPaneSize <= 0 ? ((this._firstPaneSize[split === "horizontal" ? "x": "y"] + firstPaneSize) - 0.1) : 
            (this._firstPaneSize[split === "horizontal" ? "x": "y"] + firstPaneSize + 0.1)) / bBContainer[split === "horizontal" ? "width": "height"]) * 100}%`
    }

    public onDragStart(event: MouseEvent | TouchEvent) {
        const selection = document.getSelection()
        if (selection) selection.removeAllRanges()

        this._firstPaneSize = this._firstPane.getSize()
        this._secondPaneSize = this._secondPane.getSize()
    }

    public onDragEnd(event: MouseEvent | TouchEvent) {
        const selection = document.getSelection()
        if (selection) selection.removeAllRanges()
    }

}