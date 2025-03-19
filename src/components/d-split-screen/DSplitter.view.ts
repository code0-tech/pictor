import {DSplitPaneView, DSplitScreenService} from "./DSplitScreen.service";

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

        const stackedSize = this.getStackedSize()
        const bBContainer = this._element.parentElement!!.getBoundingClientRect()

        //real coordinates within the document
        const mPY = event instanceof MouseEvent ? event.clientY : event.touches[0].clientY
        const mPX = event instanceof MouseEvent ? event.clientX : event.touches[0].clientX

        //the coordinates within the area of the two panes
        const containerMPY = Math.min(Math.max((mPY) - this._firstPaneSize.y, 0), (this._secondPaneSize.bottom - this._firstPaneSize.y))
        const containerMPX = Math.min(Math.max((mPX) - this._firstPaneSize.x, 0), (this._secondPaneSize.right - this._firstPaneSize.x))

        //the coordinates similar to the container but with some extra padding for the splitter
        //and the coordinates are not subtracted to the area.
        //Are always referred to the complete document
        const framedMPY = Math.min(Math.max(this._firstPaneSize.top <= 0 ? 0 : this._firstPaneSize.top + 0.1, mPY), this._secondPaneSize.bottom >= window.innerHeight ? this._secondPaneSize.bottom : this._secondPaneSize.bottom - 0.1)
        const framedMPX = Math.min(Math.max(this._firstPaneSize.left <= 0 ? 0 : this._firstPaneSize.left + 0.1, mPX), this._secondPaneSize.right >= window.innerWidth ? this._secondPaneSize.right : this._secondPaneSize.right - 0.1)

        const firstPaneSize = containerMPX
        const secondPaneSize = stackedSize - containerMPX

        this._firstPane.getElement().style.width = `${(firstPaneSize / bBContainer.width) * 100}%`
        this._firstPane.getElement().style.left = `${(this._firstPaneSize.x / bBContainer.width) * 100}%`

        this._secondPane.getElement().style.width = `${(secondPaneSize / bBContainer.width) * 100}%`
        this._secondPane.getElement().style.left = `${(framedMPX / bBContainer.width) * 100}%`

        this._element.style.left = `${(framedMPX / bBContainer.width) * 100}%`
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