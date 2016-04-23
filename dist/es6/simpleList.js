import { Defaults } from './common/defaults';
import { Utility } from './common/utility';
import { FilterManager } from './filterManager';
import { ProgressState } from './common/progressState';
export class SimpleList {
    constructor(stateManager) {
        this.disposed = false;
        this.inited = false;
        this.state = null;
        ///IList
        this.items = [];
        this.totalCount = 0;
        this.loadedCount = 0;
        ///IRequestCanceller
        ///IObjectWithState
        this.useModelState = true;
        this.stateManager = stateManager;
        FilterManager.includeIn(this);
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
        Utility.disposeAll(this.items);
    }
    get busy() {
        return this.state === ProgressState.Progress;
    }
    get ready() {
        return this.state !== ProgressState.Progress;
    }
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
        this.filterManager.dispose();
    }
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
        const promise = this.getDataReadPromise(this.toRequest());
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

//# sourceMappingURL=data:application/json;base64,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QztJQUNMLENBQUM7SUFDRCxRQUFRO0lBRVIsb0JBQW9CO0lBQ3BCLHlCQUF5QixDQUFDLE9BQXdCLElBQVUsQ0FBQzs7SUFDN0QsY0FBYyxLQUFXLENBQUM7O0lBSzFCLGdCQUFnQjtRQUNaLElBQUksQ0FBQyxZQUFZLENBQUMsaUJBQWlCLENBQUMsSUFBSSxDQUFDLFNBQVMsRUFBRSxDQUFDLENBQUM7SUFDMUQsQ0FBQzs7SUFDRCxjQUFjO1FBQ1YsSUFBSSxDQUFDLFlBQVksQ0FBQyxpQkFBaUIsQ0FBQyxJQUFJLENBQUMsYUFBYSxFQUFFLENBQUMsQ0FBQztJQUM5RCxDQUFDOztJQUNPLGdCQUFnQixDQUFDLE1BQWM7UUFDbkMsRUFBRSxDQUFDLENBQUMsSUFBSSxDQUFDLGFBQWEsS0FBSyxLQUFLLENBQUMsQ0FBQyxDQUFDO1lBQy9CLE1BQU0sQ0FBQyxNQUFNLENBQUM7UUFDbEIsQ0FBQztRQUNELE1BQU0sQ0FBQyxJQUFJLENBQUMsWUFBWSxDQUFDLFdBQVcsQ0FBQyxNQUFNLENBQUMsQ0FBQztJQUNqRCxDQUFDO0FBSUwsQ0FBQztBQUFBIiwiZmlsZSI6InNpbXBsZUxpc3QuanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQge0RlZmF1bHRzfSBmcm9tICcuL2NvbW1vbi9kZWZhdWx0cyc7XHJcbmltcG9ydCB7VXRpbGl0eX0gZnJvbSAnLi9jb21tb24vdXRpbGl0eSc7XHJcbmltcG9ydCB7RmlsdGVyTWFuYWdlcn0gZnJvbSAnLi9maWx0ZXJNYW5hZ2VyJztcclxuaW1wb3J0IHtQcm9ncmVzc1N0YXRlfSBmcm9tICcuL2NvbW1vbi9wcm9ncmVzc1N0YXRlJztcclxuaW1wb3J0IHtJU3RhdGVNYW5hZ2VyfSBmcm9tICcuL2NvbnRyYWN0cy9JU3RhdGVNYW5hZ2VyJztcclxuaW1wb3J0IHtJTGlzdH0gZnJvbSAnLi9jb250cmFjdHMvSUxpc3QnO1xyXG5pbXBvcnQge0lGaWx0ZXJNYW5hZ2VyfSBmcm9tICcuL2NvbnRyYWN0cy9JRmlsdGVyTWFuYWdlcic7XHJcblxyXG5leHBvcnQgYWJzdHJhY3QgY2xhc3MgU2ltcGxlTGlzdCBpbXBsZW1lbnRzIElMaXN0IHtcclxuICAgIHByaXZhdGUgbGlzdExvYWREYXRhU3VjY2Vzc0NhbGxiYWNrKHJlc3VsdDogT2JqZWN0KTogT2JqZWN0IHtcclxuICAgICAgICB0aGlzLmxvYWRlZENvdW50ID0gcmVzdWx0W0RlZmF1bHRzLmxpc3RTZXR0aW5ncy5sb2FkZWRDb3VudFBhcmFtZXRlck5hbWVdO1xyXG4gICAgICAgIHRoaXMudG90YWxDb3VudCA9IHJlc3VsdFtEZWZhdWx0cy5saXN0U2V0dGluZ3MudG90YWxDb3VudFBhcmFtZXRlck5hbWVdIHx8IDA7XHJcbiAgICAgICAgdGhpcy5zdGF0ZSA9IFByb2dyZXNzU3RhdGUuRG9uZTtcclxuICAgICAgICByZXR1cm4gcmVzdWx0O1xyXG4gICAgfVxyXG4gICAgcHJpdmF0ZSBsaXN0TG9hZERhdGFGYWlsQ2FsbGJhY2soKTogdm9pZCB7XHJcbiAgICAgICAgdGhpcy5zdGF0ZSA9IFByb2dyZXNzU3RhdGUuRmFpbDtcclxuICAgIH1cclxuICAgIHByaXZhdGUgbGlzdExvYWREYXRhU3VjY2Vzc0JpbmRlZDogKHJlc3VsdDogT2JqZWN0KSA9PiBPYmplY3Q7XHJcbiAgICBwcml2YXRlIGxpc3RMb2FkRGF0YUZhaWxCaW5kZWQ6IChlcnJvcjogT2JqZWN0KSA9PiB2b2lkO1xyXG4gICAgcHJpdmF0ZSBjbGVhckRhdGFJbnRlcm5hbCgpOiB2b2lkIHtcclxuICAgICAgICB0aGlzLnRvdGFsQ291bnQgPSAwO1xyXG4gICAgICAgIFV0aWxpdHkuZGlzcG9zZUFsbCh0aGlzLml0ZW1zKTtcclxuICAgIH1cclxuICAgIGNvbnN0cnVjdG9yKHN0YXRlTWFuYWdlcjogSVN0YXRlTWFuYWdlcikge1xyXG4gICAgICAgIHRoaXMuc3RhdGVNYW5hZ2VyID0gc3RhdGVNYW5hZ2VyO1xyXG4gICAgICAgIEZpbHRlck1hbmFnZXIuaW5jbHVkZUluKHRoaXMpO1xyXG4gICAgICAgIHRoaXMubGlzdExvYWREYXRhU3VjY2Vzc0JpbmRlZCA9IHRoaXMubGlzdExvYWREYXRhU3VjY2Vzc0NhbGxiYWNrLmJpbmQodGhpcyk7XHJcbiAgICAgICAgdGhpcy5saXN0TG9hZERhdGFGYWlsQmluZGVkID0gdGhpcy5saXN0TG9hZERhdGFGYWlsQ2FsbGJhY2suYmluZCh0aGlzKTtcclxuICAgIH1cclxuICAgIGRpc3Bvc2VkID0gZmFsc2U7XHJcbiAgICBpbml0ZWQgPSBmYWxzZTtcclxuICAgIHN0YXRlOiBQcm9ncmVzc1N0YXRlID0gbnVsbDtcclxuXHJcbiAgICBnZXQgYnVzeSgpOiBib29sZWFuIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5zdGF0ZSA9PT0gUHJvZ3Jlc3NTdGF0ZS5Qcm9ncmVzcztcclxuICAgIH1cclxuXHJcbiAgICBnZXQgcmVhZHkoKTogYm9vbGVhbiB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuc3RhdGUgIT09IFByb2dyZXNzU3RhdGUuUHJvZ3Jlc3M7XHJcbiAgICB9XHJcblxyXG4gICAgaW5pdChxdWVyeVBhcmFtcz86IE9iamVjdCk6IHZvaWQge1xyXG4gICAgICAgIHRoaXMuaW5pdGVkID0gdHJ1ZTtcclxuICAgICAgICBjb25zdCByZXN0b3JlZFN0YXRlID0gdGhpcy5nZXRSZXN0b3JlZFN0YXRlKHF1ZXJ5UGFyYW1zKTtcclxuICAgICAgICB0aGlzLmZpbHRlck1hbmFnZXIucGFyc2VQYXJhbXMocmVzdG9yZWRTdGF0ZSk7XHJcbiAgICB9XHJcbiAgICBkaXNwb3NlKCk6IHZvaWQge1xyXG4gICAgICAgIHRoaXMuZGlzcG9zZWQgPSB0cnVlO1xyXG4gICAgICAgIGRlbGV0ZSB0aGlzLmxpc3RMb2FkRGF0YVN1Y2Nlc3NCaW5kZWQ7XHJcbiAgICAgICAgZGVsZXRlIHRoaXMubGlzdExvYWREYXRhRmFpbEJpbmRlZDtcclxuICAgICAgICB0aGlzLmNsZWFyRGF0YUludGVybmFsKCk7XHJcbiAgICAgICAgdGhpcy5maWx0ZXJNYW5hZ2VyLmRpc3Bvc2UoKTtcclxuICAgIH1cclxuICAgIG9uU29ydENoYW5nZXNDb21wbGV0ZWQoKTogdm9pZCB7XHJcbiAgICAgICAgaWYgKHRoaXMucmVhZHkpIHtcclxuICAgICAgICAgICAgdGhpcy5jbGVhckRhdGFJbnRlcm5hbCgpO1xyXG4gICAgICAgICAgICB0aGlzLmxvYWREYXRhKCk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG4gICAgLy8vSUxpc3RcclxuICAgIGl0ZW1zOiBPYmplY3RbXSA9IFtdO1xyXG4gICAgdG90YWxDb3VudCA9IDA7XHJcbiAgICBsb2FkZWRDb3VudCA9IDA7XHJcbiAgICB0b1JlcXVlc3QoKTogYW55IHtcclxuICAgICAgICByZXR1cm4gdGhpcy5maWx0ZXJNYW5hZ2VyLmJ1aWxkUmVxdWVzdChudWxsKTtcclxuICAgIH1cclxuICAgIGdldExvY2FsU3RhdGUoKTogT2JqZWN0IHtcclxuICAgICAgICByZXR1cm4gdGhpcy5maWx0ZXJNYW5hZ2VyLmJ1aWxkUGVyc2lzdGVkU3RhdGUobnVsbCk7XHJcbiAgICB9XHJcblxyXG4gICAgbG9hZERhdGEoKTogUHJvbWlzZTxPYmplY3Q+IHtcclxuICAgICAgICBpZiAoIXRoaXMuaW5pdGVkKSB7XHJcbiAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcignbG9hZERhdGEgY2FuIGJlIGNhbGxlZCBvbmx5IGFmdGVyIGFjdGl2YXRpb24uJyk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICB0aGlzLnRvdGFsQ291bnQgPSAwO1xyXG4gICAgICAgIHRoaXMuc3RhdGUgPSBQcm9ncmVzc1N0YXRlLlByb2dyZXNzO1xyXG4gICAgICAgIGNvbnN0IHByb21pc2UgPSB0aGlzLmdldERhdGFSZWFkUHJvbWlzZSh0aGlzLnRvUmVxdWVzdCgpKTtcclxuICAgICAgICB0aGlzLmFkZFRvQ2FuY2VsbGF0aW9uU2VxdWVuY2UocHJvbWlzZSk7XHJcbiAgICAgICAgcHJvbWlzZS50aGVuKHRoaXMubGlzdExvYWREYXRhU3VjY2Vzc0JpbmRlZCwgdGhpcy5saXN0TG9hZERhdGFGYWlsQmluZGVkKTtcclxuICAgICAgICBpZiAodGhpcy51c2VNb2RlbFN0YXRlKSB7XHJcbiAgICAgICAgICAgIHRoaXMuc2F2ZVJlcXVlc3RTdGF0ZSgpO1xyXG4gICAgICAgICAgICB0aGlzLnNhdmVMb2NhbFN0YXRlKCk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiBwcm9taXNlO1xyXG4gICAgfVxyXG4gICAgY2xlYXJEYXRhKCk6IHZvaWQge1xyXG4gICAgICAgIHRoaXMuY2xlYXJEYXRhSW50ZXJuYWwoKTtcclxuICAgIH1cclxuICAgIHJlbG9hZERhdGEoKTogdm9pZCB7XHJcbiAgICAgICAgaWYgKHRoaXMucmVhZHkpIHtcclxuICAgICAgICAgICAgdGhpcy5jbGVhckRhdGEoKTtcclxuICAgICAgICAgICAgdGhpcy5sb2FkRGF0YSgpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuICAgIC8vL0lMaXN0XHJcblxyXG4gICAgLy8vSVJlcXVlc3RDYW5jZWxsZXJcclxuICAgIGFkZFRvQ2FuY2VsbGF0aW9uU2VxdWVuY2UocHJvbWlzZTogUHJvbWlzZTxPYmplY3Q+KTogdm9pZCB7IH07XHJcbiAgICBjYW5jZWxSZXF1ZXN0cygpOiB2b2lkIHsgfTtcclxuICAgIC8vL0lSZXF1ZXN0Q2FuY2VsbGVyXHJcbiAgICAvLy9JT2JqZWN0V2l0aFN0YXRlXHJcbiAgICB1c2VNb2RlbFN0YXRlID0gdHJ1ZTtcclxuICAgIHN0YXRlTWFuYWdlcjogSVN0YXRlTWFuYWdlcjtcclxuICAgIHNhdmVSZXF1ZXN0U3RhdGUoKTogdm9pZCB7XHJcbiAgICAgICAgdGhpcy5zdGF0ZU1hbmFnZXIuZmx1c2hSZXF1ZXN0U3RhdGUodGhpcy50b1JlcXVlc3QoKSk7XHJcbiAgICB9O1xyXG4gICAgc2F2ZUxvY2FsU3RhdGUoKTogdm9pZCB7XHJcbiAgICAgICAgdGhpcy5zdGF0ZU1hbmFnZXIucGVyc2lzdExvY2FsU3RhdGUodGhpcy5nZXRMb2NhbFN0YXRlKCkpO1xyXG4gICAgfTtcclxuICAgIHByaXZhdGUgZ2V0UmVzdG9yZWRTdGF0ZShwYXJhbXM6IE9iamVjdCk6IE9iamVjdCB7XHJcbiAgICAgICAgaWYgKHRoaXMudXNlTW9kZWxTdGF0ZSA9PT0gZmFsc2UpIHtcclxuICAgICAgICAgICAgcmV0dXJuIHBhcmFtcztcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuc3RhdGVNYW5hZ2VyLm1lcmdlU3RhdGVzKHBhcmFtcyk7XHJcbiAgICB9XHJcbiAgICAvLy9JT2JqZWN0V2l0aFN0YXRlXHJcbiAgICBmaWx0ZXJNYW5hZ2VyOiBJRmlsdGVyTWFuYWdlcjtcclxuICAgIGFic3RyYWN0IGdldERhdGFSZWFkUHJvbWlzZShyZXF1ZXN0UGFyYW1zOiBhbnkpOiBQcm9taXNlPE9iamVjdD47XHJcbn1cclxuIl0sInNvdXJjZVJvb3QiOiIvc291cmNlLyJ9
