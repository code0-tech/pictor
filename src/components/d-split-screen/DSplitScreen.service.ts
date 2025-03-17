import {Service, Store} from "../../utils/store";
import {DSplitPaneProps} from "./DSplitPane";

export class DSplitPaneView {

    private readonly _service: DSplitScreenService

    private _props: DSplitPaneProps
    private _element: HTMLDivElement
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

        this._defaultSize = size

        if (split === "horizontal") this._element.style.width = `${(size.width / bBContainer!!.width) * 100}%`
        else this._element.style.height = `${(size.height / bBContainer!!.height) * 100}%`

        this._element.classList.add(`d-split-pane--${this._service.getSplit()}`)

        if (this._element.previousElementSibling) {
            //set initial left as percentage
            const bBPreviousElement: DOMRect = this._element.previousElementSibling!!.getBoundingClientRect()
            if (split === "horizontal") this._element.style.left = bBPreviousElement ?
                `${((bBPreviousElement.left + bBPreviousElement.width) / bBContainer!!.width) * 100}%` : `0%`
            else this._element.style.top = bBPreviousElement ?
                `${((bBPreviousElement.top + bBPreviousElement.height) / bBContainer!!.height) * 100}%` : "0%"
        }

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
}

export class DSplitView {

    private readonly _service: DSplitScreenService
    private readonly _firstPane: DSplitPaneView
    private readonly _secondPane: DSplitPaneView
    private _element: HTMLDivElement

    constructor(service: DSplitScreenService, firstPane: DSplitPaneView, secondPane: DSplitPaneView) {
        this._service = service
        this._firstPane = firstPane
        this._secondPane = secondPane

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

    public getSplitter(): HTMLDivElement {
        return this._element;
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
        /**
         if (!firstPaneElement || !secondPaneElement || !ref.current) return

         const stackedSize = split === "horizontal" ? bBSecond.right - bBFirst.left : bBSecond.bottom - bBFirst.top
         const bBContainer = (ref.current as HTMLDivElement).parentElement.getBoundingClientRect()

         const mPY = event instanceof MouseEvent ? event.clientY : event.touches[0].clientY
         const mPX = event instanceof MouseEvent ? event.clientX : event.touches[0].clientX

         const containerMPY = Math.min(Math.max((mPY) - bBFirst.y, 0), (bBSecond.bottom - bBFirst.y))
         const containerMPX = Math.min(Math.max((mPX) - bBFirst.x, 0), (bBSecond.right - bBFirst.x))

         const framedMPY = Math.min(Math.max(bBFirst.top <= 0 ? 0 : bBFirst.top + 0.1, mPY), bBSecond.bottom >= window.innerHeight ? bBSecond.bottom : bBSecond.bottom - 0.1)
         const framedMPX = Math.min(Math.max(bBFirst.left <= 0 ? 0 : bBFirst.left + 0.1, mPX), bBSecond.right >= window.innerWidth ? bBSecond.right : bBSecond.right - 0.1)

         const sizeFirstPane = firstPane?.current?.calculateSize(direction == "horizontal" ? containerMPX : containerMPY, "first", stackedSize) ?? 0
         const sizeSecondPane = secondPane?.current?.calculateSize(direction == "horizontal" ? containerMPX : containerMPY, "second", stackedSize) ?? 0

         if (sizeFirstPane[1] === DSplitPaneStatus.SNAP) {
         firstPane?.current?.setSize(sizeFirstPane[0], direction === "horizontal" ? bBFirst.x : bBFirst.y)
         secondPane?.current?.setSize(stackedSize - sizeFirstPane[0], direction === "horizontal" ? bBFirst.x + sizeFirstPane[0] : bBFirst.y + sizeFirstPane[0])
         if (direction === "horizontal") (ref.current as HTMLDivElement).style.left = `${((bBFirst.x + sizeFirstPane[0]) / bBContainer.width) * 100}%`
         else (ref.current as HTMLDivElement).style.top = `${((bBFirst.y + sizeFirstPane[0]) / bBContainer.height) * 100}%`
         return
         }

         if (sizeSecondPane[1] === DSplitPaneStatus.SNAP) {
         firstPane?.current?.setSize((stackedSize - sizeSecondPane[0]), direction === "horizontal" ? bBFirst.x : bBFirst.y)
         secondPane?.current?.setSize(sizeSecondPane[0], direction === "horizontal" ? bBFirst.x + (stackedSize - sizeSecondPane[0]) : bBFirst.y + (stackedSize - sizeSecondPane[0]))
         if (direction === "horizontal") (ref.current as HTMLDivElement).style.left = `${((bBFirst.x + (stackedSize - sizeSecondPane[0])) / bBContainer.width) * 100}%`
         else (ref.current as HTMLDivElement).style.top = `${((bBFirst.y + (stackedSize - sizeSecondPane[0])) / bBContainer.height) * 100}%`
         return
         }

         if (sizeFirstPane[1] === DSplitPaneStatus.LIMIT || sizeSecondPane[1] === DSplitPaneStatus.LIMIT) return

         if (direction === "horizontal") (ref.current as HTMLDivElement).style.left = `${(framedMPX / bBContainer.width) * 100}%`
         else (ref.current as HTMLDivElement).style.top = `${(framedMPY / bBContainer.height) * 100}%`

         firstPane?.current?.setSize(sizeFirstPane[0], direction === "horizontal" ? bBFirst.x : bBFirst.y)
         secondPane?.current?.setSize(sizeSecondPane[0], direction === "horizontal" ? framedMPX : framedMPY)

         */
    }

    public onDragStart(event: MouseEvent | TouchEvent) {
        const selection = document.getSelection()
        if (selection) selection.removeAllRanges()
    }

    public onDragEnd(event: MouseEvent | TouchEvent) {
        //nothing to add so far
    }

}

export class DSplitScreenService extends Service<DSplitView> {

    private readonly _split: 'horizontal' | 'vertical'

    constructor(store: Store<DSplitView>, split: 'horizontal' | 'vertical') {
        super(store)
        this._split = split
    }

    public addSplitView(splitter: DSplitView) {
        const store = this.store
        store.current.set(store.current.size, splitter)
    }

    public setSplitView(key: number, splitter: DSplitView) {
        const store = this.store
        store.current.set(key, splitter)
    }

    public getAllSplitViews(): Array<DSplitView> {
        return Array.from(this.store.current.values())
    }

    public getAllPaneViews(): Array<DSplitPaneView> {
        return [
            ...Array.from(this.store.current.values()).map((value) => value.getFirstPane()),
            this.store.current.get(this.store.current.size - 1)?.getSecondPane() as DSplitPaneView,
        ]
    }

    public getSplit(): "horizontal" | "vertical" {
        return this._split;
    }
}