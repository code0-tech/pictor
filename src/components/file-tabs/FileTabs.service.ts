import {FileTabsView} from "./FileTabs.view";
import {ReactiveArrayService, ReactiveArrayStore} from "../../utils/reactiveArrayService";

export class FileTabsService extends ReactiveArrayService<FileTabsView> {

    constructor(store: ReactiveArrayStore<FileTabsView>) {
        super(store);
    }

    public clearLeft(): void {
        const index = this.getActiveIndex()
        this.access.setState(prevState => [...prevState.filter((_, index1) => {
            return index1 >= index
        })])
    }

    public clearRight(): void {
        const index = this.getActiveIndex()
        this.access.setState(prevState => [...prevState.filter((_, index1) => {
            return index1 <= index
        })])
    }

    public clearWithoutActive(): void {
        const tab = this.getActiveTab()
        if (tab) this.access.setState(prevState => [tab])
    }

    public activateTab(id: string) {
        this.values().forEach((item: FileTabsView) => {
            item.active = false
        })

        const tab = this.values().find((item: FileTabsView) => item.id === id);
        if (tab) tab.active = true
    }

    public delete(index: number) {
        const tab = this.get(index)

        if (tab.active && this.has(index - 1)) {
            this.activateTab(this.get(index - 1).id!!)
        } else if (tab.active && this.has(index + 1)) {
            this.activateTab(this.get(index + 1).id!!)
        }

        super.delete(index);
    }

    public add(value: FileTabsView) {
        //if tab with id already exists, do not add it again and just activate the existing one

        if (this.values().some(value1 => value1.id == value.id)) {
            this.activateTab(value.id!!)
            return
        }

        if (value.active) {
            this.values().forEach((item: FileTabsView) => {
                item.active = false
            })
        }
        super.add(value);
    }

    public getActiveTab(): FileTabsView | undefined {
        const values = [...this.values()]
        return values.reverse().find((item: FileTabsView) => {
            return item.active
        })
    }

    public getActiveIndex(): number {
        return this.values().findIndex((item: FileTabsView) => {
            return item.active
        })
    }

}