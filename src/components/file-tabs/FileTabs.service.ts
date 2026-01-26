import {FileTabsView} from "./FileTabs.view";
import {ReactiveArrayService} from "../../utils/reactiveArrayService";
import {View} from "../../utils/view";

export class FileTabsService extends ReactiveArrayService<FileTabsView> {

    getById(id: string): FileTabsView | undefined {
        return this.values().find((item: FileTabsView) => item.id === id)
    }

    public clearLeft(): void {
        const index = this.getActiveIndex()
        this.access.getState().forEach((tab, indexTab) => {
            if (indexTab >= index) return
            this.removeTabById(tab.payload.id!)
        })
    }

    public clearRight(): void {
        const index = this.getActiveIndex()
        this.access.getState().forEach((tab, indexTab) => {
            if (indexTab <= index) return
            this.removeTabById(tab.payload.id!)
        })
    }

    public clearWithoutActive(): void {
        const index = this.getActiveIndex()
        this.access.getState().forEach((tab, indexTab) => {
            if (indexTab == index) return
            this.removeTabById(tab.payload.id!)
        })
    }

    public clearAll(): void {
        this.access.getState().forEach((tab) => {
            this.removeTabById(tab.payload.id!)
        })
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

    removeTabById(id: string) {
        const tab = this.getById(id)
        const index = this.values().findIndex((item: FileTabsView) => item.id === id)
        if (!tab) return
        if (tab.active && this.has(index - 1)) {
            const previousTab = this.get(index - 1)
            if (previousTab.show) this.activateTab(previousTab.id!!)
        } else if (tab.active && this.has(index + 1)) {
            const nextTab = this.get(index + 1)
            if (nextTab.show) this.activateTab(nextTab.id!!)
        }
        tab.show = false
        tab.active = false
        this.update()
    }

    deleteById(id: string) {
        const index = this.values().findIndex((item: FileTabsView) => item.id === id)
        const tab = this.get(index)

        if (tab && tab.active && this.has(index - 1)) {
            this.activateTab(this.get(index - 1).id!!)
        } else if (tab && tab.active && this.has(index + 1)) {
            this.activateTab(this.get(index + 1).id!!)
        }

        if (tab) this.access.setState(prev => prev.filter((tab) => tab.payload.id !== id))
    }

    registerTab(value: FileTabsView) {

        const nextValue = {...value, show: value.show ?? false}
        const tabAlreadyExist = !!this.values().find((tab) => tab.id === nextValue.id)

        if (tabAlreadyExist) return

        this.add(new View(nextValue))
    }

    public add(value: View<FileTabsView>) {


        const nextValue: FileTabsView = {...value.payload, show: value.payload.show ?? true}

        this.access.setState((prevState) => {
            const existingIndex = prevState.findIndex((tab) => tab.payload.id === nextValue.id)
            const nextState: FileTabsView[] = prevState.map((tab) => ({...tab.payload, active: nextValue.active ? false : tab.payload.active}))

            if (existingIndex !== -1) {
                nextState[existingIndex] = {
                    ...nextState[existingIndex],
                    ...nextValue,
                    active: nextValue.active ?? nextState[existingIndex].active,
                    show: nextValue.show ?? nextState[existingIndex].show,
                }
                return [...nextState.map(tab => new View(tab))]
            }

            return [...nextState.map(tab => new View(tab)), new View(nextValue)]
        })

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