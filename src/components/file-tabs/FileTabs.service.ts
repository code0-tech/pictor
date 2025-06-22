import {FileTabsView} from "./FileTabs.view";
import {ReactiveArrayService, ReactiveArrayStore} from "../../utils/reactiveArrayStore";

export class FileTabsService extends ReactiveArrayService<FileTabsView> {

    constructor(store: ReactiveArrayStore<FileTabsView>) {
        super(store);
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
        if (value.active) {
            this.values().forEach((item: FileTabsView) => {
                item.active = false
            })
        }
        super.add(value);
    }

    public getActiveTab(): FileTabsView | undefined {
        return this.values().reverse().find((item: FileTabsView) => {
            return item.active
        })
    }

    public getActiveIndex(): number {
        return this.values().findIndex((item: FileTabsView) => {
            return item.active
        })
    }

}