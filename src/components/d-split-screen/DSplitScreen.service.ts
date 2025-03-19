import {Service, Store} from "../../utils/store";
import {DSplitPaneProps} from "./pane/DSplitPane";
import {DSplitView} from "./DSplitter.view";

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