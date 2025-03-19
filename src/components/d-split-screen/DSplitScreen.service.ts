import {Service, Store} from "../../utils/store";
import {DSplitView} from "./splitter/DSplitter.view";
import {DSplitPaneView} from "./pane/DSplitPane.view";

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