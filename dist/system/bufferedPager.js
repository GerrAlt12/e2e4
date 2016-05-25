System.register(['./common/defaults', './filterAnnotation'], function(exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
        var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
        if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
        else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
        return c > 3 && r && Object.defineProperty(target, key, r), r;
    };
    var __metadata = (this && this.__metadata) || function (k, v) {
        if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
    };
    var defaults_1, filterAnnotation_1;
    var BufferedPager;
    return {
        setters:[
            function (defaults_1_1) {
                defaults_1 = defaults_1_1;
            },
            function (filterAnnotation_1_1) {
                filterAnnotation_1 = filterAnnotation_1_1;
            }],
        execute: function() {
            BufferedPager = (function () {
                function BufferedPager() {
                    this.takeRowCountInternal = defaults_1.Defaults.bufferedListSettings.defaultRowCount;
                    this.totalCount = 0;
                    this.loadedCount = 0;
                    this.defaultRowCount = defaults_1.Defaults.bufferedListSettings.defaultRowCount;
                    this.minRowCount = defaults_1.Defaults.bufferedListSettings.minRowCount;
                    this.maxRowCount = defaults_1.Defaults.bufferedListSettings.maxRowCount;
                    this.skip = 0;
                }
                Object.defineProperty(BufferedPager.prototype, "takeRowCount", {
                    get: function () {
                        return this.takeRowCountInternal;
                    },
                    set: function (value) {
                        var valueStr = (value + '').replace(/[^0-9]/g, '');
                        var rowCount = parseInt(valueStr, 10) ? parseInt(valueStr, 10) : this.defaultRowCount;
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
                    },
                    enumerable: true,
                    configurable: true
                });
                BufferedPager.prototype.processResponse = function (result) {
                    this.totalCount = result[defaults_1.Defaults.listSettings.totalCountParameterName] || 0;
                    this.skip = (result[defaults_1.Defaults.listSettings.loadedCountParameterName] === null || result[defaults_1.Defaults.listSettings.loadedCountParameterName] === undefined) ?
                        0 : this.skip + result[defaults_1.Defaults.listSettings.loadedCountParameterName];
                    this.loadedCount = this.skip;
                };
                BufferedPager.prototype.reset = function () {
                    this.totalCount = 0;
                    this.takeRowCount = this.defaultRowCount;
                    this.skip = 0;
                };
                __decorate([
                    filterAnnotation_1.filter({
                        defaultValue: function () { return this.defaultRowCount; },
                        parameterName: defaults_1.Defaults.bufferedListSettings.takeRowCountParameterName,
                        parseFormatter: function (rawValue, allValues) {
                            var result;
                            if (allValues && !isNaN(allValues.skip) && !isNaN(allValues.take)) {
                                result = (allValues.skip || 0) + (allValues.take || 0);
                            }
                            return result || this.defaultRowCount;
                        }
                    }), 
                    __metadata('design:type', Object)
                ], BufferedPager.prototype, "takeRowCountInternal", void 0);
                __decorate([
                    filterAnnotation_1.filter({
                        defaultValue: 0,
                        parameterName: defaults_1.Defaults.bufferedListSettings.skipRowCountParameterName,
                        parseFormatter: function () { return 0; }
                    }), 
                    __metadata('design:type', Object)
                ], BufferedPager.prototype, "skip", void 0);
                return BufferedPager;
            }());
            exports_1("BufferedPager", BufferedPager);
        }
    }
});
