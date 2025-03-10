import {Service, Store} from "../../utils/store";

export class DSplitPaneView {

    private readonly minSize?: string
    private readonly maxSize?: string
    private readonly snap: boolean

    private _element: HTMLDivElement
    private _defaultSize: DOMRect

    constructor(minSize?, maxSize?, snap = false) {
        this.minSize = minSize
        this.maxSize = maxSize
        this.snap = snap
    }


    setElement(element) {
        this._element = element;
    }

    public setDefaultSize(value: DOMRect) {
        this._defaultSize = value;
    }

    public getElement(): HTMLDivElement {
        return this._element
    }

    public getSize(): DOMRect {
        return this._element.getBoundingClientRect()
    }

}

export class DSplitView {

    private readonly _service: DSplitScreenService
    private readonly _firstPane: DSplitPaneView
    private readonly _secondPane: DSplitPaneView

    private _element: HTMLDivElement

    constructor(service, firstPane, secondPane) {
        this._service = service
        this._firstPane = firstPane
        this._secondPane = secondPane
    }

    public setElement(element) {
        this._element = element;
    }

    public getService(): DSplitScreenService {
        return this._service;
    }

    public getElement(): HTMLDivElement {
        return this._element;
    }

    public getFirstPane(): DSplitPaneView {
        return this._firstPane;
    }

    public getSecondPane(): DSplitPaneView {
        return this._secondPane;
    }

}

export class DSplitScreenService extends Service<DSplitView> {

    private _split: 'horizontal' | 'vertical'

    constructor(store: Store<DSplitView>, split) {
        super(store)
        this._split = split
    }

    public addSplitView(splitter: DSplitView) {
        const store = this.store
        store.current.set(store.current.size, splitter)
    }

    public getAllSplitViews(): MapIterator<DSplitView> {
        return this.store.current.values()
    }


    getSplit(): "horizontal" | "vertical" {
        return this._split;
    }
}