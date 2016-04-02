import { Defaults } from './common/defaults';
import { Utility } from './common/utility';
import { SelectionManager } from './selectionManager';
import { FilterManager } from './filterManager';
import { ProgressState } from './common/progressState';
import { SortManager } from './sortManager';
export class List {
    constructor(stateManager) {
        this.disposed = false;
        this.inited = false;
        this.state = null;
        ///IList
        this.items = [];
        this.totalCount = 0;
        this.loadedCount = 0;
        ///IRequestCanceller
        ///IComponentWithState
        this.useModelState = true;
        this.stateManager = stateManager;
        SelectionManager.includeIn(this, 'items');
        FilterManager.includeIn(this);
        SortManager.includeIn(this);
        this.filterManager.registerFilterTarget(this.sortManager);
        this.listLoadDataSuccessBinded = this.listLoadDataSuccessCallback.bind(this);
        this.listLoadDataFailBinded = this.listLoadDataFailCallback.bind(this);
    }
    listLoadDataSuccessCallback(result) {
        this.loadedCount = result[Defaults.listSettings.loadedCountParameterName];
        this.totalCount = result[Defaults.listSettings.totalCountParameterName] || 0;
        this.state = ProgressState.Done;
        return result;
    }
    listLoadDataFailCallback() {
        this.state = ProgressState.Fail;
    }
    clearDataInternal() {
        this.totalCount = 0;
        this.selectionManager.deselectAll();
        Utility.disposeAll(this.items);
    }
    get busy() {
        return this.state === ProgressState.Progress;
    }
    get ready() {
        return this.state !== ProgressState.Progress;
    }
    ///IComponent overrides
    init(queryParams) {
        this.inited = true;
        const restoredState = this.getRestoredState(queryParams);
        this.filterManager.parseParams(restoredState);
    }
    dispose() {
        this.disposed = true;
        delete this.listLoadDataSuccessBinded;
        delete this.listLoadDataFailBinded;
        this.clearDataInternal();
        this.sortManager.dispose();
        this.filterManager.dispose();
        this.selectionManager.dispose();
    }
    ///IComponent overrides
    onSortChangesCompleted() {
        if (this.ready) {
            this.clearDataInternal();
            this.loadData();
        }
    }
    toRequest() {
        return this.filterManager.buildRequest(null);
    }
    getLocalState() {
        return this.filterManager.buildPersistedState(null);
    }
    loadData() {
        if (!this.inited) {
            throw new Error('loadData can be called only after activation.');
        }
        this.totalCount = 0;
        this.state = ProgressState.Progress;
        const promise = this.getDataReadPromise();
        this.addToCancellationSequence(promise);
        promise.then(this.listLoadDataSuccessBinded, this.listLoadDataFailBinded);
        if (this.useModelState) {
            this.saveRequestState();
            this.saveLocalState();
        }
        return promise;
    }
    clearData() {
        this.clearDataInternal();
    }
    reloadData() {
        if (this.ready) {
            this.clearData();
            this.loadData();
        }
    }
    ///IList
    ///IRequestCanceller
    addToCancellationSequence(promise) { }
    ;
    cancelRequests() { }
    ;
    saveRequestState() {
        this.stateManager.flushRequestState(this.toRequest());
    }
    ;
    saveLocalState() {
        this.stateManager.persistLocalState(this.getLocalState());
    }
    ;
    getRestoredState(params) {
        if (this.useModelState === false) {
            return params;
        }
        return this.stateManager.mergeStates(params);
    }
}

//# sourceMappingURL=data:application/json;base64,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UUFDMUUsRUFBRSxDQUFDLENBQUMsSUFBSSxDQUFDLGFBQWEsQ0FBQyxDQUFDLENBQUM7WUFDckIsSUFBSSxDQUFDLGdCQUFnQixFQUFFLENBQUM7WUFDeEIsSUFBSSxDQUFDLGNBQWMsRUFBRSxDQUFDO1FBQzFCLENBQUM7UUFDRCxNQUFNLENBQUMsT0FBTyxDQUFDO0lBQ25CLENBQUM7SUFDRCxTQUFTO1FBQ0wsSUFBSSxDQUFDLGlCQUFpQixFQUFFLENBQUM7SUFDN0IsQ0FBQztJQUNELFVBQVU7UUFDTixFQUFFLENBQUMsQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQztZQUNiLElBQUksQ0FBQyxTQUFTLEVBQUUsQ0FBQztZQUNqQixJQUFJLENBQUMsUUFBUSxFQUFFLENBQUM7UUFDcEIsQ0FBQztJQUNMLENBQUM7SUFDRCxRQUFRO0lBRVIsb0JBQW9CO0lBQ3BCLHlCQUF5QixDQUFDLE9BQXdCLElBQVUsQ0FBQzs7SUFDN0QsY0FBYyxLQUFXLENBQUM7O0lBSzFCLGdCQUFnQjtRQUNaLElBQUksQ0FBQyxZQUFZLENBQUMsaUJBQWlCLENBQUMsSUFBSSxDQUFDLFNBQVMsRUFBRSxDQUFDLENBQUM7SUFDMUQsQ0FBQzs7SUFDRCxjQUFjO1FBQ1YsSUFBSSxDQUFDLFlBQVksQ0FBQyxpQkFBaUIsQ0FBQyxJQUFJLENBQUMsYUFBYSxFQUFFLENBQUMsQ0FBQztJQUM5RCxDQUFDOztJQUNPLGdCQUFnQixDQUFDLE1BQWM7UUFDbkMsRUFBRSxDQUFDLENBQUMsSUFBSSxDQUFDLGFBQWEsS0FBSyxLQUFLLENBQUMsQ0FBQyxDQUFDO1lBQy9CLE1BQU0sQ0FBQyxNQUFNLENBQUM7UUFDbEIsQ0FBQztRQUNELE1BQU0sQ0FBQyxJQUFJLENBQUMsWUFBWSxDQUFDLFdBQVcsQ0FBQyxNQUFNLENBQUMsQ0FBQztJQUNqRCxDQUFDO0FBTUwsQ0FBQztBQUFBIiwiZmlsZSI6Imxpc3QuanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQge0RlZmF1bHRzfSBmcm9tICcuL2NvbW1vbi9kZWZhdWx0cyc7XHJcbmltcG9ydCB7VXRpbGl0eX0gZnJvbSAnLi9jb21tb24vdXRpbGl0eSc7XHJcbmltcG9ydCB7U2VsZWN0aW9uTWFuYWdlcn0gZnJvbSAnLi9zZWxlY3Rpb25NYW5hZ2VyJztcclxuaW1wb3J0IHtGaWx0ZXJNYW5hZ2VyfSBmcm9tICcuL2ZpbHRlck1hbmFnZXInO1xyXG5pbXBvcnQge1Byb2dyZXNzU3RhdGV9IGZyb20gJy4vY29tbW9uL3Byb2dyZXNzU3RhdGUnO1xyXG5pbXBvcnQge0lTdGF0ZU1hbmFnZXJ9IGZyb20gJy4vY29udHJhY3RzL0lTdGF0ZU1hbmFnZXInO1xyXG5pbXBvcnQge0lMaXN0fSBmcm9tICcuL2NvbnRyYWN0cy9JTGlzdCc7XHJcbmltcG9ydCB7SVNvcnRNYW5hZ2VyfSBmcm9tICcuL2NvbnRyYWN0cy9JU29ydE1hbmFnZXInO1xyXG5pbXBvcnQge1NvcnRNYW5hZ2VyfSBmcm9tICcuL3NvcnRNYW5hZ2VyJztcclxuaW1wb3J0IHtJRmlsdGVyTWFuYWdlcn0gZnJvbSAnLi9jb250cmFjdHMvSUZpbHRlck1hbmFnZXInO1xyXG5pbXBvcnQge0lTZWxlY3Rpb25NYW5hZ2VyfSBmcm9tICcuL2NvbnRyYWN0cy9JU2VsZWN0aW9uTWFuYWdlcic7XHJcblxyXG5leHBvcnQgYWJzdHJhY3QgY2xhc3MgTGlzdCBpbXBsZW1lbnRzIElMaXN0IHtcclxuICAgIHByaXZhdGUgbGlzdExvYWREYXRhU3VjY2Vzc0NhbGxiYWNrKHJlc3VsdDogT2JqZWN0KTogT2JqZWN0IHtcclxuICAgICAgICB0aGlzLmxvYWRlZENvdW50ID0gcmVzdWx0W0RlZmF1bHRzLmxpc3RTZXR0aW5ncy5sb2FkZWRDb3VudFBhcmFtZXRlck5hbWVdO1xyXG4gICAgICAgIHRoaXMudG90YWxDb3VudCA9IHJlc3VsdFtEZWZhdWx0cy5saXN0U2V0dGluZ3MudG90YWxDb3VudFBhcmFtZXRlck5hbWVdIHx8IDA7XHJcbiAgICAgICAgdGhpcy5zdGF0ZSA9IFByb2dyZXNzU3RhdGUuRG9uZTtcclxuICAgICAgICByZXR1cm4gcmVzdWx0O1xyXG4gICAgfVxyXG4gICAgcHJpdmF0ZSBsaXN0TG9hZERhdGFGYWlsQ2FsbGJhY2soKTogdm9pZCB7XHJcbiAgICAgICAgdGhpcy5zdGF0ZSA9IFByb2dyZXNzU3RhdGUuRmFpbDtcclxuICAgIH1cclxuICAgIHByaXZhdGUgbGlzdExvYWREYXRhU3VjY2Vzc0JpbmRlZDogKHJlc3VsdDogT2JqZWN0KSA9PiBPYmplY3Q7XHJcbiAgICBwcml2YXRlIGxpc3RMb2FkRGF0YUZhaWxCaW5kZWQ6IChlcnJvcjogT2JqZWN0KSA9PiB2b2lkO1xyXG4gICAgcHJpdmF0ZSBjbGVhckRhdGFJbnRlcm5hbCgpOiB2b2lkIHtcclxuICAgICAgICB0aGlzLnRvdGFsQ291bnQgPSAwO1xyXG4gICAgICAgIHRoaXMuc2VsZWN0aW9uTWFuYWdlci5kZXNlbGVjdEFsbCgpO1xyXG4gICAgICAgIFV0aWxpdHkuZGlzcG9zZUFsbCh0aGlzLml0ZW1zKTtcclxuICAgIH1cclxuICAgIGNvbnN0cnVjdG9yKHN0YXRlTWFuYWdlcjogSVN0YXRlTWFuYWdlcikge1xyXG4gICAgICAgIHRoaXMuc3RhdGVNYW5hZ2VyID0gc3RhdGVNYW5hZ2VyO1xyXG4gICAgICAgIFNlbGVjdGlvbk1hbmFnZXIuaW5jbHVkZUluKHRoaXMsICdpdGVtcycpO1xyXG4gICAgICAgIEZpbHRlck1hbmFnZXIuaW5jbHVkZUluKHRoaXMpO1xyXG4gICAgICAgIFNvcnRNYW5hZ2VyLmluY2x1ZGVJbih0aGlzKTtcclxuICAgICAgICB0aGlzLmZpbHRlck1hbmFnZXIucmVnaXN0ZXJGaWx0ZXJUYXJnZXQodGhpcy5zb3J0TWFuYWdlcik7XHJcbiAgICAgICAgdGhpcy5saXN0TG9hZERhdGFTdWNjZXNzQmluZGVkID0gdGhpcy5saXN0TG9hZERhdGFTdWNjZXNzQ2FsbGJhY2suYmluZCh0aGlzKTtcclxuICAgICAgICB0aGlzLmxpc3RMb2FkRGF0YUZhaWxCaW5kZWQgPSB0aGlzLmxpc3RMb2FkRGF0YUZhaWxDYWxsYmFjay5iaW5kKHRoaXMpO1xyXG4gICAgfVxyXG4gICAgZGlzcG9zZWQgPSBmYWxzZTtcclxuICAgIGluaXRlZCA9IGZhbHNlO1xyXG4gICAgc3RhdGU6IFByb2dyZXNzU3RhdGUgPSBudWxsO1xyXG5cclxuICAgIGdldCBidXN5KCk6IGJvb2xlYW4ge1xyXG4gICAgICAgIHJldHVybiB0aGlzLnN0YXRlID09PSBQcm9ncmVzc1N0YXRlLlByb2dyZXNzO1xyXG4gICAgfVxyXG5cclxuICAgIGdldCByZWFkeSgpOiBib29sZWFuIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5zdGF0ZSAhPT0gUHJvZ3Jlc3NTdGF0ZS5Qcm9ncmVzcztcclxuICAgIH1cclxuXHJcbiAgICAvLy9JQ29tcG9uZW50IG92ZXJyaWRlc1xyXG4gICAgaW5pdChxdWVyeVBhcmFtcz86IE9iamVjdCk6IHZvaWQge1xyXG4gICAgICAgIHRoaXMuaW5pdGVkID0gdHJ1ZTtcclxuICAgICAgICBjb25zdCByZXN0b3JlZFN0YXRlID0gdGhpcy5nZXRSZXN0b3JlZFN0YXRlKHF1ZXJ5UGFyYW1zKTtcclxuICAgICAgICB0aGlzLmZpbHRlck1hbmFnZXIucGFyc2VQYXJhbXMocmVzdG9yZWRTdGF0ZSk7XHJcbiAgICB9XHJcbiAgICBkaXNwb3NlKCk6IHZvaWQge1xyXG4gICAgICAgIHRoaXMuZGlzcG9zZWQgPSB0cnVlO1xyXG4gICAgICAgIGRlbGV0ZSB0aGlzLmxpc3RMb2FkRGF0YVN1Y2Nlc3NCaW5kZWQ7XHJcbiAgICAgICAgZGVsZXRlIHRoaXMubGlzdExvYWREYXRhRmFpbEJpbmRlZDtcclxuICAgICAgICB0aGlzLmNsZWFyRGF0YUludGVybmFsKCk7XHJcbiAgICAgICAgdGhpcy5zb3J0TWFuYWdlci5kaXNwb3NlKCk7XHJcbiAgICAgICAgdGhpcy5maWx0ZXJNYW5hZ2VyLmRpc3Bvc2UoKTtcclxuICAgICAgICB0aGlzLnNlbGVjdGlvbk1hbmFnZXIuZGlzcG9zZSgpO1xyXG4gICAgfVxyXG4gICAgLy8vSUNvbXBvbmVudCBvdmVycmlkZXNcclxuICAgIG9uU29ydENoYW5nZXNDb21wbGV0ZWQoKTogdm9pZCB7XHJcbiAgICAgICAgaWYgKHRoaXMucmVhZHkpIHtcclxuICAgICAgICAgICAgdGhpcy5jbGVhckRhdGFJbnRlcm5hbCgpO1xyXG4gICAgICAgICAgICB0aGlzLmxvYWREYXRhKCk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG4gICAgLy8vSUxpc3RcclxuICAgIGl0ZW1zOiBPYmplY3RbXSA9IFtdO1xyXG4gICAgdG90YWxDb3VudCA9IDA7XHJcbiAgICBsb2FkZWRDb3VudCA9IDA7XHJcbiAgICB0b1JlcXVlc3QoKTogYW55IHtcclxuICAgICAgICByZXR1cm4gdGhpcy5maWx0ZXJNYW5hZ2VyLmJ1aWxkUmVxdWVzdChudWxsKTtcclxuICAgIH1cclxuICAgIGdldExvY2FsU3RhdGUoKTogT2JqZWN0IHtcclxuICAgICAgICByZXR1cm4gdGhpcy5maWx0ZXJNYW5hZ2VyLmJ1aWxkUGVyc2lzdGVkU3RhdGUobnVsbCk7XHJcbiAgICB9XHJcblxyXG4gICAgbG9hZERhdGEoKTogUHJvbWlzZTxPYmplY3Q+IHtcclxuICAgICAgICBpZiAoIXRoaXMuaW5pdGVkKSB7XHJcbiAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcignbG9hZERhdGEgY2FuIGJlIGNhbGxlZCBvbmx5IGFmdGVyIGFjdGl2YXRpb24uJyk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICB0aGlzLnRvdGFsQ291bnQgPSAwO1xyXG4gICAgICAgIHRoaXMuc3RhdGUgPSBQcm9ncmVzc1N0YXRlLlByb2dyZXNzO1xyXG4gICAgICAgIGNvbnN0IHByb21pc2UgPSB0aGlzLmdldERhdGFSZWFkUHJvbWlzZSgpO1xyXG4gICAgICAgIHRoaXMuYWRkVG9DYW5jZWxsYXRpb25TZXF1ZW5jZShwcm9taXNlKTtcclxuICAgICAgICBwcm9taXNlLnRoZW4odGhpcy5saXN0TG9hZERhdGFTdWNjZXNzQmluZGVkLCB0aGlzLmxpc3RMb2FkRGF0YUZhaWxCaW5kZWQpO1xyXG4gICAgICAgIGlmICh0aGlzLnVzZU1vZGVsU3RhdGUpIHtcclxuICAgICAgICAgICAgdGhpcy5zYXZlUmVxdWVzdFN0YXRlKCk7XHJcbiAgICAgICAgICAgIHRoaXMuc2F2ZUxvY2FsU3RhdGUoKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIHByb21pc2U7XHJcbiAgICB9XHJcbiAgICBjbGVhckRhdGEoKTogdm9pZCB7XHJcbiAgICAgICAgdGhpcy5jbGVhckRhdGFJbnRlcm5hbCgpO1xyXG4gICAgfVxyXG4gICAgcmVsb2FkRGF0YSgpOiB2b2lkIHtcclxuICAgICAgICBpZiAodGhpcy5yZWFkeSkge1xyXG4gICAgICAgICAgICB0aGlzLmNsZWFyRGF0YSgpO1xyXG4gICAgICAgICAgICB0aGlzLmxvYWREYXRhKCk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG4gICAgLy8vSUxpc3RcclxuXHJcbiAgICAvLy9JUmVxdWVzdENhbmNlbGxlclxyXG4gICAgYWRkVG9DYW5jZWxsYXRpb25TZXF1ZW5jZShwcm9taXNlOiBQcm9taXNlPE9iamVjdD4pOiB2b2lkIHsgfTtcclxuICAgIGNhbmNlbFJlcXVlc3RzKCk6IHZvaWQgeyB9O1xyXG4gICAgLy8vSVJlcXVlc3RDYW5jZWxsZXJcclxuICAgIC8vL0lDb21wb25lbnRXaXRoU3RhdGVcclxuICAgIHVzZU1vZGVsU3RhdGUgPSB0cnVlO1xyXG4gICAgc3RhdGVNYW5hZ2VyOiBJU3RhdGVNYW5hZ2VyO1xyXG4gICAgc2F2ZVJlcXVlc3RTdGF0ZSgpOiB2b2lkIHtcclxuICAgICAgICB0aGlzLnN0YXRlTWFuYWdlci5mbHVzaFJlcXVlc3RTdGF0ZSh0aGlzLnRvUmVxdWVzdCgpKTtcclxuICAgIH07XHJcbiAgICBzYXZlTG9jYWxTdGF0ZSgpOiB2b2lkIHtcclxuICAgICAgICB0aGlzLnN0YXRlTWFuYWdlci5wZXJzaXN0TG9jYWxTdGF0ZSh0aGlzLmdldExvY2FsU3RhdGUoKSk7XHJcbiAgICB9O1xyXG4gICAgcHJpdmF0ZSBnZXRSZXN0b3JlZFN0YXRlKHBhcmFtczogT2JqZWN0KTogT2JqZWN0IHtcclxuICAgICAgICBpZiAodGhpcy51c2VNb2RlbFN0YXRlID09PSBmYWxzZSkge1xyXG4gICAgICAgICAgICByZXR1cm4gcGFyYW1zO1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gdGhpcy5zdGF0ZU1hbmFnZXIubWVyZ2VTdGF0ZXMocGFyYW1zKTtcclxuICAgIH1cclxuICAgIC8vL0lDb21wb25lbnRXaXRoU3RhdGVcclxuICAgIHNlbGVjdGlvbk1hbmFnZXI6IElTZWxlY3Rpb25NYW5hZ2VyO1xyXG4gICAgZmlsdGVyTWFuYWdlcjogSUZpbHRlck1hbmFnZXI7XHJcbiAgICBzb3J0TWFuYWdlcjogSVNvcnRNYW5hZ2VyO1xyXG4gICAgYWJzdHJhY3QgZ2V0RGF0YVJlYWRQcm9taXNlKCk6IFByb21pc2U8T2JqZWN0PjtcclxufVxyXG4iXSwic291cmNlUm9vdCI6Ii9zb3VyY2UvIn0=
