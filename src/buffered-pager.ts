import { FilterConfig } from './contracts/filter-config';
import { ListResponse } from './contracts/list-response';
import { Pager } from './contracts/pager';
import { filter } from './filter-annotation';

/**
 * Implements {@link Pager} contract and represents buffered list behavior. 
 * @note This type is configured to use with {@link FiltersService}.
 */
export class BufferedPager implements Pager {
    /**
     * Global settings for properties such as default values and constraints for pager properties.
     * 
     * These settings are static and their values are copied to the properties of the same name for each instance of {@link BufferedPager} type.
     * 
     * So, changing of this settings will affect all instances of {@link BufferedPager} type that will be created after such changes.
     * If you want to change settings of concrete object you can use it the same name properties.
     */
    // tslint:disable-next-line: typedef
    public static settings =
    {
        /**
         * @see {@link BufferedPager.defaultRowCount}
         */
        defaultRowCount: 20,
        /**
         * @see {@link BufferedPager.maxRowCount}
         */
        maxRowCount: 200,
        /**
         * @see {@link BufferedPager.minRowCount}
         */
        minRowCount: 1
    };
    /**
     * @inheritdoc
     */
    public appendedOnLoad: boolean = true;
    /**
     * @inheritdoc
     */
    public totalCount: number = 0;
    /**
     * @inheritdoc
     */
    public loadedCount: number = 0;
    /**
     * This is both initial value and value which will be applied to {@link takeRowCount} property on {@link reset} method execution. 
     */
    public defaultRowCount: number = BufferedPager.settings.defaultRowCount;
    /**
     * The smallest value that can be applied to {@link takeRowCount} property. 
     */
    public minRowCount: number = BufferedPager.settings.minRowCount;
    /**
     * The biggest value that can be applied to {@link takeRowCount} property. 
     */
    public maxRowCount: number = BufferedPager.settings.maxRowCount;
    /**
     * This property is applied to the server request and it specifies how many rows are already loaded and must be skipped on next request. 
     * 
     * @note This property is ready to use with {@link FiltersService} since it has {@link filter} annotation.
     * @see {@link BufferedListRequest.skip} 
     */
    @filter({
        defaultValue: 0,
        parameterName: 'skip',
        parseFormatter(): number { return 0; }
    } as FilterConfig)
    public skip: number = 0;

    /**
     * Internal implementation of {@link takeRowCount}. 
     */
    @filter({
        defaultValue(this: BufferedPager): number { return this.defaultRowCount; },
        parameterName: 'take',
        parseFormatter(this: BufferedPager, rawValue: any, allValues: any): number {
            let result: number;
            if (allValues && !isNaN(allValues.skip) && !isNaN(allValues.take)) {
                result = (allValues.skip || 0) + (allValues.take || 0);
            }
            return result || this.defaultRowCount;
        }
    } as FilterConfig)
    protected takeRowCountInternal: number = BufferedPager.settings.defaultRowCount;

    /**
     * This property is applied to the server request and it specifies how many rows must be loaded on next request.
     * @note This property is ready to use with {@link FiltersService} since it has {@link filter} annotation.
     * @see {@link BufferedListRequest.take} 
     */
    public get takeRowCount(): number {
        return this.takeRowCountInternal;
    }
    /**
     * Executes several checks. For example, it doesn't accept values bigger than {@link maxRowCount}.
     */
    public set takeRowCount(value: number) {
        const valueStr = (value + '').replace(/[^0-9]/g, '');
        let rowCount = parseInt(valueStr, 10) ? parseInt(valueStr, 10) : this.defaultRowCount;
        if (rowCount < this.minRowCount) {
            rowCount = this.defaultRowCount;
        }
        if (rowCount > this.maxRowCount) {
            rowCount = this.maxRowCount;
        }
        if (this.totalCount !== 0) {
            if (this.skip + rowCount > this.totalCount) {
                rowCount = this.totalCount - this.skip;
            }
        }
        this.takeRowCountInternal = rowCount;
    }
    /**
     * Returns `true` if it's possible to load more records (e.g. currently not all records loaded to the list).
     */
    public get canLoadMore(): boolean {
        return this.totalCount !== 0 && this.skip < this.totalCount;
    }
    /**
     * @inheritdoc
     */
    public processResponse(response: ListResponse<any>): void {
        this.totalCount = response.totalCount || 0;
        const loadedCount = response.loadedCount || (response.items && response.items.length ? response.items.length : 0);
        this.skip = loadedCount === 0 ? 0 : this.skip + loadedCount;
        this.loadedCount = this.skip;
    }
    /**
     * @inheritdoc
     */
    public reset(): void {
        this.totalCount = 0;
        this.loadedCount = 0;
        this.takeRowCount = this.defaultRowCount;
        this.skip = 0;
    }
}
