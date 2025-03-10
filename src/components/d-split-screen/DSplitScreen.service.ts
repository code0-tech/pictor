import {Service, Store} from "../../utils/store";

class DSplitPaneModel {

    private readonly dom: HTMLDivElement
    private readonly defaultSize: DOMRect
    private readonly renderedMinSize?: number
    private readonly rendredMaxSize?: number
    private readonly minSize?: string
    private readonly maxSize?: string
    private readonly snap: boolean

    constructor(dom: HTMLDivElement, renderedSize: DOMRect, renderedMinSize?: number, rendredMaxSize?: number, minSize?: string, maxSize?: string, snap: boolean = false) {

        this.dom = dom
        this.defaultSize = renderedSize
        this.renderedMinSize = renderedMinSize
        this.rendredMaxSize = rendredMaxSize
        this.minSize = minSize
        this.maxSize = maxSize
        this.snap = snap

    }

    public getElement(): HTMLDivElement {
        return this.dom
    }

    public getSize(): DOMRect {
        return this.dom.getBoundingClientRect()
    }


}


class DSplitScreenService extends Service<DSplitPaneModel[]> {

    private readonly split: 'vertical' | 'horizontal'

    constructor(store: Store<DSplitPaneModel[]>) {
        super(store)
    }

    public addPane(pane: DSplitPaneModel) {

        const [store, setStore] = this.store
        setStore([...(store ?? []), pane])

    }

    public getSplitterPanes(splitter: HTMLDivElement): DSplitPaneModel[] {

        const [store] = this.store
        const index = Array.from(splitter.parentElement!!.querySelectorAll(".d-splitter")).indexOf(splitter)
        const allPanes = splitter.parentElement!!.nextElementSibling!!.querySelectorAll(".d-split-pane")
        const firstPane = store!!.find((pane: DSplitPaneModel) => pane.getElement() == allPanes[index])
        const secondPane = store!!.find((pane: DSplitPaneModel) => pane.getElement() == allPanes[index + 1])

        return [firstPane!!, secondPane!!]

    }

    public setSize(firstPane: DSplitPaneModel, secondPane: DSplitPaneModel, position: number) {

        const stackedSize = this.split === "horizontal" ? bBSecond.right - bBFirst.left : bBSecond.bottom - bBFirst.top


    }

}