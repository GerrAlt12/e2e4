export class ParseHelper {
    static coerceValue(value) {
        if (typeof value === 'object' || Array.isArray(value)) {
            for (let index in value) {
                if (value.hasOwnProperty(index)) {
                    value[index] = ParseHelper.coerceValue(value[index]);
                }
            }
        }
        else if (value && !isNaN(value)) {
            value = +value;
        }
        else if (value === 'undefined') {
            value = undefined;
        }
        else if (ParseHelper.coerceTypes[value] !== undefined) {
            value = ParseHelper.coerceTypes[value];
        }
        return value;
    }
}
ParseHelper.coerceTypes = { 'true': !0, 'false': !1, 'null': null };

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImNvbW1vbi9wYXJzZUhlbHBlci50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtJQUVJLE9BQU8sV0FBVyxDQUFDLEtBQVU7UUFDekIsRUFBRSxDQUFDLENBQUMsT0FBTyxLQUFLLEtBQUssUUFBUSxJQUFJLEtBQUssQ0FBQyxPQUFPLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDO1lBQ3BELEdBQUcsQ0FBQyxDQUFDLElBQUksS0FBSyxJQUFJLEtBQUssQ0FBQyxDQUFDLENBQUM7Z0JBQ3RCLEVBQUUsQ0FBQyxDQUFDLEtBQUssQ0FBQyxjQUFjLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDO29CQUM5QixLQUFLLENBQUMsS0FBSyxDQUFDLEdBQUcsV0FBVyxDQUFDLFdBQVcsQ0FBQyxLQUFLLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQztnQkFDekQsQ0FBQztZQUNMLENBQUM7UUFDTCxDQUFDO1FBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQyxDQUFDLEtBQUssSUFBSSxDQUFDLEtBQUssQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUM7WUFDaEMsS0FBSyxHQUFHLENBQUMsS0FBSyxDQUFDO1FBQ25CLENBQUM7UUFBQyxJQUFJLENBQUMsRUFBRSxDQUFDLENBQUMsS0FBSyxLQUFLLFdBQVcsQ0FBQyxDQUFDLENBQUM7WUFDL0IsS0FBSyxHQUFHLFNBQVMsQ0FBQztRQUN0QixDQUFDO1FBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQyxDQUFDLFdBQVcsQ0FBQyxXQUFXLENBQUMsS0FBSyxDQUFDLEtBQUssU0FBUyxDQUFDLENBQUMsQ0FBQztZQUN0RCxLQUFLLEdBQUcsV0FBVyxDQUFDLFdBQVcsQ0FBQyxLQUFLLENBQUMsQ0FBQztRQUMzQyxDQUFDO1FBQ0QsTUFBTSxDQUFDLEtBQUssQ0FBQztJQUNqQixDQUFDO0FBQ0wsQ0FBQztBQWpCVSx1QkFBVyxHQUFHLEVBQUUsTUFBTSxFQUFFLENBQUMsQ0FBQyxFQUFFLE9BQU8sRUFBRSxDQUFDLENBQUMsRUFBRSxNQUFNLEVBQUUsSUFBSSxFQUFFLENBaUJqRSIsImZpbGUiOiJjb21tb24vcGFyc2VIZWxwZXIuanMiLCJzb3VyY2VzQ29udGVudCI6WyJleHBvcnQgY2xhc3MgUGFyc2VIZWxwZXIge1xyXG4gICAgc3RhdGljIGNvZXJjZVR5cGVzID0geyAndHJ1ZSc6ICEwLCAnZmFsc2UnOiAhMSwgJ251bGwnOiBudWxsIH07XHJcbiAgICBzdGF0aWMgY29lcmNlVmFsdWUodmFsdWU6IGFueSk6IE9iamVjdCB7XHJcbiAgICAgICAgaWYgKHR5cGVvZiB2YWx1ZSA9PT0gJ29iamVjdCcgfHwgQXJyYXkuaXNBcnJheSh2YWx1ZSkpIHtcclxuICAgICAgICAgICAgZm9yIChsZXQgaW5kZXggaW4gdmFsdWUpIHtcclxuICAgICAgICAgICAgICAgIGlmICh2YWx1ZS5oYXNPd25Qcm9wZXJ0eShpbmRleCkpIHtcclxuICAgICAgICAgICAgICAgICAgICB2YWx1ZVtpbmRleF0gPSBQYXJzZUhlbHBlci5jb2VyY2VWYWx1ZSh2YWx1ZVtpbmRleF0pO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSBlbHNlIGlmICh2YWx1ZSAmJiAhaXNOYU4odmFsdWUpKSB7XHJcbiAgICAgICAgICAgIHZhbHVlID0gK3ZhbHVlO1xyXG4gICAgICAgIH0gZWxzZSBpZiAodmFsdWUgPT09ICd1bmRlZmluZWQnKSB7XHJcbiAgICAgICAgICAgIHZhbHVlID0gdW5kZWZpbmVkO1xyXG4gICAgICAgIH0gZWxzZSBpZiAoUGFyc2VIZWxwZXIuY29lcmNlVHlwZXNbdmFsdWVdICE9PSB1bmRlZmluZWQpIHtcclxuICAgICAgICAgICAgdmFsdWUgPSBQYXJzZUhlbHBlci5jb2VyY2VUeXBlc1t2YWx1ZV07XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiB2YWx1ZTtcclxuICAgIH1cclxufVxyXG4iXSwic291cmNlUm9vdCI6Ii9zb3VyY2UvIn0=