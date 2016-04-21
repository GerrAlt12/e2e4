import {ISelectable} from './contracts/ISelectable';
import {ISelectionManager} from './contracts/ISelectionManager';
import {ISelectionTuple} from './contracts/ISelectionTuple';
export class SelectionManager implements ISelectionManager {
    private selectionsList = new Array<ISelectionTuple>();
    private items: Array<ISelectable>;
    private itemsPropertyName: string;
    dispose(): void {
        this.selectionsList.length = 0;
        delete this.selectionsList;
        delete this.items;
    }

    lastProcessedIndex: number;
    get itemsSource(): Array<ISelectable> {
        return this.items;
    }
    set itemsSource(value: Array<ISelectable>) {
        this.items = value;
        this.checkSelection();
    }
    private processSelection(item: ISelectable, selected: boolean): void {
        item.selected = selected;
        if (item.onSelectionChanged !== undefined) {
            item.onSelectionChanged(selected);
        }
        if (selected === true && item.onSelected !== undefined) {
            item.onSelected();
        }
        if (selected === false && item.onDeselected !== undefined) {
            item.onDeselected();
        }
    }
    private deselectItem(selectionTuple: ISelectionTuple, recursive: boolean = false): void {
        const index = this.selectionsList.findIndex(selectedItem => (selectedItem.item === selectionTuple.item));
        if (index !== -1) {
            this.selectionsList.splice(index, 1);
        }
        this.processSelection(selectionTuple.item, false);
        if (this.canRecurse(recursive, selectionTuple.item)) {
            /* tslint:disable:no-any */
            ((selectionTuple.item as any)).selectionManager.deselectAll(true);
            /* tslint:enable:no-any */
        }
        this.lastProcessedIndex = selectionTuple.index;
    }
    private selectItem(selectionTuple: ISelectionTuple, savePrevious: boolean = false, recursive: boolean = false): void {
        if (savePrevious) {
            const index = this.selectionsList.findIndex(selectedItem => (selectedItem.item === selectionTuple.item));
            if (index !== -1) {
                this.processSelection(selectionTuple.item, false);
                this.selectionsList.splice(index, 1);
            }
            this.selectionsList.push(selectionTuple);
            this.processSelection(selectionTuple.item, true);
        } else {
            const list = this.selectionsList.splice(0, this.selectionsList.length);
            list.forEach(selectedItem => { this.processSelection(selectedItem.item, false); });
            this.selectionsList.push(selectionTuple);
            this.processSelection(selectionTuple.item, true);
        }
        if (this.canRecurse(recursive, selectionTuple.item)) {
            /* tslint:disable:no-any */
            ((selectionTuple.item as any)).selectionManager.selectAll(true);
            /* tslint:enable:no-any */
        }
        this.lastProcessedIndex = selectionTuple.index;
    }
    private canRecurse(recursive: boolean, /* tslint:disable:no-any */item: any/* tslint:enable:no-any */): boolean {
        if (recursive && item.selectionManager && item.selectionManager instanceof SelectionManager) {
            return true;
        }
        return false;
    }
    private getSelectionTuple(index: number): ISelectionTuple {
        return {
            index: index,
            item: this.itemsSource[index]
        };
    }
    private checkSelection(): void {
        for (let i = this.selectionsList.length - 1; i >= 0; i--) {
            const tuple = this.selectionsList[i];
            if (this.itemsSource[tuple.index] !== tuple.item) {
                this.deselectItem(tuple);
            }
        }
    }
    deselectAll(recursive: boolean = false): void {
        const list = this.selectionsList.splice(0, this.selectionsList.length);
        for (let i = 0; i < list.length; i++) {
            const item = list[i].item;
            this.processSelection(item, false);
            if (this.canRecurse(recursive, item)) {
                /* tslint:disable:no-any */
                ((item as any)).selectionManager.deselectAll(true);
                /* tslint:enable:no-any */
            }
        }
        this.lastProcessedIndex = null;
    }
    selectAll(recursive: boolean = false): void {
        this.selectRange(0, this.itemsSource.length - 1, recursive);
    }
    selectRange(fromIndex: number, toIndex: number, recursive: boolean = false): void {
        if (toIndex < 0 || this.itemsSource.length <= toIndex || fromIndex < 0 || this.itemsSource.length <= fromIndex) {
            return;
        }
        const startIndex = Math.min(fromIndex, toIndex);
        const endIndex = Math.max(fromIndex, toIndex);
        this.deselectAll();
        const tempData = new Array<ISelectionTuple>();
        for (let i = startIndex; i <= endIndex; i++) {
            const tuple = this.getSelectionTuple(i);
            tempData.push(tuple);
            this.processSelection(tuple.item, true);
            if (this.canRecurse(recursive, tuple.item)) {
                /* tslint:disable:no-any */
                ((tuple.item as any)).selectionManager.selectAll(true);
                /* tslint:enable:no-any */
            }
        }
        this.selectionsList.splice(0, this.selectionsList.length, ...tempData);
        this.lastProcessedIndex = endIndex;
    }

    hasSelections(): boolean {
        return this.selectionsList.length !== 0;
    }
    isIndexSelected(index: number): boolean {
        if (index >= 0 && this.itemsSource.length > index) {
            return this.itemsSource[index].selected;
        }
        return false;
    }

    getItemIndex(item: ISelectable): number {
        return this.itemsSource.findIndex(value => value === item);
    }
    getMinSelectedIndex(): number {
        let minIndex = null;
        this.selectionsList.forEach(item => {
            minIndex = (minIndex === null || item.index < minIndex) ? item.index : minIndex;
        });
        return minIndex;
    }
    getMaxSelectedIndex(): number {
        let maxIndex = null;
        this.selectionsList.forEach(item => {
            maxIndex = (maxIndex === null || item.index > maxIndex) ? item.index : maxIndex;
        });
        return maxIndex;
    }

    selectFirst(): void {
        if (this.itemsSource.length > 0) {
            this.selectItem(this.getSelectionTuple(0));
        }
    }
    selectLast(): void {
        if (this.itemsSource.length > 0) {
            this.selectItem(this.getSelectionTuple(this.itemsSource.length - 1));
        }
    }

    selectIndex(index: number, savePrevious: boolean = false, recursive: boolean = false): void {
        if (index >= 0 && this.itemsSource.length > index) {
            this.selectItem(this.getSelectionTuple(index), savePrevious, recursive);
        }
    }
    deselectIndex(index: number, recursive: boolean = false): void {
        if (index >= 0 && this.itemsSource.length > index) {
            this.deselectItem(this.getSelectionTuple(index), recursive);
        }
    }
    toggleSelection(index: number, savePrevious: boolean = false, recursive: boolean = false): void {
        if (index < 0 || this.itemsSource.length <= index) {
            return;
        }
        const tuple = this.getSelectionTuple(index);
        if (this.isIndexSelected(index)) {
            if (this.selectionsList.length === 1 || (this.selectionsList.length > 1 && savePrevious)) {
                this.deselectItem(tuple, recursive);
            } else {
                this.selectItem(tuple, savePrevious, recursive);
            }
            return;
        }
        this.selectItem(tuple, savePrevious, recursive);
    }
    getSelections(recursive: boolean = false): Array<Object> {
        if (recursive) {
            let result = [];
            for (let i = 0; i < this.selectionsList.length; i++) {
                const item = this.selectionsList[i].item;
                result.push(item);
                if (this.canRecurse(recursive, item)) {
                    /* tslint:disable:no-any */
                    result = result.concat(((item as any)).selectionManager.getSelections(true));
                    /* tslint:enable:no-any */
                }
            }
        }
        return this.selectionsList.map((selectable) => selectable.item);
    }
}
