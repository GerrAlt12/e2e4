// tslint:disable:max-classes-per-file
import { FilterConfig } from '../src/contracts/filter-config';
import { filter, getDefaultFilterConfig } from '../src/filter-annotation';
import { FiltersService } from '../src/filters-service';
import { cloneAsLiteral, coerceValue } from '../src/utilities';

import { expect } from 'chai';
import * as sinon from 'sinon';

describe('FiltersService', () => {
    afterEach(() => {
        FiltersService.filterPropertiesMap.clear();
    });

    describe('configs registration', () => {

        it('registers filter config for type', () => {
            class TargetType { };
            const config = getDefaultFilterConfig('propertyName');
            FiltersService.registerFilterConfig(TargetType, config);
            expect(FiltersService.filterPropertiesMap.has(TargetType)).true;
            expect(FiltersService.filterPropertiesMap.get(TargetType)).eql([config]);

        });
        it('registers multiple filter configs for type', () => {
            class TargetType { };
            const config = getDefaultFilterConfig('propertyName');
            const anotherConfig = getDefaultFilterConfig('anotherPropertyName');

            FiltersService.registerFilterConfig(TargetType, config);
            FiltersService.registerFilterConfig(TargetType, anotherConfig);

            expect(FiltersService.filterPropertiesMap.has(TargetType)).true;
            expect(FiltersService.filterPropertiesMap.get(TargetType)).eql([config, anotherConfig]);
        });

        it('builds filters map for target object', () => {
            class TargetType {
                @filter
                public first: string = 'first';
            }
            let target = new TargetType();
            let filtersService = new FiltersService(target);
            expect(filtersService.appliedFiltersMap.has(target)).true;
            expect(filtersService.appliedFiltersMap.get(target).length).eql(1);
        });

        it('builds filters map for registered object even after map was builted', () => {
            class TargetType {
                @filter
                public first: string = 'first';
            }
            let target = new TargetType();
            let filtersService = new FiltersService(target);
            expect(filtersService.appliedFiltersMap.has(target)).true;
            expect(filtersService.appliedFiltersMap.get(target).length).eql(1);
            let anotherTarget = new TargetType();
            filtersService.registerFilterTarget(anotherTarget);
            expect(filtersService.appliedFiltersMap.has(anotherTarget)).true;
            expect(filtersService.appliedFiltersMap.get(anotherTarget)).exist.not.empty;
        });

        it('can remove filter target', () => {
            class TargetType {
                @filter
                public first: string = 'first';
            }
            let target = new TargetType();
            let filtersService = new FiltersService(target);
            expect(filtersService.appliedFiltersMap.has(target)).true;
            expect(filtersService.appliedFiltersMap.get(target).length).eql(1);
            filtersService.removeFilterTarget(target);
            expect(filtersService.appliedFiltersMap.has(target)).false;
        });

        it('handles null on removeFilterTarget', () => {
            let filtersService = new FiltersService(null);
            filtersService.registerFilterTarget(null);
            expect(filtersService.appliedFiltersMap.size).eq(0);
            filtersService.removeFilterTarget(null);
        });

        it('handles null as target object', () => {
            let filtersService = new FiltersService(null);
            filtersService.registerFilterTarget(null);
            expect(filtersService.appliedFiltersMap.size).eq(0);
        });

        it('builds filters map for target object with multiple filters', () => {
            class TargetType {
                @filter
                public first: string = 'first';
                @filter
                public second: string = 'second';
            }
            let target = new TargetType();
            let filtersService = new FiltersService(target);
            expect(filtersService.appliedFiltersMap.has(target)).true;
            expect(filtersService.appliedFiltersMap.get(target).length).eql(2);
        });

        it('builds filters map for inheritant objects', () => {
            class TargetTypeParent {
                @filter
                public parent: string = 'parent property';
            }
            class TargetTypeChild extends TargetTypeParent {
                @filter
                public child: string = 'child property';
            }
            let target = new TargetTypeChild();
            let filtersService = new FiltersService(target);
            expect(filtersService.appliedFiltersMap.has(target)).true;
            expect(filtersService.appliedFiltersMap.get(target).length).eql(2);
            expect(filtersService.appliedFiltersMap.get(target)[0].propertyName).eql('parent');
            expect(filtersService.appliedFiltersMap.get(target)[1].propertyName).eql('child');
        });

        it('can compose additional objects in filters map', () => {
            class TargetType {
                @filter
                public property: string = 'property';
            }
            class AnotherTargetType {
                @filter
                public anotherProperty: string = 'another property';
            }
            let target = new TargetType();
            let anotherTarget = new AnotherTargetType();

            let filtersService = new FiltersService(target);
            filtersService.registerFilterTarget(anotherTarget);

            expect(filtersService.appliedFiltersMap.has(target)).true;
            expect(filtersService.appliedFiltersMap.get(target).length).eql(1);

            expect(filtersService.appliedFiltersMap.has(anotherTarget)).true;
            expect(filtersService.appliedFiltersMap.get(anotherTarget).length).eql(1);
        });

        it('applies default values on registration', () => {
            class TargetType {
                @filter
                public property: string = 'property';
            }
            class AnotherTargetType {
                @filter
                public anotherProperty: string = 'another property';
            }

            let target = new TargetType();
            let anotherTarget = new AnotherTargetType();
            let filtersService = new FiltersService(target);
            filtersService.registerFilterTarget(anotherTarget);

            expect(filtersService.appliedFiltersMap.get(target)[0].defaultValue).eq(target.property);
            expect(filtersService.appliedFiltersMap.get(anotherTarget)[0].defaultValue).eq(anotherTarget.anotherProperty);
        });

        it('clones default values on registrtaion', () => {
            class TargetType {
                @filter
                public property: string[] = ['one', 'two', 'three'];
            }

            let target = new TargetType();
            let filtersService = new FiltersService(target);
            expect(filtersService.appliedFiltersMap.get(target)[0].defaultValue).eql(target.property);
            expect(filtersService.appliedFiltersMap.get(target)[0].defaultValue).not.eq(target.property);
        });

        it('handles multiple registrations of same target', () => {
            class TargetType {
                @filter
                public first: 'first';
            }
            let target = new TargetType();
            let filtersService = new FiltersService(target);

            filtersService.registerFilterTarget(target);

            expect(filtersService.appliedFiltersMap.has(target)).true;
            expect(filtersService.appliedFiltersMap.get(target).length).eql(1);
        });

        it('ignores targets without filters', () => {
            class TargetType {
                public first: 'first';
            }
            let target = new TargetType();
            let filtersService = new FiltersService(target);
            filtersService.registerFilterTarget(target);

            expect(filtersService.appliedFiltersMap.has(target)).false;
        });

        it('clears targets on destroy', () => {
            class TargetType {
                @filter
                public first: 'first';
            }
            let target = new TargetType();
            let filtersService = new FiltersService(target);
            expect(filtersService.appliedFiltersMap.has(target)).true;
            filtersService.destroy();
            expect(filtersService.appliedFiltersMap.has(target)).false;
        });
    });
    describe('get...State', () => {
        it('includes all filters to requestState', () => {
            class TargetType {
                @filter({ coerce: false } as FilterConfig)
                public first: string = 'first';
                @filter
                public second: string = 'second';
            }
            let target = new TargetType();
            let filtersService = new FiltersService(target);
            let requestState = filtersService.getRequestState();
            expect(requestState.first).eq(target.first);
            expect(requestState.second).eq(target.second);
        });
        it('includes only filtered values to the state if filter is specified', () => {
            class TargetType {
                @filter({ coerce: false } as FilterConfig)
                public first: string = 'first';
                @filter
                public second: string = 'second';
            }
            let target = new TargetType();
            let filtersService = new FiltersService(target);
            let filteredState = filtersService.getRequestState((config: FilterConfig) => !config.coerce);
            expect(filteredState.first).eq(target.first);
            expect(filteredState.second).undefined;
        });

        it('calls \'toRequest\' method on filter if defined', () => {

            class TargetType {
                @filter()
                public first: any = { toRequest: sinon.spy(() => { return 'first'; }) };
            }
            let target = new TargetType();
            let filtersService = new FiltersService(target);
            let requestState = filtersService.getRequestState();
            expect(target.first.toRequest.calledOnce).true;
            expect(requestState.first).eq(target.first.toRequest());
        });

        it('calls \'serializeFormatter\' method of config if defined', () => {
            let serializeSpy = sinon.spy(() => { return 'first'; });
            class TargetType {
                @filter({ serializeFormatter: serializeSpy } as FilterConfig)
                public first: string = 'first';
            }
            let target = new TargetType();
            let filtersService = new FiltersService(target);
            let requestState = filtersService.getRequestState();
            expect(serializeSpy.calledOnce).true;
            expect(serializeSpy.calledOn(target)).true;
            expect(serializeSpy.calledWith(target.first)).true;
            expect(requestState.first).eq(serializeSpy());
        });

        it('handles emptyIsNullFlag', () => {
            let cfg = { emptyIsNull: true } as FilterConfig;
            class TargetType {
                @filter(cfg)
                public zero: number = 0;

                @filter(cfg)
                public emptyString: string = '';

                @filter(cfg)
                public nullProperty: any = null;

                @filter(cfg)
                public undefinedProperty: any = undefined;

                @filter(cfg)
                public falseProperty: boolean = false;
            }
            let target = new TargetType();
            let filtersService = new FiltersService(target);

            let requestState = filtersService.getRequestState();
            expect(requestState.zero).null;
            expect(requestState.emptyString).null;
            expect(requestState.nullProperty).null;
            expect(requestState.undefinedProperty).null;
            expect(requestState.falseProperty).null;
        });
        it('handles arrays', () => {
            let toRequestSpy = sinon.spy(() => { return 'first'; });
            class TargetType {
                @filter()
                public arrayProperty: any[] = [{ toRequest: toRequestSpy }, 'first'];
            }

            let target = new TargetType();
            let filtersService = new FiltersService(target);
            let requestState = filtersService.getRequestState();
            expect(requestState.arrayProperty).eql(['first', 'first']);
            expect(toRequestSpy.calledOnce).true;
        });
    });
    describe('applyParams', () => {
        it('apply coerced values by default', () => {
            class TargetType {
                @filter
                public booleanProperty: any;
                @filter
                public nullProperty: any;
                @filter
                public numberProperty: number;
                @filter
                public stringProperty: string;
                @filter
                public undefinedProperty: any;
            }

            let target = new TargetType();
            let filtersService = new FiltersService(target);
            let params = {
                booleanProperty: 'false',
                nullProperty: 'null',
                numberProperty: '5',
                stringProperty: 'value',
                undefinedProperty: 'undefined'
            };
            let coercedParams = coerceValue(cloneAsLiteral(params));
            filtersService.applyParams(params);
            expect(target).eql(coercedParams);
        });

        it('doesn\'t coerce values if specified', () => {
            let cfg = { coerce: false } as FilterConfig;
            class TargetType {
                @filter(cfg)
                public booleanProperty: any;
                @filter(cfg)
                public nullProperty: any;
                @filter(cfg)
                public numberProperty: number;
                @filter(cfg)
                public stringProperty: string;
                @filter(cfg)
                public undefinedProperty: any;
            }

            let target = new TargetType();
            let filtersService = new FiltersService(target);
            let params = {
                booleanProperty: 'false',
                nullProperty: 'null',
                numberProperty: '5',
                stringProperty: 'value',
                undefinedProperty: 'undefined'
            };
            filtersService.applyParams(params);
            expect(target).eql(params);
        });

        it('skip if ignoreOnAutoMap setted to true', () => {
            class TargetType {
                @filter({ ignoreOnAutoMap: true } as FilterConfig)
                public ignoredProperty: 'old value';
                @filter
                public mappedProperty: 'old value';
            }

            let target = new TargetType();
            let filtersService = new FiltersService(target);
            let params = {
                ignoredProperty: 'new value',
                mappedProperty: 'new value'
            };
            filtersService.applyParams(params);
            expect(target.ignoredProperty).not.eql(params.ignoredProperty);
            expect(target.mappedProperty).eql(params.mappedProperty);
        });

        it('handles emptyIsNullFlag', () => {
            let cfg = { emptyIsNull: true } as FilterConfig;
            class TargetType {
                @filter(cfg)
                public zero: number = 0;

                @filter(cfg)
                public emptyString: string = '';

                @filter(cfg)
                public nullProperty: any = null;

                @filter(cfg)
                public falseProperty: boolean = false;
            }
            let target = new TargetType();
            let filtersService = new FiltersService(target);

            let params: any = {
                emptyString: '',
                falseProperty: false,
                nullProperty: null,
                zero: 0
            };

            filtersService.applyParams(params);
            expect(target.zero).null;
            expect(target.emptyString).null;
            expect(target.nullProperty).null;
            expect(target.falseProperty).null;
        });
        it('calls parseFormatter', () => {
            let parseSpy = sinon.spy((value: string) => { return 'parsed ' + value; });

            class TargetType {
                @filter({ parseFormatter: parseSpy } as FilterConfig)
                public value: string;
            }
            let target = new TargetType();
            let filtersService = new FiltersService(target);

            let params = {
                value: 'value'
            };
            filtersService.applyParams(params);

            expect(parseSpy.calledOnce).true;
            expect(parseSpy.calledOn(target)).true;
            expect(parseSpy.calledWith(params.value, params)).true;
            expect(target.value).eql(parseSpy(params.value));
        });
        it('handles situation when paramaterName and propertyName are different', () => {
            class TargetType {
                @filter({ parameterName: 'parameter' } as FilterConfig)
                public value: string;
            }
            let target = new TargetType();
            let filtersService = new FiltersService(target);

            let params = {
                parameter: 'parameter value'
            };
            filtersService.applyParams(params);
            expect(target.value).eql(params.parameter);
        });
    });
    describe('resetValues', () => {
        it('reset values to defaultValue', () => {
            let cfg = { defaultValue: 'default value' } as FilterConfig;
            class TargetType {
                @filter(cfg)
                public value: string = 'string value';
            }
            let target = new TargetType();
            let filtersService = new FiltersService(target);

            filtersService.resetValues();

            expect(target.value).eql(cfg.defaultValue);
        });
        it('calls defaultValue if it\'s function', () => {
            let defaultSpy = sinon.spy(() => { return 'default value'; });

            class TargetType {
                @filter({ defaultValue: defaultSpy } as FilterConfig)
                public value: string = 'string value';
            }
            let target = new TargetType();
            let filtersService = new FiltersService(target);
            filtersService.resetValues();

            expect(defaultSpy.calledOnce).true;
            expect(defaultSpy.calledOn(target)).true;
            expect(target.value).eql(defaultSpy());
        });

        it('calls parseFormatter', () => {
            const defaultValue = 'value';
            let parseSpy = sinon.spy((value: string) => { return 'parsed ' + value; });

            class TargetType {
                @filter({ parseFormatter: parseSpy } as FilterConfig)
                public value: string = defaultValue;
            }
            let target = new TargetType();
            let filtersService = new FiltersService(target);

            filtersService.resetValues();

            expect(parseSpy.calledOnce).true;
            expect(parseSpy.calledOn(target)).true;
            expect(parseSpy.calledWith(defaultValue)).true;
            expect(target.value).eql(parseSpy(defaultValue));
        });
    });
});
