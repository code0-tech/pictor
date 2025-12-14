import {FileTabsView} from "./FileTabs.view";
import {ReactiveArrayService, ReactiveArrayStore} from "../../utils/reactiveArrayService";

export class FileTabsService extends ReactiveArrayService<FileTabsView> {

    constructor(store: ReactiveArrayStore<FileTabsView>) {
        super(store);
    }

    getById(id: string): FileTabsView | undefined {
        return this.values().find((item: FileTabsView) => item.id === id)
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
        if (tab) {
            tab.active = true
            tab.show = true
        }
        this.update()
    }

    public delete(index: number) {
        const tab = this.get(index)

        if (tab.active && this.has(index - 1)) {
            this.activateTab(this.get(index - 1).id!!)
        } else if (tab.active && this.has(index + 1)) {
            this.activateTab(this.get(index + 1).id!!)
        }

        super.delete(index);
        this.update()
    }

    registerTab(value: FileTabsView) {
        if (this.getById(value.id!!)) return

        super.add({...value, show: value.show ?? false});
        this.update()

    }

    public add(value: FileTabsView) {

        if (this.values().some(value1 => value1.id == value.id)) {
            this.activateTab(value.id!!)
            return
        }

        if (value.active) {
            this.values().forEach((item: FileTabsView) => {
                item.active = false
            })
        }
        super.add({...value, show: value.show ?? true});
        this.update()
    }

    public getActiveTab(): FileTabsView | undefined {
        return this.values().find((item: FileTabsView) => {
            return item.active
        })
    }

    public getActiveIndex(): number {
        return this.values().findIndex((item: FileTabsView) => {
            return item.active
        })
    }

}