import {ReactiveArrayService, ReactiveArrayStore} from "../../utils/reactiveArrayStore";
import {DSplitView} from "./splitter/DSplitter.view";
import {DSplitPaneView} from "./pane/DSplitPane.view";

export class DSplitScreenService extends ReactiveArrayService<DSplitPaneView> {

    private readonly _split: 'horizontal' | 'vertical'
    private _splitViews: DSplitView[]

    constructor(store: ReactiveArrayStore<DSplitPaneView>, split: 'horizontal' | 'vertical') {
        super(store)
        this._split = split
        this.generateSplitViews()
    }

    /** private methods **/
    private generateSplitViews() {
        this._splitViews = this.activePaneViews.map((pane, index) => {
            return index < (this.activePaneViews.length - 1) ? new DSplitView(
                this,
                pane,
                this.activePaneViews[index + 1]
            ) : null
        }).filter(value => !!value)
    }

    /** constructing methods **/

    public setPaneView(key: number, paneView: DSplitPaneView) {
        this.set(key, paneView)
    }

    public showPaneView(key: number) {
        if (!this.has(key)) return
        const paneView = this.get(key)
        paneView!!.props = {
            ...paneView!!.getProps(),
            hide: false
        }
        this.set(key, paneView!!)
        this.generateSplitViews()
    }

    public hidePaneView(key: number) {
        if (!this.has(key)) return
        const paneView = this.get(key)
        paneView!!.props = {
            ...paneView!!.getProps(),
            hide: true
        }
        this.set(key, paneView!!)
        this.generateSplitViews()
    }

    /** getter / setter methods **/

    get activePaneViews(): Array<DSplitPaneView> {
        return Array.from(this.values()).filter(pane => !pane.getProps().hide)
    }

    get splitViews(): DSplitView[] {
        return this._splitViews;
    }

    get split(): "horizontal" | "vertical" {
        return this._split;
    }
}