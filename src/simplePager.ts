import {Defaults} from './common/defaults';
import {IPager} from './contracts/IPager';

export class SimplePager implements IPager {
    private pageSizeInternal = Defaults.pagedListSettings.defaultPageSize;
    private pageNumberInternal = 1;

    totalCount: number = 0;
    loadedCount: number = 0;

    processResponse(result: Object): void {
        this.loadedCount = result[Defaults.listSettings.loadedCountParameterName];
        this.totalCount = result[Defaults.listSettings.totalCountParameterName] || 0;
    }
    reset(): void {
        this.totalCount = 0;
    }
}